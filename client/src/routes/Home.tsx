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
						<br></br>
						<p style={{ fontSize: 'min(max(1.875vw, 1.25rem), 1.875rem)' }}>
							09/11/2024
						</p>
					</h1>
				</div>
				<div className='flex gap-4'>
				<Link
					style={{ fontFamily: 'argue' }}
					to='https://photos.app.goo.gl/fHT7BTd5s69JLFwP6'
					className='text-2xl font-semibold w-80 h-20 border-0 px-0 py-0 justify-center items-center rounded-lg text-backgroundColor hover:bg-darkAccentColor bg-secondaryColor flex [&_span]:px-2 [&_span]:py-2 transition'>
					Share your photos
				</Link>
				<Link
					style={{ fontFamily: 'argue' }}
					to='https://www.marriagegiftlist.com/D66PZ8'
					className='text-2xl font-semibold w-80 h-20 border-0 px-0 py-0 justify-center items-center rounded-lg text-backgroundColor hover:bg-darkAccentColor bg-secondaryColor flex [&_span]:px-2 [&_span]:py-2 transition'>
					Gift Registry
				</Link>
				<Link
					style={{ fontFamily: 'argue' }}
					to='/livestream'
					className='text-2xl font-semibold w-80 h-20 border-0 px-0 py-0 justify-center items-center rounded-lg text-backgroundColor hover:bg-darkAccentColor bg-secondaryColor flex [&_span]:px-2 [&_span]:py-2 transition'>
					Livestream
				</Link>
				
				</div>
			</section>
			<Divider orientation='horizontal'></Divider>
			<section className='flex flex-col py-8 px-8 gap-2 text-darkAccentColor'>
				<p
					style={{
						fontFamily: 'argue',
						fontSize: 'min(max(1.25vw, 1rem), 1.5rem)',
					}}>
					12:00-13:00 - Wedding ceremony at Monyhull Church
				</p>
				<p className='text-textColor'>{`Arrival from 11:30`}</p>
				<p className='text-textColor'>{`Refreshments to follow`}</p>
				<p
					className='pt-4'
					style={{
						fontFamily: 'argue',
						fontSize: 'min(max(1.25vw, 1rem), 1.5rem)',
					}}>
					14:30-18:00 - Wedding breakfast at Westmead Hotel
				</p>
				<p className='text-textColor'>{`The wedding breakfast is by specific invitation only`}</p>
				<p
					className='pt-4'
					style={{
						fontFamily: 'argue',
						fontSize: 'min(max(1.25vw, 1rem), 1.5rem)',
					}}>
					19:00 until late - Evening celebration at Westmead Hotel
				</p>
			</section>
		</PageWrapper>
	);
}
