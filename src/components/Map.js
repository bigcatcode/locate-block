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
  useMapEvents
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
        console.log(markers);
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

    // const filteredMarkers = markers.filter(marker => {
    //     return Object.keys(selectedFilters).every(filterKey => {
    //         return selectedFilters[filterKey].length === 0 || selectedFilters[filterKey].includes(marker[filterKey]);
    //     });
    // });

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

    return (
        <Fragment>
            {height && mapStartPosition && mapStartZoom && (
                
                    <MapContainer
                        key={`${height}${width}`}
                        center={centerCoordinates}
                        zoom={mapStartZoom}
                        scrollWheelZoom={false}
                        style={{ height: `${height}${mapHeightUnit}`, width: `${width}${mapWidthUnit}` }}
                        dragging={false}
                        
                    >

                        {renderLayer()}

                        <ZoomHandler />


                        <FilterControl filters={filters} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}  displayFilters={displayFilters} />

                        {/* Render Markers */}
                        {filteredMarkers && filteredMarkers.map((marker, index) => (
                            <Marker
                                key={index}
                                position={[parseFloat(marker.lat), parseFloat(marker.lng)]}
                                icon={createIcon(marker?.custom_marker || defaults)}
                            >
                                <Popup>
                                    <div>
                                        <h3>{marker.title}</h3>
                                        <p>{marker.excerpt}</p>
                                        {/* You can include other information here */}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}    

                    </MapContainer>
                
            )}
        </Fragment>
    )

}


