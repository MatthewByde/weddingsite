import { Modal, Button } from 'flowbite-react';
import PageWrapper from '../PageWrapper';

export default function PrivacyPage() {
	return (
		<PageWrapper>
			<PrivacyPolicy />
		</PageWrapper>
	);
}

export function PrivacyModal({
	showPrivacyModal,
	setShowPrivacyModal,
}: {
	showPrivacyModal: boolean;
	setShowPrivacyModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	return (
		<Modal
			show={showPrivacyModal}
			size={'7xl'}
			onClose={() => setShowPrivacyModal(false)}>
			<Modal.Header>Privacy notice</Modal.Header>
			<Modal.Body>
				<PrivacyPolicy></PrivacyPolicy>
			</Modal.Body>
			<Modal.Footer>
				<Button
					className='min-w-24 max-h-[50px] w-fit mb-4 '
					onClick={() => setShowPrivacyModal(false)}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

function PrivacyPolicy() {
	return (
		<div className='space-y-6 p-6 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-textColor [&_li]:list-item [&_li]:list-disc [&_ul]:pt-2 [&_li]:list-inside'>
			<h1 className='text-2xl'>Privacy notice</h1>
			<p>
				We (Matthew Byde and Adele Butcher (who is expected to change her name
				to Adele Byde upon marriage), matthewandadelewedding@gmail.com)
				currently collect and/or process the following personal information:
			</p>
			<ul>
				<li>Email addresses</li>
				<li>Personal identifiers e.g. names</li>
				<li>Dietary information</li>
				<li>Location information</li>
				<li>How certain people are interrelated</li>
				<li>Whether people are attending the wedding</li>
				<li>
					Information that could disclose your ability to drive/car ownership
				</li>
				<li>Photographs and videos</li>
				<li>
					Any other personal information submitted unprompted, e.g. by emailing
					us or using the contact form
				</li>
			</ul>

			<p>
				Most of the personal information we process is provided directly to us
				by you for the sole purpose of organising our wedding, or performing
				other services specifically requested by you. We also store and process
				names of people and how certain people are interrelated based on
				pre-existing relationships with users, external to this website.
			</p>
			<p>
				We use the personal information that you have given to us as follows:
			</p>
			<ul>
				<li>
					Email addresses: to respond to enquiries, send RSVP receipts,
					coordinate travel, and send other wedding-related emails
				</li>
				<li>
					Personal identifiers e.g. names: to link the other information you
					submit back to you
				</li>
				<li>Who is attending the wedding: for wedding planning purposes</li>
				<li>
					Location information and information that could disclose your ability
					to drive/car ownership: for the purpose of helping to coordinate
					travel arrangements
				</li>
				<li>Dietary information: for the purpose of wedding catering</li>
				<li>
					How certain people are interrelated: to allow for having multiple
					people linked to the same wedding invitation, and for seating
					arrangement planning
				</li>
				<li>Photographs and videos: as a historical record and a keepsake</li>
				<li>
					Any other personal information submitted unprompted: for the purpose
					of providing additional assistance to you in relation to the wedding
				</li>
			</ul>
			<p>We may share this information as follows:</p>
			<ul>
				<li>
					Email addresses: Not shared unless consent is given to allow us to
					share your email address also with another invitee of the wedding for
					the purpose of coordinating travel arrangements at your request.
				</li>
				<li>
					Personal identifiers e.g. names, and how certain people are
					interrelated: May be shared with our families and friends. At times,
					this information may also be publicly obtainable through the website,
					to allow for names to be entered to access the relevant RSVP form for
					that person. However, no other information is able to be linked back
					to you this way. This information may also be shared with Westmead
					Hotel in the case that you inform us you intend to attend our wedding
					reception.
				</li>
				<li>Who is attending the wedding: with our friends and family</li>
				<li>
					Location information and information that could disclose your ability
					to drive/car ownership: Will not be directly shared, but may be
					indirectly shared with other invitees of the wedding in the process of
					coordinating travel arrangements, for example when, with your consent,
					sharing your email address as someone who can provide a lift with
					someone who needs one.
				</li>
				<li>
					Dietary information: To be shared with Westmead Hotel if you inform us
					you are attending the wedding reception.
				</li>
				<li>
					Photographs and videos: We may share these publicly and use them
					however we like, within the bounds of the law. You retain the
					copyright.
				</li>
				<li>
					Any other personal information submitted unprompted: Not to be shared
				</li>
			</ul>

			<p>
				Your personal information is stored securely. We will keep all your
				personal information from when it is submitted until 90 days after
				either the 01/01/2026 or the date the wedding takes place, whichever is
				earlier, or until 3 months after it was submitted, whichever is later,
				at the latest. At this time, most of your personal information submitted
				through the website will be deleted. The only retained personal data
				will be:
			</p>
			<ul>
				<li>
					A list of names of those invited to the wedding and whether or not
					they attended, for the purpose of historical records. Retained
					indefinitely.
				</li>
				<li>
					Any photos or videos you provided or in which you appear, for the
					purpose of historical records and as a keepsake. Retained
					indefinitely.
				</li>
				<li>
					Any other data that needs to be retained due to exceptional
					circumstances, such as when necessary for reasons of freedom of
					expression and information, to comply with legal regulations, if
					carrying out a task in the public interest, if needed for
					establishing, exercising or defending legal claims, when erasing the
					data would prejudice scientific or historal research, or when
					archiving the data is in the public interest. Retained for no longer
					than is necessary.
				</li>
			</ul>
			<p>
				When data is deleted, it will be permanently removed from both our
				servers and from our local records. Any data that was shared with
				Westmead Hotel may be retained by them for longer than we retain it,
				subject to their privacy policy. If we know of any data stores held by
				individuals with whom personal data was shared, we will request that it
				is also deleted.
			</p>
		</div>
	);
}
