import React from 'react'
import './button.css'

export default function Button(props) {
  return (
    <button className={`btn btn--custom d-flex align-items-center justify-content-center ${props.customClass ? props.customClass : '' }`} style={{backgroundColor: props.backgroundColor, color: props.color}} onClick={props.callback} disabled={props.disabled}>
    <span className='btn__icon'>{props.icon}</span>
    {props.title && <span className='btn__title'>{props.title}</span>
    } 
  </button>
  )
}
