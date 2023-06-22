import { RaRecord, useGetList, useResourceContext } from 'react-admin'
import { useParams } from 'react-router-dom'
import { Typography, Box, Chip } from '@mui/material'

interface RefTableFieldWithLabelProps<T extends RaRecord, ResourceType> {
  label: string
  reference: string
  resourceTable: string
  multiple?: boolean
  labelField: keyof T
}

export default function RefTableFieldWithLabel<
  T extends RaRecord,
  ResourceType extends RaRecord
>(props: RefTableFieldWithLabelProps<T, ResourceType>): React.ReactElement {
  const {
    label,
    reference,
    resourceTable,
    multiple = false,
    labelField
  } = props

  const { data: referenceData = [] } = useGetList<T>(reference)
  const resource = useResourceContext()
  const { id } = useParams()

  const { data = [], isLoading } = useGetList<ResourceType>(resourceTable, {
    [resource]: id
  })

  if (isLoading) return <></>

  return (
    <Box>
      <Typography fontWeight='bold' sx={{ minWidth: '300px' }}>
        {label}
      </Typography>
      <>
        {data?.map((item: ResourceType) => {
          const { id, [labelField]: fieldId } = item
          const value = referenceData?.find(
            (item: T) => item.id === fieldId
          ).name
          return multiple ? (
            <Chip sx={{ marginRight: 0.4 }} key={id} label={`${value}`} />
          ) : (
            <Typography key={id}>{value}</Typography>
          )
        })}
      </>
    </Box>
  )
}
