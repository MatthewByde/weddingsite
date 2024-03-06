import { Button, Sidebar } from 'flowbite-react';
import React from 'react';
import * as Icons from 'react-icons/hi2';
import { WindowWidthContext } from './App';
import bg from './assets/bg.jpg'; //https://www.freepik.com/free-photo/concrete-wall-with-flowers_3164817.htm#query=wedding%20background&position=0&from_view=keyword&track=ais&uuid=aca60d95-755a-4828-88fa-7ebe1118f085 TODO ATTRIBUTE
import Divider from './lib/Divider';

export default function PageWrapper({
	children,
}: {
	children?: React.ReactNode;
}) {
	// const { pathname } = useLocation();
	const ref = React.useRef<HTMLDivElement>(null);
	// React.useEffect(() => {
	// 	ref.current?.scrollTo({ behavior: 'smooth', top: 0, left: 0 });
	// }, [pathname]);
	return (
		<div
			className='h-full flex flex-col'
			ref={ref}>
			<header className='w-full h-20 bg-secondaryColor flex sticky top-0'>
				<a
					href={'/'}
					style={{ fontFamily: 'argue' }}
					className='flex flex-col items-center text-lightAccentColor pl-2 h-fit pt-1'>
					<h1 className='text-lg'>Adele</h1>
					<h3 className='text-sm'>and</h3>
					<h1 className='text-lg'>Matthew</h1>
				</a>
			</header>
			<div className='flex'>
				<div
					className='sticky top-20 self-start'
					style={{ height: 'calc(100vh - 5rem)' }}>
					<NavBar />
					<Divider
						orientation='vertical'
						className='relative w-[2px]'></Divider>
				</div>
				<div
					className='h-full bg-fit'
					style={{ backgroundImage: `url(${bg})` }}>
					<main className=' w-full h-[1000px] pt-2'>{children}</main>
				</div>
			</div>

			<footer></footer>
		</div>
	);
}

function NavBar() {
	const { isMobile } = React.useContext(WindowWidthContext);
	const [collapsed, setCollapsed] = React.useState(isMobile);
	return (
		<Sidebar
			className='h-full'
			style={{ transition: 'width 400ms ease-in-out' }}
			collapseBehavior={'collapse'}
			collapsed={collapsed}
			aria-label='Navigation sidebar'>
			<Sidebar.Items>
				<Button
					className='border-0'
					onClick={() => {
						setCollapsed((c) => !c);
					}}>
					<Icons.HiBars3 className='w-6 h-6' />
				</Button>

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
