import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { PanelBody, ColorPalette, SelectControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

import LocateSelectShortcode from "./components/LocateSelectShortcode";

const { Fragment } = wp.element;

// editor style
import './editor.scss';

// colors
import colors from './utilities/colors-palette';

export default function Edit({ attributes, setAttributes }) {
    const { content, color, customAttribute } = attributes; // Add your custom attribute here

    const updateCustomAttribute = (newValue) => {
        setAttributes({ customAttribute: newValue });
    };


	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={__('Global Options', 'locate')}
					initialOpen={true}
				>
				</PanelBody>		
				<PanelBody
					title={__('Map Settings', 'boilerplate')}
					initialOpen={false}
				>
					<p className="custom__editor__label">
						{__('Text Color', 'boilerplate')}
					</p>
					<ColorPalette
						colors={colors}
						value={color}
						onChange={(newColor) =>
							setAttributes({ color: newColor })
						}
					/>
				</PanelBody>
			</InspectorControls>

            <div {...useBlockProps()}>
                <LocateSelectShortcode
                    attributes={{ ...attributes, customAttribute }} // Pass your custom attribute here
                    setAttributes={(newAttributes) => {
                        setAttributes(newAttributes);
                        // You can also do additional processing here if needed
                    }}
                />
            </div>

		</Fragment>
	);
}