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

}

function get_locateandfiltermap_custom_field_value($object, $field_name, $request) {
    return get_post_meta($object['id'], $field_name, true);
}

function update_locateandfiltermap_custom_field_value($value, $object, $field_name) {
    return update_post_meta($object->ID, $field_name, $value);
}

add_action('rest_api_init', 'register_locateandfiltermap_custom_fields');

