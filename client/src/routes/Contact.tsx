import {
	Button,
	Label,
	Spinner,
	Textarea,
	TextInput,
	Toast,
} from 'flowbite-react';
import { Link } from 'react-router-dom';
import * as Icons from 'react-icons/hi2';
import PageWrapper from '../PageWrapper';
import { FormEvent } from 'react';
import React from 'react';
import { FaTelegramPlane } from 'react-icons/fa';

type SendEmailRequestBody = {
	name: string;
	email: string;
	message: string;
	subject: string;
};

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
	const [sending, setSending] = React.useState(false);
	const [toastText, setToastText] = React.useState('Unknown error');
	const [emailRequestBody, setEmailRequestBody] =
		React.useState<SendEmailRequestBody>(defaultEmailRequestBody);
	React.useEffect(() => {
		setEmailRequestBody((c) => {
			const body = { ...c };
			body.message = body.message.slice(0, 10000);
			body.name = body.name.slice(0, 255);
			body.subject = body.subject.slice(0, 255);
			const [localPart, domainPart] = body.email.split('@', 1);
			if (localPart && domainPart) {
				body.email = `${localPart.slice(0, 64)}@${domainPart.slice(0, 255)}`;
			} else {
				body.email = body.email.slice(0, 64);
			}
			return body;
		});
	}, [emailRequestBody]);
	const onSubmit = React.useCallback(
		(event: FormEvent) => {
			event.preventDefault();
			setSending(true);
			fetch('/api/sendemail', {
				method: 'POST',
				body: JSON.stringify(emailRequestBody),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			})
				.then(async (response) => {
					if (response.ok) {
						setEmailRequestBody(defaultEmailRequestBody);
					}
					setToastText(
						response.ok
							? 'Message sent successfully'
							: `Error ${response.status}: ${response.statusText} - ${
									(await response.json())?.message ?? 'unknown cause'
							  }`
					);
					setToastType(response.ok ? 'success' : 'error');
					setSending(false);
				})
				.catch((error) => {
					console.error(error);
					setToastText('Network error: could not connect to the server.');
					setToastType('error');
					setSending(false);
				});
		},
		[emailRequestBody]
	);

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
						className='text-xl underline text-darkAccentColor'
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
				<form
					onSubmit={onSubmit}
					className='w-full flex flex-col gap-2'>
					<div>
						<Label
							htmlFor='name'
							value='Full name'
						/>
						<TextInput
							disabled={sending}
							id='name'
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
							disabled={sending}
							onChange={(e) =>
								setEmailRequestBody((c) => ({ ...c, email: e.target.value }))
							}
							type='email'
							icon={Icons.HiEnvelope}
							placeholder='name@domain.com'
							required
							id='email'
							value={emailRequestBody.email}
						/>
					</div>
					<div>
						<Label
							htmlFor='subject'
							value='Subject'
						/>
						<TextInput
							disabled={sending}
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
							disabled={sending}
							id='message'
							value={emailRequestBody.message}
							onChange={(e) =>
								setEmailRequestBody((c) => ({ ...c, message: e.target.value }))
							}
							required
							rows={12}
							placeholder='Write your message here'></Textarea>
					</div>
					<Button
						type='submit'
						className='min-w-24 w-fit bg-secondaryColor hover:bg-darkAccentColor'
						disabled={sending}>
						{sending ? (
							<>
								<Spinner aria-label=''></Spinner>
								<span className='pl-3'>Sending...</span>
							</>
						) : (
							<>Submit</>
						)}
					</Button>
				</form>
				{toastType === 'success' ? (
					<Toast>
						<FaTelegramPlane className='h-5 w-5 text-secondaryColor' />
						<div className='pl-4 text-sm font-normal'>{toastText}</div>
						<Toast.Toggle onDismiss={() => setToastType('none')} />
					</Toast>
				) : toastType === 'error' ? (
					<Toast>
						<div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500'>
							<Icons.HiXMark className='h-5 w-5' />
						</div>
						<div className='pl-4 text-sm font-normal'>{toastText}</div>
						<Toast.Toggle onDismiss={() => setToastType('none')} />
					</Toast>
				) : (
					<></>
				)}
			</section>
		</PageWrapper>
	);
}
