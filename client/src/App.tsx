import React from 'react';
import Router from './Router';

export const WindowWidthContext = React.createContext<{
	width: number;
	isMobile: boolean;
}>({ width: window.innerWidth, isMobile: false });

export const NavCollapsedContext = React.createContext<{
	navCollapsed: boolean;
	setNavCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}>({ navCollapsed: true, setNavCollapsed: () => {} });

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

	const [navCollapsed, setNavCollapsed] = React.useState<boolean>(width < 768);

	return (
		<WindowWidthContext.Provider
			value={{ width: width, isMobile: width < 768 }}>
			<NavCollapsedContext.Provider value={{ navCollapsed, setNavCollapsed }}>
				<Router />
			</NavCollapsedContext.Provider>
		</WindowWidthContext.Provider>
	);
}
