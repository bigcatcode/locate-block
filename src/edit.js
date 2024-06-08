import { __ } from '@wordpress/i18n';

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';

import apiFetch from '@wordpress/api-fetch';

import LocateSelectShortcode from "./components/LocateSelectShortcode";
import PanelGlobalOptions from "./components/PanelGlobalOptions";
import PanelMapSettings from "./components/PanelMapSettings";
import Map from "./components/Map";

const { Fragment } = wp.element;

// editor style
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { selectedOptionShortcode } = attributes; 

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

	const [mapOptions, setMapOptions] = useState(null);

    useEffect(() => {
        const apiUrlOptions = `/custom/v1/map-options`;
        apiFetch({ path: apiUrlOptions })
            .then((data) => {
                setMapOptions(data);
            })
            .catch((error) => {
                console.error('Error fetching JSON data:', error);
            });
      }, []); 

	return (
		<Fragment>

			<InspectorControls>
				
				<PanelGlobalOptions
					attributes={{ ...attributes, posts }}
					setAttributes={(newAttributes) => {
						setAttributes(newAttributes);
					}}
				/>
				
				{selectedOptionShortcode && (
					<PanelMapSettings
						attributes={{ ...attributes, posts, mapOptions }}
						setAttributes={(newAttributes) => {
							setAttributes(newAttributes);
						}}
					/>
				)}
							
			</InspectorControls>

            <div {...useBlockProps()}>
				{!selectedOptionShortcode ? (
					<LocateSelectShortcode
						attributes={{ ...attributes, posts }} 
						setAttributes={(newAttributes) => {
							setAttributes(newAttributes);
						}}
					/>
				) : (
					<Map
						attributes={{ ...attributes, posts, mapOptions }} 
						setAttributes={(newAttributes) => {
							setAttributes(newAttributes);
						}}
					/>
				)}
				 
            </div>

		</Fragment>
	);
}