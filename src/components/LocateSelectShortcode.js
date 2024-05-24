import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';

export default function LocateSelectShortcode({ attributes, setAttributes }){
    const { posts } = attributes; 
    const { selectedOptionShortcode } = attributes || { selectedOptionShortcode: '' };

	const options = [
        { label: 'Select shortcode', value: '' },
        ...posts.map((post) => ({
            label: post.title.rendered,
            value: post.id,
        })),
    ];

    return (
        <div className="LocateSelectShortcode">
            <h3>{__('LocateAndFilter Block', 'locate')}</h3>
            <SelectControl
                className="locate_select_shortcode"
                value={selectedOptionShortcode}
                options={options}
                onChange={(newOption) => setAttributes({ selectedOptionShortcode: newOption })}
                __nextHasNoMarginBottom
            />
        </div>
    );

}