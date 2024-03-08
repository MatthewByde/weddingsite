import PageWrapper from '../PageWrapper';
import banner from '../assets/banner.png';

export default function Homepage() {
	return (
		<PageWrapper>
			<div className='w-full box-border flex items-center max-w-max h-auto'>
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
					<p className='text-3xl'>You're invited to the wedding of</p>
					<p className='text-6xl'>Adele Georgia Butcher</p>
					<p className='text-xl py-2'>and</p>
					<p className='text-6xl'>Matthew David Byde</p>
				</h1>
			</div>
		</PageWrapper>
	);
}
