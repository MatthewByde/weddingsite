import { Button, Sidebar } from 'flowbite-react';
import React from 'react';
import * as Icons from 'react-icons/hi2';
import { NavCollapsedContext } from './App';
import bg from './assets/bg.jpg'; //https://www.freepik.com/free-photo/concrete-wall-with-flowers_3164817.htm#query=wedding%20background&position=0&from_view=keyword&track=ais&uuid=aca60d95-755a-4828-88fa-7ebe1118f085 TODO ATTRIBUTE
import Divider from './lib/Divider';
import { Link } from 'react-router-dom';

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
	const { navCollapsed, setNavCollapsed } =
		React.useContext(NavCollapsedContext);
	return (
		<div
			className='h-full flex flex-col'
			ref={ref}>
			<header className='w-full h-20 bg-secondaryColor flex sticky top-0 z-50'>
				<Link
					to={'/'}
					style={{ fontFamily: 'argue' }}
					className='flex flex-col items-center text-lightAccentColor pl-2 h-fit pt-1'>
					<span className='text-lg'>Adele</span>
					<span className='text-sm'>and</span>
					<span className='text-lg'>Matthew</span>
				</Link>
			</header>
			<div className='flex'>
				<div
					className='sticky top-20 self-stretch'
					style={{ height: 'calc(100vh - 5rem)' }}>
					<NavBar
						collapsed={navCollapsed}
						setCollapsed={setNavCollapsed}
					/>
					<Divider
						orientation='vertical'
						className='relative w-[2px]'></Divider>
				</div>
				<div
					className='h-full bg-fit w-full'
					style={{ backgroundImage: `url(${bg})` }}>
					<main
						className='w-full pt-2 max-h-fit'
						style={{ minHeight: 'calc(100vh - 5rem)' }}>
						{children}
					</main>
				</div>
			</div>

			<footer></footer>
		</div>
	);
}

function NavBar({
	collapsed,
	setCollapsed,
}: {
	collapsed: boolean;
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
						to='/'
						icon={Icons.HiHome}
						as={Link}>
						Home
					</Sidebar.Item>
					<Sidebar.Item
						to='/rsvp'
						icon={Icons.HiEnvelope}
						as={Link}>
						RSVP
					</Sidebar.Item>
					<Sidebar.Item
						to='/registry'
						icon={Icons.HiGift}
						as={Link}>
						Gift registry
					</Sidebar.Item>
					<Sidebar.Item
						to='/travel'
						icon={Icons.HiMap}
						as={Link}>
						Travel
					</Sidebar.Item>
					<Sidebar.Item
						to='/faqs'
						icon={Icons.HiQuestionMarkCircle}
						as={Link}>
						FAQs
					</Sidebar.Item>
					<Sidebar.Item
						to='/contact'
						icon={Icons.HiPhone}
						as={Link}>
						Contact
					</Sidebar.Item>
				</Sidebar.ItemGroup>
			</Sidebar.Items>
		</Sidebar>
	);
}
