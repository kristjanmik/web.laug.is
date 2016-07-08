import React from 'react';
import Pools from '../components/Pools';

export default function(props){
  const { poolId } = props.params
  console.log('props',props)
  return (
    <div>Stök laug: {poolId}</div>
  )
}
