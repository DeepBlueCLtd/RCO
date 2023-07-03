import FlexBox from './FlexBox'
import * as constants from '../constants'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import ProtectionRefInput from './ProtectionRefInput'
import { type RaRecord } from 'react-admin'
import { useFormContext } from 'react-hook-form'
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
  TCatHandle extends RaRecord,
  TProtectiveMarking extends RaRecord
>(props: Props): React.ReactElement {
  const { disabled, id, refTables } = props
  const { setValue } = useFormContext()

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
          Protection
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
          label='Cat code'
          {...protectionInputProps}
          width='20%'
        />
        <ProtectionRefInput<ProtectiveMarking, TProtectiveMarking>
          setIsDirty={setIsDirty}
          reference={constants.R_PROTECTIVE_MARKING}
          refTable={refTables.catCode}
          labelField='name'
          source='protectiveMarking'
          itemId={id}
          label='Protective Marking'
          {...protectionInputProps}
          multiple={false}
          width='20%'
        />
        <ProtectionRefInput<CatHandle, TCatHandle>
          setIsDirty={setIsDirty}
          reference={constants.R_CAT_HANDLING}
          refTable={refTables.catHandle}
          source='catHandling'
          itemId={id}
          label='Cat handling'
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
          label='Cat cave'
          {...protectionInputProps}
          width='30%'
        />
      </FlexBox>
    </Box>
  )
}
