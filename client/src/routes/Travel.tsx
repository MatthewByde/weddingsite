import { FaBusAlt, FaCar, FaBed } from 'react-icons/fa';
import PageWrapper from '../PageWrapper';
import nationalRailLogo from '../assets/National_Rail_logo.png';
import uberLogo from '../assets/uber_icon.png';
import boltLogo from '../assets/Bolt_logo.png';
import Divider from '../lib/Divider';

export default function Travel() {
	return (
		<PageWrapper>
			<div className='flex flex-col gap-2 items-start py-8 px-8 w-full text-textColor'>
				<h1
					className='text-darkAccentColor'
					style={{
						fontFamily: 'argue',
						fontSize: 'min(max(3.75vw, 2rem), 3.75rem)',
					}}>
					Travel
				</h1>
				<section>
					<h2 className='text-3xl'>Monyhull Church</h2>
					<div className='flex gap-4 flex-wrap'>
						<div className='flex flex-col gap-2 max-w-2xl'>
							<p>St Francis Drive, Birmingham, Kings Norton, B30 3PS</p>

							<p className='text-xl pt-4'>Arriving by car?</p>
							<div className='flex gap-4 items-center'>
								<div className='max-w-[4.5rem] min-w-[4.5rem] flex justify-center'>
									<FaCar className='min-w-8 h-auto'></FaCar>
								</div>
								<p>
									The church is located a short distance off the A435, A441 and
									A38, south of the city, and near to the M42.
								</p>
							</div>
							<p className='text-xl pt-4'>Arriving by public transport?</p>
							<div className='flex gap-4 items-center'>
								<div className='max-w-[4.5rem] min-w-[4.5rem] flex justify-center'>
									<FaBusAlt className='min-w-8 h-auto'></FaBusAlt>
								</div>
								<div className='flex flex-col'>
									<p>
										The nearest bus stop to the church is on Monyhull Hall Road
										at the junction with Earlswood Road, a 5 minute walk away.
									</p>
									<p>This stop is served by the 18, 35, and 46. </p>
									<p>The 35 runs directly from the city centre.</p>
									<p>
										The 18 goes via Kings Norton Railway Station, taking 6
										minutes from there.
									</p>
								</div>
							</div>
							<div className='flex gap-4'>
								<div className='max-w-[4.5rem] min-w-[4.5rem] flex justify-center'>
									<div className='min-w-8 max-w-8 box-border flex items-center h-auto pt-2 '>
										{
											<img
												alt='National rail double arrow logo'
												src={nationalRailLogo}></img>
										}
									</div>
								</div>
								<p>
									The nearest railway station is Kings Norton, on a direct line
									out of Birmingham New Street. The 18 bus runs from here to
									near to the church.
								</p>
							</div>
							<div className='flex gap-4 items-center'>
								<div className='max-w-[4.5rem] min-w-[4.5rem] flex justify-center'>
									<div className='flex gap-2'>
										<div className='w-8 box-border flex items-center h-auto pt-2 '>
											{
												<img
													alt='Bolt logo'
													src={boltLogo}></img>
											}
										</div>
										<div className='w-8 box-border flex items-center h-auto pt-2 '>
											{
												<img
													alt='Uber logo'
													src={uberLogo}></img>
											}
										</div>
									</div>
								</div>
								<p>
									Taxis, including Ubers and Bolts, also operate in the area.
								</p>
							</div>
						</div>
						<div className='flex flex-col'>
							<iframe
								sandbox='allow-scripts'
								style={{ border: 0 }}
								loading='lazy'
								allowFullScreen
								title={'Monyhull Church map'}
								width='450'
								height='350'
								src='https://www.openstreetmap.org/export/embed.html?bbox=-2.129287719726563%2C52.32002222038767%2C-1.6761016845703127%2C52.50096672615167&amp;layer=mapnik&amp;marker=52.41052735020586%2C-1.9027145999999675'></iframe>

							<small>
								<a href='https://www.openstreetmap.org/?mlat=52.4104&amp;mlon=-1.9020#map=14/52.4104/-1.9020'>
									View Larger Map
								</a>
							</small>
						</div>
					</div>
				</section>
				<Divider
					className='mt-4 mb-4'
					orientation='horizontal'></Divider>

				<section>
					<h2 className='text-3xl'>Westmead Hotel</h2>
					<div className='flex gap-4 flex-wrap'>
						<div className='flex flex-col gap-2 max-w-2xl'>
							<p>Redditch Road, Hopwood, Birmingham, B48 7AL</p>
							<p className='text-xl pt-4'>Arriving by car?</p>
							<div className='flex gap-4 items-center'>
								<div className='max-w-[4.5rem] min-w-[4.5rem] flex justify-center'>
									<FaCar className='min-w-8 h-auto'></FaCar>
								</div>
								<p>
									The hotel is a 15 minute drive from Monyhull Church down the
									A441.<br></br>
									It is also only a few minutes away from M42 Junction 2, and
									the A38.
								</p>
							</div>
							<p className='text-xl pt-4'>Arriving by public transport?</p>
							<div className='flex gap-4 items-center'>
								<div className='max-w-[4.5rem] min-w-[4.5rem] flex justify-center'>
									<FaBusAlt className='min-w-8 h-auto'></FaBusAlt>
								</div>
								<div className='flex flex-col'>
									<p>
										The nearest bus stops to the hotel are the Man on the Moon
										and Dormy Drive. These are both a 30 minute walk away, and
										are served by the 45/46/46A and 45/49 respectively.
									</p>
								</div>
							</div>
							<div className='flex gap-4'>
								<div className='max-w-[4.5rem] min-w-[4.5rem] flex justify-center'>
									<div className='min-w-8 max-w-8 box-border flex items-center h-auto pt-2 '>
										{
											<img
												alt='National rail double arrow logo'
												src={nationalRailLogo}></img>
										}
									</div>
								</div>
								<p>
									The most convenient railway station is Longbridge, on a direct
									line out of Birmingham New Street. <br></br>Barnt Green
									station is also nearby.
								</p>
							</div>
							<div className='flex gap-4 items-center'>
								<div className='flex gap-2'>
									<div className='w-8 box-border flex items-center h-auto pt-2 '>
										{
											<img
												alt='Bolt logo'
												src={boltLogo}></img>
										}
									</div>

									<div className='w-8 box-border flex items-center h-auto pt-2 '>
										{
											<img
												alt='Uber logo'
												src={uberLogo}></img>
										}
									</div>
								</div>
								<p>
									Taxis, including Ubers and Bolts, also operate in the area.
								</p>
							</div>
							<p className='text-xl pt-4'>Staying overnight?</p>
							<div className='flex gap-4 items-center'>
								<FaBed className='min-w-8 h-auto'></FaBed>
								<div className='flex flex-col'>
									<p>
										Westmead Hotel is providing discounted rates for our guests!
										<br></br>
										£80 for a single room, £90 for a double/twin, or £110 for a
										superior room. All rates are inclusive of breakfast.
										<br></br>
										{`To book, call them directly on `}
										<a
											className='underline text-darkAccentColor'
											href='tel:012144512021'>
											0121 445 1202
										</a>
										{` and quote group reference number BK144959.`}
									</p>
									<p>
										{`Many other hotels are also available in the local area and
										around Birmingham, should you prefer - `}
										<a
											className='underline text-darkAccentColor'
											href={`https://www.google.co.uk/travel/search?q=hotels%20near%20b48%207al&ved=0CAAQ5JsGahgKEwiIsaOc4qOFAxUAAAAAHQAAAAAQ0gE&ts=CAEaOAoaEhYKCy9nLzF2aGx4bW00OgdCNDggN2FsGgASGhIUCgcI6A8QCxgIEgcI6A8QCxgKGAIyAggBKgkKBToDR0JQGgA&qs=CAEgACgAOA1IAA&ap=KigKEgkPO0ektyRKQBHDcvbOOrkAwBISCXlhs5inO0pAEYbl7J3dLfy_MAE`}>
											click here for a selection (link to external site)
										</a>
										.
									</p>
								</div>
							</div>
						</div>
						<div className='flex flex-col'>
							<iframe
								sandbox='allow-scripts'
								style={{ border: 0 }}
								loading='lazy'
								allowFullScreen
								title={'Westmead hotel map'}
								width='450'
								height='350'
								src='https://www.openstreetmap.org/export/embed.html?bbox=-2.184562683105469%2C52.28706252904208%2C-1.7313766479492188%2C52.468141942250746&amp;layer=mapnik&amp;marker=52.37760250077664%2C-1.9578235500000574'></iframe>

							<small>
								<a href='https://www.openstreetmap.org/?mlat=52.3776&amp;mlon=-1.9578#map=13/52.3776/-1.9578'>
									View Larger Map
								</a>
							</small>
						</div>
					</div>
				</section>
			</div>
		</PageWrapper>
	);
}
