import { DateTime } from 'luxon'
import Recent from './Recent'
import * as constants from '../constants'
import { DateField, type Identifier, useGetList, useTheme } from 'react-admin'
import HastenerSentField from './HastenerSentField'
import { type SimplePaletteColorOptions, type SxProps } from '@mui/material'

const rowStyle = (dispatch: Dispatch): SxProps => {
  const { dispatchedAt, lastHastenerSent } = dispatch
  const [theme] = useTheme()
  const date = lastHastenerSent ?? dispatchedAt
  if (!date) return {}

  const { weeks = 0 } = DateTime.now()
    .diff(DateTime.fromISO(date), ['week'])
    .toObject()
  const style =
    weeks >= 4
      ? {
          backgroundColor: (theme.palette?.error as SimplePaletteColorOptions)
            .light
        }
      : {}
  return style
}

export default function PendingReceiptNotes(): React.ReactElement {
  const { data = [] } = useGetList<Dispatch>(constants.R_DISPATCH)

  const dispatchedIds: Identifier[] = []
  data.forEach((d) =>
    d.dispatchedAt !== undefined ? dispatchedIds.push(d.id) : null
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
