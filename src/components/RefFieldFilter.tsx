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

interface Props<T extends RaRecord> {
  refFieldTable: string
  refField: string
  reference: string
  label: string
  labelField: keyof T
  source: string
}

// const useResetFilter = (source: string, display: string): void => {
//   const { setFilters, filterValues, displayedFilters = {} } = useListContext()
//   useEffect(() => {
//     const closeCondition =
//       !displayedFilters?.[source] &&
//       !displayedFilters?.[display] &&
//       filterValues?.[source]

//     if (closeCondition !== undefined && closeCondition !== false) {
//       const { [source]: _ } = filterValues
//       setFilters(
//         {
//           ...filterValues,
//           [source]: undefined
//         },
//         displayedFilters
//       )
//     }
//   }, [displayedFilters])
// }

interface ResetFilterProps {
  source: string
  display: string
}

export function ResetRefFieldFilter(
  props: ResetFilterProps
): React.ReactElement {
  // const { source, display } = props
  // useResetFilter(source, display)
  return <></>
}

export default function RefFieldFilter<T extends RaRecord>(
  props: Props<T>
): React.ReactElement {
  const { refFieldTable, refField, reference, label } = props

  const { setFilters, displayedFilters, filterValues } = useListContext()
  const { data: options = [] } = useGetList<T>(reference)
  const dataProvider = useDataProvider()

  const handleChange = async (ev: SelectChangeEvent): Promise<void> => {
    const id = ev.target.value

    const { data } = await dataProvider.getList(refFieldTable, {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: 'id', order: 'ASC' },
      filter: { [reference]: id }
    })

    const filterIds = data.map((item: any) => item.id)

    // if (filterValues?.[refField]?.length > 0) {
    //   console.log(filterIds)
    //   filterIds = filterIds.filter((id: number) =>
    //     filterValues[refField].includes(id)
    //   )
    //   console.log(filterIds)
    // }

    setFilters(
      {
        ...filterValues,
        [refField]: filterIds.length > 0 ? filterIds : -1
      },
      displayedFilters
    )
  }

  return (
    <FormControl sx={{ width: '164px' }}>
      <InputLabel id={refFieldTable}>{label}</InputLabel>
      <Select onChange={handleChange as any} label={label}>
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
