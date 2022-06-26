import React from 'react'
import './button.css'

export function Button({children, ...rest}){
  return (
    <button type='button' className={`btn btn--custom d-flex align-items-center justify-content-center ${rest.customClass && rest.customClass}`} style={{backgroundColor: rest.backgroundColor, color: rest.color}} onClick={rest.callback} disabled={rest.disabled}>
    {
      children
    } 
  </button>
  )
}