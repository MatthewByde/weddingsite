import { Button, Spinner, Toast } from 'flowbite-react';
import React, { FormEvent } from 'react';
import { FaTelegramPlane } from 'react-icons/fa';
import { HiXMark } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

type FormProps = {
	children?: React.ReactNode;
	toastType?: 'error' | 'success' | 'none';
	toastText?: string;
	submitButtonText?: string;
	onSubmit?: () => Promise<void>;
	onDismissToast: () => void;
	formNoValidate?: boolean;
	PrivacyPolicy?:
		| string
		| ((props: {
				showPrivacyModal: boolean;
				setShowPrivacyModal: React.Dispatch<React.SetStateAction<boolean>>;
		  }) => JSX.Element);
};

export default React.forwardRef<HTMLFormElement, FormProps>(function Form(
	{
		children,
		toastType = 'none',
		toastText = '',
		submitButtonText = 'Submit',
		onSubmit = async () => {},
		onDismissToast,
		formNoValidate,
		PrivacyPolicy,
	}: FormProps,
	ref
) {
	const [showPrivacyModal, setShowPrivacyModal] = React.useState(false);
	const [sending, setSending] = React.useState(false);

	const onSubmitForm = React.useCallback(
		(event: FormEvent) => {
			event.preventDefault();
			setSending(true);
			onSubmit().then(() => setSending(false));
		},
		[onSubmit]
	);

	return (
		<form
			ref={ref}
			onSubmit={onSubmitForm}
			className={`w-full flex flex-col gap-2 ${
				sending ? '[&_*]:pointer-events-none' : ''
			}`}>
			{children}
			<Button
				type='submit'
				formNoValidate={formNoValidate}
				className='min-w-24 w-fit mt-4'
				disabled={sending}>
				{sending ? (
					<>
						<Spinner aria-label=''></Spinner>
						<span className='pl-3'>Sending...</span>
					</>
				) : (
					<>{submitButtonText}</>
				)}
			</Button>
			{typeof PrivacyPolicy === 'string' ? (
				<small>
					<Link
						className='underline'
						to={PrivacyPolicy}>
						Click here to view our privacy policy
					</Link>
				</small>
			) : PrivacyPolicy ? (
				<small>
					<p
						className='hover:underline'
						onClick={() => setShowPrivacyModal(true)}>
						Click here to view our privacy policy
					</p>
					<PrivacyPolicy
						showPrivacyModal={showPrivacyModal}
						setShowPrivacyModal={setShowPrivacyModal}></PrivacyPolicy>
				</small>
			) : (
				<></>
			)}

			{toastType === 'success' ? (
				<Toast>
					<FaTelegramPlane className='h-5 w-5 text-secondaryColor' />
					<div className='pl-4 text-sm font-normal'>{toastText}</div>
					<Toast.Toggle onDismiss={onDismissToast} />
				</Toast>
			) : toastType === 'error' ? (
				<Toast>
					<div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500'>
						<HiXMark className='h-5 w-5' />
					</div>
					<div className='pl-4 text-sm font-normal'>{toastText}</div>
					<Toast.Toggle onDismiss={onDismissToast} />
				</Toast>
			) : (
				<></>
			)}
		</form>
	);
});
