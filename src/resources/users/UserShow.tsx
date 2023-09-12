import React, { useEffect, useState } from 'react'
import FlexBox from '../../components/FlexBox'
import { Box } from '@mui/system'
import ItemList, { BulkActions } from '../items/ItemList'
import {
  BooleanInput,
  DatagridConfigurable,
  type DatagridConfigurableProps,
  EditButton,
  Loading,
  Show,
  SimpleForm,
  TextField,
  TextInput,
  TopToolbar,
  useGetList,
  useShowContext,
  useUpdate
} from 'react-admin'
import { Chip, Typography, Button, Modal } from '@mui/material'
import { R_AUDIT, R_ITEMS, R_USERS } from '../../constants'
import { nowDate } from '../../providers/dataProvider/dataprovider-utils'
import useCanAccess from '../../hooks/useCanAccess'
import { Warning } from '@mui/icons-material'
import ResourceHistoryModal from '../../components/ResourceHistory'
import * as constants from '../../constants'
import { useParams } from 'react-router-dom'
import SourceField from '../../components/SourceField'
import HistoryButton from '../../components/HistoryButton'

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
  record?: User
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

interface UserShowCompType {
  setRecord: React.Dispatch<React.SetStateAction<User | undefined>>
}

const UserShowComp = ({ setRecord }: UserShowCompType): React.ReactElement => {
  const { record, isLoading } = useShowContext<User>()
  const [departOpen, setDepartOpen] = useState(false)
  const loanedHistory = 'Loaned Items'
  const viewUser = 'View User'
  const loanedItems = useGetList<Item>(R_ITEMS, {
    sort: { field: 'id', order: 'ASC' },
    pagination: { page: 1, perPage: 10 },
    filter: { loanedTo: record?.id }
  })
  const { hasAccess } = useCanAccess()
  const hasWriteAccess = hasAccess(R_USERS, { write: true })
  const { id } = useParams()

  const handleDepartUser = (): void => {
    setDepartOpen(true)
  }

  const handleDepartClose = (): void => {
    setDepartOpen(false)
  }
  const cannotDepart = (): boolean => {
    return (
      (loanedItems.data !== undefined && loanedItems.data?.length > 0) ||
      (record?.active as unknown as number) === 0 ||
      !hasWriteAccess
    )
  }

  useEffect(() => {
    if (!isLoading) setRecord(record)
  }, [isLoading])

  if (isLoading !== undefined && isLoading) return <Loading />

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
            <FlexBox>
              <Chip label={record?.role} />
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
          <ItemList
            storeKey={`${constants.R_USERS}-${id}-items-list`}
            filter={{ loanedTo: record?.id }}>
            <ItemListDataTable
              preferenceKey={`datagrid-${constants.R_USERS}-${id}-items-list`}
            />
          </ItemList>
        </Box>
      </FlexBox>

      <Modal open={departOpen} onClose={handleDepartClose}>
        <DepartOrganisation handleClose={handleDepartClose} record={record} />
      </Modal>
    </>
  )
}

export default function UserShow(): React.ReactElement {
  const [record, setRecord] = useState<User>()

  const { hasAccess } = useCanAccess()
  const [open, setOpen] = useState(false)
  const [filteredData, setFilteredData] = useState<Audit[]>([])
  const hasDeleteAccess = hasAccess(R_USERS, { delete: true })
  const { isLoading, data } = useGetList<Audit>(R_AUDIT, {})

  useEffect(() => {
    if (data != null)
      setFilteredData(
        data.filter((audit) => {
          return (
            audit.user === record?.id ||
            audit.subjectId === record?.id ||
            (audit.dataId === record?.id && audit.resource === R_USERS)
          )
        })
      )
  }, [data, record, isLoading])

  const handleOpen = (open: boolean): void => {
    setOpen(open)
  }

  if (isLoading) return <Loading />

  return (
    <Show
      resource={constants.R_USERS}
      actions={
        hasDeleteAccess && (
          <TopToolbar sx={{ alignItems: 'center' }}>
            <EditButton />
            <HistoryButton
              onClick={() => {
                handleOpen(true)
              }}
            />
          </TopToolbar>
        )
      }>
      <UserShowComp setRecord={setRecord} />
      <ResourceHistoryModal
        // filter={filter}
        open={open}
        data={filteredData}
        close={() => {
          handleOpen(false)
        }}
      />
    </Show>
  )
}

function ItemListDataTable(
  props: DatagridConfigurableProps
): React.ReactElement {
  return (
    <DatagridConfigurable
      bulkActionButtons={<BulkActions />}
      rowClick='show'
      omit={props?.omit}
      preferenceKey={props.preferenceKey}
      {...props}>
      <TextField<Item> source='itemNumber' label='Reference' />
      <SourceField<Item>
        link='show'
        source='mediaType'
        reference={constants.R_MEDIA_TYPE}
        label='Media type'
      />
      <SourceField<Item>
        source='protectiveMarking'
        reference='protectiveMarking'
      />
      <TextField<Item> source='remarks' />
    </DatagridConfigurable>
  )
}
