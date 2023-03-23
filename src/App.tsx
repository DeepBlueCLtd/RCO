import { Admin, CustomRoutes, Resource } from "react-admin";
import { useState, useEffect } from "react";

import { Login } from "./ROUTES/LOGINPAGE/Login";
import { Route } from "react-router-dom";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";

import { PostList } from "./COMPONENTS/LIST/List";
import { WelcomePage } from "./COMPONENTS/WELCOMEPAGE/WelcomePage";
// import authProvider from "./UTILS/authProvider";
import localStorageDataProvider from "ra-data-local-storage";
import { setProfileDetails } from "./REDUX/profileDetailSlice.js";
import { Editlist } from "./COMPONENTS/EDIT/Edit";
function App() {
  const [finalTableData, setFinalTableData] = useState([]);
  const dispatch = useDispatch();
  //@ts-ignore
  const authProvider: AuthProvider = {
    login: (userData: any) => {
      localStorage.setItem("loggedInUser", JSON.stringify(userData));
      // accept all username/password combinations
      return Promise.resolve();
    },
    logout: () => {
      dispatch(
        setProfileDetails({
          id: "",
          name: "",
          adminRights: "",
        })
      );
      //@ts-ignore
      const data = JSON.parse(localStorage.getItem("loggedInUser"));
      //@ts-ignore
      const tabledata = JSON.parse(localStorage.getItem("tabledata"));
      const arr = tabledata.audit;
      let datetime = new Date(Date.now()).toLocaleDateString("en-GB");
      datetime += " " + new Date(Date.now()).toLocaleTimeString();
      data.datetime = datetime;
      data.activitydetail = "Successfully logged Out";
      data.activitytype = "Logout";
      data.id = arr.length + 1;
      arr.push(data);
      tabledata.audit = arr;
      localStorage.setItem("tabledata", JSON.stringify(tabledata));
      localStorage.removeItem("loggedInUser");
      return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: () =>
      localStorage.getItem("loggedInUser")
        ? Promise.resolve()
        : Promise.reject(),
    getPermissions: () => Promise.reject("Unknown method"),
    getIdentity: () => {
      return Promise.resolve({
        id: "user",
        fullName: "",
        avatar: "",
      });
    },
  };

  const { id, adminRights } = useSelector(
    (state: any) => state.profileDetailSlice
  );
  useEffect(() => {
    //@ts-ignore
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!id) {
      if (loggedInUser) dispatch(setProfileDetails(loggedInUser));
    }
  }, []);

  const dataProvider = localStorageDataProvider({
    localStorageKey: "tabledata",
    defaultData: {
      audit: finalTableData,
      comments: [
        { id: 0, post_id: 0, author: "John Doe", body: "Sensational!" },
        { id: 1, post_id: 0, author: "Jane Doe", body: "I agree" },
      ],
    },
  });
  return (
    <Admin
      loginPage={() => <Login setFinalTableData={setFinalTableData} />}
      authProvider={authProvider}
      dataProvider={dataProvider}
    >
      <CustomRoutes>
        <Route path="/" element={<WelcomePage />} />
      </CustomRoutes>
      {adminRights === "true" ? (
        <Resource name="audit" list={PostList} edit={Editlist} />
      ) : null}
    </Admin>
  );
}

export default App;
