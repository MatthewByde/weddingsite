import * as React from 'react';

export default function Divider({
	orientation,
	style,
	className,
}: {
	orientation: 'horizontal' | 'vertical';
	style?: React.CSSProperties;
	className?: string;
}) {
	return (
		<div
			role='separator'
			className={`box-border ${
				orientation === 'horizontal' ? 'h-[1px] w-full' : 'w-[1px]'
			} ${className ?? ''}`}
			style={{ backgroundColor: 'gray', ...style }}></div>
	);
}
