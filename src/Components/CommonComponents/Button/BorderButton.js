import React from 'react';
import { CustomButton } from './Button';

function BorderButton({ border, ...rest }) {
    border = {size: 1, color: 'var(--button-color-type-1)', style: 'solid', ...border};
    return (
        <CustomButton border = {border} {...rest} />
    );
}

export default BorderButton;