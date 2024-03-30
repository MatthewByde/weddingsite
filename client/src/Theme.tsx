import type { CustomFlowbiteTheme } from 'flowbite-react';
import { Flowbite } from 'flowbite-react';
import { ReactNode } from 'react';

export default function Theme({ children }: { children?: ReactNode }) {
	return <Flowbite theme={{ theme: customTheme }}>{children}</Flowbite>;
}

export const customTheme: CustomFlowbiteTheme = {
	sidebar: {
		root: {
			base: '',
			collapsed: {
				on: 'w-16',
				off: 'w-48',
			},
			inner:
				'h-full overflow-y-auto overflow-x-hidden bg-secondaryColor py-4 px-3 items-start flex',
		},

		item: {
			base: 'flex items-center justify-center rounded-lg p-2 text-base font-normal text-backgroundColor hover:bg-darkAccentColor transition',
			active: 'bg-gray-100',
			collapsed: {
				insideCollapse: 'group w-full pl-8 transition duration-75',
				noIcon: 'font-bold',
			},
			content: {
				base: 'px-3 flex-1 whitespace-nowrap',
			},
			icon: {
				base: 'h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900',
				active: 'text-gray-700',
			},
			label: '',
			listItem: '',
		},
		items: {
			base: '',
		},
	},
	button: {
		base: 'border-0 px-0 py-0 justify-center items-center rounded-lg border-0 text-backgroundColor hover:bg-darkAccentColor flex [&_span]:px-2 [&_span]:py-2 transition',
	},
	accordion: {
		root: {
			base: 'divide-y divide-gray-200 border-gray-200 dark:divide-gray-700 dark:border-gray-700',
			flush: {
				off: 'rounded-lg border',
				on: 'border-b',
			},
		},
		content: {
			base: 'p-5 first:rounded-t-lg last:rounded-b-lg dark:bg-gray-900',
		},
		title: {
			arrow: {
				base: 'h-6 w-6 shrink-0',
				open: {
					off: '',
					on: 'rotate-180',
				},
			},
			base: 'flex w-full items-center justify-between p-5 text-left font-medium text-gray-500 first:rounded-t-lg last:rounded-b-lg dark:text-gray-400',
			flush: {
				off: 'hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-800',
				on: 'bg-transparent dark:bg-transparent',
			},
			heading: '',
			open: {
				off: '',
				on: 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white',
			},
		},
	},
};
