import { Button, Sidebar } from 'flowbite-react';
import React from 'react';
import * as Icons from 'react-icons/hi2';
import { NavCollapsedContext, WindowWidthContext } from './App';
import bg from './assets/bg.jpg'; //TODO https://www.freepik.com/free-photo/concrete-wall-with-flowers_3164817.htm#query=wedding%20background&position=0&from_view=keyword&track=ais&uuid=aca60d95-755a-4828-88fa-7ebe1118f085 ATTRIBUTE
import { Link, useLocation } from 'react-router-dom';
import { use100vh } from 'react-div-100vh';
import Divider from './lib/Divider';
import dayjs from 'dayjs';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

const HEADER_SIZE = '80px';

const WEDDING_DATE = dayjs('2024-11-09T12:00:00Z');

function updateTimer(setTimer: React.Dispatch<React.SetStateAction<string>>) {
	const secondDiff = WEDDING_DATE.diff(dayjs(), 'seconds');
	const minuteDiff = Math.floor(secondDiff / 60);
	const hourDiff = Math.floor(minuteDiff / 60);
	const days = Math.floor(hourDiff / 24);
	const hours = dayjs().hour(hourDiff).hour();
	const minutes = dayjs().minute(minuteDiff).minute();
	const seconds = dayjs().second(secondDiff).second();
	setTimer(
		`${days} days, ${String(hours).padStart(2, '0')}:${String(minutes).padStart(
			2,
			'0'
		)}:${String(seconds).padStart(2, '0')}`
	);
}

export default function PageWrapper({
	children,
}: {
	children?: React.ReactNode;
}) {
	const [timer, setTimer] = React.useState<string>('');
	React.useEffect(() => {
		updateTimer(setTimer);
	}, []);
	setInterval(() => updateTimer(setTimer), 1000);
	const { isMobile } = React.useContext(WindowWidthContext);
	const ref = React.useRef<HTMLDivElement>(null);
	const fullvh = use100vh();
	const { navCollapsed, setNavCollapsed } =
		React.useContext(NavCollapsedContext);
	const location = useLocation();
	React.useEffect(() => {
		if (isMobile) {
			setNavCollapsed(true);
		}
	}, [isMobile, setNavCollapsed, location.pathname]);
	return (
		<div
			className='h-full flex flex-col'
			ref={ref}>
			<header
				className='w-full bg-secondaryColor flex sticky top-0 z-50 justify-between'
				style={{ height: HEADER_SIZE }}>
				<Link
					to={'/'}
					style={{ fontFamily: 'argue' }}
					className='flex flex-col items-center text-lightAccentColor pl-2 h-fit pt-1'>
					<span className='text-lg'>Adele</span>
					<span className='text-sm'>and</span>
					<span className='text-lg'>Matthew</span>
				</Link>
				<span className='h-fit self-center justify-self-end p-2 text-lightAccentColor mr-2 font-medium text-lg min-w-[10.5rem]'>
					{timer}
				</span>
			</header>
			<div className='flex'>
				<div
					className='sticky self-stretch'
					style={{
						height: `calc(${
							fullvh ? `${fullvh}px` : '100vh'
						} - ${HEADER_SIZE})`,
						top: HEADER_SIZE,
					}}>
					<NavBar
						collapsed={navCollapsed}
						setCollapsed={setNavCollapsed}
					/>
				</div>
				<Divider orientation='vertical' />
				<div
					className='bg-fit overflow-auto'
					style={{
						backgroundImage: `url(${bg})`,
						width: `calc(100% - ${navCollapsed ? '4rem' : '12rem'}`,
						height: `calc(${
							fullvh ? `${fullvh}px` : '100vh'
						} - ${HEADER_SIZE})`,
					}}>
					<main
						className='w-full max-h-fit'
						style={{
							overflowWrap: 'anywhere',
							minHeight: `calc(${
								fullvh ? `${fullvh}px` : '100vh'
							} - ${HEADER_SIZE})`,
						}}>
						<ErrorBoundary FallbackComponent={FallbackComponent}>
							{children}
						</ErrorBoundary>
					</main>
				</div>
			</div>

			<footer></footer>
		</div>
	);
}

function FallbackComponent(props: FallbackProps) {
	console.error(props.error);
	return (
		<section className='flex flex-col gap-2 items-start py-8 px-8 w-full max-w-3xl text-textColor'>
			<h1
				className='text-darkAccentColor'
				style={{
					fontFamily: 'argue',
					fontSize: 'min(max(3.75vw, 2rem), 3.75rem)',
				}}>
				Something went wrong
			</h1>
			<p>
				{`If you're seeing this, something went wrong on our end. Sorry! Please try again, or if this is a recurring issue, you can `}
				<Link
					className='text-xl underline text-darkAccentColor'
					to={'/contact'}>
					contact us
				</Link>
				.
			</p>
		</section>
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
						to='/faq'
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
			<Link
				to='/about'
				className='underline text-darkAccentColor'>
				About
			</Link>
		</Sidebar>
	);
}
