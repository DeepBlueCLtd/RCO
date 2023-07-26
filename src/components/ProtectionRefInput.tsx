import {
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  type SelectProps,
  Typography
} from '@mui/material'
import { useEffect, useState, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import useRefTable from '../hooks/useRefTable'
import {
  type RaRecord,
  useGetList,
  useRecordContext,
  useResourceContext,
  useRedirect,
  type Identifier
} from 'react-admin'
import { Box } from '@mui/system'
import * as constants from '../constants'

interface Props<T, RefTable> {
  reference: string
  refTable: string
  source: keyof RefTable
  itemId?: number
  label: string
  labelField: keyof T
  width: string
  setIsDirty: (source: string, value: string) => void
  onValueChange: (value: string[]) => void
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
    width = '100%',
    setIsDirty,
    onValueChange,
    ...rest
  } = props
  const [data, setData] = useState<Array<T['id']> | T['id']>([])
  const record = useRecordContext()
  const resource = useResourceContext()
  const [prevValue, setPrevValue] = useState<Array<T['id']>>([])
  const {
    formState: { errors, isSubmitSuccessful },
    setValue
  } = useFormContext()
  const redirect = useRedirect()
  const [valueLabel, setValueLabel] = useState<string>('')
  type SelectedIdType = T['id'] | Array<T['id']>

  const { createRecord, updateRecord } = useRefTable(
    refTable,
    source as string,
    resource
  )

  const { data: options = [] } = useGetList<T>(reference)

  const labelById = useMemo(() => {
    const results: Record<Identifier, T> = {}
    options.forEach((option) => {
      results[option.id as T['id']] = option
    })
    return results
  }, [options])

  const { data: selectedItems = [] } = useGetList<RefTable>(refTable, {
    filter: {
      [resource]: record?.id
    }
  })

  const getNamesByIds = (ids: SelectedIdType): string => {
    const names: string[] = []
    const values = Array.isArray(ids) ? ids : [ids]
    options.filter((item: T) => {
      if (values.includes(item.id as number)) {
        names.push(item.name)
        return true
      }
      return false
    })
    return names.join(' ')
  }

  const setProtectionValues = (ids: SelectedIdType): string => {
    const names = getNamesByIds(ids)
    setValueLabel(names)
    return names
  }

  const getPreviousValue = (): string[] => {
    const values = Array.isArray(data) ? data : [data]

    const isSameLength = values.length === prevValue.length
    const compare = (a: any, b: any): number => a.localeCompare(b)
    const isSame =
      isSameLength &&
      values.sort(compare).join() === prevValue.sort(compare).join()

    if (isSame) {
      return []
    }
    return prevValue.map((id) => getLabelById(id))
  }

  const handleChange = (ev: SelectChangeEvent<typeof data>): void => {
    const value = ev.target.value as SelectedIdType
    setData(value)
    const names = setProtectionValues(value)
    setIsDirty(source as string, names)
  }

  useEffect(() => {
    if (valueLabel.length > 0) {
      setValue(source as string, valueLabel)
    }
  }, [valueLabel])

  useEffect(() => {
    const selectedData = multiple
      ? selectedItems?.map((item: RefTable) => item[source]) ?? []
      : selectedItems?.[0]?.[source]
    setData(selectedData)
    setPrevValue(selectedData)
    setProtectionValues(selectedData)
  }, [selectedItems])

  useEffect(() => {
    if (isSubmitSuccessful) {
      const selectedData = typeof data === 'number' ? [data] : data
      if (record?.id) {
        onValueChange(getPreviousValue())
        updateRecord(record.id as number, selectedData as number[])
      } else if (id) {
        createRecord(id, selectedData as number[])
      }
      if (resource === constants.R_BATCHES) {
        const path = `/${constants.R_BATCHES}/${id ?? record?.id}/show`
        redirect(path)
      }
    }
  }, [isSubmitSuccessful])

  const getLabelById = (id: Identifier): string => labelById[id]?.[labelField]

  const error: string = (errors[source as string]?.message as string) ?? ''

  const RenderValue = ({
    selected
  }: {
    selected: SelectedIdType
  }): React.ReactElement => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5
        }}>
        {Array.isArray(selected) ? (
          selected.map((value: T['id']) => (
            <Chip key={value} label={getLabelById(value)} />
          ))
        ) : (
          <Typography key={selected}>{getLabelById(selected)}</Typography>
        )}
      </Box>
    )
  }

  return (
    <FormControl
      variant='filled'
      sx={{ width, padding: 0 }}
      error={Boolean(error)}>
      <InputLabel id={rest.id}>{label}</InputLabel>
      <Select<typeof data>
        {...rest}
        defaultValue={rest.defaultValue as typeof data}
        multiple={multiple}
        value={data}
        onChange={handleChange}
        renderValue={(selected) => <RenderValue selected={selected} />}>
        {options.map((item: T) => {
          const { id } = item
          return (
            <MenuItem key={id} value={id}>
              {item[labelField]}
            </MenuItem>
          )
        })}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}
