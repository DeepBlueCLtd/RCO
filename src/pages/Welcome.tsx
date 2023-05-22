import React from 'react'
import * as constants from '../constants'
import { ICON_PROJECT, ICON_BATCH } from '../constants'
import Recent from '../components/Recent'
import FlexBox from '../components/FlexBox'
import { CreateButton } from 'react-admin'
import AppIcon from '../assets/rco_transparent.png'
import { makeStyles } from '@mui/styles'
import RecentMock from '../components/RecentMock'
import useCanAccess from '../hooks/useCanAccess'

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

const mockData = {
  hasteners: [
    { id: 1, name: '2023/02/11', hastenersNumber: 'RAC' },
    { id: 2, name: '2023/02/15', hastenersNumber: 'AA' },
    { id: 3, name: '2023/02/19', hastenersNumber: 'GREEN FLG' }
  ],
  notes: [
    { id: 1, name: '2023/02/12', receiptsNumber: 'RAC' },
    { id: 2, name: '2023/02/11', receiptsNumber: 'AA' },
    { id: 3, name: '2023/02/07', receiptsNumber: 'GREEN FLG' }
  ]
}

export default function Welcome(): React.ReactElement {
  const styles = useStyles()
  const { hasAccess, loading } = useCanAccess()

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
            label='New Project'
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
        />
        <Recent<Item>
          label='Recent loans'
          resource={constants.R_ITEMS}
          fields={[
            { source: 'loanedTo', reference: constants.R_USERS },
            { source: 'item_number' },
            { source: 'batchId', reference: constants.R_BATCHES }
          ]}
          filter={{ loanedTo_neq: undefined }}
          onFilter
        />
      </FlexBox>
      <FlexBox className={styles.row}>
        <RecentMock
          label='Pending Receipt Notes'
          data={mockData.notes}
          fields={['name', 'receiptsNumber']}
        />
        <RecentMock
          label='Hasteners Required'
          data={mockData.hasteners}
          fields={['name', 'hastenersNumber']}
        />
      </FlexBox>
    </div>
  )
}
