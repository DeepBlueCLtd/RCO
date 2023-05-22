import React, { useState } from 'react'
import {
  Button,
  DateField,
  Show,
  SimpleShowLayout,
  TextField,
  useRecordContext,
  useUpdate,
  useGetIdentity
} from 'react-admin'
import { Box, Typography } from '@mui/material'
import FlexBox from '../../components/FlexBox'
import * as constants from '../../constants'
import { nowDate } from '../../providers/dataProvider/dataprovider-utils'
import DestructionReport from './DestructionReport'

const Finalised = (): React.ReactElement => {
  const { finalisedAt } = useRecordContext<Destruction>()

  const label = typeof finalisedAt !== 'undefined' ? 'Finlised' : 'Pending'

  return <Typography variant='body2'>{label}</Typography>
}

interface FooterProps {
  handleOpen: (open: boolean) => void
  destroy: (updateData: any) => Promise<void>
}

const Footer = (props: FooterProps): React.ReactElement => {
  const record = useRecordContext()
  const { data } = useGetIdentity()
  const { handleOpen, destroy } = props

  return (
    <FlexBox justifyContent='end' padding={2}>
      <Button
        variant='outlined'
        label='Report'
        onClick={() => { handleOpen(true) }}
      />
      <Button
        variant='contained'
        label='Destroy'
        onClick={() =>
          destroy({
            id: record.id,
            data: {
              finalisedBy: data?.id,
              finalisedAt: nowDate()
            }
          }) as any
        }
      />
    </FlexBox>
  )
}

export default function DestructionShow(): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false)
  const [update] = useUpdate()

  const handleOpen = (open: boolean): void => {
    setOpen(open)
  }

  const destroy = async (updateData: any): Promise<void> => {
    await update(constants.R_DESTRUCTION, updateData)
  }

  return (
    <Box>
      <DestructionReport open={open} handleOpen={handleOpen} />
      <Show>
        <SimpleShowLayout>
          <TextField source='reference' />
          <DateField source='finalisedAt' />
          <Finalised />
          <TextField source='remarks' />
        </SimpleShowLayout>
        <Footer handleOpen={handleOpen} destroy={destroy} />
      </Show>
    </Box>
  )
}
