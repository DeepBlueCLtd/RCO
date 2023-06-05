import {
  AutocompleteInput,
  DateTimeInput,
  ReferenceInput,
  TextField,
  TextInput
} from 'react-admin'
import { mediaTypeOptions } from '../../../utils/options'
import FlexBox from '../../../components/FlexBox'
import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import SourceField from '../../../components/SourceField'
import { R_BATCHES } from '../../../constants'

const sx = { width: '100%' }

interface Props {
  batchId?: number
  disabled?: boolean
}

const optionsText = (item: ReferenceItem): string => item.name

const CoreForm = (props: Props): React.ReactElement => {
  const { batchId, disabled } = props
  const formContext = useFormContext()

  useEffect(() => {
    formContext?.setValue('batchId', batchId)
  })

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
        choices={mediaTypeOptions}
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
      <FlexBox>
        <DateTimeInput
          sx={sx}
          disabled={disabled}
          source='start'
          label='Start'
          variant='outlined'
        />
        <DateTimeInput
          sx={sx}
          disabled={disabled}
          source='end'
          variant='outlined'
          label='End'
        />
      </FlexBox>
      <FlexBox>
        <ReferenceInput source='vaultLocation' reference='vaultLocation'>
          <AutocompleteInput
            disabled={disabled}
            optionText={optionsText}
            sx={sx}
          />
        </ReferenceInput>
        <ReferenceInput
          source='protectiveMarking'
          reference='protectiveMarking'>
          <AutocompleteInput
            disabled={disabled}
            optionText={optionsText}
            sx={sx}
          />
        </ReferenceInput>
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
