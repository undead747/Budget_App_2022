import React from 'react';
import { CustomButton } from './Button';

/**
 * Go back version of custom button (interface of bootstrap-react button).  
 * Returns go back with props as same as custom button plus btn--go-back class that responsibility of styling go back button.
 * @param {object} props
 */
function GobackButton({ children, ...rest }) {
  rest = { ...rest, customClass: rest.customClass ? rest.customClass + ' btn--go-back' : 'btn--go-back' };
  return (
    <CustomButton {...rest}>
      <i className="fas fa-chevron-left"></i> {children}
    </CustomButton>
  )
}

export default GobackButton;