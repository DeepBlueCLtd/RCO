import React, { useState } from 'react'
import FlexBox from '../../components/FlexBox'
import { Box } from '@mui/system'
import ItemList from '../items/ItemList'
import {
  BooleanInput,
  SimpleForm,
  TextInput,
  useGetList,
  useShowContext,
  useUpdate
} from 'react-admin'
import { Chip, Typography, Button, Modal } from '@mui/material'
import { decryptPassword } from '../../utils/encryption'
import { R_ITEMS, R_USERS } from '../../constants'
import { nowDate } from '../../providers/dataProvider/dataprovider-utils'
import useCanAccess from '../../hooks/useCanAccess'
import { Warning } from '@mui/icons-material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

interface Props {
  handleClose: () => void
  record?: User & { salt: string }
}

const DepartOrganisation = ({
  handleClose,
  record
}: Props): React.ReactElement => {
  const [update] = useUpdate()

  const handleDepartUser = (): void => {
    update(R_USERS, {
      id: record?.id,
      previousData: record,
      data: { active: false, departedDate: nowDate() }
    }).catch(console.log)
    handleClose()
  }
  return (
    <Box sx={style}>
      <Typography variant='h6'>
        Are you sure this user is departing the organisation? Doing this will
        prevent items from being loaned to the user
      </Typography>
      <FlexBox marginTop='20px' justifyContent='center'>
        <Button variant='contained' onClick={handleDepartUser}>
          Confirm
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
      </FlexBox>
    </Box>
  )
}

export default function UserShow(): React.ReactElement {
  const { record } = useShowContext<User & { salt: string }>()
  const loanedHistory = 'Loaned Items'
  const viewUser = 'View User'
  const { hasAccess } = useCanAccess()
  const [departOpen, setDepartOpen] = useState(false)

  const hasWriteAccess = hasAccess(R_USERS, { write: true })

  const loanedItems = useGetList<Item>(R_ITEMS, {
    sort: { field: 'id', order: 'ASC' },
    pagination: { page: 1, perPage: 10 },
    filter: { loanedTo: record?.id }
  })

  const handleDepartUser = (): void => {
    setDepartOpen(true)
  }

  const handleDepartClose = (): void => {
    setDepartOpen(false)
  }

  const cannotDepart = (): boolean => {
    return (
      (loanedItems.data !== undefined && loanedItems.data?.length > 0) ||
      record?.active === false ||
      !hasWriteAccess
    )
  }

  return (
    <>
      <FlexBox>
        <Box component='fieldset' style={{ width: '550px', padding: '0 15px' }}>
          <legend>
            <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
              {viewUser}
            </Typography>
          </legend>
          <SimpleForm toolbar={false}>
            <TextInput
              disabled
              source='name'
              variant='outlined'
              sx={{ width: '100%' }}
            />
            <TextInput
              disabled
              source='password'
              variant='outlined'
              sx={{ width: '100%' }}
              format={(password) =>
                record !== undefined && decryptPassword(password, record.salt)
              }
            />
            <FlexBox>
              {record?.roles.map((r, index) => (
                <Chip label={r} key={index} />
              ))}
              <TextInput
                disabled
                source='staffNumber'
                label='Staff number'
                sx={{ flex: 1 }}
              />
            </FlexBox>
            <FlexBox>
              <BooleanInput disabled source='adminRights' />
              <BooleanInput disabled source='active' />
            </FlexBox>
            <FlexBox justifyContent='center'>
              <Button
                variant='outlined'
                sx={{ marginBottom: 1 }}
                disabled={cannotDepart()}
                onClick={handleDepartUser}>
                Depart Organisation
              </Button>
              {loanedItems.data !== undefined &&
                loanedItems.data?.length > 0 && (
                  <>
                    <Warning sx={{ color: 'red' }} />
                    <Typography variant='subtitle1' sx={{ color: 'red' }}>
                      User still has items loaned
                    </Typography>
                  </>
                )}
            </FlexBox>
          </SimpleForm>
        </Box>
        <Box component='fieldset' style={{ padding: '0 15px' }}>
          <legend>
            <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
              {loanedHistory}
            </Typography>
          </legend>
          <ItemList filter={{ loanedTo: record?.id }} />
        </Box>
      </FlexBox>

      <Modal open={departOpen} onClose={handleDepartClose}>
        <DepartOrganisation handleClose={handleDepartClose} record={record} />
      </Modal>
    </>
  )
}