import React from 'react'
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
import { Chip, Typography, Button } from '@mui/material'
import { decryptPassword } from '../../utils/encryption'
import { R_ITEMS, R_USERS } from '../../constants'
import { nowDate } from '../../providers/dataProvider/dataprovider-utils'
import useCanAccess from '../../hooks/useCanAccess'

export default function UserShow(): React.ReactElement {
  const { record } = useShowContext<User & { salt: string }>()
  const loanedHistory = 'Loaned Items'
  const viewUser = 'View User'
  const [update] = useUpdate()
  const { hasAccess } = useCanAccess()

  const hasWriteAccess = hasAccess(R_USERS, { write: true })

  const loanedItems = useGetList<Item>(R_ITEMS, {
    sort: { field: 'id', order: 'ASC' },
    pagination: { page: 1, perPage: 10 },
    filter: { loanedTo: record?.id }
  })

  const handleDepartUser = (): void => {
    update(R_USERS, {
      id: record?.id,
      previousData: record,
      data: { active: false, departedDate: nowDate() }
    }).catch(console.log)
  }

  return (
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
          <Button
            variant='outlined'
            sx={{ marginBottom: 1 }}
            disabled={
              (loanedItems.data !== undefined &&
                loanedItems.data?.length > 0) ||
              record?.active === false ||
              !hasWriteAccess
            }
            onClick={handleDepartUser}>
            Depart Organisation
          </Button>
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
  )
}
