import { Sidebar } from 'flowbite-react';
import React from 'react';
import * as Icons from 'react-icons/hi2';
import { useLocation } from 'react-router-dom';
import Divider from './lib/Divider';
//import banner from './assets/banner.png';

export default function PageWrapper({
	children,
}: {
	children?: React.ReactNode;
}) {
	const { pathname } = useLocation();
	const ref = React.useRef<HTMLDivElement>(null);
	React.useEffect(() => {
		ref.current?.scrollTo({ behavior: 'smooth', top: 0, left: 0 });
	}, [pathname]);
	return (
		<div
			className='h-full flex flex-col'
			ref={ref}>
			<header className='w-full p-2 box-border flex items-center'>
				<h1>Header</h1>
				{/* <img
					alt='Adele and Matthew smiling together on the beach'
					width='1200'
					height='400'
					src={banner}></img> */}
			</header>
			<Divider orientation='horizontal' />
			<div className='h-full flex'>
				<NavBar />
				<main className='bg-backgroundColor w-full'>{children}</main>
			</div>

			<footer></footer>
		</div>
	);
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
