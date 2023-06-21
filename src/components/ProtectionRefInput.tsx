import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  type SelectProps
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import useRefTable from '../hooks/useRefTable'
import {
  type RaRecord,
  useGetList,
  useRecordContext,
  useResourceContext
} from 'react-admin'

interface Props<T, RefTable> {
  reference: string
  refTable: string
  source: keyof RefTable
  itemId?: number
  label: string
  labelField: keyof T
}

export default function ProtectionRefInput<
  T extends RaRecord,
  RefTable extends RaRecord
>(props: SelectProps & Props<T, RefTable>): React.ReactElement {
  const {
    reference,
    source,
    itemId: id,
    refTable,
    label,
    multiple,
    labelField,
    ...rest
  } = props
  const [data, setData] = useState<number[] | number>([])
  const record = useRecordContext()
  const resource = useResourceContext()
  const {
    formState: { isSubmitted }
  } = useFormContext()

  const { createRecord, updateRecord } = useRefTable(
    refTable,
    source as string,
    resource
  )

  const { data: options = [] } = useGetList<T>(reference)

  const { data: selectedItems = [] } = useGetList<RefTable>(refTable, {
    filter: {
      [resource]: record?.id
    }
  })

  const handleChange = (ev: SelectChangeEvent<typeof data>): void => {
    setData(ev.target.value as number | number[])
  }

  useEffect(() => {
    const selectedData = multiple
      ? selectedItems?.map((item: RefTable) => item[source]) ?? []
      : selectedItems?.[0]?.[source]
    setData(selectedData)
  }, [selectedItems])

  useEffect(() => {
    if (isSubmitted) {
      const selectedData = typeof data === 'number' ? [data] : data
      if (record?.id) {
        updateRecord(record.id as number, selectedData)
      } else if (id) {
        createRecord(id, selectedData)
      }
    }
  }, [isSubmitted])
  return (
    <FormControl variant='filled' sx={{ width: '100%', padding: 0 }}>
      <InputLabel id={rest.id}>{label}</InputLabel>
      <Select<typeof data>
        {...rest}
        defaultValue={rest.defaultValue as typeof data}
        multiple={multiple}
        value={data}
        onChange={handleChange}>
        {options.map((item: T) => {
          const { id } = item
          return (
            <MenuItem key={id} value={id}>
              {item[labelField]}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}
