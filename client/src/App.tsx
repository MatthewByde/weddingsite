import React from 'react';
import Router from './Router';
import Theme from './Theme';

export const AdminKeyContext = React.createContext<{
	key: string | null;
	setKey: React.Dispatch<React.SetStateAction<string | null>>;
}>({ key: null, setKey: () => {} });

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
	const [key, setKey] = React.useState<string | null>(null);

	return (
		<WindowWidthContext.Provider
			value={{ width: width, isMobile: width < 768 }}>
			<NavCollapsedContext.Provider value={{ navCollapsed, setNavCollapsed }}>
				<AdminKeyContext.Provider value={{ key, setKey }}>
					<Theme>
						<Router />
					</Theme>
				</AdminKeyContext.Provider>
			</NavCollapsedContext.Provider>
		</WindowWidthContext.Provider>
	);
}
