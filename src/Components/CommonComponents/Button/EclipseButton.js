import React from 'react'
import { CustomButton } from './Button'

export default function EclipseButton(props) {
    props = {...props, customClass: props.customClass ? props.customClass + ' btn--eclipse' : 'btn--eclipse'};
  return (
    <CustomButton {...props} />
  )
}
