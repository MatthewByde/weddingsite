import emailInfo from './assets/confidential.json';
import nodemailer from 'nodemailer';
import React from 'react';
import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
	render,
} from '@react-email/components';
import { imageData } from './emailBannerData.js';
import Mail from 'nodemailer/lib/mailer';
import {
	EMAILDOMAIN_MAXCHARS,
	EMAILLOCAL_MAXCHARS,
	CONTACT_MESSAGE_MAXCHARS,
	CONTACT_NAME_MAXCHARS,
	CONTACT_SUBJECT_MAXCHARS,
	UpdateRSVPRequestBody,
} from './constants.js';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: emailInfo.gmailLogin.email,
		pass: emailInfo.gmailLogin.password,
	},
});

export async function sendRSVPEmail(data: UpdateRSVPRequestBody) {
	if (!data.email) {
		return;
	}
	const email = createRSVPEmail(data);

	return await sendEmail(
		email.plain,
		email.html,
		`Matthew & Adele's wedding RSVP receipt`,
		'Matthew and Adele',
		[data.email],
		[
			{
				cid: 'image',
				filename: 'image.png',
				content: Buffer.from(imageData, 'base64'),
			},
		]
	);
}

export async function sendContactFormEmail(
	message: string,
	subject: string,
	fromName: string,
	userEmail: string
) {
	message = message.slice(0, CONTACT_MESSAGE_MAXCHARS);
	subject = subject.slice(0, CONTACT_SUBJECT_MAXCHARS);
	fromName = fromName.slice(0, CONTACT_NAME_MAXCHARS);

	const email = createContactFormEmail(message, fromName, subject, userEmail);
	return await sendEmail(
		email.plain,
		email.html,
		subject,
		fromName,
		emailInfo.contactFormToEmail,
		[
			{
				cid: 'image',
				filename: 'image.png',
				content: Buffer.from(imageData, 'base64'),
			},
		],
		userEmail
	);
}

export async function sendEmail(
	text: string,
	html: string,
	subject: string,
	fromName: string,
	to: string[],
	attachments?: Mail.Attachment[],
	replyTo?: string | string[]
) {
	to = to.map((email) => {
		const [localPart, domainPart] = email.split('@', 1);
		if (localPart && domainPart) {
			email = `${localPart.slice(0, EMAILLOCAL_MAXCHARS)}@${domainPart.slice(
				0,
				EMAILDOMAIN_MAXCHARS
			)}`;
		} else {
			email = email.slice(0, EMAILLOCAL_MAXCHARS);
		}
		return email;
	});

	return await transporter.sendMail({
		disableFileAccess: true,
		disableUrlAccess: true,
		from: { address: emailInfo.gmailLogin.email, name: fromName },
		to,
		text,
		subject,
		html,
		replyTo,
		attachments,
	});
}

function createRSVPEmail(data: UpdateRSVPRequestBody) {
	return {
		html: render(<RSVPEmail data={data}></RSVPEmail>, { pretty: true }),
		plain: render(<RSVPEmail data={data}></RSVPEmail>, {
			pretty: true,
			plainText: true,
		}),
	};
}

function RSVPEmail({ data }: { data: UpdateRSVPRequestBody }) {
	const { ip, people, submitterName, allowSaveEmail, inviteId } = data;

	return (
		<Html>
			<Head />
			<Preview>{`Your RSVP submission for Matthew and Adele's wedding`}</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={coverSection}>
						<Section style={imageSection}>
							<Link
								href='https://matthewandadelewedding.co.uk'
								target='_blank'>
								<Img
									src={'cid:image'}
									alt='Matthew and adele wedding banner'
									width='100%'
									className='m-0 border-0 p-0 block'
								/>
							</Link>
						</Section>
						<Section style={upperSection}>
							<Heading
								style={h1}>{`Thanks for filling out the RSVP form!`}</Heading>
							{people?.map((e, i) => (
								<RSVPEmailSection
									key={i}
									person={e}></RSVPEmailSection>
							))}
						</Section>
						<Hr />
						<Section style={lowerSection}>
							<Text style={cautionText}>
								{`The above RSVP was submitted at ${new Date().toISOString()} by ${submitterName} from ${ip}`}
							</Text>
						</Section>
					</Section>
					<Text style={footerText}>
						{'This message was produced by '}
						<Link
							href='https://matthewandadelewedding.co.uk'
							target='_blank'
							style={link}>
							matthewandadelewedding.co.uk
						</Link>
						{
							' at request of a user, and may contain confidential information. If you have received this email in error, please delete it, then '
						}
						<Link
							href='https://matthewandadelewedding.co.uk/contact'
							target='_blank'
							style={link}>
							contact us.
						</Link>
						{` ${
							allowSaveEmail
								? 'If you are subscribed to our emails and you wish to unsubscribe, '
								: ''
						}`}
						{allowSaveEmail && (
							<Link
								href={`https://matthewandadelewedding.co.uk/api/unsubscribe?id=${inviteId}`}
								target='_blank'
								style={link}>
								click here.
							</Link>
						)}
					</Text>
				</Container>
			</Body>
		</Html>
	);
}

function RSVPEmailSection({
	person,
}: {
	person: Exclude<UpdateRSVPRequestBody['people'], undefined>[number];
}) {
	const isComing = person.afternoon || person.evening || person.ceremony;

	return (
		<>
			<Heading style={h2}>{person.name ?? 'Unknown name'}</Heading>
			{isComing ? (
				<>
					<Text style={h3}>
						You graciously accepted the invitation to the following:
					</Text>
					<Text style={mainText}>
						{person.ceremony && (
							<>
								- Wedding ceremony at Monyhull Church <br></br>
							</>
						)}
						{person.afternoon && (
							<>
								- Afternoon reception at Westmead Hotel <br></br>
							</>
						)}
						{person.evening && (
							<>
								- Evening reception at Westmead Hotel <br></br>
							</>
						)}
					</Text>
					<Text style={h3}>Dietary requirements:</Text>
					<Text style={mainText}>
						{person.vegetarian ? (
							<>Vegetarian</>
						) : person.pescetarian ? (
							<>Pescetarian</>
						) : person.dietary ? (
							<>{person.dietary}</>
						) : (
							<>No dietary requirements</>
						)}
					</Text>
					<Text style={h3}>Would like orange juice in place of alcohol?</Text>
					<Text style={mainText}>{person.noAlcohol ? 'Yes' : 'No'}</Text>
					<Text style={h3}>Additional comments</Text>
					<Text style={mainText}>{person.comments}</Text>
				</>
			) : (
				<>
					<Text style={mainText}>You regretfully declined the invitation.</Text>
				</>
			)}
		</>
	);
}

function createContactFormEmail(
	emailContent: string,
	emailFrom: string,
	emailSubject: string,
	userEmail: string
) {
	return {
		html: render(
			<ContactFormEmail
				from={emailFrom}
				content={emailContent}
				subject={emailSubject}
				userEmail={userEmail}></ContactFormEmail>,
			{ pretty: true }
		),
		plain: render(
			<ContactFormEmail
				from={emailFrom}
				content={emailContent}
				subject={emailSubject}
				userEmail={userEmail}></ContactFormEmail>,
			{ pretty: true, plainText: true }
		),
	};
}

function ContactFormEmail({
	from,
	subject,
	content,
	userEmail,
}: {
	from: string;
	subject: string;
	content: string;
	userEmail: string;
}) {
	return (
		<Html>
			<Head />
			<Preview>{`Submission through matthewandadelewedding.co.uk contact form from ${from}: ${subject}`}</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={coverSection}>
						<Section style={imageSection}>
							<Link
								href='https://matthewandadelewedding.co.uk'
								target='_blank'>
								<Img
									src={'cid:image'}
									alt='Matthew and adele wedding banner'
									width='100%'
									className='m-0 border-0 p-0 block'
								/>
							</Link>
						</Section>
						<Section style={upperSection}>
							<Heading
								style={h1}>{`Contact form submission: ${subject}`}</Heading>
							<Text style={mainText}>
								{content.split(/\r\n|\r|\n/).map((e) => {
									return (
										<>
											{e}
											<br />
										</>
									);
								})}
							</Text>
						</Section>
						<Hr />
						<Section style={lowerSection}>
							<Text style={cautionText}>
								{`The above message was sent by ${from} <${userEmail}> at ${new Date().toISOString()}.`}
							</Text>
						</Section>
					</Section>
					<Text style={footerText}>
						{'This message was produced by '}
						<Link
							href='https://matthewandadelewedding.co.uk'
							target='_blank'
							style={link}>
							matthewandadelewedding.co.uk
						</Link>
						{
							' at request of a user, and may contain confidential information. If you have received this email in error, please delete it, then '
						}
						<Link
							href='https://matthewandadelewedding.co.uk/contact'
							target='_blank'
							style={link}>
							contact us
						</Link>
						.
					</Text>
				</Container>
			</Body>
		</Html>
	);
}

const main = {
	backgroundColor: '#fff',
	color: '#212121',
};

const container = {
	padding: '20px',
	margin: '0 auto',
	backgroundColor: '#eee',
	width: 'min-content',
};

const h1 = {
	color: '#333',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '20px',
	fontWeight: 'bold',
	marginBottom: '15px',
};

const h2 = {
	color: '#333',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '17px',
	fontWeight: 'bold',
	marginBottom: '8px',
};

const h3 = {
	color: '#333',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '15px',
	fontWeight: 'bold',
	marginBottom: '3px',
};

const link = {
	color: '#2754C5',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '14px',
	textDecoration: 'underline',
};

const text = {
	color: '#333',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '14px',
	margin: '24px 0',
};

const imageSection = {
	backgroundColor: '#E9EDEA',
	display: 'flex',
	paddingTop: '20px',
	alignItems: 'center',
	justifyContent: 'center',
};

const coverSection = { backgroundColor: '#fff' };

const upperSection = { padding: '25px 35px' };

const lowerSection = { padding: '25px 35px' };

const footerText = {
	...text,
	fontSize: '12px',
	padding: '0 20px',
};

const mainText = { ...text, marginBottom: '14px' };

const cautionText = { ...text, margin: '0px' };
