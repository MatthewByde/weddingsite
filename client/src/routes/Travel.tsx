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
								<FaCar className='min-w-8 h-auto'></FaCar>
								<p>
									The church is located a short distance off the A435, A441 and
									A38, south of the city, and near to the M42 which connects to
									the M40, M5, and M6.
								</p>
							</div>
							<p className='text-xl pt-4'>Arriving by public transport?</p>
							<div className='flex gap-4 items-center'>
								<FaBusAlt className='min-w-8 h-auto'></FaBusAlt>
								<div className='flex flex-col'>
									<p>
										The nearest bus stop to the church is on Monyhull Hall Road
										at the junction with Earlswood Road, a 5 minute walk away.
									</p>
									<p>This stop is served by the 18, 35, and 46. </p>
									<p>
										The 35 runs directly from the city centre every 12 minutes,
										with a 40 minute journey time.
									</p>
									<p>
										The 18 goes via Kings Norton Railway Station every 12
										minutes, taking 6 minutes from there.
									</p>
								</div>
							</div>
							<div className='flex gap-4'>
								<div className='min-w-8 max-w-8 box-border flex items-center h-auto pt-2 '>
									{
										<img
											alt='National rail double arrow logo'
											src={nationalRailLogo}></img>
									}
								</div>
								<p>
									The nearest railway station is Kings Norton, on the cross city
									line out of Birmingham New Street. The 18 bus runs from here
									to near to the church.
								</p>
							</div>
							<div className='flex gap-4 items-center'>
								<div className='flex flex-col gap-2'>
									<div className='w-8 box-border flex items-center h-auto pt-2 '>
										{
											<img
												alt='National rail double arrow logo'
												src={boltLogo}></img>
										}
									</div>
									<div className='w-8 box-border flex items-center h-auto pt-2 '>
										{
											<img
												alt='National rail double arrow logo'
												src={uberLogo}></img>
										}
									</div>
								</div>
								<p>
									Taxis, including Ubers and Bolts, also operate in the area.
								</p>
							</div>
						</div>
						<iframe
							width='600'
							height='450'
							style={{ border: 0 }}
							loading='lazy'
							allowFullScreen
							title={'Monyhull Church map'}
							src='https://www.google.com/maps/embed/v1/view?zoom=17&center=52.4105%2C-1.9026&key=AIzaSyAJnptVwhoEmVwI31055K1xxW0uh8IR3Iw'></iframe>
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
								<FaCar className='min-w-8 h-auto'></FaCar>
								<p>
									The hotel is a 15 minute drive from Monyhull Church down the
									A441.<br></br>
									It is also only a few minutes away from M42 Junction 2, and
									the A38.
								</p>
							</div>
							<p className='text-xl pt-4'>Arriving by public transport?</p>
							<div className='flex gap-4 items-center'>
								<FaBusAlt className='min-w-8 h-auto'></FaBusAlt>
								<div className='flex flex-col'>
									<p>
										The nearest bus stops to the hotel are the Man on the Moon
										and Dormy Drive. These are both a 30 minute walk away, and
										are served by the 45/46/46A and 45/49 respectively.
									</p>
								</div>
							</div>
							<div className='flex gap-4'>
								<div className='min-w-8 max-w-8 box-border flex items-center h-auto pt-2 '>
									{
										<img
											alt='National rail double arrow logo'
											src={nationalRailLogo}></img>
									}
								</div>
								<p>
									The most convenient railway station is Longbridge, on the
									cross city line out of Birmingham New Street. <br></br>Barnt
									Green and Alvechurch railway stations are also nearby.
								</p>
							</div>
							<div className='flex gap-4 items-center'>
								<div className='flex flex-col gap-2'>
									<div className='w-8 box-border flex items-center h-auto pt-2 '>
										{
											<img
												alt='National rail double arrow logo'
												src={boltLogo}></img>
										}
									</div>
									<div className='w-8 box-border flex items-center h-auto pt-2 '>
										{
											<img
												alt='National rail double arrow logo'
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
											0121 445 12021
										</a>
										{` and quote group reference number BK144959.`}
									</p>
									<p>
										Many other hotels are also available in the local area and
										around Birmingham, should you prefer.
									</p>
								</div>
							</div>
						</div>
						<iframe
							width='600'
							height='450'
							style={{ border: 0 }}
							loading='lazy'
							allowFullScreen
							title='Monyhull to Westmead directions map'
							src='https://www.google.com/maps/embed/v1/directions?origin=place_id:ChIJOeFASJW-cEgR24XlMh2lUsA&destination=Westmead%20Hotel%20hopwood&key=AIzaSyAJnptVwhoEmVwI31055K1xxW0uh8IR3Iw'></iframe>
					</div>
				</section>
			</div>
		</PageWrapper>
	);
}
