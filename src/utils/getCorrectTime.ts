function normalizeTime(time: number): string | number {
  return time < 10 ? `0${time}` : time
}

export function getHoursAndMinutes(timestamp: number) {
  const date = new Date(timestamp)
  const hours = normalizeTime(date.getHours())
  const minutes = normalizeTime(date.getMinutes())

  return `${hours}:${minutes}`
}

export function getDayAndMonth(timestamp: number) {
  const date = new Date(timestamp)
  const day = normalizeTime(date.getDay())
  const month = normalizeTime(date.getMonth())

  return `${day}:${month}`
}
