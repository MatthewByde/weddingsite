import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './routes/Home';
import RSVP from './routes/RSVP';
import Contact from './routes/Contact';
import GiftList from './routes/GiftList';
import FAQ from './routes/FAQ';
import Travel from './routes/Travel';
import Login from './routes/Login';
import About from './routes/About';
import Livestream from './routes/Livestream';
import Photos from './routes/Photos';
import Error404 from './routes/404';
import PrivacyPage from './routes/PrivacyPolicy';

export const routes = [
	{ path: '/', element: <Home></Home> },
	{ path: '/rsvp', element: <RSVP></RSVP> },
	{ path: '/contact', element: <Contact></Contact> },
	{ path: '/registry', element: <GiftList></GiftList> },
	{ path: '/travel', element: <Travel></Travel> },
	{ path: '/faq', element: <FAQ></FAQ> },
	{ path: '/login', element: <Login></Login> },
	{ path: '/about', element: <About></About> },
	{ path: '/photos', element: <Photos></Photos> },
	{ path: '/livestream', element: <Livestream></Livestream> },
	{ path: '/privacy', element: <PrivacyPage></PrivacyPage> },
	{ path: '*', element: <Error404></Error404> },
];

export default function Router() {
	const router = createBrowserRouter(routes);
	return <RouterProvider router={router}></RouterProvider>;
}
