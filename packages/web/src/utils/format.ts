import dayjs from 'dayjs'

export function fmtDate(date: string | Date | number, fmt = 'YYYY-MM-DD hh:mm:ss') {
  return dayjs(date).format(fmt)
}
