import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { RangeControl } from '@wordpress/components';

const FilterControl = ({ filters, selectedFilters, setSelectedFilters, displayFilters }) => {
    const [taxonomyLabels, setTaxonomyLabels] = useState({});
    const [isDataReady, setIsDataReady] = useState(false);

    useEffect(() => {
        //console.log(displayFilters);
    }, [displayFilters]);


    // Parse displayFilters keys to remove quotes
    const parseDisplayFilters = (filters) => {
        const parsedFilters = {};
        for (const key in filters) {
            if (filters.hasOwnProperty(key)) {
                const newKey = key.replace(/^'|'$/g, '');
                parsedFilters[newKey] = filters[key];
            }
        }
        return parsedFilters;
    };

    const parsedDisplayFilters = parseDisplayFilters(displayFilters);

    useEffect(() => {
        //console.log(parsedDisplayFilters);
    }, [parsedDisplayFilters]);



    useEffect(() => {
        const fetchTaxonomyLabels = async () => {
            const promises = Object.keys(filters).map(async (filterKey) => {
                try {
                    const response = await apiFetch({
                        path: `/wp/v2/taxonomies/${filterKey}`,
                    });
                    const label = response && response.name ? response.name : filterKey;
                    return { [filterKey]: label };
                } catch (error) {
                    console.error(`Error fetching taxonomy label for ${filterKey}:`, error);
                    return { [filterKey]: filterKey };
                }
            });
            const resolvedLabels = await Promise.all(promises);
            const mergedLabels = Object.assign({}, ...resolvedLabels);
            setTaxonomyLabels(mergedLabels);
            setIsDataReady(true);
        };

        fetchTaxonomyLabels();
    }, [filters]);

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

    const handleSelectChange = (filterKey, option) => {
        setSelectedFilters(prevFilters => {
            const newFilters = { ...prevFilters };
            newFilters[filterKey] = [option];
            return newFilters;
        });
    };

    const handleRangeChange = (filterKey, value) => {
        setSelectedFilters(prevFilters => {
            const newFilters = { ...prevFilters };
            newFilters[filterKey] = [value];
            return newFilters;
        });
    };

    const getOptionValue = (optionValue) => {
        // Remove HTML tags from optionValue
        const cleanedValue = optionValue.replace(/<\/?[^>]+(>|$)/g, '');
        return cleanedValue;
    };

    const shouldDisplayFilter = (filterKey) => {
        return parsedDisplayFilters && parsedDisplayFilters[filterKey];
    };

    const getFilterType = (filterKey) => {
        return parsedDisplayFilters ? parsedDisplayFilters[filterKey] : null;
    };

    // Get min and max range values for range filters
    const getRangeValues = (filterKey) => {
        const minKey = `locate-anything-min-range-${filterKey}`;
        const maxKey = `locate-anything-max-range-${filterKey}`;
        const min = parsedDisplayFilters && parsedDisplayFilters[minKey] ? parseInt(parsedDisplayFilters[minKey], 10) : 0;
        const max = parsedDisplayFilters && parsedDisplayFilters[maxKey] ? parseInt(parsedDisplayFilters[maxKey], 10) : 100;
        return { min, max };
    };

    // Get sort value for each filter from displayFilters
    const getSortValue = (filterKey) => {
        const sortKey = `filter_sort-${filterKey}`;
        return parsedDisplayFilters && parsedDisplayFilters[sortKey] ? parseInt(parsedDisplayFilters[sortKey], 10) : Infinity;
    };

    // Sort filters based on sort value
    const sortedFilters = Object.keys(filters).sort((a, b) => {
        return getSortValue(a) - getSortValue(b);
    });

    // Sort filter options alphabetically
    const sortFilterOptions = (filterOptions) => {
        return Object.entries(filterOptions).sort((a, b) => {
            const valueA = getOptionValue(a[1]).toLowerCase();
            const valueB = getOptionValue(b[1]).toLowerCase();
            if (valueA < valueB) return -1;
            if (valueA > valueB) return 1;
            return 0;
        });
    };

    // Only render the filter controls if data is ready
    if (!isDataReady || !displayFilters) {
        return null; // Or some loading indicator
    }

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
                    
                    {/* {Object.entries(filters).map(([filterKey, filterOptions]) => (
                        <div key={filterKey}>
                            <h3>{taxonomyLabels[filterKey]}</h3>
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
                    ))} */}

                    {sortedFilters.map((filterKey) => (
                        shouldDisplayFilter(filterKey) && (
                            <div key={filterKey}>
                                <h3>{taxonomyLabels[filterKey]}</h3>
                                {getFilterType(filterKey) === 'select' ? (
                                    <select
                                        value={selectedFilters[filterKey] ? selectedFilters[filterKey][0] : ''}
                                        onChange={(e) => handleSelectChange(filterKey, e.target.value)}
                                    >
                                        {/* {Object.entries(filters[filterKey]).map(([optionKey, optionValue]) => (
                                            <option key={optionKey} value={optionKey}>
                                                {getOptionValue(optionValue)}
                                            </option>
                                        ))} */}
                                        {sortFilterOptions(filters[filterKey]).map(([optionKey, optionValue]) => (
                                            <option key={optionKey} value={optionKey}>
                                                {getOptionValue(optionValue)}
                                            </option>
                                        ))}                                        
                                    </select>
                                ) : getFilterType(filterKey) === 'range' ? (
                                    <RangeControl
                                        label={taxonomyLabels[filterKey]}
                                        value={selectedFilters[filterKey] ? selectedFilters[filterKey][0] : getRangeValues(filterKey).min}
                                        onChange={(value) => handleRangeChange(filterKey, value)}
                                        min={getRangeValues(filterKey).min}
                                        max={getRangeValues(filterKey).max}
                                    />                                    
                                ) : (
                                    sortFilterOptions(filters[filterKey]).map(([optionKey, optionValue]) => (
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
                                    ))                                    
                                )}
                            </div>
                        )
                    ))}

                </div>
            </section>
        </div>
    );
};

export default FilterControl;
