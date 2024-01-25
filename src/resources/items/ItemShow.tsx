import React, { useEffect, useState } from 'react'
import {
  DateInput,
  DateTimeInput,
  EditButton,
  Form,
  FunctionField,
  Link,
  Loading,
  Show,
  TextInput,
  TopToolbar,
  useGetList,
  useRedirect,
  useShowContext
} from 'react-admin'
import * as constants from '../../constants'
import TopToolbarField, { sx as SX } from '../../components/TopToolbarField'
import { Box, Typography, type Theme } from '@mui/material'
import useCanAccess from '../../hooks/useCanAccess'
import SourceField from '../../components/SourceField'
import { type SystemStyleObject } from '@mui/system'
import ProtectionBlockInputs from '../../components/ProtectionBlockInputs'
import FlexBox from '../../components/FlexBox'
import SourceInput from '../../components/SourceInput'
import HistoryButton from '../../components/HistoryButton'
import ItemHistory from './ItemHistory'

interface ShowFormProps {
  setRecord: React.Dispatch<React.SetStateAction<Item | undefined>>
}

const ShowForm = ({ setRecord }: ShowFormProps): React.ReactElement => {
  const { record, isLoading } = useShowContext<Item>()

  useEffect(() => {
    if (!isLoading) setRecord(record)
  }, [isLoading])

  if (isLoading !== undefined && isLoading) return <Loading />

  const pageTitle = 'View Item'

  return (
    <Box sx={{ padding: '10px', flex: 2 }}>
      <Typography variant='h5' fontWeight='bold' sx={{ padding: '15px' }}>
        <constants.ICON_ITEM /> {pageTitle}
      </Typography>
      <Form>
        <Details />
        <Location />
        <ProtectionBlockInputs
          disabled={true}
          markingSource='protectiveMarking'
          refTables={{
            catCave: constants.R_ITEMS_CAVE,
            catCode: constants.R_ITEMS_CODE,
            catHandle: constants.R_ITEMS_HANDLE
          }}
          resource={constants.R_ITEMS}
          show
        />
        <FlexBox>
          <Remarks />
          <Media />
        </FlexBox>
        <Created />
      </Form>
    </Box>
  )
}

const Details = (): React.ReactElement => {
  const sx = {
    width: '100%'
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
          Details
        </Typography>
      </legend>
      <FlexBox>
        <TextInput
          label='Consec/Sheets'
          source='consecSheets'
          sx={sx}
          disabled
        />
        <DateTimeInput source='startDate' label='Start' sx={sx} disabled />
        <DateTimeInput source='endDate' label='End' sx={sx} disabled />
      </FlexBox>
    </Box>
  )
}

const Location = (): React.ReactElement => {
  const sx = {
    width: '100%'
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
          Location
        </Typography>
      </legend>
      <FlexBox>
        <SourceInput
          source='vaultLocation'
          reference={constants.R_VAULT_LOCATION}
          label='Vault location'
          inputProps={{ sx, disabled: true }}
        />
        <TextInput
          label='Muster remarks'
          source='musterRemarks'
          sx={sx}
          disabled
        />
      </FlexBox>
    </Box>
  )
}

const Media = (): React.ReactElement => {
  const sx = {
    width: '100%'
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
          Media
        </Typography>
      </legend>
      <FlexBox>
        <SourceInput
          source='mediaType'
          reference={constants.R_MEDIA_TYPE}
          inputProps={{ sx, disabled: true }}
        />
        <SourceInput
          source='legacyMediaType'
          label='Legacy Media Type'
          reference={constants.R_MEDIA_TYPE}
          inputProps={{ sx, disabled: true }}
        />
      </FlexBox>
    </Box>
  )
}

const Remarks = (): React.ReactElement => {
  const sx = {
    width: '100%'
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
          Remarks
        </Typography>
      </legend>
      <FlexBox>
        <TextInput multiline source='remarks' sx={sx} disabled />
      </FlexBox>
    </Box>
  )
}

const Created = (): React.ReactElement => {
  const sx = {
    width: '100%'
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
          Created
        </Typography>
      </legend>
      <FlexBox>
        <DateInput source='createdAt' sx={sx} disabled />
        <SourceInput
          source='createdBy'
          reference={constants.R_USERS}
          inputProps={{ sx, disabled: true }}
        />
      </FlexBox>
    </Box>
  )
}

const sx = (theme: Theme): SystemStyleObject<Theme> => {
  const color = theme.palette.primary.main
  return {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    background: 'white',
    justifyContent: 'center',
    color,
    borderRadius: '5px',
    border: '2px solid'
  }
}
interface StatusTextProps {
  record: Item
}

interface ActionLinkProps {
  actionText: string
  linkPathname: string
  text: string | null
}

const ActionLink = ({
  actionText,
  linkPathname,
  text
}: ActionLinkProps): React.ReactElement => {
  return (
    <Typography sx={sx} variant='h5'>
      {actionText}
      <Link to={{ pathname: linkPathname }}>
        <span style={{ textDecoration: 'underline', marginLeft: '5px' }}>
          {text}
        </span>
      </Link>
    </Typography>
  )
}

const StatusText = ({ record }: StatusTextProps): React.ReactElement | null => {
  let linkPathname = ''
  let statusText = ''
  let source: keyof Item
  let component: React.ReactElement | null = null
  if (record.destruction !== undefined && record.destruction !== null) {
    linkPathname = `/destruction/${record.destruction}/show`
    source = 'destruction'
    const actionText =
      record.destructionDate !== undefined && record.destructionDate !== null
        ? 'Destroyed at:'
        : 'Pending'
    const dateText =
      record.destructionDate !== undefined && record.destructionDate !== null
        ? record.destructionDate
        : 'Destruction'
    component = (
      <ActionLink
        actionText={actionText}
        linkPathname={linkPathname}
        text={dateText}
      />
    )
  } else if (record.dispatchJob !== undefined && record.dispatchJob !== null) {
    linkPathname = `/dispatch/${record.dispatchJob}/show`
    source = 'dispatchJob'
    const actionText =
      record.dispatchedDate !== undefined && record.dispatchedDate !== null
        ? 'Dispatched at:'
        : 'Pending'
    const dateText =
      record.dispatchedDate !== undefined && record.dispatchedDate !== null
        ? record.dispatchedDate
        : 'Dispatch'
    component = (
      <ActionLink
        actionText={actionText}
        linkPathname={linkPathname}
        text={dateText}
      />
    )
  } else if (record.loanedTo !== undefined && record.loanedTo !== null) {
    source = 'loanedTo'
    statusText = 'Loaned to: '
  } else {
    return null
  }

  return (
    <TopToolbarField<Item> source={source} component='div'>
      {source === 'loanedTo' ? (
        <Typography sx={sx} variant='h5'>
          {statusText}
          <SourceField<Item>
            link='show'
            source={source}
            reference={constants.R_USERS}
            sourceField={source}
            textProps={{
              sx: {
                fontSize: '20px',
                textDecoration: 'underline',
                fontWeight: 'bold',
                marginLeft: '5px'
              }
            }}
          />
        </Typography>
      ) : (
        component
      )}
    </TopToolbarField>
  )
}

interface ItemShowProps {
  record: Item
}

const ItemShowActions = ({ record }: ItemShowProps): React.ReactElement => {
  const redirect = useRedirect()
  const { hasAccess } = useCanAccess()
  const { data: richItemRecord } = useGetList<RichItem>(
    constants.R_RICH_ITEMS,
    {
      filter: { id: record.id },
      pagination: { perPage: 1, page: 1 }
    }
  )

  return (
    <TopToolbar sx={{ alignItems: 'center' }}>
      <TopToolbarField<Item> source='itemNumber'>
        <FunctionField<RichItem>
          sx={SX}
          render={() =>
            `${
              richItemRecord?.[0]?.vault
                ? `${richItemRecord?.[0]?.vault?.[0]}`
                : ''
            }${richItemRecord?.[0]?.itemNumber}`
          }
        />
      </TopToolbarField>
      <StatusText record={record} />
      {hasAccess(constants.R_ITEMS, { write: true }) && (
        <EditButton to={`/${constants.R_RICH_ITEMS}/${record.id}`} />
      )}
      <HistoryButton
        onClick={() => {
          redirect(
            `/audit?filter=${JSON.stringify({
              dataId: record.id,
              resource: constants.R_ITEMS
            })}`
          )
        }}
      />
    </TopToolbar>
  )
}

export default function ItemShow(): React.ReactElement {
  const [record, setRecord] = useState<Item | undefined>()

  return (
    <Show
      resource={constants.R_ITEMS}
      actions={record !== undefined && <ItemShowActions record={record} />}>
      <FlexBox columnGap={0} padding='10px' alignItems='start'>
        <ShowForm setRecord={setRecord} />
        <ItemHistory />
      </FlexBox>
    </Show>
  )
}
