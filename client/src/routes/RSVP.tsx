import {
	Accordion,
	Button,
	Checkbox,
	Label,
	Modal,
	Radio,
	Select,
	TextInput,
	Textarea,
} from 'flowbite-react';
import React from 'react';
import PageWrapper from '../PageWrapper';
import Form from '../lib/Form';
import {
	AuthRequestResponse,
	CheckRSVPRequestResponse,
	GetRSVPRequestBody,
	GetRSVPRequestResponse,
	RSVPRawJSONSchema,
	ResponseType,
	UpdateRSVPRequestBody,
	UpdateRSVPRequestResponse,
} from '../../../server/src/constants';
import { Link } from 'react-router-dom';
import {
	HiChevronDown,
	HiEnvelope,
	HiMiniArrowLeftOnRectangle,
} from 'react-icons/hi2';
import { AdminKeyContext } from '../App';
import { crypto_box_seal_open } from 'libsodium-wrappers';
import { ab2b64, b642uint8array } from '../lib/Utils';

export default function RSVP() {
	const { keys } = React.useContext(AdminKeyContext);
	const [checkRsvpRequestResponse, setCheckRsvpRequestResponse] =
		React.useState<
			(CheckRSVPRequestResponse<'success'> & { submitterName: string }) | null
		>(null);
	return (
		<PageWrapper>
			<section className='flex flex-col gap-2 items-start py-8 px-8 w-full max-w-3xl text-textColor'>
				<h1
					className='text-darkAccentColor'
					style={{
						fontFamily: 'argue',
						fontSize: 'min(max(3.75vw, 2rem), 3.75rem)',
					}}>
					RSVP
				</h1>

				{checkRsvpRequestResponse ? (
					<>
						<Button
							className='min-w-24 w-fit bg-secondaryColor hover:bg-darkAccentColor'
							onClick={() => {
								setCheckRsvpRequestResponse(null);
							}}>
							<HiMiniArrowLeftOnRectangle className='w-6 h-6' />
							Log out
						</Button>

						{keys ? (
							checkRsvpRequestResponse.submittedBy ? (
								<>
									<p className='pt-4'>
										{`An RSVP response for this invitation has been submitted by ${checkRsvpRequestResponse.submittedBy}.`}
									</p>
									<RSVPForm
										checkRsvpResponse={checkRsvpRequestResponse}
										keys={keys}></RSVPForm>
								</>
							) : (
								<p className='pt-4'>
									Nobody has RSVPd to this invitation yet. It cannot be viewed
									in admin mode.
								</p>
							)
						) : (
							<>
								{checkRsvpRequestResponse.submittedBy ? (
									<p className='pt-4'>
										{`An RSVP response for your invitation has already been submitted by ${checkRsvpRequestResponse.submittedBy}. If you would like to check or modify your response, please `}
										<Link
											className='text-xl underline text-darkAccentColor'
											to={'/contact'}>
											contact us
										</Link>
										.
									</p>
								) : (
									<RSVPForm
										checkRsvpResponse={checkRsvpRequestResponse}></RSVPForm>
								)}
							</>
						)}
					</>
				) : (
					<>
						<p>To get started, please enter your name.</p>
						<NameForm
							setCheckRsvpRequestResponse={
								setCheckRsvpRequestResponse
							}></NameForm>

						<p className='pt-4'>
							{`If you're having issues, please try entering your name exactly as it
					appears on the envelope/email you received with your invitation.
					Failing that, `}
							<Link
								className='text-xl underline text-darkAccentColor'
								to={'/contact'}>
								contact us
							</Link>
							.
						</p>
					</>
				)}
			</section>
		</PageWrapper>
	);
}

type RSVPFormData = Exclude<
	RSVPRawJSONSchema[string]['data']['people'],
	undefined
>;
//TODO test unsubscribing
//TODO support for unnamed +1s
//TODO support for returning all data, formatting as csv and downloading
//TODO testing and styling
//TODO input length validation like for contact form for RSVP form & name form. Name form done locally but not serverside currently.
//TODO error bounadries eg for 404s as well
//TODO use localstorage for storing response progress
//TODO test email styling

async function getNonce(keys: { adminKey: Uint8Array; publicKey: Uint8Array }) {
	const nonceResp = await fetch('/api/auth', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
	const nonceBody = (await nonceResp.json()) as AuthRequestResponse;
	if (!nonceResp.ok || 'errorMessage' in nonceBody) {
		throw new Error(
			`Error ${nonceResp.status} - ${nonceResp.statusText}: ${
				'errorMessage' in nonceBody ? nonceBody.errorMessage : 'unknown cause'
			}`
		);
	}
	const decrypted = crypto_box_seal_open(
		b642uint8array(nonceBody.nonce),
		keys.publicKey,
		keys.adminKey
	);
	return ab2b64(decrypted.buffer);
}

function RSVPForm({
	checkRsvpResponse,
	keys,
}: {
	checkRsvpResponse: Exclude<
		CheckRSVPRequestResponse<'success'> & { submitterName: string },
		undefined
	>;
	keys?: { adminKey: Uint8Array; publicKey: Uint8Array } | null;
}) {
	const [submitted, setSubmitted] = React.useState(false);
	const [toastType, setToastType] = React.useState<
		'success' | 'error' | 'none'
	>('none');
	const [toastText, setToastText] = React.useState('Unknown error');
	const [rsvpFormData, setRsvpFormData] = React.useState<RSVPFormData>(
		keys ? [] : checkRsvpResponse.peopleOnInvite.map((e) => ({ name: e }))
	);
	const [email, setEmail] = React.useState('');
	const [allowSaveEmail, setAllowSaveEmail] = React.useState(true);
	const [expandedIndex, setExpandedIndex] = React.useState(0);

	React.useEffect(() => {
		localStorage.setItem(
			checkRsvpResponse.submitterName.toLowerCase(),
			JSON.stringify(rsvpFormData)
		);
	}, [checkRsvpResponse.submitterName, rsvpFormData]);

	React.useEffect(() => {
		let isSubscribed = true;
		async function loadFormData() {
			if (!keys) {
				const stored = localStorage.getItem(
					checkRsvpResponse.submitterName.toLowerCase()
				);
				if (stored && isSubscribed) {
					setRsvpFormData(JSON.parse(stored));
				}
				return;
			}
			try {
				const requestBody: GetRSVPRequestBody = {
					nonce: await getNonce(keys),
				};
				const resp = await fetch('api/getrsvp', {
					method: 'POST',
					body: JSON.stringify(requestBody),
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
				});
				const body = (await resp.json()) as GetRSVPRequestResponse;
				if (!resp.ok || 'errorMessage' in body) {
					console.error(
						`Error ${resp.status} - ${resp.statusText}: ${
							'errorMessage' in body ? body.errorMessage : 'unknown cause'
						}`
					);
					return;
				}
				const invite = body[checkRsvpResponse.inviteId];
				if (!invite) {
					console.error(
						`inviteId ${checkRsvpResponse.inviteId} not in response from server`
					);
					return;
				}
				const decryptedInviteData = crypto_box_seal_open(
					b642uint8array(invite.data),
					keys.publicKey,
					keys.adminKey
				);
				const decoded = new TextDecoder().decode(decryptedInviteData);
				const json: RSVPRawJSONSchema[string]['data'] = JSON.parse(decoded);
				if (isSubscribed) {
					setEmail(json.email ?? '');
					setAllowSaveEmail(json.email ? true : false);
					setRsvpFormData(json.people ?? []);
				}
			} catch (e) {
				console.error(e);
			}
		}

		if (keys) {
			loadFormData();
		}
		return () => {
			isSubscribed = false;
		};
	}, [checkRsvpResponse.inviteId, checkRsvpResponse.submitterName, keys]);

	const onSubmit = React.useCallback(async () => {
		let body: UpdateRSVPRequestBody;
		if (keys) {
			if (rsvpFormData.length === 0) {
				setToastText(
					`Not submitting because form data was not correctly loaded from server in the beginning`
				);
				setToastType('error');
				return;
			}
			try {
				body = {
					inviteId: checkRsvpResponse.inviteId,
					allowSaveEmail: allowSaveEmail,
					email: email,
					people: rsvpFormData,
					adminAuth: await getNonce(keys),
				};
			} catch (e) {
				console.error(e);
				setToastText(
					`Error: ${JSON.stringify(e, Object.getOwnPropertyNames(e))}`
				);
				setToastType('error');
				return;
			}
		} else {
			const ip = await fetch('https://api.ipify.org?format=json')
				.then((response) => response.json())
				.then((json) => json.ip as string)
				.catch(() => 'unknown');
			body = {
				inviteId: checkRsvpResponse.inviteId,
				allowSaveEmail: allowSaveEmail,
				email: email,
				ip: ip,
				people: rsvpFormData,
				submitterName: checkRsvpResponse.submitterName,
			};
		}
		try {
			const resp = await fetch('/api/updatersvp', {
				body: JSON.stringify(body),
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			});
			const json = (await resp.json()) as UpdateRSVPRequestResponse;
			if (resp.ok) {
				setSubmitted(true);
				return;
			}
			setToastText(
				`Error ${resp.status}: ${resp.statusText} - ${
					'errorMessage' in json ? json.errorMessage : 'unknown cause'
				}`
			);
			setToastType('error');
		} catch (error) {
			console.error(error);
			setToastText('Network error: could not connect to the server.');
			setToastType('error');
		}
	}, [
		allowSaveEmail,
		checkRsvpResponse.inviteId,
		checkRsvpResponse.submitterName,
		email,
		keys,
		rsvpFormData,
	]);
	return (
		<>
			{submitted ? (
				<h1>
					RSVP submitted successfully, thanks! We look forward to celebrating
					with you!
				</h1>
			) : (
				<Form
					onSubmit={onSubmit}
					onDismissToast={() => {
						setToastType('none');
					}}
					toastText={toastText}
					toastType={toastType}
					submitButtonText='Submit'>
					<Accordion>
						{rsvpFormData.map((e, i) => {
							return (
								<RSVPFormSection
									setExpandedIndex={setExpandedIndex}
									expandedIndex={expandedIndex}
									key={i}
									loadedFromServer={keys ? true : false}
									formData={e}
									setFormData={setRsvpFormData}
									index={i}
									invitedToAfternoon={
										checkRsvpResponse.invitedToAfternoon
									}></RSVPFormSection>
							);
						})}
					</Accordion>
					<div>
						<Label
							htmlFor='email'
							value='Email (optional - we will send a receipt with the details of your RSVP response to this email)'
						/>
						<TextInput
							onChange={(e) => setEmail(e.target.value)}
							type='email'
							icon={HiEnvelope}
							placeholder='name@domain.com'
							id='email'
							value={email}
						/>
					</div>
					<div className='flex items-center gap-2'>
						<Checkbox
							id='storeemail'
							checked={allowSaveEmail}
							onChange={(e) => {
								setAllowSaveEmail(e.target.checked);
							}}
						/>
						<Label htmlFor='storeemail'>
							Check this box to allow us to store your email for the sole
							purpose of more easily comnmunicating any important updates with
							you, in relation to the wedding. Your email would not be shared
							with any 3rd parties, and would be used as sparingly as possible.
						</Label>
					</div>
				</Form>
			)}
		</>
	);
}

function RSVPFormSection({
	index,
	formData,
	setFormData,
	invitedToAfternoon,
	loadedFromServer,
	expandedIndex,
	setExpandedIndex,
}: {
	index: number;
	formData: RSVPFormData[number];
	setFormData: React.Dispatch<React.SetStateAction<RSVPFormData>>;
	invitedToAfternoon: boolean;
	loadedFromServer: boolean;
	expandedIndex: number;
	setExpandedIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
	const [status, setStatus] = React.useState<'none' | 'accepts' | 'declines'>(
		loadedFromServer
			? formData.afternoon || formData.ceremony || formData.evening
				? 'accepts'
				: 'declines'
			: 'none'
	);
	const [dietary, setDietary] = React.useState<
		'vegetarian' | 'pescetarian' | 'none' | 'other'
	>(
		formData.dietary
			? 'other'
			: formData.vegetarian
			? 'vegetarian'
			: formData.pescetarian
			? 'pescetarian'
			: 'none'
	);
	const [showFoodInfoModal, setShowFoodInfoModal] = React.useState(false);
	React.useEffect(() => {
		if (status === 'none') {
			setFormData((c) => {
				const newData = c.slice();
				newData[index] = {
					...newData[index],
					afternoon: false,
					evening: false,
					ceremony: false,
				};
				return newData;
			});
		}
	}, [index, setFormData, status]);
	React.useEffect(() => {
		setFormData((c) => {
			const newData = c.slice();
			newData[index] = {
				...newData[index],
				vegetarian: dietary === 'vegetarian',
				pescetarian: dietary === 'pescetarian',
				dietary: dietary === 'other' ? c[index].dietary : undefined,
			};
			return newData;
		});
	}, [dietary, index, setFormData]);

	return (
		<Accordion.Panel
			isOpen={expandedIndex === index}
			arrowIcon={HiChevronDown}>
			<Accordion.Title
				onClick={() => {
					setExpandedIndex((c) => (c === index ? -1 : index));
				}}>{`${index + 1}. ${formData.name}`}</Accordion.Title>
			<Accordion.Content>
				<fieldset className='flex max-w-md gap-4'>
					<div className='flex items-center gap-2'>
						<Radio
							id='accept'
							value='accept'
							checked={status === 'accepts'}
							onChange={(e) => {
								setStatus(e.target.checked ? 'accepts' : 'declines');
							}}
						/>

						<Label htmlFor='accept'>Excitedly accepts!</Label>
					</div>
					<div className='flex items-center gap-2'>
						<Radio
							id='decline'
							value='decline'
							checked={status === 'declines'}
							onChange={(e) => {
								setStatus(e.target.checked ? 'declines' : 'accepts');
							}}
						/>
						<Label htmlFor='decline'>{`Regretfully declines`}</Label>
					</div>
				</fieldset>
				{status === 'accepts' ? (
					<>
						<fieldset className='flex max-w-md flex-col gap-4'>
							<legend className='mb-4'>
								Please select all parts of the day this person is planning to
								attend.
							</legend>
							<div className='flex items-center gap-2'>
								<Checkbox
									id='ceremony'
									required={
										!formData.afternoon &&
										!formData.ceremony &&
										!formData.evening
									}
									checked={formData.ceremony}
									onChange={(e) => {
										setFormData((c) => {
											const newData = c.slice();
											newData[index] = {
												...newData[index],
												ceremony: e.target.checked,
											};
											return newData;
										});
									}}
								/>
								<Label htmlFor='ceremony'>Wedding ceremony</Label>
							</div>
							{invitedToAfternoon && (
								<div className='flex items-center gap-2'>
									<Checkbox
										id='afternoon'
										required={
											!formData.afternoon &&
											!formData.ceremony &&
											!formData.evening
										}
										onChange={(e) => {
											setFormData((c) => {
												const newData = c.slice();
												newData[index] = {
													...newData[index],
													afternoon: e.target.checked,
												};
												return newData;
											});
										}}
									/>
									<Label htmlFor='afternoon'>Afternoon reception</Label>
								</div>
							)}
							<div className='flex items-center gap-2'>
								<Checkbox
									id='evening'
									required={
										!formData.afternoon &&
										!formData.ceremony &&
										!formData.evening
									}
									onChange={(e) => {
										setFormData((c) => {
											const newData = c.slice();
											newData[index] = {
												...newData[index],
												evening: e.target.checked,
											};
											return newData;
										});
									}}
								/>
								<Label htmlFor='evening'>Evening reception</Label>
							</div>
						</fieldset>
						{formData.evening || formData.afternoon ? (
							<>
								<div className='max-w-md'>
									<div className='mb-2 block'>
										<Label
											htmlFor='dietary'
											value='Dietary requirements'
										/>
									</div>
									<Select
										id='dietary'
										required
										onChange={(e) => {
											setDietary(
												e.target.value as
													| 'none'
													| 'vegetarian'
													| 'pescetarian'
													| 'other'
											);
											if (e.target.value !== 'other') {
												setFormData((c) => {
													const newData = c.slice();
													newData[index] = {
														...newData[index],
														dietary: undefined,
													};
													return newData;
												});
											}
										}}
										value={dietary}>
										<option value={'none'}>No dietary requirements</option>
										<option value={'vegetarian'}>Vegetarian</option>
										<option value={'pescetarian'}>Pescetarian</option>
										<option value={'other'}>Other</option>
									</Select>
								</div>
								{dietary === 'other' && (
									<div className='max-w-md'>
										<Label
											htmlFor='dietarydetail'
											value='Please provide details'
										/>

										<Textarea
											id='dietarydetail'
											required
											value={formData.dietary}
											placeholder='Detail your dietary requirements here'
											rows={12}
											onChange={(e) => {
												setFormData((c) => {
													const newData = c.slice();
													newData[index] = {
														...newData[index],
														dietary: e.target.value,
													};
													return newData;
												});
											}}></Textarea>
									</div>
								)}
								<div className='flex items-center gap-2'>
									<Checkbox
										id='alcohol'
										checked={formData.noAlcohol}
										onChange={(e) => {
											setFormData((c) => {
												const newData = c.slice();
												newData[index] = {
													...newData[index],
													noAlcohol: e.target.checked,
												};
												return newData;
											});
										}}
									/>
									<Label htmlFor='alcohol'>
										Orange juice in place of alcohol?
									</Label>
								</div>
								<div className='text-gray-500'>
									<span
										onClick={() => setShowFoodInfoModal(true)}
										className='text-xs font-normal'>
										Please click here to view information about the food and
										dtink that will be served.
									</span>
								</div>
								<FoodInformationModal
									showFoodInfoModal={showFoodInfoModal}
									setShowFoodInfoModal={setShowFoodInfoModal}
									invitedToAfternoon={
										invitedToAfternoon
									}></FoodInformationModal>
							</>
						) : (
							<></>
						)}
						<div className='max-w-md'>
							<Label
								htmlFor='comments'
								value='Anything else?'
							/>

							<Textarea
								id='comments'
								required
								value={formData.comments}
								placeholder={`If there's anything else you'd like us to know, write it here`}
								rows={12}
								onChange={(e) => {
									setFormData((c) => {
										const newData = c.slice();
										newData[index] = {
											...newData[index],
											comments: e.target.value,
										};
										return newData;
									});
								}}></Textarea>
						</div>
					</>
				) : (
					<></>
				)}
			</Accordion.Content>
		</Accordion.Panel>
	);
}

function FoodInformationModal({
	showFoodInfoModal,
	setShowFoodInfoModal,
	invitedToAfternoon,
}: {
	showFoodInfoModal: boolean;
	setShowFoodInfoModal: React.Dispatch<React.SetStateAction<boolean>>;
	invitedToAfternoon: boolean;
}) {
	return (
		<Modal
			show={showFoodInfoModal}
			size={'7xl'}
			onClose={() => setShowFoodInfoModal(false)}>
			<Modal.Header>Food information</Modal.Header>
			<Modal.Body>
				<div className='space-y-6 p-6 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-textColor '>
					{invitedToAfternoon && (
						<>
							<h1 className='text-2xl'>Afternoon reception</h1>
							<p>
								At the afternoon reception, everyone with no dietary
								requirements will be served from the standard menu below. All
								vegetarians will be served from the vegetarian menu below.
								Pescetarians will be served from the standard menu where
								possible, and the vegetarian menu elsewhere. Any other dietary
								requirements will be catered for separately to fit your personal
								needs.
							</p>
							<h2 className='text-xl'>Standard menu</h2>
							<p>To start: a lovely dish</p>
							<p>Main course: A lovely dish</p>
							<p>Dessert: A lovely dish</p>
							<h2 className='text-xl'>Vegetarian menu</h2>
							<p>To start: a lovely dish</p>
							<p>Main course: A lovely dish</p>
							<p>Dessert: A lovely dish</p>
						</>
					)}
					<h1 className='text-2xl'>Evening reception</h1>
					<p>
						At the evening reception, a buffet of various foods will be
						provided, catering for omnivores, pescetarians and vegetarians
						alike. Other dietary requirements can be catered for separately to
						fit your personal needs.
					</p>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={() => setShowFoodInfoModal(false)}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}

type NameFormData = {
	firstName: string;
	surname: string;
};

const defaultNameFormData = {
	firstName: '',
	surname: '',
};

function NameForm({
	setCheckRsvpRequestResponse,
}: {
	setCheckRsvpRequestResponse: React.Dispatch<
		React.SetStateAction<
			(CheckRSVPRequestResponse<'success'> & { submitterName: string }) | null
		>
	>;
}) {
	const [toastType, setToastType] = React.useState<
		'success' | 'error' | 'none'
	>('none');
	const [toastText, setToastText] = React.useState('Unknown error');
	const [nameFormData, setNameFormData] =
		React.useState<NameFormData>(defaultNameFormData);
	React.useEffect(() => {
		setNameFormData((c) => {
			const data = { ...c };
			data.firstName = data.firstName?.slice(0, 25);
			data.firstName =
				data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1);
			data.surname = data.surname?.slice(0, 25);
			data.surname =
				data.surname.charAt(0).toUpperCase() + data.surname.slice(1);
			return JSON.stringify(data) === JSON.stringify(c) ? c : data;
		});
	}, [nameFormData]);
	const onSubmit = React.useCallback(async () => {
		const name = nameFormData.firstName + ' ' + nameFormData.surname;
		try {
			const response = await fetch(`/api/checkrsvp?name=${name}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			});
			const body =
				(await response.json()) as CheckRSVPRequestResponse<ResponseType>;
			if (!response.ok || 'errorMessage' in body) {
				setToastText(
					`Error ${response.status}: ${response.statusText} - ${
						'errorMessage' in body ? body.errorMessage : 'unknown cause'
					}`
				);
				setToastType('error');
				return;
			}
			setNameFormData(defaultNameFormData);
			setToastType('none');
			setCheckRsvpRequestResponse({
				...body,
				submitterName: `${nameFormData.firstName} ${nameFormData.surname}`,
			});
		} catch (error) {
			console.error(error);
			setToastText('Network error: could not connect to the server.');
			setToastType('error');
		}
	}, [
		nameFormData.firstName,
		nameFormData.surname,
		setCheckRsvpRequestResponse,
	]);

	return (
		<Form
			onSubmit={onSubmit}
			onDismissToast={() => {
				setToastType('none');
			}}
			toastText={toastText}
			toastType={toastType}
			submitButtonText='Get started'>
			<div>
				<Label
					htmlFor='name'
					value='First name'
				/>
				<TextInput
					id='name'
					required
					onChange={(e) =>
						setNameFormData((c) => ({ ...c, firstName: e.target.value }))
					}
					value={nameFormData.firstName}
				/>
			</div>
			<div>
				<Label
					htmlFor='surname'
					value='Surname'
				/>
				<TextInput
					onChange={(e) =>
						setNameFormData((c) => ({ ...c, surname: e.target.value }))
					}
					required
					id='surname'
					value={nameFormData.surname}
				/>
			</div>
		</Form>
	);
}
