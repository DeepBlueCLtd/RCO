import { Datagrid, FunctionField, List } from 'react-admin'

export default function ReferenceDataList() {
    return (
        <List>
            <Datagrid>
                <FunctionField render={({ id, name }: any) => `${name}-${id}`} label="Name" />
            </Datagrid>
        </List>
    )
}
