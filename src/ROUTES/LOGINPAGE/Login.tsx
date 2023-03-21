import React, { useState } from "react";
import { useDispatch } from "react-redux/es/exports";
import { useNavigate } from "react-router-dom";
import { setProfileDetails } from "../../REDUX/profileDetailSlice.js";
//@ts-ignore
import lodash from "lodash";
import "./login.css";

export const Login = () => {
  interface IDetails {
    name: String;
    password: String;
  }
  const [details, setDetails] = useState<IDetails>({ name: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const inputHandler = (e: any) => {
    if (msg) setMsg("");
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const submitHandler = () => {
    if (!details.name && !details.password) return;
    //@ts-ignore
    const data = JSON.parse(localStorage.getItem("data"));
    //@ts-ignore
    const tableData = JSON.parse(localStorage.getItem("tabledata")) || [];
    let i = 0;
    for (i = 0; i < data.length; i++) {
      if (
        data[i].name === details.name &&
        data[i].password === details.password
      ) {
        //@ts-ignore
        localStorage.setItem("isLoggedIn", true);

        const tempUserData = data[i];
        tempUserData.datetime = Date.now();
        tempUserData.activitytype = "login";
        tempUserData.activitydetail = "Successfull Login";
        const userData = lodash.omit(data[i], "password");
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
        tableData.push(tempUserData);
        localStorage.setItem("tabledata", JSON.stringify(tableData));
        dispatch(setProfileDetails(userData));
        setMsg("");
        return navigate("/");
      }
    }
    const tempUserData = data[i - 1];
    tempUserData.datetime = Date.now();
    tempUserData.activitytype = "login";
    tempUserData.activitydetail = "Login Failed";
    const userData = lodash.omit(data[i], "password");
    tableData.push(tempUserData);
    localStorage.setItem("tabledata", JSON.stringify(tableData));
    setMsg("Wrong Credentials");
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
            onChange={inputHandler}
          />
        </div>
        <button
          className="login-button"
          name="password"
          onClick={submitHandler}
        >
          LOGIN
        </button>
        <div style={{ marginTop: "5px", color: "red" }} className="login-msg">
          {msg}
        </div>
      </div>
    </div>
  );
};
