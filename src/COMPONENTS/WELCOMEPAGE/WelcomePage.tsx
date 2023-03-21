import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Logout } from "../../UTILS/Logout.js";
// @ts-ignore
import { setProfileDetails } from "../../REDUX/profileDetailSlice.js";

import "./welcomepage.css";
export const WelcomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { name, id, adminRights, isLoggedin } = useSelector(
    (state: any) => state.profileDetailSlice
  );
  const displayName = name || "Page";
  const buttonName = id ? "LOGOUT" : "LOGIN";
  const logoutHandler = () => {
    Logout(dispatch, navigate);
  };
  useEffect(() => {
    // @ts-ignore
    const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));

    if (isLoggedIn) {
      // @ts-ignore
      const userData = JSON.parse(localStorage.getItem("loggedInUser"));
      dispatch(setProfileDetails(userData));
      navigate("/");
    }
  }, []);
  useEffect(() => {
    const initialdata = [
      {
        id: 1,
        name: "ian",
        password: "admin",
        adminRights: "true",
      },
      {
        id: 2,
        name: "jason",
        password: "user",
        adminRights: "false",
      },
    ];
    localStorage.setItem("data", JSON.stringify(initialdata));
  }, []);
  return (
    <>
      <div className="welcome-navbar">
        <button
          style={{
            backgroundColor: id ? "#FFBF00" : "#1778F2",
            marginRight: "12px",
            color: id ? "black" : "white",
          }}
          onClick={() => {
            id ? logoutHandler() : navigate("/login");
          }}
        >
          {buttonName}
        </button>
      </div>
      <div className="welcome-box">
        <div className="welcome-title">
          <span>Welcome {displayName}</span>
          {adminRights === "true" ? (
            <span className="admin-link">
              Go to <Link to={"/table"}>localhost:3000/table</Link>
            </span>
          ) : null}
        </div>
      </div>
    </>
  );
};
