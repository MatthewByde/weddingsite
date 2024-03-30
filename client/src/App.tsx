import React from 'react';
import Router from './Router';
import Theme from './Theme';

export const AdminKeyContext = React.createContext<{
	keys: {
		adminKey: Uint8Array;
		publicKey: Uint8Array;
	} | null;
	setKeys: React.Dispatch<
		React.SetStateAction<{
			adminKey: Uint8Array;
			publicKey: Uint8Array;
		} | null>
	>;
}>({ keys: null, setKeys: () => {} });

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
	const [keys, setKeys] = React.useState<{
		adminKey: Uint8Array;
		publicKey: Uint8Array;
	} | null>(null);

	return (
		<WindowWidthContext.Provider
			value={{ width: width, isMobile: width < 768 }}>
			<NavCollapsedContext.Provider value={{ navCollapsed, setNavCollapsed }}>
				<AdminKeyContext.Provider
					value={{
						keys,
						setKeys,
					}}>
					<Theme>
						<Router />
					</Theme>
				</AdminKeyContext.Provider>
			</NavCollapsedContext.Provider>
		</WindowWidthContext.Provider>
	);
}
