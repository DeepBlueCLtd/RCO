import {
  type RaRecord,
  useDataProvider,
  useGetList,
  useListContext
} from 'react-admin'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent
} from '@mui/material'
import { useEffect, useState } from 'react'
import { type UseRefFilter } from '../hooks/useRefFilter'

interface Props<T extends RaRecord> {
  refFieldTable: string
  refField: string
  reference: string
  label: string
  labelField: keyof T
  source: string
}

const useResetFilter = (source: string, displaySource: string): void => {
  const { setFilters, filterValues, displayedFilters = {} } = useListContext()
  useEffect(() => {
    const closeCondition =
      !displayedFilters?.[source] &&
      !displayedFilters?.[displaySource] &&
      filterValues?.[source]

    if (closeCondition !== undefined && closeCondition !== false) {
      setFilters(
        {
          ...filterValues,
          [source]: undefined
        },
        displayedFilters
      )
    }
  }, [displayedFilters])
}

interface ResetFilterProps {
  source: string
  displaySource: string
}

export function ResetRefFieldFilter(
  props: ResetFilterProps
): React.ReactElement {
  const { source, displaySource } = props
  useResetFilter(source, displaySource)
  return <></>
}

export default function RefFieldFilter<T extends RaRecord>(
  props: Props<T> & UseRefFilter
): React.ReactElement {
  const { refFieldTable, refField, reference, label, source, setFilterValue } =
    props

  const { setFilters, displayedFilters, filterValues } = useListContext()
  const [value, setValue] = useState<number>()
  const { data: options = [] } = useGetList<T>(reference)
  const dataProvider = useDataProvider()

  const handleChange = (): void => {
    const srcId = value
    dataProvider
      .getList(refFieldTable, {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: 'id', order: 'ASC' },
        filter: { [reference]: srcId }
      })
      .then(({ data }) => {
        let filterIds: number[] = data.map((item: any) => item.id)
        filterIds =
          setFilterValue(source, filterIds, Object.keys(displayedFilters)) ??
          filterIds

        setFilters(
          {
            ...filterValues,
            [refField]: filterIds?.length > 0 ? filterIds : -1
          },
          displayedFilters
        )
      })
      .catch(console.error)
  }

  useEffect(() => {
    if (value !== undefined && value !== null) {
      handleChange()
    }
  }, [displayedFilters, value])

  return (
    <FormControl sx={{ width: '164px' }}>
      <InputLabel id={refFieldTable}>{label}</InputLabel>
      <Select
        onChange={(ev: SelectChangeEvent) =>
          { setValue(parseInt(ev.target.value)) }
        }
        label={label}>
        {options.map((item: T, index: number) => {
          const { id, name } = item
          return (
            <MenuItem key={index} value={id}>
              {name}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}
