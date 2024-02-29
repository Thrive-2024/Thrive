import { getStorage, setStorage } from '../../utils/chrome'
import {
  HISTORY_CSV_HEADER_ARRAY
} from '../../consts'
import { DailyPomodoro } from '../../types'
import { NEW_LINE_CODE } from '../../consts/index'

const createStorageValue = (content: string): DailyPomodoro[] => {
  const newLineCodes =
    NEW_LINE_CODE.CR + '|' + NEW_LINE_CODE.LF + '|' + NEW_LINE_CODE.CRLF
  const replacedContent = content.replace(
    '/' + newLineCodes + '/',
    NEW_LINE_CODE.LF
  )
  const csvRows = replacedContent
    .slice(replacedContent.indexOf('\n') + 1)
    .split('\n')
  return csvRows.map((row) => {

    const values = row.split(',')

    return {
      year: Number(values[0]),
      month: Number(values[1]),
      day: Number(values[2]),
      count: Number(values[3])
    }
  })
}

const createBlobData = (dailyPomodoros: DailyPomodoro[]): string => {
  const header = HISTORY_CSV_HEADER_ARRAY.join(',') + '\n'

  let joinedData = ''
  dailyPomodoros.forEach((row) => {
    if (row.count === 0 || row.day === 0 || row.month === 0 || row.year === 0) {
      return
    }
    joinedData +=
      String(row.year) +
      ',' +
      String(row.month) +
      ',' +
      String(row.day) +
      ',' +
      String(row.count) +
      '\n'
  })

  joinedData = joinedData.slice(0, -1)
  return header + joinedData
}

const isValidContent = (content: string): boolean => {
  if (!content) {
    return false
  } else {
    return true
  }
}

export { createBlobData, createStorageValue }
