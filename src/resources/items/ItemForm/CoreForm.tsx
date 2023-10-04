import {
  AutocompleteInput,
  DateTimeInput,
  TextField,
  TextInput,
  useGetList
} from 'react-admin'
import FlexBox from '../../../components/FlexBox'
import { useFormContext } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import SourceField from '../../../components/SourceField'
import { R_BATCHES } from '../../../constants'
import { ConditionalReferenceInput } from '../../batches/BatchForm'
import ProtectionBlockInputs from '../../../components/ProtectionBlockInputs'
import * as constants from '../../../constants'
import { emitter } from './ItemFormToolbar'

const sx = { width: '100%' }

interface Props {
  batch?: Batch['id']
  disabled?: boolean
  itemId?: Item['id']
  setItemId: React.Dispatch<React.SetStateAction<number | undefined>>
  isRemarksOpen: boolean
}

const CoreForm = (props: Props): React.ReactElement => {
  const { batch, disabled, itemId, setItemId, isRemarksOpen } = props
  const formContext = useFormContext()
  const {
    setValue,
    formState: { isSubmitted, isSubmitting }
  } = formContext
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([])
  const { data = [] } = useGetList(constants.R_MEDIA_TYPE)
  const dateRef = useRef<HTMLInputElement>(null)
  const mediaTypeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    formContext?.setValue('batch', batch)
  })

  useEffect(() => {
    setMediaTypes(data)
  }, [data])

  useEffect(() => {
    if (isSubmitted) {
      setItemId(undefined)
    }
  }, [isSubmitted, isSubmitting])

  useEffect(() => {
    emitter.on(constants.ITEM_SAVE, () => {
      if (mediaTypeRef.current) mediaTypeRef.current.click()
    })
    emitter.on(constants.ITEM_CLONE, () => {
      if (dateRef.current) dateRef.current.click()
    })

    return () => {
      emitter.off(constants.ITEM_CLONE)
      emitter.off(constants.ITEM_SAVE)
    }
  }, [])

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

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLDivElement>,
    source: string
  ): void => {
    const inputElement = e.target as HTMLInputElement
    const value = inputElement.value
    setValue(source, value)
  }

  return (
    <>
      <AutocompleteInput
        TextFieldProps={{ ref: mediaTypeRef }}
        disabled={disabled}
        source='mediaType'
        choices={mediaTypes
          .filter((item: MediaType) => item.active)
          .sort((a, b) => a.id - b.id)}
        sx={sx}
      />
      <FlexBox alignItems='flex-start'>
        <TextInput
          multiline
          disabled={disabled}
          label='Consec/Sheets'
          source='consecSheets'
          sx={sx}
        />
        <Card sx={{ ...sx, margin: '8px 0 20px' }}>
          {!(disabled === true) && (
            <CardContent sx={{ padding: '12px !important' }}>
              Consec/Sheets should contain one of the following:
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
        isRemarksOpen={isRemarksOpen}
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
          onKeyUp={(e) => {
            handleKeyUp(e, 'startDate')
          }}
        />
        <DateTimeInput
          InputProps={{ ref: dateRef }}
          sx={sx}
          disabled={disabled}
          source='endDate'
          variant='outlined'
          label='End'
          onKeyUp={(e) => {
            handleKeyUp(e, 'endDate')
          }}
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
              <TextField<Item> source='createdAt' />
            </ValueField>
            <div>
              {'Batch: '}
              <SourceField<Item>
                link='show'
                source='batch'
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
