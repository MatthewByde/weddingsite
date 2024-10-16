import PageWrapper from '../PageWrapper';
import { Link } from 'react-router-dom';

export default function Livestream() {
	return <PageWrapper>
			<div className='flex flex-col gap-2 items-start py-8 px-8 w-full text-textColor'>
			<h1
					className='text-darkAccentColor'
					style={{
						fontFamily: 'argue',
						fontSize: 'min(max(3.75vw, 2rem), 3.75rem)',
					}}>
					Livestream
				</h1>
				<section>
					<h2 className='text-3xl'>The livestream will appear here on the wedding day.</h2>
					<br></br>
						<Link
					style={{ fontFamily: 'argue' }}
					to='/'
					className='text-xl font-semibold w-40 h-10 border-0 px-0 py-0 justify-center items-center rounded-lg text-backgroundColor hover:bg-darkAccentColor bg-secondaryColor flex [&_span]:px-2 [&_span]:py-2 transition'>
					Home
				</Link>
				</section>
		</div>
		</PageWrapper>;
}
