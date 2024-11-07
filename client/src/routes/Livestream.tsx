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
					<h2 className='text-3xl'><Link className='underline text-darkAccentColor' to='https://www.youtube.com/live/idKKFoJmqKc'>If the video player below is not working, click here to watch it on YouTube</Link></h2>
					<br></br>
					<iframe width="854" height="480" src="https://www.youtube-nocookie.com/embed/idKKFoJmqKc?si=CJnQh0itHrRCX9RD" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
					<br></br>
					<h2 className='text-xl'>If you're here after the event looking for the recording and it's not here, please come back in a couple of weeks once we're back from honeymoon!</h2>
				</section>
		</div>
		</PageWrapper>;
}
