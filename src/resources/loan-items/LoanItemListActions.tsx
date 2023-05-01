import { CreateButton, FilterButton, TopToolbar } from 'react-admin'
import { useParams } from 'react-router-dom'

const LoanItemListActions = () => {
  const { id = '' } = useParams()
  const loanId: string = id

  return (
    <TopToolbar>
      <CreateButton label='ADD ITEM' to={`/loanItems/create?loan=${loanId}`} />
      <FilterButton />
    </TopToolbar>
  )
}

export default LoanItemListActions
