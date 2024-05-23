import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { SelectControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

export default function LocateSelectShortcode({ attributes, setAttributes }){

    const { selectedOption } = attributes || { selectedOption: '' };
	const [posts, setPosts] = useState([]);

    const fetchPosts = () => {
		const relativeApiUrl = '/wp/v2/locateandfiltermap';
        apiFetch({ path: relativeApiUrl })
            .then((res) => {
                setPosts(res);
            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
            });
    };

	useEffect(() => {
	  fetchPosts()
	}, [])


	const options = [
        { label: 'Select shortcode', value: '' },
        ...posts.map((post) => ({
            label: post.title.rendered,
            value: post.id,
        })),
    ];

    return (
        <div>
            <h3>{__('LocateAndFilter Block', 'locate')}</h3>
            <SelectControl
                className="locate_select_shortcode"
                value={selectedOption}
                options={options}
                onChange={(newOption) => setAttributes({ selectedOption: newOption })}
                __nextHasNoMarginBottom
            />
        </div>
    );

}