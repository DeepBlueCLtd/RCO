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

interface Props {
  onClose: () => void
  successCallback: () => void
  ids: number[]
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
  const { onClose, successCallback, ids } = props

  const [loading, setLoading] = useState(false)

  const datProvider = useDataProvider()
  const [items, setItems] = useState<Destruction[]>([])

  const notify = useNotify()
  const [destructionId, setDestructionId] = useState<number | string>()

  useEffect(() => {
    setLoading(true)
    datProvider
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

  const onDestroy = (): void => {
    if (typeof destructionId !== 'undefined') {
      datProvider
        .updateMany<Item>(constants.R_ITEMS, {
          ids,
          data: {
            destruction: Number(destructionId),
            destructionDate: new Date().toISOString()
          }
        })
        .then(() => {
          notify(`${ids.length} items destroyed!` )
          successCallback()
        })
        .catch(console.log)
    }
  }
  const label = 'Destructions'

  if (loading) return <></>

  return (
    <Box sx={style}>
      <Typography variant='h6'>Destroy {ids.length} items:</Typography>
      <Box>
        <FormControl sx={{ width: '100%', margin: '25px 0' }}>
          <InputLabel>{label}</InputLabel>
          <Select
            value={String(destructionId)}
            onChange={(event) => { setDestructionId(event.target.value) }}
            label={label}>
            {items.map((item) => (
              <MenuItem key={item.id} value={String(item.id)}>
                {item.reference}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <FlexBox>
        <Button onClick={onDestroy} variant='contained'>
          Destroy
        </Button>
        <Button onClick={onClose} variant='outlined'>
          Cancel
        </Button>
      </FlexBox>
    </Box>
  )
}
