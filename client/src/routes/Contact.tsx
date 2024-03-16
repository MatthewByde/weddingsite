import { Button, Label, Textarea, TextInput } from 'flowbite-react';
import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'react-icons/hi2';

// type SendEmailRequestBody = {
// 	name: string;
// 	email: string;
// 	message: string;
// 	subject: string;
// };

export default function Contact() {
	// fetch('/api/sendemail', {
	// 	method: 'POST',
	// 	headers: {
	// 		Accept: 'application/json',
	// 		'Content-Type': 'application/json',
	// 	},
	// 	body: JSON.stringify({
	// 		email: 'matthew@bydemusic.co.uk',
	// 		name: 'Matthew Byde',
	// 		message:
	// 			'Hi\n\n, this is a test message.\nInsincerely regardless,\n\nMatthew',
	// 		subject: 'Test',
	// 	} as SendEmailRequestBody),
	// });
	const onSubmit = React.useCallback(() => {}, []);
	return (
		<section>
			<h1>Contact us</h1>
			<p>
				First, check if your question is answered by our
				<Link to={'/FAQ'}>FAQs</Link>.
			</p>
			<p>
				If you still need help, please feel free to contact us using the phone
				number on your invitation, or by email:
			</p>
			<p>matthewandadelewedding@gmail.com</p>
			<p>Or by filling out the form below.</p>
			<form
				id='contact-form'
				onSubmit={onSubmit}>
				<Label
					htmlFor='name'
					value='Full name'
				/>
				<TextInput
					placeholder='Joe Bloggs'
					required
				/>
				<Label
					htmlFor='email'
					value='Email'
				/>
				<TextInput
					type='email'
					icon={Icons.HiEnvelope}
					placeholder='name@domain.com'
					required
				/>
				<Label
					htmlFor='message'
					value={'Message'}>
					Message
				</Label>
				<Textarea
					required
					rows={10}
					placeholder='Write your message here'></Textarea>
				<Button
					type='submit'
					className='btn btn-primary'>
					Submit
				</Button>
			</form>
		</section>
	);
}
