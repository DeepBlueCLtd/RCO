import {
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
import useAudit from '../../hooks/useAudit'
import { AuditType } from '../../utils/activity-types'

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

export default function DispatchItems(props: Props): React.ReactElement {
  const { onClose, successCallback, ids, data } = props

  const dataProvider = useDataProvider()
  const notify = useNotify()
  const audit = useAudit()

  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<Dispatch[]>([])

  const [dispatchId, setDispatchId] = useState<number | string>()

  useEffect(() => {
    setLoading(true)
    dataProvider
      .getList<Dispatch>(constants.R_DISPATCH, {
        filter: { dispatchedAt: undefined },
        sort: { field: 'id', order: 'ASC' },
        pagination: {
          page: 1,
          perPage: 1000
        }
      })
      .then(({ data }) => {
        setDispatchId(String(data[0]?.id))
        setItems(data)
      })
      .catch(console.log)
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const onDispatch = async (): Promise<void> => {
    const { reference } = items.find(
      (job) => job.id === parseInt(dispatchId as string)
    ) ?? {
      reference: undefined
    }
    if (typeof dispatchId !== 'undefined') {
      const items = data
        .filter(({ id }) => ids.includes(id))
        .map(async (item) => {
          const { item_number: itemNumber } = item
          const audiData = {
            type: AuditType.EDIT,
            activityDetail: `Add item to dispatch ${reference}`,
            securityRelated: false,
            resource: constants.R_ITEMS,
            dataId: item.id
          }
          await audit(audiData)
          await audit({
            ...audiData,
            activityDetail: `Add item ${itemNumber} to dispatch`,
            resource: constants.R_DISPATCH,
            dataId: dispatchId as number
          })
          return item.id
        })

      await dataProvider.updateMany<Item>(constants.R_ITEMS, {
        ids: await Promise.all(items),
        data: {
          dispatchJob: Number(dispatchId)
        }
      })

      notify(`${items.length} items dispatched!`, { type: 'success' })
      successCallback()
    }
  }
  const label = 'Dispatch Jobs'

  if (typeof loading === 'boolean' && loading) return <></>

  return (
    <Box sx={style}>
      <Typography variant='h6'>{ids.length} items added to Dispatch</Typography>
      <Box>
        {items.length === 0 ? (
          <Typography marginY={3}>
            Please create the dispatch job before dispatching items
          </Typography>
        ) : (
          <FormControl sx={{ width: '100%', margin: '25px 0' }}>
            <InputLabel>{label}</InputLabel>
            <Select
              value={String(dispatchId)}
              onChange={(event) => {
                setDispatchId(event.target.value)
              }}
              label={label}>
              {items.map((item) => (
                <MenuItem key={item.id} value={String(item.id)}>
                  {item.reference}-{item.remarks}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
      <FlexBox>
        <Button
          disabled={items.length === 0}
          onClick={onDispatch as any}
          variant='contained'>
          Dispatch
        </Button>
        <Button onClick={onClose} variant='outlined'>
          Cancel
        </Button>
      </FlexBox>
    </Box>
  )
}
