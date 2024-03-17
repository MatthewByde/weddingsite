import PageWrapper from '../PageWrapper';
import banner from '../assets/banner.png';

export default function Homepage() {
	return (
		<PageWrapper>
			<div className='w-full box-border flex items-center max-w-max h-auto pt-2'>
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
		</PageWrapper>
	);
}
