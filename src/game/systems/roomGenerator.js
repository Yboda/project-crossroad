import { roomTypes } from '../data/rooms'

export function createRoomOptions(depth, count = 3) {
  const offset = depth % roomTypes.length

  return Array.from({ length: count }, (_, index) => {
    const room = roomTypes[(offset + index) % roomTypes.length]

    return {
      ...room,
      instanceId: `${room.id}-${depth}-${index}`,
    }
  })
}
