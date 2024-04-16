import {
	Accordion,
	Button,
	Checkbox,
	Label,
	Modal,
	RangeSlider,
	Select,
	TextInput,
	Textarea,
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
	RSVP_SURNAME_MAXCHARS,
	UNKNOWN_GUEST_NAME,
	ResponseType,
	UpdateRSVPRequestBody,
	UpdateRSVPRequestResponse,
	RSVP_LOCATION_MAXCHARS,
	EMAILDOMAIN_MAXCHARS,
	EMAILLOCAL_MAXCHARS,
	RSVP_FULLNAME_MAXCHARS,
} from '../constants';
import { Link } from 'react-router-dom';
import {
	HiChevronDown,
	HiEnvelope,
	HiMiniArrowLeftOnRectangle,
} from 'react-icons/hi2';
import { IoRefreshSharp } from 'react-icons/io5';
import { AdminKeyContext } from '../App';
import { crypto_box_seal_open } from 'libsodium-wrappers';
import { b642uint8array, getNonce } from '../Utils';
import { PrivacyModal } from './PrivacyPolicy';

export default function RSVP() {
	const [submitted, setSubmitted] = React.useState(false);
	const { keys } = React.useContext(AdminKeyContext);
	const [checkRsvpRequestResponse, setCheckRsvpRequestResponse] =
		React.useState<
			(CheckRSVPRequestResponse<'success'> & { submitterName: string }) | null
		>(null);
	React.useEffect(() => {
		setSubmitted(false);
	}, [checkRsvpRequestResponse?.submitterName]);
	const [resetFormKey, setResetFormKey] = React.useState(0);
	return (
		<PageWrapper>
			<section className='flex flex-col gap-2 items-start py-8 px-8 w-full max-w-3xl text-textColor'>
				<div className='flex justify-between w-full'>
					<h1
						className='text-darkAccentColor text-nowrap pr-3'
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
									className='min-w-24 max-h-[50px] w-fit  mb-4 '
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
								className='min-w-24 max-h-[50px] w-fit  mb-4 '
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
					appears on the envelope/email you received with your invitation (including your title as part of your first name).
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

type StoredFormData = {
	ceremonyLift: boolean;
	locationLift: boolean;
	liftNumbers: number;
	lift: 'need' | 'give' | 'none';
	email: string;
	rsvpFormData: RSVPFormData;
	expandedIndex: number;
	emailUpdates: boolean;
	liftEmailConsent: boolean;
	statuses: ('accepts' | 'declines' | 'none')[];
	location: string;
	emailReceipt: boolean;
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
								name: { displayName: UNKNOWN_GUEST_NAME, altNames: [] },
						  })
						: []),
			  ]
	);
	const [email, setEmail] = React.useState(stored ? stored.email : '');
	const [lift, setLift] = React.useState<'need' | 'give' | 'none'>(
		stored?.lift ?? 'none'
	);
	const [ceremonyLift, setCeremonyLift] = React.useState(
		stored?.ceremonyLift ?? false
	);
	const [location, setLocation] = React.useState(stored ? stored.location : '');
	const [locationLift, setLocationLift] = React.useState(
		stored?.locationLift ?? false
	);
	const [liftNumbers, setLiftNumbers] = React.useState(
		stored?.liftNumbers ?? 1
	);
	const [liftEmailConsent, setLiftEmailConsent] = React.useState(
		stored?.liftEmailConsent ?? false
	);
	const [emailUpdates, setEmailUpdates] = React.useState(
		stored?.emailUpdates ?? false
	);
	const [emailReceipt, setEmailReceipt] = React.useState(
		stored?.emailReceipt ?? false
	);
	const [expandedIndex, setExpandedIndex] = React.useState(
		stored?.expandedIndex ?? 0
	);
	const [statuses, setStatuses] = React.useState<
		('accepts' | 'declines' | 'none')[]
	>(keys ? [] : stored?.statuses ?? rsvpFormData.map((_) => 'none'));
	const formRef = React.useRef<HTMLFormElement>(null);

	React.useEffect(() => {
		console.log(rsvpFormData);
		setRsvpFormData((c) => {
			const data = [...c];
			data.forEach((item) => {
				item.comments = item.comments?.slice(0, RSVP_COMMENTS_MAXCHARS);
				item.dietary = item.dietary?.slice(0, RSVP_DIETARY_MAXCHARS);
				item.name = {
					displayName: item.name.displayName.slice(0, RSVP_FULLNAME_MAXCHARS),
					altNames: item.name.altNames,
				};
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
				emailUpdates: emailUpdates,
				expandedIndex: expandedIndex,
				statuses: statuses,
				ceremonyLift: ceremonyLift,
				lift: lift,
				liftEmailConsent: liftEmailConsent,
				liftNumbers: liftNumbers,
				location: location,
				locationLift: locationLift,
			} as StoredFormData)
		);
	}, [
		emailUpdates,
		ceremonyLift,
		checkRsvpResponse.submitterName,
		email,
		expandedIndex,
		lift,
		liftEmailConsent,
		liftNumbers,
		location,
		locationLift,
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
					setEmailUpdates(invite.doNotEmail ? false : true);
					setCeremonyLift(json.ceremonyLift ?? false);
					setLift(json.needOrCanGiveLift ?? 'none');
					setLiftNumbers(json.liftSpaces ?? 1);
					setLiftEmailConsent(json.liftEmailConsent ?? false);
					setLocationLift(!!json.locationLift);
					setLocation(json.locationLift ?? '');
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
				(e, i) =>
					e.name.displayName === UNKNOWN_GUEST_NAME &&
					statuses[i] !== 'declines'
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
					emailUpdates: emailUpdates,
					email: email,
					people: rsvpFormData,
					ceremonyLift: ceremonyLift,
					locationLift: location,
					needOrCanGiveLift: lift,
					liftSpaces: liftNumbers,
					emailReceipt: emailReceipt,
					liftEmailConsent: liftEmailConsent,
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
			body = {
				inviteId: checkRsvpResponse.inviteId,
				emailUpdates: emailUpdates,
				email: email,
				people: rsvpFormData,
				submitterName: checkRsvpResponse.submitterName,
				ceremonyLift: ceremonyLift,
				locationLift: location,
				needOrCanGiveLift: lift,
				liftSpaces: liftNumbers,
				emailReceipt: emailReceipt,
				liftEmailConsent: liftEmailConsent,
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
		rsvpFormData,
		keys,
		statuses,
		checkRsvpResponse.inviteId,
		checkRsvpResponse.submitterName,
		emailUpdates,
		email,
		ceremonyLift,
		location,
		lift,
		liftNumbers,
		emailReceipt,
		liftEmailConsent,
		setSubmitted,
	]);
	return (
		<>
			{submitted ? (
				<h1>
					{`RSVP submitted successfully, thanks!${
						rsvpFormData.some((e) => e.afternoon || e.ceremony || e.evening)
							? ` We look forward to celebrating
					with you!`
							: ''
					}`}
					<br></br>
					Please note that the ceremony will be livestreamed, so even if you
					can't make it on the day you can still watch. More information will be
					added to the site closer to the time.
				</h1>
			) : (
				<Form
					PrivacyPolicy={PrivacyModal}
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
					{statuses.some((e) => e === 'accepts') && (
						<div className='border-gray-500 border p-3 flex flex-col gap-2 rounded-lg mt-4 mb-4'>
							<div className='max-w-md'>
								<div className='mb-2 block'>
									<Label
										htmlFor={`lifts`}
										value='Need or could provide a lift?'
									/>
								</div>
								<Select
									name={`lifts`}
									id={`lifts`}
									required
									onChange={(e) => {
										setLift(e.target.value as 'none' | 'need' | 'give');
									}}
									value={lift}>
									<option value={'none'}>No</option>
									<option value={'need'}>I would like a lift</option>
									<option value={'give'}>I can provide a lift</option>
								</Select>
							</div>
							{lift !== 'none' && (
								<>
									<span className='text-gray-700 text-sm'>
										We will do our best to match those looking for a lift to
										those who can provide one.
									</span>
									{checkRsvpResponse.invitedToAfternoon && (
										<div className='flex gap-2 items-center'>
											<Checkbox
												style={{ boxShadow: '0px 0px 2px 1px' }}
												id='ceremonylift'
												checked={ceremonyLift}
												onChange={(e) => {
													setCeremonyLift(e.target.checked);
												}}
											/>
											<Label htmlFor='ceremonylift'>
												{lift === 'give'
													? 'I could provide a lift from the ceremony to the reception'
													: 'I would like a lift from the ceremony to the reception'}
											</Label>
										</div>
									)}
									<div className='flex gap-2 items-center'>
										<Checkbox
											style={{ boxShadow: '0px 0px 2px 1px' }}
											id='locationlift'
											checked={locationLift}
											onChange={(e) => {
												setLocationLift(e.target.checked);
											}}
										/>
										<Label htmlFor='locationlift'>
											{lift === 'give'
												? 'I could provide a lift to the ceremony from where I live'
												: 'I would like a lift to the ceremony from where I live'}
										</Label>
									</div>
									{locationLift && (
										<div>
											<Label
												htmlFor='location'
												value={
													lift === 'give'
														? 'Where are you able to provide a lift from?'
														: 'Where would you like a lift from?'
												}
											/>
											<TextInput
												onChange={(e) => setLocation(e.target.value)}
												id='location'
												name='location'
												value={location}
												required
												maxLength={RSVP_LOCATION_MAXCHARS}
											/>
										</div>
									)}
									<div>
										<div className='mb-1 block'>
											<Label
												htmlFor='lg-range'
												value={
													lift === 'give'
														? 'How many people do you have room for?'
														: 'How many seats do you need?'
												}
											/>
										</div>
										<div className='flex gap-2'>
											<RangeSlider
												style={{ boxShadow: '0px 0px 2px 1px' }}
												className='w-56'
												id='lg-range'
												sizing='lg'
												max={10}
												min={1}
												step={1}
												onChange={(e) => {
													setLiftNumbers(e.target.valueAsNumber);
												}}
												value={liftNumbers}
											/>
											<Label>{liftNumbers}</Label>
										</div>
									</div>
								</>
							)}
						</div>
					)}

					<div className='flex gap-2 items-center'>
						<Checkbox
							style={{ boxShadow: '0px 0px 2px 1px' }}
							id='emailreceipt'
							checked={emailReceipt}
							onChange={(e) => {
								setEmailReceipt(e.target.checked);
							}}
						/>
						<Label htmlFor='emailreceipt'>
							Send me an email receipt containing my RSVP response
						</Label>
					</div>

					<div className='flex gap-2 items-center'>
						<Checkbox
							style={{ boxShadow: '0px 0px 2px 1px' }}
							id='storeemail'
							checked={emailUpdates}
							onChange={(e) => {
								setEmailUpdates(e.target.checked);
							}}
						/>
						<Label htmlFor='storeemail'>Send me email updates</Label>
					</div>

					{lift === 'give' && (
						<div className='flex gap-2 items-center'>
							<Checkbox
								style={{ boxShadow: '0px 0px 2px 1px' }}
								id='liftemailconsent'
								checked={liftEmailConsent}
								onChange={(e) => {
									setLiftEmailConsent(e.target.checked);
								}}
							/>
							<Label htmlFor='liftemailconsent'>
								If you are matched with someone who is looking for a lift, may
								we share your email address with them?
							</Label>
						</div>
					)}
					{emailReceipt || liftEmailConsent || emailUpdates ? (
						<div>
							<Label
								htmlFor='email'
								value='Email'
							/>
							<TextInput
								required
								onChange={(e) => setEmail(e.target.value)}
								type='email'
								icon={HiEnvelope}
								autoComplete='email'
								placeholder='name@domain.com'
								id='email'
								value={email}
								maxLength={EMAILDOMAIN_MAXCHARS + EMAILLOCAL_MAXCHARS + 1}
							/>
						</div>
					) : (
						<></>
					)}
				</Form>
			)}
		</>
	);
}

//TODO test updated form
//TODO update all wording
//TODO add info to homepage incl. date

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
				}}>{`${index + 1}. ${formData.name.displayName}`}</Accordion.Title>
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
								style={{
									clipPath: 'circle(46% at 50% 50%)',
									filter: 'brightness(125%) contrast(250%)',
								}}
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
								style={{
									clipPath: 'circle(46% at 50% 50%)',
									filter: 'brightness(125%) contrast(250%)',
								}}
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
							{formData.name.displayName === UNKNOWN_GUEST_NAME ? (
								<div className='flex flex-col gap-2'>
									<div>
										<Label
											htmlFor={`name${index}`}
											value='First name'
										/>
										<TextInput
											id={`name${index}`}
											name={`name${index}`}
											autoComplete='off'
											required
											onChange={(e) => setPlusOneFirstName(e.target.value)}
											value={plusOneFirstName}
											autoCapitalize='words'
											maxLength={RSVP_FIRSTNAME_MAXCHARS}
										/>
									</div>
									<div>
										<Label
											htmlFor={`surname${index}`}
											value='Surname'
										/>
										<TextInput
											autoCapitalize='words'
											onChange={(e) => setPlusOneSurname(e.target.value)}
											required
											maxLength={RSVP_SURNAME_MAXCHARS}
											id={`surname${index}`}
											name={`surname${index}`}
											value={plusOneSurname}
											autoComplete='off'
										/>
									</div>
									<Button
										onClick={() => {
											if (!plusOneFirstName || !plusOneSurname) {
												return;
											}
											setFormData((c) => {
												const newData = c.slice();
												newData[index] = {
													...newData[index],
													name: {
														displayName:
															plusOneFirstName.trim() +
															' ' +
															plusOneSurname.trim(),
														altNames: [],
													},
												};
												return newData;
											});
										}}
										className='min-w-24 w-fit'>
										Submit name
									</Button>
								</div>
							) : (
								<>
									<fieldset className='flex max-w-md flex-col gap-4'>
										<legend className='mb-4'>
											Please select all parts of the day this person is planning
											to attend.
										</legend>
										<div className='flex items-center gap-2'>
											<Checkbox
												style={{ boxShadow: '0px 0px 2px 1px' }}
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
													style={{ boxShadow: '0px 0px 2px 1px' }}
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
												style={{ boxShadow: '0px 0px 2px 1px' }}
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
														maxLength={RSVP_DIETARY_MAXCHARS}
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
														style={{ boxShadow: '0px 0px 2px 1px' }}
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
											<div className='text-gray-600'>
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
											maxLength={RSVP_COMMENTS_MAXCHARS}
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
					) : status === 'declines' ? (
						<h1>
							Sorry you won't be there - the ceremony will be livestreamed, so
							you could still watch! More information will be added to the site
							closer to the time.
						</h1>
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
								will probably be available throughout so you can purchase your
								own drinks.
							</p>
						</>
					)}
					<h1 className='text-2xl'>Evening reception</h1>
					<p>
						A buffet will be provided, which will include some vegetarian food.
						Other dietary requirements can be catered for separately.
					</p>
					<p>
						In addition, a bar will be available throughout so you can purchase
						your own drinks.
					</p>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button
					className='min-w-24 max-h-[50px] w-fit mb-4 '
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
		const name =
			nameFormData.firstName.trim() + ' ' + nameFormData.surname.trim();
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
					autoCapitalize='words'
					maxLength={RSVP_FIRSTNAME_MAXCHARS}
					id='name'
					required
					onChange={(e) =>
						setNameFormData((c) => ({ ...c, firstName: e.target.value }))
					}
					value={nameFormData.firstName}
					autoComplete='given-name'
				/>
			</div>
			<div>
				<Label
					htmlFor='surname'
					value='Surname'
				/>
				<TextInput
					autoCapitalize='words'
					maxLength={RSVP_SURNAME_MAXCHARS}
					autoComplete='family-name'
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
