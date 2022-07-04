import React from 'react'
import { Button} from 'react-bootstrap'
import './button.css'

export function CustomButton({  children, 
                                type = "button", 
                                customClass = "", 
                                backgroundColor, 
                                color, 
                                callback, 
                                disabled, 
                                border = null, 
                                ...rest}){

  const padding =  border && `calc(0.375rem - ${border.size}px) calc(0.75rem - ${border.size}px)`;
  const borderVal = border && `${border.size}px ${border.color} ${border.style}`;

  return (
    <Button type={type} 
            className={`btn btn--custom d-flex align-items-center justify-content-center ${customClass}`} 
            style={{backgroundColor: backgroundColor, color: color, padding: padding, border: borderVal}} 
            onClick={callback} 
            disabled={disabled} 
            {...rest}>
    {
      children
    } 
  </Button>
  )
}