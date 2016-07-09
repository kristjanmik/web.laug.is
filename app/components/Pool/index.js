//http://www.color-hex.com/color-palette/700

import React from 'react'
import s from './Pool.css'
import moment from 'moment'
import Countdown from '../Countdown'

import { Link } from 'react-router'

export default class Pool extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { key, data } = this.props

    const {
      id,
      latitude,
      longitude,
      name,
      today
    } = data

    const now = moment().unix()
    const validToday = today && today.opens && today.closes && true

    let opens = !validToday ? false : moment(today.opens,'HH:mm').unix()
    let closes = !validToday ? false : moment(today.closes,'HH:mm').unix()
    let isOpen = validToday && opens < now && closes > now

    let openIndicator = (<div/>)

    if(isOpen){
      const closesIn = closes - now

      const poolStyle = (closesIn >= 60) ? s.poolStatusOpen : s.poolStatusWillClose

      openIndicator = (
        <div className={poolStyle}>
          <span> Opin næstu: <Countdown time={today.closes}/></span>
        </div>
      )
    }else if(Math.abs(now - opens) <= 3600){
      const opensIn = Math.abs(now - opens)

      if(opensIn >= 60){
        openIndicator = (
          <div className={s.poolStatusWillOpen}>
            Opnar eftir &nbsp; {Math.floor(opensIn / 60)} &nbsp; mínútur
          </div>
        )
      }
    }else{
      openIndicator = (
        <div className={s.poolStatusClosed}>Lokuð</div>
      )
    }

    return (
      <div key={key} className={s.poolContainer}>
        {/*@TODO update SinglePool before enabling this*/}
        {/*<Link to={`/pool/${id.toLowerCase()}`} className={s.pool}>*/}
        <Link to={`/`} className={s.pool}>
          <img src={require(`../../img/${id.toLowerCase()}.png`)} className={s.poolImage}/>
          {/*<img src={require('../../img/arb.png')} className={s.poolImage}/>*/}
          <div className={s.poolName}>{name}</div>
          <div className={s.poolStatusContainer}>
            {openIndicator}
          </div>
        </Link>
      </div>
    )
  }
}
