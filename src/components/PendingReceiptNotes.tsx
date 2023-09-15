import { DateTime } from 'luxon'
import Recent from './Recent'
import * as constants from '../constants'
import { DateField, type Identifier, useGetList } from 'react-admin'
import HastenerSentField from './HastenerSentField'
import { type SxProps } from '@mui/material'

const rowStyle = (dispatch: Dispatch): SxProps => {
  const { dispatchedAt, lastHastenerSent, receiptReceived } = dispatch
  const date = lastHastenerSent ?? dispatchedAt
  if (!date) return {}

  const { weeks = 0 } = DateTime.now()
    .diff(DateTime.fromISO(date), ['week'])
    .toObject()

  if (!receiptReceived) {
    if (lastHastenerSent && weeks >= 4) {
      return { backgroundColor: 'red' }
    } else if (!lastHastenerSent && dispatchedAt && weeks >= 4) {
      return { backgroundColor: 'red' }
    }
  }

  return {}
}

export default function PendingReceiptNotes(): React.ReactElement {
  const { data = [] } = useGetList<Dispatch>(constants.R_DISPATCH)
  const filter = process.env.MOCK ? 'null' : null
  const dispatchedIds: Identifier[] = []
  data.forEach((d) =>
    d.dispatchedAt !== filter && !d.receiptReceived
      ? dispatchedIds.push(d.id)
      : null
  )

  return (
    <Recent<Dispatch>
      label='Pending Receipt Notes'
      rowStyle={rowStyle}
      resource={constants.R_DISPATCH}
      fields={[
        { source: 'name' },
        { source: 'dispatchedAt', component: DateField },
        { source: 'lastHastenerSent', component: HastenerSentField }
      ]}
      filter={{ receiptReceived: null, id: dispatchedIds }}
      search={`filter=${JSON.stringify({ receiptReceived: null })}`}
    />
  )
}
