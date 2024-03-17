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
};
