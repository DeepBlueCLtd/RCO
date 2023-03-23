import { useState, useEffect } from "react";
import { useDispatch } from "react-redux/es/exports";
import { setProfileDetails } from "../../REDUX/profileDetailSlice.js";
import { useLogin } from "react-admin";
//@ts-ignore
import "./login.css";

export const Login = (props: any) => {
  interface IDetails {
    name: String;
    password: String;
  }
  const name = localStorage.getItem("name");
  const password = localStorage.getItem("password");

  const [auth, setAuth] = useState<IDetails>({
    name: name || "",
    password: password || "",
  });
  const [msg, setMsg] = useState("");
  const dispatch = useDispatch();
  const dateAndTimeHandler = (tabledata: any) => {
    const newTableData = tabledata?.audit?.map((data: any, idx: any) => {
      if (typeof data.datetime === "number") {
        let datetime = new Date(data.datetime).toLocaleDateString("en-GB");
        datetime += " " + new Date(data.datetime).toLocaleTimeString();

        return { ...data, no: data.realid, id: idx + 1, datetime };
      }
      return { ...data, no: data.realid, id: idx + 1 };
    });
    if (newTableData) tabledata.audit = newTableData;
    props.setFinalTableData(tabledata);
    localStorage.setItem("tabledata", JSON.stringify(tabledata));
  };

  const inputHandler = (e: any) => {
    if (msg) setMsg("");
    const { name, value } = e.target;
    setAuth({ ...auth, [name]: value });
  };

  const login = useLogin();
  useEffect(() => {
    localStorage.removeItem("name");
    localStorage.removeItem("password");
    setAuth({ name: "", password: "" });
  }, []);
  //@ts-ignore
  const submitHandler = (e) => {
    e.preventDefault();
    //@ts-ignore
    const data = JSON.parse(localStorage.getItem("data"));
    let i = 0;
    //@ts-ignore
    const tableData = JSON.parse(localStorage.getItem("tabledata")) || {};
    const arr = [];
    let tempUserData: any = {};
    for (i = 0; i < data.length; i++) {
      if (auth.name === data[i].name && auth.password === data[i].password) {
        tempUserData = { ...data[i] };
        dispatch(setProfileDetails(data[i]));
        delete tempUserData.password;
        tempUserData.realid = data[i].id;
        tempUserData.datetime = Date.now();
        tempUserData.activitydetail = "Successfully logged in";
        tempUserData.activitytype = "Login";
        if (!tableData.audit) tableData.audit = [tempUserData];
        else tableData.audit = [...tableData.audit, tempUserData];
        localStorage.removeItem("name");
        localStorage.removeItem("password");
        dateAndTimeHandler(tableData);
        login(tempUserData, "/");
        return;
      }
    }
    for (i = 0; i < data.length; i++) {
      if (auth.name === data[i].name) {
        tempUserData = { ...data[i] };
        delete tempUserData.password;
        tempUserData.realid = data[i].id;
        tempUserData.datetime = Date.now();
        tempUserData.activitydetail = "Log in failed";
        tempUserData.activitytype = "Login";
        if (!tableData.audit) tableData.audit = [tempUserData];
        else tableData.audit = [...tableData.audit, tempUserData];
        //@ts-ignore
        localStorage.setItem("name", auth.name);
        //@ts-ignore
        localStorage.setItem("password", auth.password);
        dateAndTimeHandler(tableData);

        return;
      }
    }
  };
  return (
    <div className="login-box">
      <div className="login-subbox">
        <div style={{ width: "100%" }}>
          <label className="login-label">Enter name :</label>
          <input
            type="text"
            className="login-input"
            name="name"
            //@ts-ignore
            value={auth.name}
            onChange={inputHandler}
            autoComplete="off"
          />
        </div>
        <div style={{ width: "100%" }}>
          <label className="login-label">Enter Password :</label>
          <input
            type="password"
            name="password"
            className="login-input"
            autoComplete="off"
            //@ts-ignore
            value={auth.password}
            onChange={inputHandler}
          />
        </div>
        {/* <Link to={"/wel"}> */}
        <button
          className="login-button"
          name="password"
          onClick={(e) => submitHandler(e)}
        >
          LOGIN
        </button>
        {/* </Link> */}
        {/* <MenuItemLink primaryText="LOGIN" to={"/wel"} /> */}
        <div style={{ marginTop: "5px", color: "red" }} className="login-msg">
          {msg}
        </div>
      </div>
    </div>
  );
};
