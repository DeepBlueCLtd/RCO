import { Box, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { Form, type Identifier, SelectInput, useDataProvider } from 'react-admin'
import FlexBox from '../../../components/FlexBox'

interface ChangeLocationProps {
  ids: Identifier[]
  onCancel?: () => void
  successCallback?: (data?: any) => void
  errorCallback?: (data?: any) => void
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

interface FormState {
  vaultLocation: number
}

export default function ChangeLocation(props: ChangeLocationProps) {
  const { ids, onCancel, successCallback, errorCallback } = props

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty }
  } = useForm<FormState>()

  const vaultLocationValue = watch('vaultLocation')

  const [vaultLocation, setVaultLocation] = useState<ReferenceItem[]>([])
  const dataProvider = useDataProvider()

  async function onSubmit(values: FormState) {
    try {
      const { data } = await dataProvider.updateMany<Item>('items', {
        ids,
        data: values
      })
      successCallback?.(data)
    } catch (error) {
      errorCallback?.(error)
    }
  }

  useEffect(() => {
    dataProvider
      .getList<ReferenceItem>('vaultLocation', {
        sort: { field: 'id', order: 'ASC' },
        pagination: { page: 1, perPage: 1000 },
        filter: {}
      })
      .then(({ data }) => {
        setVaultLocation(data)
      })
      .catch(console.log)
  }, [])

  return (
    <Box sx={style}>
      <Form>
        <Controller
          control={control}
          name='vaultLocation'
          render={({ field: { onChange, value } }) => (
            <SelectInput
              value={value}
              onChange={(event) => {
                onChange(event.target.value)
              }}
              sx={{ width: '100%' }}
              source='vaultLocation'
              choices={vaultLocation}
            />
          )}
        />
        <FlexBox>
          <Button
            variant='contained'
            disabled={!isDirty || typeof vaultLocationValue !== 'number'}
            onClick={handleSubmit(onSubmit) as any}>
            Submit
          </Button>
          <Button color='secondary' variant='outlined' onClick={onCancel}>
            Cancel
          </Button>
        </FlexBox>
      </Form>
    </Box>
  )
}
