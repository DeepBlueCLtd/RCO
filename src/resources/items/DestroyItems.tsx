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
import {
  addItemsToDestruction,
  type AuditFunction,
  type NotifyFunction,
  type DataProvider
} from './item-operations'

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
    // note: we need to provide `undefined` for mock backend, and `null`
    // for SQLite
    const nullFilter = process.env.MOCK ? 'null' : null
    dataProvider
      .getList<Destruction>(constants.R_DESTRUCTION, {
        filter: { finalisedAt: nullFilter },
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

  const onAddToDestroy = async (): Promise<void> => {
    if (typeof destructionId !== 'undefined') {
      const { id: destructionJobId } = items.find(
        (job) => job.id === parseInt(destructionId as string)
      ) ?? { name: undefined }

      if (destructionJobId) {
        await addItemsToDestruction(
          data,
          ids,
          destructionJobId,
          dataProvider as DataProvider,
          audit as AuditFunction,
          notify as NotifyFunction
        )
        successCallback()
      }
    }
  }
  const label = 'Destructions'

  if (typeof loading === 'boolean' && loading) return <></>

  return (
    <Box sx={style}>
      <Typography variant='h6'>
        {ids.length} items added to Destruction
      </Typography>
      <Box>
        {items.length === 0 ? (
          <Typography marginY={3}>
            Please create the destruction before destroying items
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
                  {item.name} ({item.remarks})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
      <FlexBox>
        <Button
          disabled={items.length === 0}
          onClick={onAddToDestroy as any}
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
