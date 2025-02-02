import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  LayerGroup,
  useMapEvents,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import FilterControl from "./FilterControl";

const { Fragment } = wp.element;

export default function Map({ attributes, setAttributes }){
    const { selectedOptionShortcode } = attributes; 
    const { mapWidth, mapWidthUnit, mapHeight, mapHeightUnit } = attributes;
    const { mapscrollWheelZoom }  = attributes;
    const { mapStartPosition }  = attributes;
    const { mapStartZoom }  = attributes;
    const { selectedOptionProvider }  = attributes;

    const [jsonData, setJsonData] = useState(null);   
    const [width, setWidth] = useState(mapWidth);
    const [height, setHeight] = useState(mapHeight);
    const { mapOptions  }  = attributes;
    const [apiKey, setApiKey] = useState(mapOptions);
    const { displayFilters}  = attributes;
    const { posts } = attributes; 
    const currentPostOfMap = posts.find(post => post.id == selectedOptionShortcode);
    const currentDisplayFilters = currentPostOfMap ? currentPostOfMap['locate-anything-display_filters'] : null;
    const {tooltipTemplate}  = attributes;
    const currentTooltipTemplate = currentPostOfMap ? currentPostOfMap['locate-anything-default-tooltip-template'] : null;
    const {tooltipPreset}  = attributes;
    const currentTooltipPreset = currentPostOfMap ? currentPostOfMap['locate-anything-tooltip-preset'] : '';
    const [taxonomyLabels, setTaxonomyLabels] = useState({});
    const [taxonomyTerms, setTaxonomyTerms] = useState({});
    const { mapLayout } = attributes;
    const { mapFitBounds } = attributes;
    const {navTemplate}  = attributes;
    const currentNavTemplate = currentPostOfMap ? currentPostOfMap['locate-anything-default-nav-template'] : null;
    const currentNavlistEvent = currentPostOfMap ? currentPostOfMap['locate-anything-navlist-event'] : null;
    const {customCSS}  = attributes;
    

    useEffect(() => {
        const fetchTaxonomyLabels = async () => {
            const response = await apiFetch({ path: '/wp/v2/taxonomies' });
            const labels = {};
            const termsPromises = Object.keys(response).map(async (key) => {
                if (key === 'nav_menu') {
                    return { [key]: {} };
                }
                labels[key] = response[key].name;
                try {
                    let termsEndpoint = key;
                    if (key === 'category') {
                        termsEndpoint = 'categories';
                    }
                    if (key === 'post_tag') {
                        termsEndpoint = 'tags';
                    }                    
                    const terms = await apiFetch({ path: `/wp/v2/${termsEndpoint}` });
                    const termsObject = {};
                    terms.forEach(term => {
                        termsObject[term.id] = term.name;
                    });
                    return { [key]: termsObject };
                } catch (error) {
                    if (error?.code !== 'rest_no_route') {
                        //console.error(`Error fetching terms for taxonomy ${key}:`, error);
                    }
                    return { [key]: {} };
                }
            });
            const termsData = await Promise.all(termsPromises);
            const mergedTerms = Object.assign({}, ...termsData);
            setTaxonomyLabels(labels);
            setTaxonomyTerms(mergedTerms);
        };

        fetchTaxonomyLabels();
    }, []);

    useEffect(() => {
        if (currentTooltipPreset) {
            setAttributes({ tooltipPreset:  currentTooltipPreset }); 
        }
    }, [currentTooltipPreset]);

    useEffect(() => {
        if (currentNavTemplate) {
            setAttributes({ navTemplate:  currentNavTemplate }); 
        }
    }, [currentNavTemplate]);

    useEffect(() => {
        //console.log(mapLayout);
    }, [mapLayout]);

    useEffect(() => {
        //console.log(mapFitBounds);
    }, [mapFitBounds]);

    useEffect(() => {
        if (currentTooltipTemplate) {
            setAttributes({ tooltipTemplate:  currentTooltipTemplate }); 
        }
    }, [currentTooltipTemplate]); 

    useEffect(() => {
        //console.log(tooltipTemplate);
    }, [tooltipTemplate]);

    useEffect(() => {
        if (currentDisplayFilters) {
            const pairs = currentDisplayFilters.split(',');
            //console.log(pairs);
            const parsedObject = {};

            pairs.forEach(pair => {
                // Split the pair by colon to extract key and value
                const keyValue = pair.split(':');
                
                // Check if the pair has at least two elements
                if (keyValue.length >= 2) {
                    const key = keyValue[0].trim();
                    const value = keyValue.slice(1).join(':').trim();
    
                    // Remove single quotes from the value
                    const sanitizedValue = value.replace(/^'(.*)'$/, '$1');
    
                    // Assign the key-value pair to the object
                    parsedObject[key] = sanitizedValue;
                } else {
                    //console.error(`Invalid key-value pair: ${pair}`);
                }
            });

            setAttributes({ displayFilters: parsedObject });    
        }
    }, [currentDisplayFilters]);

    useEffect(() => {
        if (mapOptions) {
            setApiKey(mapOptions.googlemaps_key);
        }
    }, [mapOptions]);

	useEffect(() => {
		if (selectedOptionShortcode) {
			const apiUrl = `/custom/v1/cache/${selectedOptionShortcode}`;
			apiFetch({ path: apiUrl })
				.then((data) => {
					setJsonData(data);
				})
				.catch((error) => {
					console.error('Error fetching JSON data:', error);
				});
		}
	}, [selectedOptionShortcode]);

    const [markers, setMarkers] = useState([]);
    const [markersIcon, setMarkersIcon] = useState([]);
    const [defaults, setDefaults] = useState([]);

    useEffect(() => {
        if (jsonData) {
            setMarkersIcon(jsonData.index.markers);
            setDefaults(jsonData.defaults[0].default_marker);
            const fetchedMarkers = jsonData.data.map(project => {
                const projectObj = {};
                jsonData.index.fieldnames.forEach((field, index) => {
                    projectObj[field] = project[index];
                });
    
                return projectObj;
            });
            
            // console.log(fetchedMarkers);
            setMarkers(fetchedMarkers);
        }
    }, [jsonData]);

    useEffect(() => {
        //console.log(markers);
    }, [markers]);

    const createIcon = (markerId) => {
        const marker = markersIcon[markerId];
        return L.icon({
          iconUrl: marker.url,
          iconSize: [marker.width, marker.height],
        });
    };

    const centerCoordinates = mapStartPosition.split(',').map(coord => parseFloat(coord.trim()));

    useEffect(() => {
        setWidth(mapWidth);
    }, [mapWidth]);

    useEffect(() => {
        setHeight(mapHeight);
    }, [mapHeight]);



    const [currentLayer, setCurrentLayer] = useState(selectedOptionProvider);

    useEffect(() => {
      setCurrentLayer(selectedOptionProvider);
    }, [selectedOptionProvider]);
 
    
    const renderLayer = () => {
        if (apiKey) {
            switch (currentLayer) {
                case 'basic-1':
                return <ReactLeafletGoogleLayer key='basic-1' type={'terrain'} apiKey={apiKey} />;
                case 'basic-2':
                return <ReactLeafletGoogleLayer  key='basic-2' type={'roadmap'} apiKey={apiKey} />;
                case 'basic-3':
                return <ReactLeafletGoogleLayer  key='basic-3' type={'satellite'} apiKey={apiKey} />;
                case 'basic-4':
                return <ReactLeafletGoogleLayer  key='basic-4' type={'hybrid'} apiKey={apiKey} />;
                default:
                return (
                    <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                );
            }
        } else {
            return (
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                /> 
            )          
        }
    };

    const ZoomHandler = () => {
        const map = useMapEvents({
            zoomend: () => {
                const newZoom = map.getZoom();
                setAttributes({ mapStartZoom: newZoom });
            },
            moveend: () => {
                const newCenter = map.getCenter();
                const newCenterCoordinates = `${newCenter.lat},${newCenter.lng}`;
                setAttributes({ mapStartPosition: newCenterCoordinates });
            }            
        });
        return null;
    };

    const [filters, setFilters] = useState({});

    useEffect(() => {
        if (jsonData) {
            const filterOptions = Object.keys(jsonData.index).reduce((acc, key) => {
                if (key !== 'markers' && key !== 'fieldnames') {
                    acc[key] = jsonData.index[key];
                }
                return acc;
            }, {});
            setFilters(filterOptions);
        }
    }, [jsonData]);

    const [selectedFilters, setSelectedFilters] = useState({});

    const filteredMarkers = markers.filter(marker => {
        return Object.keys(selectedFilters).every(filterKey => {
            if (typeof marker[filterKey] === 'string' && marker[filterKey].includes(',')) {
                // Split the string into an array of values
                const markerValues = marker[filterKey].split(',');
                // Check if any of the selected filter values match any of the marker values
                return selectedFilters[filterKey].length === 0 || selectedFilters[filterKey].some(filterValue => markerValues.includes(filterValue));
            } else {
                // For single values, perform the inclusion check as before
                return selectedFilters[filterKey].length === 0 || selectedFilters[filterKey].includes(marker[filterKey]);
            }
        });
    });

    useEffect(() => {
        //console.log(mapLayout);
    }, [mapLayout]);

    const [draggingEnabled, setDraggingEnabled] = useState(true); // State for map dragging
    // Handle dragging state dynamically
    const DraggingHandler = () => {
        const map = useMap();

        useEffect(() => {
            const handleKeyDown = (e) => {
                if (e.key === "Escape") {
                    setDraggingEnabled(false); // Disable dragging on Esc
                }
            };

            const handleMapClick = () => {
                setDraggingEnabled((prev) => !prev); // Toggle dragging on map click
            };

            document.addEventListener("keydown", handleKeyDown);
            map.on("click", handleMapClick);

            return () => {
                document.removeEventListener("keydown", handleKeyDown);
                map.off("click", handleMapClick);
            };
        }, [map]);

        useEffect(() => {
            if (draggingEnabled) {
                map.dragging.enable();
            } else {
                map.dragging.disable();
            }
        }, [draggingEnabled, map]);

        return null;
    };


    // FitBoundsHandler to adjust map bounds dynamically
    const FitBoundsHandler = () => {
        const map = useMap();

        useEffect(() => {
            if (mapFitBounds === '1' && filteredMarkers.length > 0) {
                const bounds = L.featureGroup(
                    filteredMarkers.map((marker) =>
                        L.marker([parseFloat(marker.lat), parseFloat(marker.lng)])
                    )
                ).getBounds();

                map.fitBounds(bounds, { animate: true });
            }
        }, [mapFitBounds, filteredMarkers, map]);

        return null;
    };

    const markerRefs = useRef({}); // Store references to markers

    const openMarkerPopup = (markerIndex) => {
        const markerRef = markerRefs.current[markerIndex];
        if (markerRef) {
            markerRef.openPopup();
        }
    };

    const closeMarkerPopup = (markerIndex) => {
        const markerRef = markerRefs.current[markerIndex];
        if (markerRef) {
            markerRef.closePopup();
        }
    };

    // Dynamically inject custom CSS into the page
    // useEffect(() => {
    //     if (customCSS) {
    //         const existingStyleElement = document.getElementById('custom-map-css');
    //         let styleElement;
    
    //         if (existingStyleElement) {
    //             styleElement = existingStyleElement;
    //         } else {
    //             styleElement = document.createElement('style');
    //             styleElement.id = 'custom-map-css';
    //             document.head.appendChild(styleElement);
    //         }
    
    //         styleElement.innerHTML = customCSS;
    
    //         return () => {
    //             styleElement.innerHTML = ''; // Cleanup styles
    //         };
    //     }
    // }, [customCSS]);

    useEffect(() => {
        if (customCSS) {
            const iframe = document.querySelector('.block-editor-iframe__container iframe');
            if (iframe) {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const existingStyleElement = iframeDoc.getElementById('custom-map-css');
                let styleElement;
    
                if (existingStyleElement) {
                    styleElement = existingStyleElement;
                } else {
                    styleElement = iframeDoc.createElement('style');
                    styleElement.id = 'custom-map-css';
                    iframeDoc.head.appendChild(styleElement);
                }
    
                styleElement.innerHTML = customCSS;
            }
        }
    }, [customCSS]);

    const adjustedHeight = 
        mapLayout === 'outside-right' ? height + 50 : 
        mapLayout === 'outside-left' ? height + 50 : 
        height;
    
    return (
        <Fragment>
            {height && mapStartPosition && mapStartZoom && mapLayout && (
                
                <div 
                    style={{ display: 'flex', flexDirection: mapLayout === 'outside-top' ? 'column' : 'row' }}
                    className={mapLayout ? `${mapLayout}` : ''}
                >

                    {(mapLayout === 'outside-left' || mapLayout === 'outside-top') && (
                            <FilterControl filters={filters} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}  displayFilters={displayFilters} height={adjustedHeight} mapHeightUnit={mapHeightUnit} />
                    )}

                    <MapContainer
                        key={`${height}${width}`}
                        center={centerCoordinates}
                        zoom={mapStartZoom}
                        scrollWheelZoom={false}
                        style={{
                            height: `${height}${mapHeightUnit}`,
                            width: mapLayout === 'outside-right' ? `calc(${width}${mapWidthUnit} - 250px)` : `${width}${mapWidthUnit}`,
                        }}
                        dragging={draggingEnabled} // Use state to control dragging
                        tabindex="0"
                    >

                        <FitBoundsHandler />
                        <DraggingHandler /> 

                        {renderLayer()}

                        <ZoomHandler />
                        
                        {mapLayout === 'inside-right' && (
                            <FilterControl filters={filters} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}  displayFilters={displayFilters} height={height} mapHeightUnit={mapHeightUnit} />
                        )}

                        {/* Render Markers */}
                        {filteredMarkers && filteredMarkers.map((marker, index) => (
                            <Marker
                                key={index}
                                position={[parseFloat(marker.lat), parseFloat(marker.lng)]}
                                icon={createIcon(marker?.custom_marker || defaults)}
                                ref={(el) => {
                                    markerRefs.current[index] = el; // Store marker reference
                                }}
                            >
                                {tooltipPreset && (
                                    <Popup className={tooltipPreset ? `${tooltipPreset}` : ''}>
                                        {tooltipTemplate && (
                                            <div dangerouslySetInnerHTML={{ __html: tooltipTemplate.replace(/\|(\w+)\|/g, (match, tag) => {
                                                if (taxonomyLabels[tag] && marker[tag]) {
                                                    const termIds = marker[tag].split(',');
                                                    const termNames = termIds.map(id => taxonomyTerms[tag][id] || id);
                                                    return termNames.join(', ');
                                                }
                                                return marker[tag] || '';
                                            }) }} />
                                        )}
                                    </Popup>
                                )}
                            </Marker>
                        ))}    

                    </MapContainer>

                    {mapLayout === 'outside-right' && (
                            <FilterControl filters={filters} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}  displayFilters={displayFilters} height={adjustedHeight} mapHeightUnit={mapHeightUnit} />
                    )}

                </div>
                
            )}
                    <div 
                        class="map-nav-wrapper" 
                        id={`map-nav-wrapper-${selectedOptionShortcode}`}
                        style={{
                            width: `${width}${mapWidthUnit}`,
                        }}
                    >
                        <div id={`results-found-${selectedOptionShortcode}`} class="map-nav-results-found">
                            {filteredMarkers?.length || 0} Results Found
                        </div>
                        <div className="marker-grid">
                            {filteredMarkers &&
                                filteredMarkers.map((marker, index) =>
                                    navTemplate ? ( // Ensure conditional rendering is valid
                                        <div
                                            className="grid-row"
                                            key={index}
                                            onClick={() => {
                                                if (currentNavlistEvent !== 'hover') {
                                                    openMarkerPopup(index); // Open on click if not hover mode
                                                }
                                            }}
                                            onMouseEnter={() => {
                                                if (currentNavlistEvent === 'hover') {
                                                    openMarkerPopup(index); // Open on hover if hover mode
                                                }
                                            }}
                                            onMouseLeave={() => {
                                                if (currentNavlistEvent === 'hover') {
                                                    closeMarkerPopup(index); // Close on hover leave if hover mode
                                                }
                                            }}
                                            dangerouslySetInnerHTML={{
                                                __html: navTemplate.replace(
                                                    /\|(\w+)\|/g,
                                                    (match, tag) => {
                                                        if (taxonomyLabels[tag] && marker[tag]) {
                                                            const termIds = marker[tag].split(',');
                                                            const termNames = termIds.map(
                                                                (id) =>
                                                                    taxonomyTerms[tag][id] || id
                                                            );
                                                            return termNames.join(', ');
                                                        }
                                                        return marker[tag] || '';
                                                    }
                                                ),
                                            }}
                                        />
                                    ) : null
                                )}
                        </div>
                    </div>

        </Fragment>
    )

}


