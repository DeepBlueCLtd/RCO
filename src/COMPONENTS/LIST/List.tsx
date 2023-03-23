import { List, Datagrid, TextField, EditButton } from "react-admin";
export const PostList = () => {
  return (
    <>
      <List actions={<></>}>
        <Datagrid bulkActionButtons={false}>
          <TextField source="no" label="id" />
          <TextField source="name" />
          <TextField source="adminRights" />
          <TextField source="datetime" label="Date-time" />
          <TextField source="activitytype" label="Activity-type" />
          <TextField source="activitydetail" label="Activity-detail" />
          <EditButton />
        </Datagrid>
      </List>
    </>
  );
};
