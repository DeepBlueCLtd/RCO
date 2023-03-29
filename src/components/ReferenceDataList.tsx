import React from 'react';
import { Datagrid, FunctionField, List } from 'react-admin';

export default function ReferenceDataList(): React.ReactElement {
  return (
    <List>
      <Datagrid>
        <FunctionField
          render={({ id, name }: any) => `${name as string}-${id as number}`}
          label="Name"
        />
      </Datagrid>
    </List>
  );
}
