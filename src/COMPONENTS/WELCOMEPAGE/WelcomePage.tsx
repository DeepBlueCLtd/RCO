import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// @ts-ignore
import { setProfileDetails } from "../../REDUX/profileDetailSlice.js";

import "./welcomepage.css";
export const WelcomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { name, id, adminRights } = useSelector(
    (state: any) => state.profileDetailSlice
  );

  const displayName = name || "Page";

  useEffect(() => {
    // @ts-ignore
    const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));

    if (isLoggedIn) {
      // @ts-ignore
      const userData = JSON.parse(localStorage.getItem("loggedInUser"));
      dispatch(setProfileDetails(userData));
      navigate("/");
    } else {
      dispatch(setProfileDetails({}));
    }
  }, []);
  useEffect(() => {
    //initialize given data into local storage
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
      <div className="welcome-box">
        <div className="welcome-title">
          <span>Welcome {displayName}</span>

          {!id ? (
            <div>
              <Link to={"/login"}>
                <button
                  style={{
                    padding: "10px 10px",
                    fontSize: "20px",
                    backgroundColor: "#7CB9E8",
                  }}
                >
                  LOGIN
                </button>{" "}
              </Link>
            </div>
          ) : null}
          {adminRights === "true" ? (
            <span className="admin-link">
              Go to <Link to={"/audit"}>localhost:3000/audit</Link>
            </span>
          ) : null}
        </div>
      </div>
    </>
  );
};
