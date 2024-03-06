import PageWrapper from '../PageWrapper';
import banner from '../assets/banner.png';

export default function Homepage() {
	return (
		<PageWrapper>
			<header className='w-full box-border flex items-center max-w-max h-auto'>
				{
					<img
						alt="A collage showind Adele and Matthew's engagement, graduation, and fun at Lickey Hills."
						src={banner}></img>
				}
			</header>
			<div
				className='flex flex-col items-center text-darkAccentColor py-8'
				style={{ fontFamily: 'argue' }}>
				<h2 className='text-3xl'>Welcome to the wedding of</h2>
				<h1 className='text-6xl'>Adele Georgia Butcher</h1>
				<h3 className='text-xl py-2'>and</h3>
				<h1 className='text-6xl'>Matthew David Byde</h1>
			</div>
		</PageWrapper>
	);
}
