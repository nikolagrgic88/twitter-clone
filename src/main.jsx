import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import Home from './Home';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/LoginPage';
import RootLayout from './pages/RootLayout';
import { action as authAction } from './pages/LoginPage';
import { loader as homePageLoader } from './loaders/dataLoader';
import { store } from './store/store';

import HomePageAccount from './pages/HomePageAccount';
import { Provider } from 'react-redux';
import CommentPage from './pages/CommentPage';

const router = createBrowserRouter([
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
				children:[]
			},
			{
				path: 'post/:postId',
				element: <CommentPage />,
			},
			
		],
	},
]);
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
	<Provider store={store}>
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>
	</Provider>
);
