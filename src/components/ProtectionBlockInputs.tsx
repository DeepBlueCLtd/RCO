import FlexBox from './FlexBox'
import * as constants from '../constants'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import SourceInput from './SourceInput'
import ProtectionRefInput from './ProtectionRefInput'
import { useDataProvider, type RaRecord } from 'react-admin'
import { useFormContext } from 'react-hook-form'
import { useConfigData } from '../utils/useConfigData'
import { useEffect } from 'react'
interface Props {
  disabled?: boolean
  markingSource: string
  isEdit?: boolean
  id?: number
  resource: string
  refTables: Record<'catCave' | 'catCode' | 'catHandle', string>
}

export default function ProtectionBlockInputs<
  TCatCode extends RaRecord,
  TCatCave extends RaRecord,
  TCatHandle extends RaRecord
>(props: Props): React.ReactElement {
  const { disabled, markingSource, isEdit, id, refTables } = props
  const { setValue, watch, getValues } = useFormContext()
  const dataProvider = useDataProvider()
  const configDate = useConfigData()

  const inputProps = { disabled }

  const protectionInputProps = {
    ...inputProps,
    multiple: true
  }

  const setIsDirty = (source: string, value = ''): void => {
    setValue(source, value, {
      shouldDirty: true
    })
  }

  const setProtectiveMarking = (id: number): void => {
    if (!id) return
    dataProvider
      .getOne(constants.R_PROTECTIVE_MARKING, { id })
      .then(({ data: pMarking }) => {
        setValue('pMarking', pMarking.name)
      })
      .catch(console.error)
  }

  watch((data, { name }): void => {
    if (name === 'protectiveMarking') {
      setProtectiveMarking(data.protectiveMarking)
    }
  })

  useEffect(() => {
    setProtectiveMarking(getValues('protectiveMarking'))
  }, [])

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
          {configDate?.protectionName}
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
          label={configDate?.cat_code ?? 'Cat code'}
          {...protectionInputProps}
          width='20%'
        />
        <SourceInput
          source={markingSource}
          filter={isEdit === true ? {} : { active: true }}
          reference={constants.R_PROTECTIVE_MARKING}
          inputProps={{ ...inputProps, sx: { width: '20%' } }}
        />
        <ProtectionRefInput<CatHandle, TCatHandle>
          setIsDirty={setIsDirty}
          reference={constants.R_CAT_HANDLING}
          refTable={refTables.catHandle}
          source='catHandling'
          itemId={id}
          label={configDate?.cat_handle ?? 'Cat handling'}
          labelField='name'
          {...protectionInputProps}
          width='30%'
        />
        <ProtectionRefInput<CatCave, TCatCave>
          setIsDirty={setIsDirty}
          reference={constants.R_CAT_CAVE}
          refTable={refTables.catCave}
          source='catCave'
          labelField='name'
          itemId={id}
          label={configDate?.cat_cave ?? 'Cat cave'}
          {...protectionInputProps}
          width='30%'
        />
      </FlexBox>
    </Box>
  )
}
