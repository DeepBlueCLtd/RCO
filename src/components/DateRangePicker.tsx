import React, { useEffect } from 'react'
import { useListContext, type DateInputProps, DateTimeInput } from 'react-admin'
import FlexBox from './FlexBox'

interface Props {
  startSource: string
  endSource: string
  startLabel?: string
  endLabel?: string
}

interface ResetFilterProps {
  source: string
}

const useResetFilter = (source: string): void => {
  const { setFilters, filterValues, displayedFilters } = useListContext()
  useEffect(() => {
    if (displayedFilters?.[source] !== true) {
      setFilters(
        {
          ...filterValues,
          start_gte: undefined,
          end_lte: undefined
        },
        displayedFilters
      )
    }
  }, [displayedFilters])
}

export function ResetDateRangeFilter(
  props: ResetFilterProps
): React.ReactElement {
  useResetFilter(props.source)
  return <></>
}

const DateRangePicker = (props: Props & DateInputProps): React.ReactElement => {
  const { startSource, endSource, startLabel, endLabel } = props
  const { setFilters, filterValues, displayedFilters } = useListContext()

  const startChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = new Date(event.target.value).toISOString()
    setFilters({ ...filterValues, [startSource]: value }, displayedFilters)
  }

  const endChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = new Date(event.target.value).toISOString()
    setFilters({ ...filterValues, [endSource]: value }, displayedFilters)
  }

  return (
    <FlexBox>
      <DateTimeInput
        onChange={startChange}
        label={startLabel ?? ''}
        source={startSource}
      />
      <DateTimeInput
        onChange={endChange}
        label={endLabel ?? ''}
        source={endSource}
      />
    </FlexBox>
  )
}

export default DateRangePicker
