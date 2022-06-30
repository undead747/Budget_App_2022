import React from 'react'
import { Button} from 'react-bootstrap'
import './button.css'

export function CustomButton({children, type, customClass, backgroundColor, color, callback, disabled, ...rest}){
  return (
    <Button type={rest.type ? rest.type : "button"} className={`btn btn--custom d-flex align-items-center justify-content-center ${rest.customClass && rest.customClass}`} style={{backgroundColor: rest.backgroundColor, color: rest.color}} onClick={rest.callback} disabled={rest.disabled}>
    {
      children
    } 
  </Button>
  )
}