import React from 'react'
import * as constants from '../constants'
import { ICON_PROJECT, ICON_BATCH, ICON_DISPATCH } from '../constants'
import Recent from '../components/Recent'
import FlexBox from '../components/FlexBox'
import { CreateButton, DateField, useGetList } from 'react-admin'
import AppIcon from '../assets/rco_transparent.png'
import { makeStyles } from '@mui/styles'
import HastenerSentField from '../components/HastenerSentField'
import useCanAccess from '../hooks/useCanAccess'
import { useConfigData } from '../utils/useConfigData'

const useStyles = makeStyles({
  root: {
    maxWidth: '720px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '30px',
    margin: '0 auto'
  },
  row: {
    marginTop: '40px',
    justifyContent: 'space-between'
  },
  header: {
    justifyContent: 'space-evenly',
    columnGap: '68px'
  },
  headerColumn: {
    flex: 1,
    justifyContent: 'center'
  }
})

export default function Welcome(): React.ReactElement {
  const styles = useStyles()
  const { hasAccess, loading } = useCanAccess()
  const { data } = useGetList<Item>(constants.R_ITEMS, {
    sort: { field: 'id', order: 'ASC' }
  })
  const loaned = data?.filter((d) => d.loanedTo !== undefined).map((f) => f.id)
  const configData = useConfigData()

  if (loading) return <></>

  return (
    <div className={styles.root}>
      <FlexBox className={styles.header}>
        <FlexBox className={styles.headerColumn}>
          <img src={AppIcon} height='100px' />
        </FlexBox>
        <FlexBox className={styles.headerColumn}>
          <CreateButton
            color='primary'
            variant='contained'
            disabled={!hasAccess(constants.R_PROJECTS, { write: true })}
            resource={constants.R_PROJECTS}
            icon={<ICON_PROJECT />}
            label={`New ${configData?.projectName}`}
            sx={{ width: '150px', height: '50px' }}
          />
          <CreateButton
            color='primary'
            variant='contained'
            resource={constants.R_BATCHES}
            disabled={!hasAccess(constants.R_BATCHES, { write: true })}
            icon={<ICON_BATCH />}
            label='New Batch'
            sx={{ width: '150px', height: '50px' }}
          />
          <CreateButton
            color='primary'
            variant='contained'
            resource={constants.R_DISPATCH}
            disabled={!hasAccess(constants.R_DISPATCH, { write: true })}
            icon={<ICON_DISPATCH />}
            label='New Dispatch'
            sx={{ width: '150px', height: '50px' }}
          />
        </FlexBox>
      </FlexBox>
      <FlexBox className={styles.row}>
        <Recent<Batch>
          label='Recent Batches'
          resource={constants.R_BATCHES}
          fields={[
            { source: 'batchNumber' },
            { source: 'platform', reference: constants.R_PLATFORMS },
            { source: 'project', reference: constants.R_PROJECTS }
          ]}
          search='order=DESC&sort=createdAt'
        />
        <Recent<Item>
          label='Recent loans'
          resource={constants.R_ITEMS}
          fields={[
            { source: 'loanedTo', reference: constants.R_USERS },
            { source: 'itemNumber' },
            { source: 'batchId', reference: constants.R_BATCHES }
          ]}
          filter={{ loanedTo_neq: undefined }}
          search={`filter=${JSON.stringify({
            id: loaned
          })}`}
        />
      </FlexBox>
      <FlexBox className={styles.row}>
        <Recent<Dispatch>
          label='Pending Receipt Notes'
          resource={constants.R_DISPATCH}
          fields={[
            { source: 'reference' },
            { source: 'dispatchedAt', component: DateField },
            { source: 'lastHastenerSent', component: HastenerSentField }
          ]}
          filter={{ receiptReceived: undefined }}
          search={`filter=${JSON.stringify({ receiptReceived: [undefined] })}`}
        />
      </FlexBox>
    </div>
  )
}
