import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './routes/Home';
import RSVP from './routes/RSVP';

export const routes = [
	{
		path: '/',
		element: <Home></Home>,
	},
	{ path: '/rsvp', element: <RSVP></RSVP> },
];

export default function Router() {
	const router = createBrowserRouter(routes);
	return <RouterProvider router={router}></RouterProvider>;
}
