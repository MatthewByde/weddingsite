import { CustomFlowbiteTheme, Flowbite } from 'flowbite-react';
import { ReactNode } from 'react';

export default function Theme({ children }: { children?: ReactNode }) {
	return <Flowbite theme={{ theme: flowbiteTheme }}>{children}</Flowbite>;
}

const flowbiteTheme: CustomFlowbiteTheme = {
	sidebar: {
		root: {
			base: 'h-full',
			collapsed: {
				on: 'w-16',
				off: 'w-64',
			},
			inner: `h-full overflow-y-auto overflow-x-hidden rounded bg-secondaryColor py-4 px-3`,
		},
		item: {
			base: `flex items-center justify-center rounded-lg p-2 text-base font-normal text-backgroundColor hover:bg-darkAccentColor`,
			active: 'bg-gray-100 dark:bg-gray-700',
			collapsed: {
				insideCollapse: 'group w-full pl-8 transition duration-75',
				noIcon: 'font-bold',
			},
			content: {
				base: 'px-3 flex-1 whitespace-nowrap',
			},
			icon: {
				base: 'h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white',
				active: 'text-gray-700 dark:text-gray-100',
			},
			label: '',
			listItem: '',
		},
	},
};
