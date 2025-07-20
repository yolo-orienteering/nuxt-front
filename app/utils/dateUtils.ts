import moment from 'moment'
import 'moment/dist/locale/de'

export function formatDate (date: string, format: string) {
  return moment(date).locale('de-CH').format(format)
}