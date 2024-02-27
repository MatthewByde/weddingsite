import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './Router';
import Theme from './Theme';
import './tailwind.css';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<React.StrictMode>
		<Theme>
			<Router />
		</Theme>
	</React.StrictMode>
);
