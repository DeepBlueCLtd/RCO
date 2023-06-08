import { DateTime } from 'luxon'
import { DateField, useRecordContext } from 'react-admin'
import { DATE_FORMAT } from '../constants'
import { type Theme } from '@mui/material'

interface Props {
  source: string
}

export default function HastenerSentField(props: Props): React.ReactElement {
  const { source } = props
  const { dispatchedAt } = useRecordContext<Dispatch>()

  if (typeof dispatchedAt === 'undefined') return <></>

  const diff: number =
    DateTime.now()
      .diff(DateTime.fromFormat(dispatchedAt, DATE_FORMAT), 'months')
      .toObject().months ?? 0

  return (
    <DateField
      sx={(theme: Theme) => ({
        color: diff >= 1 ? theme.palette.error.light : undefined
      })}
      source={source}
    />
  )
}
