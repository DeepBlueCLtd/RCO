import {
  List,
  TextField,
  Datagrid
} from 'react-admin';
import  {MyPagination}  from '../pagination/MyPagination';

const AuditList = () => {

  return (
    <>
     <List pagination={<MyPagination />}>
         <Datagrid>
           <TextField source="id" />
           <TextField source="userId" />
           <TextField source="date-time" />
           <TextField source="activity-type" />
         </Datagrid>
     </List>
    </>
  );
}

export default AuditList;