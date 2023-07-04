import {
  AutocompleteInput,
  DateTimeInput,
  TextField,
  TextInput,
  useGetList
} from 'react-admin'
import FlexBox from '../../../components/FlexBox'
import { useFormContext } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import SourceField from '../../../components/SourceField'
import { R_BATCHES } from '../../../constants'
import { ConditionalReferenceInput } from '../../batches/BatchForm'
import ProtectionBlockInputs from '../../../components/ProtectionBlockInputs'
import * as constants from '../../../constants'

const sx = { width: '100%' }

interface Props {
  batchId?: number
  disabled?: boolean
  itemId?: Item['id']
}

const CoreForm = (props: Props): React.ReactElement => {
  const { batchId, disabled, itemId } = props
  const formContext = useFormContext()
  const [mediaTypes, setMediaTypes] = useState<any[]>([])
  const { data = [] } = useGetList(constants.R_MEDIA_TYPE)

  useEffect(() => {
    formContext?.setValue('batchId', batchId)
  })

  useEffect(() => {
    setMediaTypes(data)
  }, [data])

  const ValueField = ({
    label,
    children
  }: {
    label: string
    children: any
  }): React.ReactElement => {
    return (
      <Typography fontWeight='bold'>
        {label}: {children}
      </Typography>
    )
  }

  return (
    <>
      <AutocompleteInput
        disabled={disabled}
        source='mediaType'
        choices={mediaTypes.filter((item: Record<string, any>) => item.active)}
        sx={sx}
      />
      <FlexBox alignItems='flex-start'>
        <TextInput
          multiline
          disabled={disabled}
          label='Consec/Pages'
          source='consecPages'
          sx={sx}
        />
        <Card sx={{ ...sx, margin: '8px 0 20px' }}>
          {!(disabled === true) && (
            <CardContent sx={{ padding: '12px !important' }}>
              Consec/Pages should contain one of the following:
              <ul>
                <li>
                  The Consec/Serial reference (<strong>125/2022</strong> or
                  similiar) for mag media, when provided.
                </li>
                <li>
                  The acronym <strong>LEP</strong> if a list of effective pages
                  is present
                </li>
                <li>
                  The count of effective sheets (<strong>12</strong>), for
                  printed materials without an LEP
                </li>
                <li>Blank, otherwise</li>
              </ul>
            </CardContent>
          )}
        </Card>
      </FlexBox>
      <ProtectionBlockInputs<ItemCode, ItemCave, ItemHandling>
        disabled={disabled}
        markingSource='protectiveMarking'
        id={itemId}
        refTables={{
          catCave: constants.R_ITEMS_CAVE,
          catCode: constants.R_ITEMS_CODE,
          catHandle: constants.R_ITEMS_HANDLE
        }}
        resource={constants.R_ITEMS}
      />
      <FlexBox>
        <DateTimeInput
          sx={sx}
          disabled={disabled}
          source='startDate'
          label='Start'
          variant='outlined'
        />
        <DateTimeInput
          sx={sx}
          disabled={disabled}
          source='endDate'
          variant='outlined'
          label='End'
        />
      </FlexBox>
      <FlexBox>
        <ConditionalReferenceInput
          source='vaultLocation'
          reference={constants.R_VAULT_LOCATION}
          active
        />
      </FlexBox>
      <FlexBox>
        <TextInput multiline disabled={disabled} source='remarks' sx={sx} />
        <TextInput
          multiline
          disabled={disabled}
          source='musterRemarks'
          sx={sx}
        />
      </FlexBox>
      <FlexBox style={{ justifyContent: 'space-between' }}>
        {(disabled ?? false) && (
          <>
            <ValueField label='Created'>
              <TextField source='createdAt' />
            </ValueField>
            <div>
              {'Batch: '}
              <SourceField
                link='show'
                source='batchId'
                reference={R_BATCHES}
                sourceField='batchNumber'
                textProps={{
                  style: { color: 'blue' },
                  variant: 'subtitle1'
                }}
              />
            </div>
          </>
        )}
      </FlexBox>
    </>
  )
}

export default CoreForm
