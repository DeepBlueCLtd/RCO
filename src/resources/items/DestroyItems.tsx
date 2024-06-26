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
      const itemsAdded = data
        .filter(({ loanedDate, loanedTo, destructionDate, id }) => {
          return (
            ids.includes(id) &&
            (loanedTo === null || typeof loanedTo === 'undefined') &&
            (loanedDate === null || typeof loanedDate === 'undefined') &&
            (destructionDate === null || typeof destructionDate === 'undefined')
          )
        })
        .map(async (item) => {
          const audiData = {
            activityType: AuditType.EDIT,
            activityDetail: 'Item added to destruction',
            securityRelated: false,
            resource: constants.R_ITEMS,
            dataId: item.id,
            subjectId: destructionJobId as number,
            subjectResource: constants.R_DESTRUCTION
          }
          await audit(audiData)
          await audit({
            ...audiData,
            resource: constants.R_DESTRUCTION,
            dataId: destructionJobId as number,
            subjectId: item.id,
            subjectResource: constants.R_ITEMS
          })

          return item.id
        })

      await dataProvider.updateMany<Item>(constants.R_ITEMS, {
        ids: await Promise.all(itemsAdded),
        data: {
          destruction: Number(destructionId)
        }
      })

      notify(`${ids.length} items marked for destruction`, { type: 'success' })
      successCallback()
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
