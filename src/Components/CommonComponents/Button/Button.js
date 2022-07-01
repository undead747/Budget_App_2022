import React from 'react'
import { Button} from 'react-bootstrap'
import './button.css'

export function CustomButton({children, type = "button", customClass = "", backgroundColor, color, callback, disabled, border="none", ...rest}){
  return (
    <Button type={type} className={`btn btn--custom d-flex align-items-center justify-content-center ${customClass}`} style={{backgroundColor: backgroundColor, color: color, border: border}} onClick={callback} disabled={disabled} {...rest}>
    {
      children
    } 
  </Button>
  )
}