import { Box, Button, Modal, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import {
  type DataProvider,
  useDataProvider,
  useListContext,
  useNotify,
  useRefresh
} from 'react-admin'
import FlexBox from '../../components/FlexBox'
import * as constants from '../../constants'
import { LoanCreate } from '../loans'

type ButtonType = '' | 'loan' | 'loanReturn'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

interface LoanItemsModalProps {
  items: number[]
  onClose: () => void
}

const useUser = (): {
  users: User[]
  usersById: Record<number, User>
} => {
  const dataProvider = useDataProvider()
  const [users, setUser] = useState<User[]>([])

  const usersById = useMemo(() => {
    const result: Record<number, User> = {}
    users.forEach((user) => {
      result[user.id] = user
    })
    return result
  }, [users])

  const getUser = async (): Promise<void> => {
    try {
      const { data } = await dataProvider.getList<User>(constants.R_USERS, {
        sort: { field: 'id', order: 'ASC' },
        pagination: { perPage: 1000, page: 1 },
        filter: {}
      })
      setUser(data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getUser().catch(console.log)
  }, [])

  return { users, usersById }
}

function LoanItemsToUser(props: LoanItemsModalProps): React.ReactElement {
  const { items, onClose } = props

  const dataProvider = useDataProvider<CustomDataProvider & DataProvider>()
  const notify = useNotify()
  const refresh = useRefresh()

  const label: string = `Loan ${items.length} items to`

  const onSuccess = async (response: Loan): Promise<void> => {
    try {
      if (items.length !== 0) {
        await dataProvider.loanItems(items, response.loanedBy, response.id)
      }
      refresh()
      notify('Loan created')
      onClose()
    } catch (error: any) {
      notify(error.message, { type: 'error' })
    }
  }

  return (
    <Box>
      <Typography variant='h6'>{label}:</Typography>
      <LoanCreate
        mutationOptions={{ onSuccess }}
        loanFormProps={{
          hideFields: ['loanedBy']
        }}
      />
    </Box>
  )
}

function LoanItemsReturn(props: LoanItemsModalProps): React.ReactElement {
  const { items, onClose } = props

  const { usersById } = useUser()
  const dataProvider = useDataProvider<CustomDataProvider & DataProvider>()
  const notify = useNotify()
  const refresh = useRefresh()
  const [loanItems, setLoanItems] = useState<LoanItem[]>([])

  const label = useMemo(() => {
    const userNames = loanItems.map((item) => {
      const { receivedBy } = item
      const user = usersById[receivedBy]
      return user.name
    })

    const names: string = [...new Set(userNames)].join(', ')

    return `Return ${items.length} items from: ${names}`
  }, [items, loanItems])

  const handleLoanReturn = async (): Promise<void> => {
    try {
      await dataProvider.returnItems(items)

      refresh()
      notify(label, { type: 'success' })
      onClose()
    } catch (error: any) {
      notify(error.message, { type: 'error' })
    }
  }

  useEffect(() => {
    dataProvider
      .getMany<LoanItem>(constants.R_LOAN_ITEMS, { ids: items })
      .then(({ data }) => {
        setLoanItems(data)
      })
      .catch(console.log)
  }, [items])

  return (
    <Box>
      <Typography variant='h6'>{label}</Typography>
      <FlexBox marginTop={4}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleLoanReturn as any}>
          Return
        </Button>
        <Button variant='outlined' onClick={onClose}>
          Cancel
        </Button>
      </FlexBox>
    </Box>
  )
}

interface Props {
  buttons?: Array<'loan' | 'loanReturn'>
}

export default function LoanItemsListBulkActionButtons(
  props: Props
): React.ReactElement {
  const { buttons = ['loan', 'loanReturn'] } = props
  const [buttonType, setButtonType] = useState<ButtonType>('')
  const { selectedIds } = useListContext()

  const handleClick = (buttonType: ButtonType) => {
    return () => {
      setButtonType(buttonType)
    }
  }

  return (
    <FlexBox>
      {buttons.includes('loan') && (
        <Button
          variant='outlined'
          size='small'
          color='primary'
          onClick={handleClick('loan')}>
          Loan
        </Button>
      )}
      {buttons.includes('loanReturn') && (
        <Button
          variant='outlined'
          size='small'
          color='primary'
          onClick={handleClick('loanReturn')}>
          Loan return
        </Button>
      )}
      <Modal open={Boolean(buttonType)} onClose={handleClick('')}>
        <Box sx={style}>
          {buttonType === 'loan' && (
            <LoanItemsToUser items={selectedIds} onClose={handleClick('')} />
          )}
          {buttonType === 'loanReturn' && (
            <LoanItemsReturn items={selectedIds} onClose={handleClick('')} />
          )}
        </Box>
      </Modal>
    </FlexBox>
  )
}