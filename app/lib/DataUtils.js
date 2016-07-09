export function poolsByDistance(pools,coords){
  if(!pools) return []

  //make a new array
  let poolsToSort = [...pools]

  poolsToSort.sort(function(a,b){
    if(a.latitude && !b.latitude) return -1
    if(!a.latitude && b.latitude) return 1

    //Instead of using haversine for the distance, it would be optimal to calculate
    //With the open google api to get actual traveling time
    let distanceA = haversine(coords,{
      latitude: a.latitude,
      longitude: a.longitude
    })

    let distanceB = haversine(coords,{
      latitude: b.latitude,
      longitude: b.longitude
    })

    if(distanceA > distanceB) return 1
    if(distanceA < distanceB) return -1

    return 0
  })

  return poolsToSort
}

export function fixMultiOpeningHours(today){
  //Check if there are multiple opening hours
  if (today.opens.indexOf(',') >= 0 && today.closes.indexOf(',') >= 0) {

    const opens = today.opens.split(',')
    const closes = today.closes.split(',')
    if (opens.length === closes.length) {

      let now = moment().unix()
      let openingHourFound = false
      for (let i = 0; i < opens.length; i++) {
        if (moment(opens[i],'HH:mm').unix() < now && moment(closes[i],'HH:mm').unix() > now) {
          openingHourFound = true
          today.opens = opens[i]
          today.closes = closes[i]
        }
      }

      //@TODO Instead of selecting the first period, select the closest opening hour
      if (!openingHourFound){
        today.opens = opens[0]
        today.closes = closes[0]
      }
    }
  }

  return today
}
