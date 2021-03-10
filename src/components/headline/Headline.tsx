import * as React from 'react';
import './headline.styles';

type headlineLevels = '1' | '2' | '3' | '4' | '5';

interface HeadlineProps {
	semanticLevel: headlineLevels;
	styleLevel?: headlineLevels;
	text: string;
}

export const Headline = (props: HeadlineProps) => {
	const Tag = ('h' + props.semanticLevel) as keyof JSX.IntrinsicElements;
	const levelBasedClass = props.styleLevel
		? props.styleLevel
		: props.semanticLevel;

	return (
		<Tag className={`headline headline--${levelBasedClass}`}>
			{props.text}
		</Tag>
	);
};