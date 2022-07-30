import React from 'react'
import { CustomButton } from './Button'

/**
 * Eclipse version of custom button (interface of bootstrap-react button).  
 * Returns eclipse button with props as same as custom button plus btn--eclipse class that responsibility of styling eclipse shape.
 * @param {object} props
 */
export default function EclipseButton(props) {
  props = { ...props, customClass: props.customClass ? props.customClass + ' btn--eclipse' : 'btn--eclipse' };
  return (
    <CustomButton {...props} />
  )
}
