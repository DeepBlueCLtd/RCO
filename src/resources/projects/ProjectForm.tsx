import React from 'react'
import { BooleanInput, DateInput, SimpleForm, TextInput } from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import EditToolBar from '../../components/EditToolBar'
import { Typography } from '@mui/material'
import { ICON_PROJECT } from '../../constants'
import { useConfigData } from '../../utils/useConfigData'
import FlexBox from '../../components/FlexBox'

const schema = yup.object({
  name: yup.string().required('Name is a required field'),
  remarks: yup.string().optional().nullable(),
  startDate: yup.date().required(),
  endDate: yup.date().required()
})

const styles = {
  '& .MuiSwitch-root': {
    display: 'none'
  },
  '& .MuiSwitch-input': {
    display: 'none'
  },
  '.MuiFormHelperText-root': {
    maxWidth: '20px'
  }
}

const helperTextStyles = {
  color: 'rgba(0, 0, 0, 0.6)',
  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
  fontWeight: '400px',
  fontSize: '0.75rem',
  lineHeight: 1.66,
  letterSpacing: '0.03333em',
  maxWidth: '500px'
}

export default function ProjectForm({ isEdit }: FormProps): React.ReactElement {
  const defaultValues = {
    name: '',
    remarks: ''
  }
  const configData = useConfigData()
  const pageTitle =
    isEdit !== undefined
      ? `Edit ${configData?.projectName}`
      : `Add new ${configData?.projectName}`

  return (
    <SimpleForm
      toolbar={<EditToolBar />}
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}>
      <Typography variant='h5' fontWeight='bold'>
        <ICON_PROJECT /> {pageTitle}
      </Typography>
      <TextInput source='name' variant='outlined' sx={{ width: '100%' }} />
      <FlexBox>
        <DateInput
          sx={{ width: '100%' }}
          source='startDate'
          label='Start'
          variant='outlined'
        />
        <DateInput
          sx={{ width: '100%' }}
          source='endDate'
          variant='outlined'
          label='End'
        />
      </FlexBox>
      <TextInput
        source='remarks'
        multiline
        variant='outlined'
        sx={{ width: '100%' }}
      />
      <FlexBox sx={{ alignItems: 'center]' }}>
        <BooleanInput source='enduring' defaultValue={false} />
        <p style={helperTextStyles}>
          This is enduring if it is a placeholder for a task that is conducted
          repeatedly, and will not be re-created each time. If it is enduring it
          should be give start/end dates covering a long period (such as
          2020-2040).
        </p>
      </FlexBox>
      <BooleanInput
        hidden
        source='active'
        defaultValue={true}
        sx={styles}
        label={false}
      />
    </SimpleForm>
  )
}
