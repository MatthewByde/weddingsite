import { Sidebar } from 'flowbite-react';
import * as Icons from 'react-icons/hi2';

export default function PageWrapper() {
	return <NavBar />;
}

function NavBar() {
	return (
		<Sidebar
			className='h-full'
			aria-label='Navigation sidebar'>
			<Sidebar.Items>
				<Sidebar.ItemGroup>
					<Sidebar.Item
						href='/'
						icon={Icons.HiHome}>
						Home
					</Sidebar.Item>
					<Sidebar.Item
						href='/rsvp'
						icon={Icons.HiEnvelope}>
						RSVP
					</Sidebar.Item>
					<Sidebar.Item
						href='/registry'
						icon={Icons.HiGift}>
						Gift registry
					</Sidebar.Item>
					<Sidebar.Item
						href='/travel'
						icon={Icons.HiMap}>
						Travel
					</Sidebar.Item>
					<Sidebar.Item
						href='/faqs'
						icon={Icons.HiQuestionMarkCircle}>
						FAQs
					</Sidebar.Item>
					<Sidebar.Item
						href='/contact'
						icon={Icons.HiPhone}>
						Contact
					</Sidebar.Item>
				</Sidebar.ItemGroup>
			</Sidebar.Items>
		</Sidebar>
	);
}
