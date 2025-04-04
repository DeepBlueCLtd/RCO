import React from 'react'
import * as constants from '../constants'
import { ICON_PROJECT, ICON_BATCH, ICON_DISPATCH } from '../constants'
import Recent from '../components/Recent'
import FlexBox from '../components/FlexBox'
import { CreateButton, FunctionField, useRedirect } from 'react-admin'
import AppIcon from '../assets/rco_transparent.png'
import { makeStyles } from '@mui/styles'
import useCanAccess from '../hooks/useCanAccess'
import { useConfigData } from '../utils/useConfigData'
import PendingReceiptNotes from '../components/PendingReceiptNotes'
import { getUser } from '../providers/authProvider'

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

const BatchComponent = (): React.ReactElement => {
  return (
    <FunctionField<Batch>
      sortable={false}
      render={(record) => `${record.vault?.[0]}${record.batchNumber}`}
    />
  )
}

export default function Welcome(): React.ReactElement {
  const styles = useStyles()

  const { hasAccess, loading } = useCanAccess()
  const configData = useConfigData()

  const redirect = useRedirect()
  const user = getUser()

  const editPasswordTime = user?.updateBefore

  if (loading) return <></>
  if (!hasAccess('welcome-page', { read: true })) redirect('/login')

  return (
    <div className={styles.root}>
      {!editPasswordTime ? (
        ''
      ) : (
        <FlexBox
          sx={{
            justifyContent: 'center',
            bgcolor: 'red',
            borderRadius: '10px',
            margin: '10px 0',
            color: 'white',
            padding: '5px 0'
          }}>
          Please update your password before it expires.
        </FlexBox>
      )}
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
          itemsCount={10}
          fields={[
            { source: 'batchNumber', component: BatchComponent },
            { source: 'platform', reference: constants.R_PLATFORMS },
            {
              source: 'project',
              label: configData?.projectName,
              reference: constants.R_PROJECTS
            }
          ]}
          search='order=DESC&sort=createdAt'
        />
        <Recent<LoanUser>
          isTitleClickable={false}
          label='Items on Loan'
          resource={constants.R_LOAN_USERS}
          fields={[
            { source: 'username', label: 'Username' },
            { source: 'numItems' }
          ]}
          rowClick={(id) => {
            const path = `/${constants.R_RICH_ITEMS}?filter={"loanedTo":${id}}`
            redirect(path)
            return path
          }}
        />
      </FlexBox>
      <FlexBox className={styles.row}>
        <PendingReceiptNotes />
      </FlexBox>
    </div>
  )
}
