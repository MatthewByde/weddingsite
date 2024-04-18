import PageWrapper from '../PageWrapper';

export default function GiftList() {
	return (
		<PageWrapper>
			<section className='flex flex-col gap-2 items-start py-8 px-8 w-full max-w-3xl text-textColor'>
				<h1
					className='text-darkAccentColor'
					style={{
						fontFamily: 'argue',
						fontSize: 'min(max(3.75vw, 2rem), 3.75rem)',
					}}>
					Gift Registry
				</h1>
				<p>
					Please don't feel obligated to buy us a wedding gift, however if you
					did feel like you'd like to contribute towards us getting started in
					our new home together, a gift regsitry will be provided here in due
					course.
				</p>
			</section>
		</PageWrapper>
	);
}
