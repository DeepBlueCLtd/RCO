import FlexBox from './FlexBox'
import * as constants from '../constants'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import SourceInput from './SourceInput'
import { AutocompleteArrayInput, ReferenceArrayInput } from 'react-admin'

interface Props {
  disabled?: boolean
  markingSource: string
}

export default function ProtectionBlockInputs(
  props: Props
): React.ReactElement {
  const { disabled, markingSource } = props

  const inputProps = { disabled }

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
      <FlexBox>
        <SourceInput
          source='catCode'
          reference={constants.R_CAT_CODE}
          inputProps={inputProps}
        />
        <SourceInput
          source={markingSource}
          reference={constants.R_PROTECTIVE_MARKING}
          inputProps={inputProps}
        />
        <SourceInput
          source='catHandling'
          reference={constants.R_CAT_HANDLING}
          inputProps={inputProps}
        />
        <ReferenceArrayInput source='catCave' reference={constants.R_CAT_CAVE}>
          <AutocompleteArrayInput
            sx={{ width: '100%' }}
            optionText={(item: ReferenceItem) => item.name}
            {...inputProps}
          />
        </ReferenceArrayInput>
      </FlexBox>
    </Box>
  )
}
