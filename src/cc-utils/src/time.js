export const calculateDays = (startDate, endDate) => {
  let t = 'days delayed'
  const startTimestamp = new Date(startDate).getTime()
  const endTimestamp = new Date(endDate).getTime()
  if (endTimestamp > startTimestamp) {
    t = 'days left'
  }

  const differenceInMilliseconds = endTimestamp - startTimestamp
  const differenceInDays = Math.ceil(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  )
  return `${Math.abs(differenceInDays)} ${t}`
}
