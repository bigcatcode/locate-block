import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

export default function PanelMapSettings({ attributes, setAttributes }){
    const { posts, selectedOptionProvider, selectedOptionShortcode } = attributes; 

    // Get the locate-anything-map-provider for a specific post ID
    const currentPostOfMap = posts.find(post => post.id == selectedOptionShortcode);
    const mapProviderForPost = currentPostOfMap ? currentPostOfMap['locate-anything-map-provider'] : null;

    // Set initial value for selectedOptionProvider if not already set
    useEffect(() => {
        if (!selectedOptionProvider && mapProviderForPost) {
            setAttributes({ selectedOptionProvider: mapProviderForPost });
        }
    }, [mapProviderForPost]);

    return (
        <div>
            <PanelBody
                title={__('Map Settings', 'locate')}
                initialOpen={true}
            >
                <SelectControl
                    value={selectedOptionProvider}
                    options={ [
                        { value: '', label: 'Select Map Overlay', disabled: true },
                        { value: 'basic-0', label: 'OpenStreetMap' },
                        { value: 'basic-1', label: 'GoogleMaps TERRAIN' },
                        { value: 'basic-2', label: 'GoogleMaps ROADMAP' },
                        { value: 'basic-3', label: 'GoogleMaps SATELLITE' },
                        { value: 'basic-4', label: 'GoogleMaps HYBRID' },
                        { value: 'addon-0', label: 'Addon overlays' },
                    ] }
                    onChange={(newOption) => setAttributes({ selectedOptionProvider: newOption })}
                    __nextHasNoMarginBottom
                />
            </PanelBody>

        </div>
    );

}