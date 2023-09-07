import FlexBox from './FlexBox'
import * as constants from '../constants'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import SourceInput from './SourceInput'
import ProtectionRefInput from './ProtectionRefInput'
import { type RaRecord } from 'react-admin'
import { useFormContext } from 'react-hook-form'
import { useConfigData } from '../utils/useConfigData'
import { useEffect, useState } from 'react'

interface Props {
  disabled?: boolean
  markingSource: string
  isEdit?: boolean
  id?: number
  resource: string
  refTables: Record<'catCave' | 'catCode' | 'catHandle', string>
  isRemarksOpen?: boolean
}

export default function ProtectionBlockInputs<
  TCatCode extends RaRecord,
  TCatCave extends RaRecord,
  TCatHandle extends RaRecord
>(props: Props): React.ReactElement {
  const { disabled, markingSource, isEdit, id, refTables, isRemarksOpen } =
    props
  const { setValue } = useFormContext()
  const configData = useConfigData()
  const [codeChanges, setCodeChanges] = useState<string[] | undefined>()
  const [caveChanges, setCaveChanges] = useState<string[] | undefined>()
  const [handleChanges, setHandleChanges] = useState<string[] | undefined>()
  const inputProps = { disabled }

  const protectionInputProps = {
    ...inputProps,
    multiple: true,
    isRemarksOpen
  }

  const setIsDirty = (source: string, value = ''): void => {
    setValue(source, value, {
      shouldDirty: true
    })
  }

  const formatChanges = (changes: string[] | undefined): string => {
    if (Array.isArray(changes)) {
      if (changes.length > 0) {
        return changes.join(' ')
      } else {
        return 'unset'
      }
    }
    return ''
  }

  const setPrevValues = (): void => {
    const isChanged =
      typeof codeChanges !== 'undefined' ||
      typeof caveChanges !== 'undefined' ||
      typeof handleChanges !== 'undefined'

    if (isChanged) {
      const detailData: Record<string, string> = {}
      const details: Record<string, string> = {
        catCode: formatChanges(codeChanges),
        catCave: formatChanges(caveChanges),
        catHandle: formatChanges(handleChanges)
      }
      Object.keys(details).forEach((keyName) => {
        if (details[keyName]?.length > 0) {
          detailData[keyName] = details[keyName]
        }
      })
      setValue('prevProtectionValues', detailData)
    }
  }

  useEffect(() => {
    setPrevValues()
  }, [codeChanges, caveChanges, handleChanges])

  return (
    <Box
      component='fieldset'
      style={{
        width: '100%',
        padding: '0 15px',
        borderRadius: 16,
        margin: '20px 0'
      }}>
      <legend>
        <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
          {configData?.protectionName}
        </Typography>
      </legend>
      <FlexBox alignItems={'start'}>
        <ProtectionRefInput<CatCode, TCatCode>
          setIsDirty={setIsDirty}
          reference={constants.R_CAT_CODE}
          refTable={refTables.catCode}
          labelField='name'
          source='catCode'
          itemId={id}
          label={configData?.catCode ?? 'Cat code'}
          {...protectionInputProps}
          width='20%'
          onValueChange={setCodeChanges}
        />
        <SourceInput
          source={markingSource}
          filter={isEdit === true ? {} : { active: true }}
          reference={constants.R_PROTECTIVE_MARKING}
          inputProps={{ ...inputProps, sx: { width: '20%' } }}
        />
        <ProtectionRefInput<CatHandle, TCatHandle>
          setIsDirty={setIsDirty}
          reference={constants.R_CAT_HANDLE}
          refTable={refTables.catHandle}
          source='catHandle'
          itemId={id}
          label={configData?.catHandle ?? 'Cat handle'}
          labelField='name'
          {...protectionInputProps}
          width='30%'
          onValueChange={setHandleChanges}
        />
        <ProtectionRefInput<CatCave, TCatCave>
          setIsDirty={setIsDirty}
          reference={constants.R_CAT_CAVE}
          refTable={refTables.catCave}
          source='catCave'
          labelField='name'
          itemId={id}
          label={configData?.catCave ?? 'Cat cave'}
          {...protectionInputProps}
          width='30%'
          onValueChange={setCaveChanges}
        />
      </FlexBox>
    </Box>
  )
}
