import PageWrapper from '../PageWrapper';

export default function Error404() {
	return (
		<PageWrapper>
			<section className='flex flex-col gap-2 items-start py-8 px-8 w-full max-w-3xl text-textColor'>
				<h1
					className='text-darkAccentColor'
					style={{
						fontFamily: 'argue',
						fontSize: 'min(max(3.75vw, 2rem), 3.75rem)',
					}}>
					Error 404 - Page not found
				</h1>
			</section>
		</PageWrapper>
	);
}
