import React, { useEffect, useState } from 'react'
import { DateInput, type DateInputProps } from 'react-admin'
import FlexBox from './FlexBox'

interface Props {
  label?: string
  startSource?: string
  endSource?: string
}

const DateRangePicker = (props: Props & DateInputProps): React.ReactElement => {
  const { startSource, endSource } = props
  const [start, setStart] = useState<string>()
  const [end, setEnd] = useState<string>()

  useEffect(() => {
    console.log(start, end)
  }, [start, end])

  useEffect(() => {
    setStart(startSource)
    setEnd(endSource)
  }, [startSource, endSource])

  return (
    <FlexBox>
      <DateInput source={`${start}_gte`} label='Start' />
      <DateInput source={`${end}_lte`} label='End' />
    </FlexBox>
  )
}

export default DateRangePicker
