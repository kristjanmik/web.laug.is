import React from 'react';

export default function(props){
  const { poolId } = props.params
  console.log('props',props)
  return (
    <div>Stök laug: {poolId}</div>
  )
}
