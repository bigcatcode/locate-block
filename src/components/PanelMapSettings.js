import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

// Import images
import insideRightImage from '../assets/map-la-2.png';
import outsideRightImage from '../assets/map-la-1.png';
import outsideLeftImage from '../assets/map-la-3.png';
import outsideTopImage from '../assets/map-la-4.png';

const mapLayoutOptions = [
    { value: 'inside-right', label: 'Filter Inside (Right)', image: insideRightImage },
    { value: 'outside-right', label: 'Filter Outside (Right)', image: outsideRightImage },
    { value: 'outside-left', label: 'Filter Outside (Left)', image: outsideLeftImage },
    { value: 'outside-top', label: 'Filter Outside (Top)', image: outsideTopImage },
];

export default function PanelMapSettings({ attributes, setAttributes }){
    const { posts, selectedOptionProvider, selectedOptionShortcode } = attributes; 
    const { mapWidth, mapWidthUnit, mapHeight, mapHeightUnit } = attributes; 
    const { mapscrollWheelZoom }  = attributes;
    const { mapStartPosition }  = attributes;
    const { mapStartZoom }  = attributes;
    const { mapLayout }  = attributes;

    
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

    const { mapOptions  }  = attributes;
    const [apiKey, setApiKey] = useState(mapOptions);

    useEffect(() => {
        if (mapOptions) {
            setApiKey(mapOptions.googlemaps_key);
        }
    }, [mapOptions]);

    // Set initial value for mapLayout if not already set
    useEffect(() => {
        if (!mapLayout) {
            setAttributes({ mapLayout: 'inside-right' }); // Default layout
        }
    }, []);

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
                        { value: apiKey ? 'basic-1' : '', label: 'GoogleMaps TERRAIN', disabled: !apiKey },
                        { value: apiKey ? 'basic-2' : '', label: 'GoogleMaps ROADMAP', disabled: !apiKey },
                        { value: apiKey ? 'basic-3' : '', label: 'GoogleMaps SATELLITE', disabled: !apiKey },
                        { value: apiKey ? 'basic-4' : '', label: 'GoogleMaps HYBRID', disabled: !apiKey },
                        { value: 'addon-0', label: 'Addon overlays', disabled: true },
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

                {/* New control for map layout */}
                <label className="components-base-control__label">{__('Map Layouts', 'locate')}</label>
                <div className="map-layout-selector">
                
                    {mapLayoutOptions.map(option => (
                        <div
                            key={option.value}
                            className={`map-layout-option ${mapLayout === option.value ? 'selected' : ''}`}
                            style={{ backgroundImage: `url(${option.image})` }}
                            onClick={() => setAttributes({ mapLayout: option.value })}  // Save mapLayout to attributes
                        >
                            {/* <span className="map-layout-label">{option.label}</span> */}
                        </div>
                    ))}
                </div>                                             
            </PanelBody>

        </div>
    );

}