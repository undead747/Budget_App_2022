import React from 'react'
import { CustomButton } from './Button';

export default function BorderButton({border = {size: 1, style: 'solid', color: 'var(--button-color-type-1)'}, ...rest}) {
    const padding = `calc(0.375rem - ${border.size}px) calc(0.75rem - ${border.size}px);`
   
    return (
      <CustomButton padding={padding} {...rest} />
    )
}
