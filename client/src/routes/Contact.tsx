import { Label, Textarea, TextInput } from 'flowbite-react';
import { Link } from 'react-router-dom';
import PageWrapper from '../PageWrapper';
import React from 'react';
import {
	CONTACT_MESSAGE_MAXCHARS,
	CONTACT_NAME_MAXCHARS,
	CONTACT_SUBJECT_MAXCHARS,
	EMAILDOMAIN_MAXCHARS,
	EMAILLOCAL_MAXCHARS,
	SendEmailRequestBody,
	SendEmailRequestResponse,
} from '../constants';
import { HiEnvelope } from 'react-icons/hi2';
import Form from '../lib/Form';
import { PrivacyModal } from './PrivacyPolicy';

const defaultEmailRequestBody: SendEmailRequestBody = {
	name: '',
	email: '',
	message: '',
	subject: '',
};

export default function Contact() {
	const [toastType, setToastType] = React.useState<
		'success' | 'error' | 'none'
	>('none');
	const [toastText, setToastText] = React.useState('Unknown error');
	const [emailRequestBody, setEmailRequestBody] =
		React.useState<SendEmailRequestBody>(defaultEmailRequestBody);
	React.useEffect(() => {
		setEmailRequestBody((c) => {
			const body = { ...c };
			body.message = body.message.slice(0, CONTACT_MESSAGE_MAXCHARS);
			body.name = body.name.slice(0, CONTACT_NAME_MAXCHARS);
			body.subject = body.subject.slice(0, CONTACT_SUBJECT_MAXCHARS);
			const [localPart, domainPart] = body.email.split('@', 1);
			if (localPart && domainPart) {
				body.email = `${localPart.slice(
					0,
					EMAILLOCAL_MAXCHARS
				)}@${domainPart.slice(0, EMAILDOMAIN_MAXCHARS)}`;
			} else {
				body.email = body.email.slice(0, EMAILLOCAL_MAXCHARS);
			}
			return JSON.stringify(body) === JSON.stringify(c) ? c : body;
		});
	}, [emailRequestBody]);
	const onSubmit = React.useCallback(async () => {
		try {
			const response = await fetch('/api/sendemail', {
				method: 'POST',
				body: JSON.stringify(emailRequestBody),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			});
			const body = (await response.json()) as SendEmailRequestResponse;
			if (response.ok) {
				setEmailRequestBody(defaultEmailRequestBody);
			}
			setToastText(
				response.ok
					? 'Message sent successfully'
					: `Error ${response.status}: ${response.statusText} - ${
							'errorMessage' in body ? body.errorMessage : 'unknown cause'
					  }`
			);
			setToastType(response.ok ? 'success' : 'error');
		} catch (error) {
			console.error(error);
			setToastText('Network error: could not connect to the server.');
			setToastType('error');
		}
	}, [emailRequestBody]);

	return (
		<PageWrapper>
			<section className='flex flex-col gap-2 items-start py-8 px-8 w-full max-w-3xl text-textColor'>
				<h1
					className='text-darkAccentColor'
					style={{
						fontFamily: 'argue',
						fontSize: 'min(max(3.75vw, 2rem), 3.75rem)',
					}}>
					Contact us
				</h1>
				<p>
					{'First, check if your question is answered by our '}
					<Link
						className='text-base underline text-darkAccentColor'
						to={'/faq'}>
						FAQs
					</Link>
					.
				</p>
				<p>
					{'Email: '}
					<a
						className='underline text-darkAccentColor'
						href='mailto:matthewandadelewedding@gmail.com'>
						matthewandadelewedding@gmail.com
					</a>
				</p>
				<p>Tel: Found on your invitation</p>
				<p>Or fill out the form below:</p>
				<Form
					PrivacyPolicy={PrivacyModal}
					onSubmit={onSubmit}
					onDismissToast={() => {
						setToastType('none');
					}}
					toastText={toastText}
					toastType={toastType}>
					<div>
						<Label
							htmlFor='name'
							value='Full name'
						/>
						<TextInput
							id='name'
							autoCapitalize='words'
							autoComplete='name'
							placeholder='Joe Bloggs'
							required
							onChange={(e) =>
								setEmailRequestBody((c) => ({ ...c, name: e.target.value }))
							}
							value={emailRequestBody.name}
						/>
					</div>
					<div>
						<Label
							htmlFor='email'
							value='Email'
						/>
						<TextInput
							onChange={(e) =>
								setEmailRequestBody((c) => ({ ...c, email: e.target.value }))
							}
							type='email'
							icon={HiEnvelope}
							placeholder='name@domain.com'
							required
							id='email'
							value={emailRequestBody.email}
							autoComplete='email'
						/>
					</div>
					<div>
						<Label
							htmlFor='subject'
							value='Subject'
						/>
						<TextInput
							value={emailRequestBody.subject}
							id='subject'
							placeholder='Subject...'
							required
							onChange={(e) =>
								setEmailRequestBody((c) => ({ ...c, subject: e.target.value }))
							}
						/>
					</div>
					<div>
						<Label
							htmlFor='message'
							value={'Message'}>
							Message
						</Label>
						<Textarea
							id='message'
							value={emailRequestBody.message}
							onChange={(e) =>
								setEmailRequestBody((c) => ({ ...c, message: e.target.value }))
							}
							required
							rows={12}
							placeholder='Write your message here'></Textarea>
					</div>
				</Form>
			</section>
		</PageWrapper>
	);
}
