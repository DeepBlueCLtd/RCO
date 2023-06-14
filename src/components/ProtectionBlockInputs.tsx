import { RadioButtonGroupInput, useGetList } from 'react-admin'
import FlexBox from './FlexBox'
import * as constants from '../constants'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'

interface Props {
  disabled?: boolean
}

export default function ProtectionBlockInputs(
  props: Props
): React.ReactElement {
  const { disabled } = props

  const options = {
    filter: { active: true },
    pagination: { page: 1, perPage: 5 }
  }

  const { data: catCodesData = [] } = useGetList(constants.R_CAT_CODE, options)
  const { data: protectiveMarkingData = [] } = useGetList(
    constants.R_PROTECTIVE_MARKING,
    options
  )
  const { data: catHandlingData = [] } = useGetList(
    constants.R_CAT_HANDLING,
    options
  )

  const radioButtonOptions = {
    row: false,
    parse: parseInt,
    disabled
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
      <FlexBox justifyContent={'space-between'}>
        <RadioButtonGroupInput
          source='catCode'
          choices={catCodesData}
          {...radioButtonOptions}
        />
        <RadioButtonGroupInput
          source='protectiveMarking'
          choices={protectiveMarkingData}
          {...radioButtonOptions}
        />
        <RadioButtonGroupInput
          source='catHandling'
          choices={catHandlingData}
          {...radioButtonOptions}
        />
      </FlexBox>
    </Box>
  )
}
