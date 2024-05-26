import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

export default function PanelMapSettings({ attributes, setAttributes }){
    const { posts, selectedOptionProvider, selectedOptionShortcode } = attributes; 
    const { mapWidth, mapWidthUnit, mapHeight, mapHeightUnit } = attributes; 
    const { mapscrollWheelZoom }  = attributes;
    const { mapStartPosition }  = attributes;
    const { mapStartZoom }  = attributes;

    // Get the locate-anything-map-provider for a specific post ID
    const currentPostOfMap = posts.find(post => post.id == selectedOptionShortcode);
    const mapProviderForPost = currentPostOfMap ? currentPostOfMap['locate-anything-map-provider'] : null;
    const currentMapWidth = currentPostOfMap ? currentPostOfMap['locate-anything-map-width'] : 100;
    const currentMapHeight = currentPostOfMap ? currentPostOfMap['locate-anything-map-height'] : 500;
    const currentMapStartZoom = currentPostOfMap ? currentPostOfMap['locate-anything-start-zoom'] : 5;
    const currentMapStartPosition = currentPostOfMap ? currentPostOfMap['locate-anything-start-position'] : null;
   

    // Set initial value for selectedOptionProvider if not already set
    useEffect(() => {
        if (!selectedOptionProvider && mapProviderForPost) {
            setAttributes({ selectedOptionProvider: mapProviderForPost });
        }
    }, [mapProviderForPost]);

    useEffect(() => {
        if (!mapWidth && currentMapWidth) {
            const regex = /^(\d+)(px|%|em)?$/;
            const match = currentMapWidth.match(regex);
            if (match) {
                setAttributes({ mapWidth: parseInt(match[1], 10) });
                setAttributes({ mapWidthUnit: match[2] || '%' });
            } else {
                setAttributes({ mapWidth: 100 });
                setAttributes({ mapWidthUnit: '%' });
            }
            
        }
    }, [currentMapWidth]);    

    useEffect(() => {
        if (!mapHeight && currentMapHeight) {
            const regex = /^(\d+)(px|%|em)?$/;
            const match = currentMapHeight.match(regex);
            if (match) {
                setAttributes({ mapHeight: parseInt(match[1], 10) });
                setAttributes({ mapHeightUnit: match[2] || 'px' });
            } else {
                setAttributes({ mapHeight: 500 });
                setAttributes({ mapHeightUnit: 'px' });
            }
            
        }
    }, [currentMapHeight]); 

    useEffect(() => {
        if (!mapStartZoom && currentMapStartZoom) {
            setAttributes({ mapStartZoom:  parseInt(currentMapStartZoom) }); 
        }
    }, [currentMapStartZoom]); 

    useEffect(() => {
        if (!mapStartPosition && currentMapStartPosition) {
            setAttributes({ mapStartPosition: currentMapStartPosition }); 
        }
    }, [currentMapStartPosition]);

    return (
        <div>
            <PanelBody
                title={__('Map Settings', 'locate')}
                initialOpen={true}
            >
                <SelectControl
                    label="Map Overlay"
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
                <RangeControl
                    label={`Map Width: ${mapWidth}${mapWidthUnit}`}
                    value={mapWidth}
                    onChange={(newValue) => setAttributes({ mapWidth: newValue })}
                    min={ 50 }
                    max={ mapWidthUnit === '%' ? 100 : 1500 }
                />  
                <RangeControl
                    label={`Map Height: ${mapHeight}${mapHeightUnit}`}
                    value={mapHeight}
                    onChange={(newValue) => setAttributes({ mapHeight: newValue })}
                    min={ 50 }
                    max={ mapHeightUnit === '%' ? 100 : 1500 }
                />  
                <RangeControl
                    label="Initial zoom"
                    value={mapStartZoom}
                    onChange={(newValue) => setAttributes({ mapStartZoom: newValue })}
                    min={ 1 }
                    max={ 18 }
                />                                               
            </PanelBody>

        </div>
    );

}