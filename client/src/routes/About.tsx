import { IoLogoGithub } from 'react-icons/io5';
import PageWrapper from '../PageWrapper';

export default function About() {
	return (
		<PageWrapper>
			<section className='flex flex-col gap-2 items-start py-8 px-8 w-full max-w-3xl text-textColor'>
				<h1
					className='text-darkAccentColor'
					style={{
						fontFamily: 'argue',
						fontSize: 'min(max(3.75vw, 2rem), 3.75rem)',
					}}>
					About
				</h1>

				<p>Website developed by Matthew Byde.</p>

				<a href='https://github.com/MatthewByde/weddingsite'>
					<div className='flex gap-2'>
						<IoLogoGithub className='w-6 h-6' />
						<span className='text-darkAccentColor underline'>
							View source on GitHub
						</span>
					</div>
				</a>

				<p>
					The pink background image used throughout this site can be found here:
					<br></br>
					<a
						className='text-darkAccentColor underline'
						href='https://www.freepik.com/free-photo/concrete-wall-with-flowers_3164817.htm'>
						Image by LuqueStock
					</a>{' '}
					on Freepik
				</p>
			</section>
		</PageWrapper>
	);
}
