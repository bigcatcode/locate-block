import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

const FilterControl = ({ filters, selectedFilters, setSelectedFilters }) => {
    const handleFilterChange = (filterKey, option) => {
        setSelectedFilters(prevFilters => {
            const newFilters = { ...prevFilters };
            if (!newFilters[filterKey]) {
                newFilters[filterKey] = [];
            }
            if (newFilters[filterKey].includes(option)) {
                newFilters[filterKey] = newFilters[filterKey].filter(item => item !== option);
            } else {
                newFilters[filterKey].push(option);
            }
            return newFilters;
        });
    };

    const getOptionValue = (optionValue) => {
        // Remove HTML tags from optionValue
        const cleanedValue = optionValue.replace(/<\/?[^>]+(>|$)/g, '');
        return cleanedValue;
    };

    return (
        <div
            className="leaflet-filter-control leaflet-control-layers leaflet-control-layers-expanded leaflet-control"
            aria-haspopup="true"
            style={{ maxHeight: '300px', overflowY: 'auto' }}
        >
            <section className="leaflet-control-layers-list">
                <div className="leaflet-control-layers-base"></div>
                <div
                    className="leaflet-control-layers-separator"
                    style={{ display: "none" }}
                ></div>
                <div className="leaflet-control-layers-overlays">
                    {Object.entries(filters).map(([filterKey, filterOptions]) => (
                        <div key={filterKey}>
                            <h3>{filterKey}</h3>
                            {Object.entries(filterOptions).map(([optionKey, optionValue]) => (
                                <label key={optionKey}>
                                    <div>
                                        <input
                                            type="checkbox"
                                            checked={selectedFilters[filterKey] && selectedFilters[filterKey].includes(optionKey)}
                                            onClick={() => handleFilterChange(filterKey, optionKey)}
                                        />
                                        <span>{getOptionValue(optionValue)}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default FilterControl;
