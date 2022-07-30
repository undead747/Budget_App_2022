import React from 'react';
import { CustomButton } from './Button';

/**
 * Border with transparent background version of custom button (interface of bootstrap-react button).  
 * Returns border button with props as same as custom button plus pre-setting border object.
 * @param {object} border - object with properties : size, color, style
 * @param {object} border - Default values: border size = 1, color = button-color-type-1, style = solid 
 * @param {object} rest - other component props 
 */
function BorderButton({ border, ...rest }) {
    border = { size: 1, color: 'var(--button-color-type-1)', style: 'solid', ...border };
    return (
        <CustomButton border={border} backgroundColor={"transparent"} {...rest} />
    );
}

export default BorderButton; 