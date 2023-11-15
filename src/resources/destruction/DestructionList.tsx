import {
  Datagrid,
  FunctionField,
  List,
  SearchInput,
  TextField,
  useRedirect
} from 'react-admin'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import HistoryButton from '../../components/HistoryButton'
import NullUndefinedFilter from '../../components/NullUndefinedFilter'
import { ConditionalDateField } from '../dispatch/DispatchList'

const filters = [
  <SearchInput source='q' key='q' alwaysOn />,
  <NullUndefinedFilter
    label='Destroyed'
    source={process.env.MOCK ? 'finalisedAt_neq' : 'finalisedAt__notnull'}
    key='destroyed'
  />,
  <NullUndefinedFilter
    label='Not Destroyed'
    source={process.env.MOCK ? 'finalisedAt_eq' : 'finalisedAt__null'}
    key='not_destroyed'
  />
]

export default function DestructionList(): React.ReactElement {
  const redirect = useRedirect()

  return (
    <List
      filters={filters}
      filterDefaultValues={
        process.env.MOCK
          ? { finalisedAt_eq: false }
          : { finalisedAt__null: true }
      }>
      <Datagrid rowClick='show' bulkActionButtons={false}>
        <TextField<Destruction> source='name' label='Reference' />
        <ConditionalDateField<Destruction>
          label='Finalised at'
          source='finalisedAt'
          resource={constants.R_DESTRUCTION}
        />
        <SourceField<Destruction>
          source='createdBy'
          reference={constants.R_USERS}
        />
        <SourceField<Destruction>
          source='finalisedBy'
          reference={constants.R_USERS}
        />
        <FunctionField<Destruction>
          label='History'
          render={(record) => {
            return (
              <HistoryButton
                onClick={(e) => {
                  e.stopPropagation()
                  redirect(
                    `/audit?filter=${JSON.stringify({
                      dataId: record.id,
                      resource: constants.R_DESTRUCTION
                    })}`
                  )
                }}
              />
            )
          }}
        />
        <TextField<Destruction> source='remarks' />
      </Datagrid>
    </List>
  )
}
