//http://www.color-hex.com/color-palette/700

import React from 'react';
import styles from './Pools.css';
import moment from 'moment';
import haversine from 'haversine';
import Countdown from '../Countdown/countdown.js';

import { Link } from 'react-router'


function poolsByDistance(pools,coords){
  if(!pools) return [];

  //make a new array
  let poolsToSort = [...pools];

  poolsToSort.sort(function(a,b){
    if(a.latitude && !b.latitude) return -1;
    if(!a.latitude && b.latitude) return 1;

    //Instead of using haversine for the distance, it would be optimal to calculate
    //With the open google api to get actual traveling time
    let distanceA = haversine(coords,{
      latitude: a.latitude,
      longitude: a.longitude
    });

    let distanceB = haversine(coords,{
      latitude: b.latitude,
      longitude: b.longitude
    })

    if(distanceA > distanceB) return 1;
    if(distanceA < distanceB) return -1;

    return 0;
  });

  return poolsToSort;
}

function fixMultiOpeningHours(today){
  //Check if there are multiple opening hours
  if (today.opens.indexOf(',') >= 0 && today.closes.indexOf(',') >= 0) {

    const opens = today.opens.split(',');
    const closes = today.closes.split(',');
    if (opens.length === closes.length) {

      let now = moment().unix();
      let openingHourFound = false;
      for (let i = 0; i < opens.length; i++) {
        if (moment(opens[i],'HH:mm').unix() < now && moment(closes[i],'HH:mm').unix() > now) {
          openingHourFound = true;
          today.opens = opens[i];
          today.closes = closes[i];
        }
      }

      //@TODO Instead of selecting the first period, select the closest opening hour
      if (!openingHourFound){
        today.opens = opens[0];
        today.closes = closes[0];
      }
    }
  }

  return today;
}

export default class Pools extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pools: [],
      coords: null
    }
  }
  componentWillMount() {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.gotPosition.bind(this));
    }

    //@TODO Use relay in the future
    let url = 'http://graphql.laug.is/?query=%7Bpools%20%7B%0A%20%20id%2C%0A%20%20name%2C%0A%20%20latitude%2C%0A%20%20longitude%2C%0A%20%20today%20%7B%0A%20%20%20%20opens%0A%20%20%20%20closes%0A%20%20%7D%0A%7D%7D';

    fetch(url).then( r => r.json() ).then( (json) => {
      return json.data.pools;
    }).then( (pools) => {
      let now = moment().unix();

      pools = pools.map( (pool) => {
        //Add .isOpen property
        pool.isOpen = false;

        if(!pool.today){
          console.log('Pool without today',pool);
          return pool
        };

        //fixing pools that have today.opens:'06:30,15:00' and today.closes:'08:00,21:00'
        //it ignores other values
        pool.today = fixMultiOpeningHours(pool.today);

        let opens = moment(pool.today.opens,'HH:mm').unix();
        let closes = moment(pool.today.closes,'HH:mm').unix();

        pool.isOpen = opens < now && closes > now;

        if(pool.isOpen && (closes - now) <= 1800){
          pool.closesIn = closes - now;
        }else if(!pool.isOpen && Math.abs(now - opens) <= 3600){
          pool.opensIn = Math.abs(now - opens);
        }

        return pool;
      });

      this.setState({
        pools: this.coords ? poolsByDistance(pools,this.state.coords) : pools
      });

    }).catch( (error) => {
      console.error('Error fetching data',error);
    })
  }
  gotPosition(position) {
    console.log('position is',position);

    if(!position.coords) return;

    let coords = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }

    this.setState({
      coords: coords,
      pools: poolsByDistance(this.state.pools,coords)
    });
  }
  render() {

    let list = this.state.pools.map( (pool) => {

      let openIndicator = (<div />);

      if(pool.isOpen){
          if(pool.closesIn >= 60){
            var poolStyle = styles.poolStatusWillClose;
          }else{
            var poolStyle = styles.poolStatusOpen;
          }
          openIndicator = (
              <div className={poolStyle}> <span> Opin næstu: <Countdown time={pool.today.closes}/></span></div>
          );
      }else{
        if(pool.opensIn >= 60){
          openIndicator = (
            <div className={styles.poolStatusWillOpen}>Opnar eftir &nbsp; {Math.floor(pool.opensIn / 60)} &nbsp; mínútur</div>
          );
        }else{
          openIndicator = (
            <div className={styles.poolStatusClosed}>Lokuð</div>
          );
        }
      }
      return (
        <div key={pool.id} className={styles.poolContainer}>
          <Link to={`/pool/${pool.id.toLowerCase()}`} className={styles.pool}>
            <img src={require(`../../img/${pool.id.toLowerCase()}.png`)} className={styles.poolImage}/>
            {/*<img src={require('../../img/arb.png')} className={styles.poolImage}/>*/}
            <div className={styles.poolName}>{pool.name}</div>
            <div className={styles.poolStatusContainer}>
              {openIndicator}
            </div>
          </Link>
        </div>
      )
    });

    return (
      <div className={styles.container}>
        {list}
      </div>
    );
  }
}
