import React from 'react';
import { CustomButton } from './Button';

function GobackButton({children, ...rest}) {
    rest = {...rest, customClass: rest.customClass ? rest.customClass + ' btn--go-back' : 'btn--go-back'};
    return (
      <CustomButton {...rest}>
         <i className="fas fa-chevron-left"></i> {children}
      </CustomButton>
    )
}

export default GobackButton;