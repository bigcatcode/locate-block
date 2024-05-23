import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl } from '@wordpress/components';

export default function PanelGlobalOptions({ attributes, setAttributes }){
    const { posts } = attributes; 

    return (
        <div>
            <PanelBody
                title={__('Global Options', 'locate')}
                initialOpen={false}
            >

            </PanelBody>

        </div>
    );

}