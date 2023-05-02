import {
  Box,
  Button,
  Modal,
  Typography,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  type SelectChangeEvent
} from '@mui/material'
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

const useUser = () => {
  const dataProvider = useDataProvider()
  const [users, setUser] = useState<User[]>([])

  const usersById = useMemo(() => {
    const result: Record<number, User> = {}
    users.forEach((user) => {
      result[user.id] = user
    })
    return result
  }, [users])

  const getUser = async () => {
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

function LoanItemsToUser(props: LoanItemsModalProps) {
  const { items, onClose } = props

  const dataProvider = useDataProvider<CustomDataProvider & DataProvider>()
  const { users } = useUser()
  const [showForm, setShowForm] = useState(false)
  const [value, setValue] = useState<number | string>('')
  const notify = useNotify()
  const refresh = useRefresh()

  const label: string = `Loan ${items.length} items to`

  useEffect(() => {
    setValue(users[0]?.id)
  }, [users])

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value)
  }

  const onSuccess = async (response: LoanItem) => {
    try {
      if (items.length !== 0) {
        await dataProvider.loanItems(items, Number(value), response.id)
      }
      refresh()
      notify('Loan created')
      onClose()
    } catch (error: any) {
      notify(error.message, { type: 'error' })
    }
  }

  if (showForm) {
    return (
      <LoanCreate
        mutationOptions={{ onSuccess }}
        loanFormProps={{
          defaultValues: { holder: Number(value) },
          hideFields: ['holder']
        }}
      />
    )
  }

  return (
    <>
      <Box>
        <Typography variant='h6'>{label}:</Typography>
        <FlexBox marginTop={3}>
          <InputLabel>Name:</InputLabel>
          <FormControl sx={{ flex: 1 }} margin='none'>
            <Select value={String(value)} label='Name' onChange={handleChange}>
              {users.map((user: User) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FlexBox>
        <FlexBox marginTop={4}>
          <Button
            variant='contained'
            color='primary'
            onClick={() => { setShowForm(true) }}>
            Loan
          </Button>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
        </FlexBox>
      </Box>
    </>
  )
}

function LoanItemsReturn(props: LoanItemsModalProps) {
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

  const handleLoanReturn = async () => {
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

export default function LoanItemsListBulkActionButtons(props: Props) {
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
