import React from 'react';
import Router from './Router';

export const WindowWidthContext = React.createContext<{
	width: number;
	isMobile: boolean;
}>({ width: window.innerWidth, isMobile: false });

export default function App() {
	const [width, setWidth] = React.useState<number>(window.innerWidth);

	const handleWindowSizeChange = React.useCallback(() => {
		setWidth(window.innerWidth);
	}, []);

	React.useEffect(() => {
		window.addEventListener('resize', handleWindowSizeChange);
		return () => {
			window.removeEventListener('resize', handleWindowSizeChange);
		};
	}, [handleWindowSizeChange]);

	return (
		<WindowWidthContext.Provider
			value={{ width: width, isMobile: width < 768 }}>
			<Router />
		</WindowWidthContext.Provider>
	);
}
