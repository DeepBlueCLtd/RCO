import { Box, Button, Modal, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import {
  type DataProvider,
  useDataProvider,
  useListContext,
  useNotify,
  useRefresh,
  Create,
  SimpleForm,
  Toolbar,
  SaveButton,
  useGetMany
} from 'react-admin'
import FlexBox from '../../components/FlexBox'
import * as constants from '../../constants'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import SourceInput from '../../components/SourceInput'
import { DateTime } from 'luxon'

type ButtonType = '' | 'loan' | 'loanReturn'

interface FormState {
  holder: User['id']
  remarks: string
}

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
  items: Item[]
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

const schema = yup.object({
  holder: yup.number().required()
})

const ToolBar = (): React.ReactElement => (
  <Toolbar>
    <SaveButton label='Loan' />
  </Toolbar>
)

function LoanItemsToUser(props: LoanItemsModalProps): React.ReactElement {
  const { items, onClose } = props
  const nowDate = useMemo(() => DateTime.now().toString(), [])

  const dataProvider = useDataProvider<CustomDataProvider & DataProvider>()
  const notify = useNotify()
  const refresh = useRefresh()

  const label: string = `Loan ${items.length} items to`

  const handleSubmit = async (values: FormState): Promise<void> => {
    try {
      const { holder } = values
      const items = props.items.map((item) => item.id)
      if (items.length !== 0) {
        await dataProvider.loanItems(items, holder)
      }
      refresh()
      notify(`${items.length} items loaned`)
      onClose()
    } catch (error: any) {
      notify(error.message, { type: 'error' })
    }
  }

  return (
    <Box>
      <Typography variant='h6'>{label}:</Typography>
      <Create resource={constants.R_LOANS}>
        <SimpleForm
          onSubmit={handleSubmit as any}
          toolbar={<ToolBar />}
          resolver={yupResolver(schema)}>
          <SourceInput
            source='holder'
            reference={constants.R_USERS}
            filter={{
              departedDate_gte: nowDate
            }}
            sort={{ field: 'staffNumber', order: 'ASC' }}
          />
        </SimpleForm>
      </Create>
    </Box>
  )
}

function LoanItemsReturn(props: LoanItemsModalProps): React.ReactElement {
  const { items, onClose } = props

  const { usersById } = useUser()
  const dataProvider = useDataProvider<CustomDataProvider & DataProvider>()
  const notify = useNotify()
  const refresh = useRefresh()

  const { label, selectedItems } = useMemo(() => {
    const selectedItems: number[] = []
    const userNames = items.map((item) => {
      selectedItems.push(item.id)
      if (item.loanedTo) {
        const user = usersById[item.loanedTo]
        return user?.name
      }
      return ''
    })

    const names: string | undefined = [...new Set(userNames)]?.join(', ')
    return {
      label: `Return ${items.length} items from: ${names}`,
      selectedItems
    }
  }, [items, usersById])

  const handleLoanReturn = async (): Promise<void> => {
    try {
      await dataProvider.returnItems(selectedItems)
      refresh()
      notify(`${selectedItems.length} items returned`)
      onClose()
    } catch (error: any) {
      notify(error.message, { type: 'error' })
    }
  }

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
  // none of the items have been loaned (so provide the Loan button)
  noneLoaned: boolean
  // all of the items have been loaned (so provide the Return button)
  allLoaned: boolean
  disabled?: boolean
}

export default function LoanItemsListBulkActionButtons(
  props: Props
): React.ReactElement {
  const {
    buttons = ['loan', 'loanReturn'],
    noneLoaned,
    allLoaned,
    disabled = false
  } = props
  const [buttonType, setButtonType] = useState<ButtonType>('')
  const { selectedIds } = useListContext<Item>()
  const { data = [] } = useGetMany<Item>(constants.R_ITEMS, {
    ids: selectedIds
  })

  const handleClick = (buttonType: ButtonType) => {
    return () => {
      setButtonType(buttonType)
    }
  }

  const selectedItems = useMemo(() => {
    return data.filter((item) => selectedIds.includes(item.id))
  }, [selectedIds, data])

  const { disableLoanItem, disableReturnItem } = useMemo(
    () => ({
      disableLoanItem: !(!disabled && buttons.includes('loan') && noneLoaned),
      disableReturnItem: !(
        !disabled &&
        buttons.includes('loanReturn') &&
        allLoaned
      )
    }),
    [noneLoaned, disabled, allLoaned]
  )

  return (
    <FlexBox>
      <Button
        disabled={disableLoanItem}
        variant='outlined'
        size='small'
        color='primary'
        onClick={handleClick('loan')}>
        Loan
      </Button>
      <Button
        disabled={disableReturnItem}
        variant='outlined'
        size='small'
        color='primary'
        onClick={handleClick('loanReturn')}>
        Loan return
      </Button>
      <Modal open={Boolean(buttonType)} onClose={handleClick('')}>
        <Box sx={style}>
          {buttonType === 'loan' && (
            <LoanItemsToUser items={selectedItems} onClose={handleClick('')} />
          )}
          {buttonType === 'loanReturn' && (
            <LoanItemsReturn items={selectedItems} onClose={handleClick('')} />
          )}
        </Box>
      </Modal>
    </FlexBox>
  )
}
