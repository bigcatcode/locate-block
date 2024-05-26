import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  LayerGroup
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const { Fragment } = wp.element;

export default function Map({ attributes, setAttributes }){
    const { selectedOptionShortcode } = attributes; 
    const { mapWidth, mapWidthUnit, mapHeight, mapHeightUnit } = attributes;
    const { mapscrollWheelZoom }  = attributes;
    const { mapStartPosition }  = attributes;
    const { mapStartZoom }  = attributes;

    const [jsonData, setJsonData] = useState(null);   
    const [width, setWidth] = useState(mapWidth);
    const [height, setHeight] = useState(mapHeight);



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
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* Render Markers */}
                    {markers && markers.map((marker, index) => (
                        
                        <Marker 
                            key={index} 
                            position={[parseFloat(marker.lat), parseFloat(marker.lng)]}
                            icon={createIcon( marker?.custom_marker || defaults )}
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