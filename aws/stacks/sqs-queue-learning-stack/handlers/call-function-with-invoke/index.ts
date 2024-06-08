import { EventBody } from './types'

export const handler = (event: EventBody) => {
  //console.log(JSON.parse(event.toString()))
  console.log(event)
}
