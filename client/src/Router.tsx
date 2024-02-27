import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './routes/Home';

export const routes = [
	{
		path: '/',
		element: <Home></Home>,
	},
	{ path: '/rsvp', element: <Home></Home> },
];

export default function Router() {
	const router = createBrowserRouter(routes);
	return <RouterProvider router={router}></RouterProvider>;
}
