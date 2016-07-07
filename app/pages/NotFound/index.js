import React from 'react';
import s from './NotFound.css';

import { Link } from 'react-router'

export default function(){
  return (
    <div className={s.container}>
      <p className={s.description}>Síða fannst ekki</p>
      <Link to="/" className={s.link}>Fara á forsíðu</Link>
    </div>
  )
}
