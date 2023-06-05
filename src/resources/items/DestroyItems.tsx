import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material'
import FlexBox from '../../components/FlexBox'
import { useDataProvider, useNotify } from 'react-admin'
import * as constants from '../../constants'
import React, { useEffect, useState } from 'react'
import { AuditType } from '../../utils/activity-types'
import useAudit from '../../hooks/useAudit'

interface Props {
  onClose: () => void
  successCallback: () => void
  ids: number[]
  data: Item[]
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

export default function DestroyItems(props: Props): React.ReactElement {
  const { onClose, successCallback, ids, data } = props

  const dataProvider = useDataProvider()
  const notify = useNotify()

  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<Destruction[]>([])
  const audit = useAudit()

  const [destructionId, setDestructionId] = useState<number | string>()

  useEffect(() => {
    setLoading(true)
    dataProvider
      .getList<Destruction>(constants.R_DESTRUCTION, {
        filter: { finalisedAt: undefined },
        sort: { field: 'id', order: 'ASC' },
        pagination: {
          page: 1,
          perPage: 1000
        }
      })
      .then(({ data }) => {
        setDestructionId(String(data[0]?.id))
        setItems(data)
      })
      .catch(console.log)
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const onDestroy = async (): Promise<void> => {
    if (typeof destructionId !== 'undefined') {
      const items = data
        .filter(({ loanedDate, loanedTo, destructionDate, id }) => {
          return (
            ids.includes(id) &&
            typeof loanedTo === 'undefined' &&
            typeof loanedDate === 'undefined' &&
            typeof destructionDate === 'undefined'
          )
        })
        .map(async (item) => {
          const audiData = {
            type: AuditType.EDIT,
            activityDetail: 'add item to destruction',
            securityRelated: false,
            resource: constants.R_ITEMS,
            dataId: item.id
          }
          await audit(audiData)
          await audit({
            ...audiData,
            resource: constants.R_DESTRUCTION
          })

          return item.id
        })

      await dataProvider.updateMany<Item>(constants.R_ITEMS, {
        ids: await Promise.all(items),
        data: {
          destruction: Number(destructionId)
        }
      })

      const notDestroyedItems = ids.length - items.length

      notify(
        <Alert
          variant='filled'
          icon={false}
          severity={items.length === 0 ? 'info' : 'success'}>
          <Typography variant='body1'>
            {items.length} items destroyed!
          </Typography>
          {notDestroyedItems !== 0 && (
            <Typography variant='body1'>
              {notDestroyedItems} items not destroyed!
            </Typography>
          )}
        </Alert>
      )
      successCallback()
    }
  }
  const label = 'Destruction Jobs'

  if (typeof loading === 'boolean' && loading) return <></>

  return (
    <Box sx={style}>
      <Typography variant='h6'>
        {ids.length} items added to Destruction Job
      </Typography>
      <Box>
        {items.length === 0 ? (
          <Typography marginY={3}>
            Please create the destruction job before destroying items
          </Typography>
        ) : (
          <FormControl sx={{ width: '100%', margin: '25px 0' }}>
            <InputLabel>{label}</InputLabel>
            <Select
              value={String(destructionId)}
              onChange={(event) => {
                setDestructionId(event.target.value)
              }}
              label={label}>
              {items.map((item) => (
                <MenuItem key={item.id} value={String(item.id)}>
                  {item.reference}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
      <FlexBox>
        <Button
          disabled={items.length === 0}
          onClick={onDestroy as any}
          variant='contained'>
          Destroy
        </Button>
        <Button onClick={onClose} variant='outlined'>
          Cancel
        </Button>
      </FlexBox>
    </Box>
  )
}
