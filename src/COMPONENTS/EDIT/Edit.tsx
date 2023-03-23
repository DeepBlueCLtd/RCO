import {
  Button,
  Edit,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
} from "react-admin";
import { Link } from "react-router-dom";
const CustomToolbar = (props: any) => (
  <Toolbar {...props} sx={{ display: "flex", justifyContent: "space-between" }}>
    <SaveButton />
  </Toolbar>
);
export const Editlist = () => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <Edit sx={{ width: "500px" }}>
      <SimpleForm width={500} toolbar={<CustomToolbar />}>
        <Link to={"/audit"}>
          <button style={{ padding: "8px", backgroundColor: "white" }}>
            BACK
          </button>
        </Link>
        <TextInput disabled source="id" multiline sx={{ width: "94%" }} />
        <TextInput source="name" multiline sx={{ width: "94%" }} disabled />
        <TextInput source="datetime" multiline sx={{ width: "94%" }} disabled />
        <TextInput source="activitytype" multiline sx={{ width: "94%" }} />
        <TextInput source="activitydetail" multiline sx={{ width: "94%" }} />
      </SimpleForm>
    </Edit>
  </div>
);
