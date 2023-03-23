import { AuthProvider } from "react-admin";
import { setProfileDetails } from "../REDUX/profileDetailSlice";
const authProvider: AuthProvider = {
  login: (userData) => {
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
    // accept all username/password combinations
    return Promise.resolve();
  },
  logout: (dispatch) => {
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
    localStorage.getItem("loggedInUser") ? Promise.resolve() : Promise.reject(),
  getPermissions: () => Promise.reject("Unknown method"),
  getIdentity: () => {
    return Promise.resolve({
      id: "user",
      fullName: "",
      avatar: "",
    });
  },
};

export default authProvider;
