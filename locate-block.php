<?php
/**
 * Plugin Name:       Locate Block
 * Description:       Gutenberg block for LocateAndFilter plugin.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       locate-block
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_locate_block_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_locate_block_block_init' );

// add custom field to rest API
function register_locateandfiltermap_custom_fields() {
    register_rest_field(
        'locateandfiltermap', // Your custom post type name
        'locate-anything-map-provider', // Name of the custom field
        array(
            'get_callback'    => 'get_locateandfiltermap_custom_field_value', // Callback function to retrieve field value
            'update_callback' => 'update_locateandfiltermap_custom_field_value', // Callback function to update field value
            'schema'          => null,
        )
    );

    register_rest_field(
        'locateandfiltermap', // Your custom post type name
        'locate-anything-map-width', // Name of the custom field
        array(
            'get_callback'    => 'get_locateandfiltermap_custom_field_value', // Callback function to retrieve field value
            'update_callback' => 'update_locateandfiltermap_custom_field_value', // Callback function to update field value
            'schema'          => null,
        )
    );

	register_rest_field(
        'locateandfiltermap', // Your custom post type name
        'locate-anything-map-height', // Name of the custom field
        array(
            'get_callback'    => 'get_locateandfiltermap_custom_field_value', // Callback function to retrieve field value
            'update_callback' => 'update_locateandfiltermap_custom_field_value', // Callback function to update field value
            'schema'          => null,
        )
    );

	register_rest_field(
        'locateandfiltermap', // Your custom post type name
        'locate-anything-source', // Name of the custom field
        array(
            'get_callback'    => 'get_locateandfiltermap_custom_field_value', // Callback function to retrieve field value
            'update_callback' => 'update_locateandfiltermap_custom_field_value', // Callback function to update field value
            'schema'          => null,
        )
    );

	register_rest_field(
        'locateandfiltermap', // Your custom post type name
        'locate-anything-show-filters', // Name of the custom field
        array(
            'get_callback'    => 'get_locateandfiltermap_custom_field_value', // Callback function to retrieve field value
            'update_callback' => 'update_locateandfiltermap_custom_field_value', // Callback function to update field value
            'schema'          => null,
        )
    );

	register_rest_field(
        'locateandfiltermap', // Your custom post type name
        'locate-anything-start-position', // Name of the custom field
        array(
            'get_callback'    => 'get_locateandfiltermap_custom_field_value', // Callback function to retrieve field value
            'update_callback' => 'update_locateandfiltermap_custom_field_value', // Callback function to update field value
            'schema'          => null,
        )
    );

	register_rest_field(
        'locateandfiltermap', // Your custom post type name
        'locate-anything-start-zoom', // Name of the custom field
        array(
            'get_callback'    => 'get_locateandfiltermap_custom_field_value', // Callback function to retrieve field value
            'update_callback' => 'update_locateandfiltermap_custom_field_value', // Callback function to update field value
            'schema'          => null,
        )
    );

	register_rest_field(
        'locateandfiltermap', // Your custom post type name
        'locate-anything-scrollWheelZoom', // Name of the custom field
        array(
            'get_callback'    => 'get_locateandfiltermap_custom_field_value', // Callback function to retrieve field value
            'update_callback' => 'update_locateandfiltermap_custom_field_value', // Callback function to update field value
            'schema'          => null,
        )
    );

	register_rest_field(
        'locateandfiltermap', // Your custom post type name
        'locate-anything-display_filters', // Name of the custom field
        array(
            'get_callback'    => 'get_locateandfiltermap_custom_field_value', // Callback function to retrieve field value
            'update_callback' => 'update_locateandfiltermap_custom_field_value', // Callback function to update field value
            'schema'          => null,
        )
    );

    register_rest_field(
        'locateandfiltermap', // Your custom post type name
        'locate-anything-default-tooltip-template', // Name of the custom field
        array(
            'get_callback'    => 'get_locateandfiltermap_custom_field_value', // Callback function to retrieve field value
            'update_callback' => 'update_locateandfiltermap_custom_field_value', // Callback function to update field value
            'schema'          => null,
        )
    );

    register_rest_field(
        'locateandfiltermap', // Your custom post type name
        'locate-anything-tooltip-preset', // Name of the custom field
        array(
            'get_callback'    => 'get_locateandfiltermap_custom_field_value', // Callback function to retrieve field value
            'update_callback' => 'update_locateandfiltermap_custom_field_value', // Callback function to update field value
            'schema'          => null,
        )
    );

    register_rest_field(
        'locateandfiltermap', // Your custom post type name
        'locate-anything-enable_fitBounds', // Name of the custom field
        array(
            'get_callback'    => 'get_locateandfiltermap_custom_field_value', // Callback function to retrieve field value
            'update_callback' => 'update_locateandfiltermap_custom_field_value', // Callback function to update field value
            'schema'          => null,
        )
    );

    register_rest_field(
        'locateandfiltermap', // Your custom post type name
        'locate-anything-default-nav-template', // Name of the custom field
        array(
            'get_callback'    => 'get_locateandfiltermap_custom_field_value', // Callback function to retrieve field value
            'update_callback' => 'update_locateandfiltermap_custom_field_value', // Callback function to update field value
            'schema'          => null,
        )
    );


    
}

function get_locateandfiltermap_custom_field_value($object, $field_name, $request) {
    return get_post_meta($object['id'], $field_name, true);
}

function update_locateandfiltermap_custom_field_value($value, $object, $field_name) {
    return update_post_meta($object->ID, $field_name, $value);
}

add_action('rest_api_init', 'register_locateandfiltermap_custom_fields');

// create new route - add all map json to rest API
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/cache/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_custom_cache_file',
        'args' => array(
            'id' => array(
                'validate_callback' => function ($param, $request, $key) {
                    return is_numeric($param);
                }
            ),
        ),
    ));
});

function get_custom_cache_file($request) {
    $id = $request['id'];
    $file_path = WP_CONTENT_DIR . '/uploads/locateandfilter-cache/cache-' . $id . '.json';

    if (file_exists($file_path)) {
        $file_contents = file_get_contents($file_path);
        $data = json_decode($file_contents, true);
        
        if (json_last_error() === JSON_ERROR_NONE) {
            return new WP_REST_Response($data, 200);
        } else {
            return new WP_Error('json_error', 'Error decoding JSON file', array('status' => 500));
        }
    } else {
        return new WP_Error('file_not_found', 'File not found', array('status' => 404));
    }
}

add_action('rest_api_init', function() {
    register_rest_route('custom/v1', '/map-options', array(
        'methods' => 'GET',
        'callback' => 'get_map_options',
    ));
});

function get_map_options() {
    $googlemaps_key = unserialize(get_option('locate-anything-option-googlemaps-key'));
    $enable_marker_bouncing_js = unserialize(get_option('locate-anything-option-enable_markerBouncingJS'));

    return rest_ensure_response(array(
        'googlemaps_key' => $googlemaps_key,
        'enable_marker_bouncing_js' => $enable_marker_bouncing_js,
    ));
}

function enable_show_in_rest_for_all_taxonomies($args, $taxonomy) {
    $args['show_in_rest'] = true;
    return $args;
}
add_filter('register_taxonomy_args', 'enable_show_in_rest_for_all_taxonomies', 10, 2);


