import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { selectedOptionShortcode } = attributes;
	return (
		<div {...useBlockProps.save()} style={{ width: attributes.mapWidth }}>
			{selectedOptionShortcode}
		</div>
	);
}