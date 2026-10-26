<?php
/**
 * Plugin Name: Site Content Editor Role
 * Description: Adds a restricted role for publishing blog posts and creating pages without site administration access.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

function hannes_add_site_content_editor_role() {
    $role = get_role('site_content_editor');

    if (!$role) {
        add_role('site_content_editor', 'Website Content Editor', array('read' => true));
        $role = get_role('site_content_editor');
    }

    if (!$role) {
        return;
    }

    // The editor can create and publish their own posts and pages.
    $capabilities = array(
        'read',
        'edit_posts',
        'edit_published_posts',
        'publish_posts',
        'edit_pages',
        'edit_published_pages',
        'publish_pages',
        'upload_files',
    );

    foreach ($capabilities as $capability) {
        $role->add_cap($capability);
    }
}

register_activation_hook(__FILE__, 'hannes_add_site_content_editor_role');
