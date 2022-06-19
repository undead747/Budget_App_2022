import React from 'react'
import { Link } from 'react-router-dom';
import { getFormatDate } from '../../../Helpers/DateHelper';

export default function Navigator() {
  const date = new Date();

  return (
    <div className='navigator'>
        <Link to="/"><i class="fas fa-angle-left"></i>Test</Link>
        <h5 className='navigator__title'>{getFormatDate()}</h5>
    </div>
  )
}
