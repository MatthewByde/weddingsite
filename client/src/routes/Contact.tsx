import { Button, Label, Textarea, TextInput } from 'flowbite-react';
import { Link } from 'react-router-dom';
import * as Icons from 'react-icons/hi2';

export default function Contact() {
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
				method='POST'
				encType='application/x-www-form-urlencoded'
				action='/api/sendemail'>
				<Label
					htmlFor='name'
					value='Full name'
				/>
				<TextInput
					placeholder='Joe Bloggs'
					required
					name={'name'}
				/>
				<Label
					htmlFor='email'
					value='Email'
				/>
				<TextInput
					name={'email'}
					type='email'
					icon={Icons.HiEnvelope}
					placeholder='name@domain.com'
					required
				/>
				<Label
					htmlFor='subject'
					value='Subject'
				/>
				<TextInput
					placeholder='Subject...'
					required
					name={'subject'}
				/>
				<Label
					htmlFor='message'
					value={'Message'}>
					Message
				</Label>
				<Textarea
					name={'message'}
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
