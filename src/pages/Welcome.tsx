import React from 'react'
import * as constants from '../constants'

import Recent from '../components/Recent'
import FlexBox from '../components/FlexBox'
import { CreateButton } from 'react-admin'
import AppIcon from '../assets/rco_transparent.png'
import { makeStyles } from '@mui/styles'

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

  return (
    <div className={styles.root}>
      <FlexBox className={styles.header}>
        <FlexBox className={styles.headerColumn}>
          <img src={AppIcon} height='50px' />
        </FlexBox>
        <FlexBox className={styles.headerColumn}>
          <CreateButton
            color='primary'
            variant='contained'
            resource={constants.R_BATCHES}
            label='Add New Batch'
            sx={{ width: '250px', height: '50px' }}
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
        <Recent
          label='Recent Loans'
          defaultData={[
            { id: 1, name: 'TAPE01', loanNumber: 'MAYO' },
            { id: 2, name: 'TAPE01', loanNumber: 'DISC/23/32 ' },
            { id: 3, name: 'SMITH', loanNumber: 'REPORT/2/23' }
          ]}
          fields={[{ source: 'name' }, { source: 'loanNumber' }]}
        />
      </FlexBox>
      <FlexBox className={styles.row}>
        <Recent
          label='Pending Receipt Notes'
          defaultData={[
            { id: 1, name: '2023/02/12', receiptsNumber: 'RAC' },
            { id: 2, name: '2023/02/11', receiptsNumber: 'AA' },
            { id: 3, name: '2023/02/07', receiptsNumber: 'GREEN FLG' }
          ]}
          fields={[{ source: 'name' }, { source: 'receiptsNumber' }]}
        />
        <Recent
          label='Hasteners Required'
          defaultData={[
            { id: 1, name: '2023/02/11', hastenersNumber: 'RAC' },
            { id: 2, name: '2023/02/15', hastenersNumber: 'AA' },
            { id: 3, name: '2023/02/19', hastenersNumber: 'GREEN FLG' }
          ]}
          fields={[{ source: 'name' }, { source: 'hastenersNumber' }]}
        />
      </FlexBox>
    </div>
  )
}
