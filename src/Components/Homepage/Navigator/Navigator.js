import React from 'react'
import { getFormatDate } from '../../../Helpers/DateHelper';
import { Button } from '../../CommonComponents/Button/Button';
import './navigator.css'

export default function Navigator() {
  const date = new Date();

  return (
    <div className='navigator'>
        <Button><i class="fas fa-angle-left"></i></Button>
        <h5 className='navigator__title'>{getFormatDate()}</h5>
        <Button><i class="fas fa-angle-right"></i></Button>
    </div>
  )
}
