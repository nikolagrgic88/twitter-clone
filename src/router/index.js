import { createBrowserRouter } from 'react-router-dom';
import { action as authAction } from '../pages/LoginPage';
import { loader as homePageLoader } from '../loaders/dataLoader';
import Login from '../pages/LoginPage';
import RootLayout from '../pages/RootLayout';
import Home from '../Home';
import HomePageAccount from '../pages/HomePageAccount';

export const router = createBrowserRouter([
	{ path: '/login', element: <Login />, action: authAction },

	{
		path: '/',
		element: <RootLayout />,
		loader: homePageLoader,
		children: [
			{ index: true, element: <Home /> },
			{
				path: 'profile/:uid',
				element: <HomePageAccount />,
			},
		],
	},
]);
