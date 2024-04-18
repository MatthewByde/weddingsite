import { Link } from 'react-router-dom';
import PageWrapper from '../PageWrapper';
import banner from '../assets/banner.png';
import Divider from '../lib/Divider';

export default function Homepage() {
	return (
		<PageWrapper>
			<section className='flex flex-col w-full items-center pb-8'>
				<div className='w-full box-border flex items-center max-w-[1200px] h-auto pt-2 '>
					{
						<img
							alt="A collage showing Adele and Matthew's engagement, graduation, and fun at Lickey Hills."
							src={banner}></img>
					}
				</div>
				<div
					className='flex flex-col items-center text-darkAccentColor py-8 px-2 [&_p]:text-center'
					style={{ fontFamily: 'argue' }}>
					<h1>
						<p style={{ fontSize: 'min(max(1.875vw, 1.25rem), 1.875rem)' }}>
							You're invited to the wedding of
						</p>
						<p style={{ fontSize: 'min(max(3.75vw, 2rem), 3.75rem)' }}>
							Adele Georgia Butcher
						</p>
						<p style={{ fontSize: 'min(max(1.25vw, 1rem), 1.5rem)' }}>and</p>
						<p style={{ fontSize: 'min(max(3.75vw, 2rem), 3.75rem)' }}>
							Matthew David Byde
						</p>
					</h1>
				</div>
				<Link
					style={{ fontFamily: 'argue' }}
					to='/rsvp'
					className='text-2xl font-semibold w-80 h-20 border-0 px-0 py-0 justify-center items-center rounded-lg text-backgroundColor hover:bg-darkAccentColor bg-secondaryColor flex [&_span]:px-2 [&_span]:py-2 transition'>
					RSVP
				</Link>
			</section>
			<Divider orientation='horizontal'></Divider>
			<section className='flex flex-col py-8 px-8 gap-2 text-textColor'>
				<h1
					className='text-darkAccentColor'
					style={{
						fontFamily: 'argue',
						fontSize: 'min(max(1.875vw, 1.25rem), 1.875rem)',
					}}>
					On the day: Saturday 9th November
				</h1>
				<p className='text-lg'>11:30-12:00</p>
				<p>Arrival at Monyhull Church</p>
				<p className='text-lg'>12:00-13:00</p>
				<p>Wedding ceremony at Monyhull Church</p>
				<p className='text-lg'>13:00-14:00</p>
				<p>Refreshments at Monyhull Church</p>
				<p className='text-lg'>14:30-19:00</p>
				<p>Afternoon reception at Westmead Hotel - by specific invite only</p>
				<p className='text-lg'>19:00 - 01:00</p>
				<p>Evening celebration at Westmead Hotel</p>
			</section>
		</PageWrapper>
	);
}
