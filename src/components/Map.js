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

var greenIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

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
    useEffect(() => {
        if (jsonData) {
            const fetchedMarkers = jsonData.data.map(project => {
                const projectObj = {};
                jsonData.index.fieldnames.forEach((field, index) => {
                    if (field === 'custom_marker') {
                        // Get the marker ID from the data
                        const markerId = project[index];
                        // Find the marker URL from the index.markers object using the marker ID
                        projectObj[field] = jsonData.index.markers[markerId]?.url || ''; // Use empty string as default if marker URL not found
                    } else {
                        projectObj[field] = project[index];
                    }
                });
    
                return projectObj;
            });
            
            console.log(fetchedMarkers);
            setMarkers(fetchedMarkers);
        }
    }, [jsonData]);

    const centerCoordinates = mapStartPosition.split(',').map(coord => parseFloat(coord.trim()));

    useEffect(() => {
        setWidth(mapWidth);
    }, [mapWidth]);

    useEffect(() => {
        setHeight(mapHeight);
    }, [mapHeight]);

    

    return (
        <Fragment>
            {height && mapStartPosition && (
                <MapContainer
                    key={`${height}${width}`}
                    center={centerCoordinates}
                    zoom={mapStartZoom}
                    scrollWheelZoom={false}
                    style={{ height: `${height}${mapHeightUnit}`, width: `${width}${mapWidthUnit}` }}
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
                            // icon={marker.custom_marker}
                            icon={greenIcon}
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