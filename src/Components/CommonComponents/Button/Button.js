import React from 'react'
import { Button } from 'react-bootstrap'
import './button.css'

/**
 * Interface layer of react-bootstrap button.  
 * Returns react-bootstrap button component with custom changes (border, background color).
 * @param {string} type - button type. Normally, there are two button types : submit, button. Default: button
 * @param {string} customClass. Default: empty string 
 * @param {string} backgroundColor - button background color 
 * @param {string} color - button color
 * @param {object} border - button border. properties: size, color, style
 * @param {string} children - contents inside button body.
 * @param {function} callback - callback function that execute when button is triggered
 */
export function CustomButton({ children,
  type = "button",
  customClass = "",
  backgroundColor,
  color,
  callback,
  border,
  ...rest }) {

  const bootstrapBtndefaultPadding = '0.375rem';
  const padding = border && `calc(${bootstrapBtndefaultPadding} - ${border.size}px) calc(${bootstrapBtndefaultPadding} - ${border.size}px)`;
  
  const borderVal = border && `${border.size}px ${border.color} ${border.style}`;

  return (
    <Button type={type}
      className={`btn btn--custom d-flex align-items-center justify-content-center ${customClass}`}
      style={{ backgroundColor: backgroundColor, color: color, padding: padding, border: borderVal }}
      onClick={callback}
      {...rest}>
      {
        children
      }
    </Button>
  )
}