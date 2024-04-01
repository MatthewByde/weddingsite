import PageWrapper from '../PageWrapper';

export default function Travel() {
	return (
		<PageWrapper>
			<div className='flex flex-col gap-2 items-start py-8 px-8 w-full max-w-3xl text-textColor'>
				<h1
					className='text-darkAccentColor'
					style={{
						fontFamily: 'argue',
						fontSize: 'min(max(3.75vw, 2rem), 3.75rem)',
					}}>
					Travel
				</h1>
				<section>
					<h2 className='text-2xl'>Monyhull Church</h2>
					<div className='flex gap-4'>
						<div className='flex flex-col gap-2'>
							<p>{`Monyhull Church,
						St Francis Drive,
						Birmingham,
						Kings Norton,
						B30 3PS`}</p>
							<p>By car:</p>
							<p>
								The church is located a short distance off the A435, A441 and
								A38, south of the city, and near to the M42 which connects to
								the M40, M5, and M6.
							</p>
							<p>By public transport:</p>
							<p>
								The nearest bus stop to the church is on Monyhull Hall Road at
								the junction with Earlswood Road, a 5 minute walk away.
							</p>
							<p>This stop is served by the 18, 35, and 46. </p>
							<p>
								The 35 runs directly from the city centre every 12 minutes, with
								a 40 minute journey time.
							</p>
							<p>
								The 18 goes via Kings Norton Railway Station every 12 minutes,
								taking 6 minutes from there.
							</p>
							<p>
								The nearest railway station is Kings Norton, on the cross city
								line out of Birmingham New Street.
							</p>
							<p>Taxis, including Ubers and Bolts, also operate in the area.</p>
						</div>
					</div>
				</section>
				<section>
					<h2 className='text-2xl'>Westmead Hotel</h2>
					<div className='flex gap-4'>
						<div className='flex flex-col gap-2'>
							<p>{`Westmead Hotel,
							Redditch Road,
						Hopwood,
						Birmingham,
						B48 7AL`}</p>
							<p>By car:</p>
							<p>
								The hotel is a 15 minute drive from Monyhull Church down the
								A441.
							</p>
							<p>It is also only a few minutes away from the M42 and A38.</p>
							<p>By public transport:</p>
							<p>
								The nearest bus stops to the hotel are the Man on the Moon and
								Dormy Drive. These are both a 30 minute walk away, and are
								served by the 45/46/46A and 45/49 respectively.
							</p>
							<p>
								The most convenient railway station is Longbridge, on the cross
								city line out of Birmingham New Street.
							</p>
							<p>Taxis, including Ubers and Bolts, also operate in the area.</p>
						</div>
					</div>
				</section>
			</div>
		</PageWrapper>
	);
}
