import {
	Accordion,
	Button,
	Checkbox,
	Label,
	Modal,
	Select,
	TextInput,
	Textarea,
	Tooltip,
} from 'flowbite-react';
import React from 'react';
import PageWrapper from '../PageWrapper';
import Form from '../lib/Form';
import {
	CheckRSVPRequestResponse,
	GetRSVPRequestBody,
	GetRSVPRequestResponse,
	RSVPRawJSONSchema,
	RSVP_COMMENTS_MAXCHARS,
	RSVP_DIETARY_MAXCHARS,
	RSVP_FIRSTNAME_MAXCHARS,
	RSVP_FULLNAME_MAXCHARS,
	RSVP_SURNAME_MAXCHARS,
	UNKNOWN_GUEST_NAME,
	ResponseType,
	UpdateRSVPRequestBody,
	UpdateRSVPRequestResponse,
} from '../constants';
import { Link } from 'react-router-dom';
import {
	HiChevronDown,
	HiEnvelope,
	HiMiniArrowLeftOnRectangle,
} from 'react-icons/hi2';
import { IoInformationCircleSharp, IoRefreshSharp } from 'react-icons/io5';
import { AdminKeyContext } from '../App';
import { crypto_box_seal_open } from 'libsodium-wrappers';
import { b642uint8array, getNonce } from '../Utils';

export default function RSVP() {
	const [submitted, setSubmitted] = React.useState(false);
	const { keys } = React.useContext(AdminKeyContext);
	const [checkRsvpRequestResponse, setCheckRsvpRequestResponse] =
		React.useState<
			(CheckRSVPRequestResponse<'success'> & { submitterName: string }) | null
		>(null);
	const [resetFormKey, setResetFormKey] = React.useState(0);
	return (
		<PageWrapper>
			<section className='flex flex-col gap-2 items-start py-8 px-8 w-full max-w-3xl text-textColor'>
				<div className='flex justify-between w-full'>
					<h1
						className='text-darkAccentColor text-nowrap'
						style={{
							fontFamily: 'argue',
							fontSize: 'min(max(3.75vw, 2rem), 3.75rem)',
						}}>
						RSVP
					</h1>
					{checkRsvpRequestResponse && (
						<div className='flex gap-2'>
							{!checkRsvpRequestResponse.submittedBy && !submitted && (
								<Button
									className='min-w-24 max-h-[50px] w-fit bg-secondaryColor hover:bg-darkAccentColor mb-4 '
									onClick={() => {
										localStorage.removeItem(
											checkRsvpRequestResponse.submitterName.toLowerCase()
										);
										setResetFormKey((c) => c + 1);
									}}>
									<IoRefreshSharp className='w-6 h-6' />
									Reset form
								</Button>
							)}
							<Button
								className='min-w-24 max-h-[50px] w-fit bg-secondaryColor hover:bg-darkAccentColor mb-4 '
								onClick={() => {
									setCheckRsvpRequestResponse(null);
								}}>
								<HiMiniArrowLeftOnRectangle className='w-6 h-6' />
								Log out
							</Button>
						</div>
					)}
				</div>

				{checkRsvpRequestResponse ? (
					<>
						{keys ? (
							checkRsvpRequestResponse.submittedBy ? (
								<>
									<p className='pt-4'>
										{`An RSVP response for this invitation has been submitted by ${checkRsvpRequestResponse.submittedBy}.`}
									</p>
									<RSVPForm
										key={resetFormKey}
										checkRsvpResponse={checkRsvpRequestResponse}
										keys={keys}
										submitted={submitted}
										setSubmitted={setSubmitted}></RSVPForm>
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
										key={resetFormKey}
										checkRsvpResponse={checkRsvpRequestResponse}
										submitted={submitted}
										setSubmitted={setSubmitted}></RSVPForm>
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

//TODO test unsubscribing when deployed to live site
//TODO test emailing when deployed to live site
//TODO improve look of timer
//TODO add content to other pages

//TODO testing and styling
//TODO test validation around duplicate names and +1s and all possible server errors
//TODO test email styling

type StoredFormData = {
	email: string;
	rsvpFormData: RSVPFormData;
	expandedIndex: number;
	allowSaveEmail: boolean;
	statuses: ('accepts' | 'declines' | 'none')[];
};

function RSVPForm({
	checkRsvpResponse,
	keys,
	setSubmitted,
	submitted,
}: {
	checkRsvpResponse: Exclude<
		CheckRSVPRequestResponse<'success'> & { submitterName: string },
		undefined
	>;
	keys?: { adminKey: Uint8Array; publicKey: Uint8Array } | null;
	setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
	submitted: boolean;
}) {
	const fromStorage = localStorage.getItem(
		checkRsvpResponse.submitterName.toLowerCase()
	);
	const stored = fromStorage
		? (JSON.parse(fromStorage) as StoredFormData)
		: null;

	const [toastType, setToastType] = React.useState<
		'success' | 'error' | 'none'
	>('none');
	const [toastText, setToastText] = React.useState('Unknown error');
	const [rsvpFormData, setRsvpFormData] = React.useState<RSVPFormData>(
		keys
			? []
			: stored
			? stored.rsvpFormData
			: [
					...checkRsvpResponse.peopleOnInvite.map((e) => ({ name: e })),
					...(checkRsvpResponse.plusOnes
						? new Array(checkRsvpResponse.plusOnes).fill({
								name: UNKNOWN_GUEST_NAME,
						  })
						: []),
			  ]
	);
	const [email, setEmail] = React.useState(stored ? stored.email : '');
	const [allowSaveEmail, setAllowSaveEmail] = React.useState(
		stored ? stored.allowSaveEmail : true
	);
	const [expandedIndex, setExpandedIndex] = React.useState(
		stored ? stored.expandedIndex : 0
	);
	const [statuses, setStatuses] = React.useState<
		('accepts' | 'declines' | 'none')[]
	>(keys ? [] : stored ? stored.statuses : rsvpFormData.map((_) => 'none'));
	const formRef = React.useRef<HTMLFormElement>(null);
	React.useEffect(() => {
		setRsvpFormData((c) => {
			const data = [...c];
			data.forEach((item) => {
				item.comments = item.comments?.slice(0, RSVP_COMMENTS_MAXCHARS);
				item.dietary = item.dietary?.slice(0, RSVP_DIETARY_MAXCHARS);
				item.name = item.name.slice(0, RSVP_FULLNAME_MAXCHARS);
			});
			return JSON.stringify(data) === JSON.stringify(c) ? c : data;
		});
	}, [rsvpFormData]);

	React.useEffect(() => {
		localStorage.setItem(
			checkRsvpResponse.submitterName.toLowerCase(),
			JSON.stringify({
				rsvpFormData: rsvpFormData,
				email: email,
				allowSaveEmail: allowSaveEmail,
				expandedIndex: expandedIndex,
				statuses: statuses,
			} as StoredFormData)
		);
	}, [
		allowSaveEmail,
		checkRsvpResponse.submitterName,
		email,
		expandedIndex,
		rsvpFormData,
		statuses,
	]);

	React.useEffect(() => {
		let isSubscribed = true;
		async function loadFormData() {
			if (!keys) {
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
					setStatuses(
						json.people?.map((e) =>
							e.afternoon || e.evening || e.ceremony ? 'accepts' : 'declines'
						) ?? []
					);
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
		if (!formRef.current?.reportValidity()) {
			setToastText(
				'The form is incomplete - have you filled it in for every person?'
			);
			setToastType('error');
			return;
		}
		if (
			rsvpFormData.find(
				(e, i) => e.name === UNKNOWN_GUEST_NAME && statuses[i] !== 'declines'
			)
		) {
			setToastText(
				'The form is incomplete - information is missing for some additional guests (+1s)'
			);
			setToastType('error');
			return;
		}
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
		setSubmitted,
		statuses,
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
					formNoValidate //we call reportValidate on submit instead
					ref={formRef}
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
									setStatuses={setStatuses}
									status={statuses[i]}
									setExpandedIndex={setExpandedIndex}
									expandedIndex={expandedIndex}
									key={i}
									loaded={stored || keys ? true : false}
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
						<div className='flex gap-2 items-center'>
							<Label
								htmlFor='email'
								value='Email'
							/>
							<Tooltip
								className='*:max-w-72'
								content='Optionally, provide your email address to receive a submission receipt with the details of your RSVP response.'>
								<IoInformationCircleSharp className='w-6 h-6' />
							</Tooltip>
						</div>
						<TextInput
							onChange={(e) => setEmail(e.target.value)}
							type='email'
							icon={HiEnvelope}
							placeholder='name@domain.com'
							id='email'
							value={email}
						/>
					</div>
					<div className='flex gap-2 items-center'>
						<Checkbox
							id='storeemail'
							checked={allowSaveEmail}
							onChange={(e) => {
								setAllowSaveEmail(e.target.checked);
							}}
						/>
						<Label htmlFor='storeemail'>Send me email updates</Label>
						<Tooltip
							className='*:max-w-72'
							content='Check this box to allow us to store your email for the sole
							purpose of more easily comnmunicating any important updates with
							you, in relation to the wedding. Your email would not be shared
							with any 3rd parties, and would be used sparingly.'>
							<IoInformationCircleSharp className='w-6 h-6' />
						</Tooltip>
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
	expandedIndex,
	setExpandedIndex,
	status,
	setStatuses,
}: {
	index: number;
	formData: RSVPFormData[number];
	setFormData: React.Dispatch<React.SetStateAction<RSVPFormData>>;
	invitedToAfternoon: boolean;
	loaded: boolean;
	expandedIndex: number;
	setExpandedIndex: React.Dispatch<React.SetStateAction<number>>;
	status: 'none' | 'accepts' | 'declines';
	setStatuses: React.Dispatch<
		React.SetStateAction<('none' | 'accepts' | 'declines')[]>
	>;
}) {
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
	const [statusRequired, setStatusRequired] = React.useState(status === 'none');
	const [checkboxesRequired, setCheckboxesRequired] = React.useState(
		!formData.afternoon && !formData.ceremony && !formData.evening
	);

	React.useEffect(() => {
		setStatusRequired(status === 'none');
	}, [status]);

	React.useEffect(() => {
		setCheckboxesRequired(
			!formData.afternoon && !formData.ceremony && !formData.evening
		);
	}, [formData.afternoon, formData.ceremony, formData.evening]);

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
	const [plusOneFirstName, setPlusOneFirstName] = React.useState('');
	const [plusOneSurname, setPlusOneSurname] = React.useState('');
	React.useEffect(() => {
		setPlusOneFirstName((c) => {
			c = c.slice(0, RSVP_FIRSTNAME_MAXCHARS);
			c = c.charAt(0).toUpperCase() + c.slice(1);
			return c;
		});
	}, [plusOneFirstName]);

	React.useEffect(() => {
		setPlusOneSurname((c) => {
			c = c.slice(0, RSVP_SURNAME_MAXCHARS);
			c = c.charAt(0).toUpperCase() + c.slice(1);
			return c;
		});
	}, [plusOneSurname]);
	return (
		<Accordion.Panel
			isOpen={expandedIndex === index}
			arrowIcon={HiChevronDown}>
			<Accordion.Title
				onClick={() => {
					setExpandedIndex((c) => (c === index ? -1 : index));
				}}>{`${index + 1}. ${formData.name}`}</Accordion.Title>
			<Accordion.Content>
				<div className='flex flex-col gap-2'>
					<fieldset className='flex max-w-md gap-4'>
						<div className='flex items-center gap-2'>
							{/*We use circular checkboxes instead of radio buttons because the radio buttons were buggy and were not always displaying their state correctly*/}
							<Checkbox
								onInvalid={(e) => {
									e.currentTarget.setCustomValidity(
										'You must select one of these options!'
									);
								}}
								onInput={(e) => e.currentTarget.setCustomValidity('')}
								required={statusRequired}
								key={String(statusRequired)}
								style={{ clipPath: 'circle(46% at 50% 50%)' }}
								name={`accept${index}`}
								id={`accept${index}`}
								checked={status === 'accepts'}
								onChange={(e) => {
									setStatuses((c) => {
										const newStatuses = c.slice();
										newStatuses[index] = e.target.checked
											? 'accepts'
											: 'declines';
										return newStatuses;
									});
								}}
							/>
							<Label htmlFor={`accept${index}`}>Excitedly accepts!</Label>
						</div>
						<div className='flex items-center gap-2'>
							<Checkbox
								required={statusRequired}
								key={String(statusRequired)}
								style={{ clipPath: 'circle(46% at 50% 50%)' }}
								name={`decline${index}`}
								id={`decline${index}`}
								checked={status === 'declines'}
								onChange={(e) => {
									setStatuses((c) => {
										const newStatuses = c.slice();
										newStatuses[index] = e.target.checked
											? 'declines'
											: 'accepts';
										return newStatuses;
									});
								}}
							/>
							<Label
								htmlFor={`decline${index}`}>{`Regretfully declines`}</Label>
						</div>
					</fieldset>
					{status === 'accepts' ? (
						<>
							{formData.name === UNKNOWN_GUEST_NAME ? (
								<>
									{formData.name === UNKNOWN_GUEST_NAME && (
										<div className='flex flex-col gap-2'>
											<div>
												<Label
													htmlFor={`name${index}`}
													value='First name'
												/>
												<TextInput
													id={`name${index}`}
													name={`name${index}`}
													required
													onChange={(e) => setPlusOneFirstName(e.target.value)}
													value={plusOneFirstName}
												/>
											</div>
											<div>
												<Label
													htmlFor={`surname${index}`}
													value='Surname'
												/>
												<TextInput
													onChange={(e) => setPlusOneSurname(e.target.value)}
													required
													id={`surname${index}`}
													name={`surname${index}`}
													value={plusOneSurname}
												/>
											</div>
											<Button
												onClick={() => {
													setFormData((c) => {
														const newData = c.slice();
														newData[index] = {
															...newData[index],
															name: plusOneFirstName + ' ' + plusOneSurname,
														};
														return newData;
													});
												}}
												className='min-w-24 w-fit bg-secondaryColor hover:bg-darkAccentColor'>
												Submit name
											</Button>
										</div>
									)}
								</>
							) : (
								<>
									<fieldset className='flex max-w-md flex-col gap-4'>
										<legend className='mb-4'>
											Please select all parts of the day this person is planning
											to attend.
										</legend>
										<div className='flex items-center gap-2'>
											<Checkbox
												name={`ceremony${index}`}
												id={`ceremony${index}`}
												onInvalid={(e) => {
													e.currentTarget.setCustomValidity(
														'You must select at least one of these boxes if you are accepting the invitation!'
													);
												}}
												onInput={(e) => e.currentTarget.setCustomValidity('')}
												required={checkboxesRequired}
												key={String(checkboxesRequired)}
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
											<Label htmlFor={`ceremony${index}`}>
												Wedding ceremony
											</Label>
										</div>
										{invitedToAfternoon && (
											<div className='flex items-center gap-2'>
												<Checkbox
													name={`afternoon${index}`}
													id={`afternoon${index}`}
													required={checkboxesRequired}
													key={String(checkboxesRequired)}
													checked={formData.afternoon}
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
												<Label htmlFor={`afternoon${index}`}>
													Afternoon reception
												</Label>
											</div>
										)}
										<div className='flex items-center gap-2'>
											<Checkbox
												name={`evening${index}`}
												id={`evening${index}`}
												required={checkboxesRequired}
												key={String(checkboxesRequired)}
												checked={formData.evening}
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
											<Label htmlFor={`evening${index}`}>
												Evening reception
											</Label>
										</div>
									</fieldset>
									{formData.evening || formData.afternoon ? (
										<>
											<div className='max-w-md'>
												<div className='mb-2 block'>
													<Label
														htmlFor={`dietary${index}`}
														value='Dietary requirements'
													/>
												</div>
												<Select
													name={`dietary${index}`}
													id={`dietary${index}`}
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
													<option value={'none'}>
														No dietary requirements
													</option>
													<option value={'vegetarian'}>Vegetarian</option>
													<option value={'pescetarian'}>Pescetarian</option>
													<option value={'other'}>Other</option>
												</Select>
											</div>
											{dietary === 'other' && (
												<div className='max-w-md'>
													<Label
														htmlFor={`dietarydetail${index}`}
														value='Please provide details'
													/>

													<Textarea
														name={`dietarydetail${index}`}
														id={`dietarydetail${index}`}
														required
														value={formData.dietary}
														placeholder='Detail your dietary requirements here'
														rows={6}
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
											{formData.afternoon && (
												<div className='flex items-center gap-2'>
													<Checkbox
														name={`alcohol${index}`}
														id={`alcohol${index}`}
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
													<Label htmlFor={`alcohol${index}`}>
														Orange juice in place of alcohol?
													</Label>
												</div>
											)}
											<div className='text-gray-500'>
												<span
													onClick={() => setShowFoodInfoModal(true)}
													className='text-sm font-normal hover:underline'>
													Please click here to view information about the food
													and drink that will be served.
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
											htmlFor={`comments${index}`}
											value={`Is there anything else you'd like us to know?`}
										/>

										<Textarea
											name={`comments${index}`}
											id={`comments${index}`}
											value={formData.comments}
											rows={6}
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
							)}
						</>
					) : (
						<></>
					)}
				</div>
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
								Those with no dietary requirements will receive the same
								3-course meal. All vegetarians will be served the same
								vegetarian 3-course meal. Pescetarians may receive a mixture of
								both menus. Any other dietary requirements will be catered for
								separately.
							</p>
							<p>
								A glass of wine will be served with the meal, and an alcoholic
								beverage will be provided on arrival and for the toast. A bar
								will be available throughout.
							</p>
						</>
					)}
					<h1 className='text-2xl'>Evening reception</h1>
					<p>
						A buffet will be provided, which will include some vegetarian food.
						Other dietary requirements can be catered for separately.
					</p>
					<p> In addition, a bar will be available throughout. </p>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button
					className='min-w-24 max-h-[50px] w-fit bg-secondaryColor hover:bg-darkAccentColor mb-4 '
					onClick={() => setShowFoodInfoModal(false)}>
					Close
				</Button>
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
			data.firstName = data.firstName?.slice(0, RSVP_FIRSTNAME_MAXCHARS);
			data.firstName =
				data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1);
			data.surname = data.surname?.slice(0, RSVP_SURNAME_MAXCHARS);
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
