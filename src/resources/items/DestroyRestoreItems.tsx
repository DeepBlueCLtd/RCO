import { Box, Button, Typography } from '@mui/material'
import FlexBox from '../../components/FlexBox'
import { useDataProvider, useNotify } from 'react-admin'
import * as constants from '../../constants'
import React from 'react'
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

export default function DestroyRestoreItems(props: Props): React.ReactElement {
  const { onClose, successCallback, ids, data } = props

  const dataProvider = useDataProvider()
  const notify = useNotify()
  const audit = useAudit()

  const onRemove = async (): Promise<void> => {
    const promisees = data.map(async (item) => {
      console.log(typeof item.destruction)
      const { id, destruction } = item

      const {
        data: { reference }
      } = await dataProvider.getOne<Destruction>(constants.R_DESTRUCTION, {
        id: destruction
      })

      await audit({
        activityType: AuditType.EDIT,
        activityDetail: `Remove item from destruction ${reference}`,
        securityRelated: false,
        resource: constants.R_ITEMS,
        dataId: id,
        subjectId: null,
        subjectResource: null
      })
    })
    await Promise.all(promisees)

    await dataProvider.updateMany<Item>(constants.R_ITEMS, {
      ids,
      data: {
        destruction: undefined,
        destructionDate: undefined
      }
    })

    notify(`${ids.length} items removed from destruction`)
    successCallback()
  }

  return (
    <Box sx={style}>
      <Typography variant='h6' marginY={2}>
        Remove {ids.length} items from destruction
      </Typography>
      <FlexBox>
        <Button onClick={onRemove as any} variant='contained'>
          Remove
        </Button>
        <Button onClick={onClose} variant='outlined'>
          Cancel
        </Button>
      </FlexBox>
    </Box>
  )
}
