import React, { useEffect, useState } from "react";
import "./table.css";
import { Logout } from "../../UTILS/Logout.js";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { EditModal } from "../../COMPONENTS/EDITMODAL/EditModal";
//@ts-ignore
import { setProfileDetails } from "../../REDUX/profileDetailSlice.js";

export const Table = () => {
  const [tableData, setTableData] = useState<Array<any>>([]);
  const [modal, setModal] = useState({ open: false });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, id, adminRights, isLoggedin } = useSelector(
    (state: any) => state.profileDetailSlice
  );

  const logoutHandler = () => {
    Logout(dispatch, navigate);
  };
  useEffect(() => {
    //@ts-ignore
    const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));

    if (isLoggedIn) {
      //@ts-ignore
      const userData = JSON.parse(localStorage.getItem("loggedInUser"));
      dispatch(setProfileDetails(userData));
    }
  }, []);
  useEffect(() => {
    //@ts-ignore
    const data: Array<any> = JSON.parse(localStorage.getItem("tabledata"));
    setTableData(data);
  }, [modal.open]);

  return (
    <>
      {modal.open && (
        <EditModal
          modalIsOpen={modal.open}
          setModalIsOpen={setModal}
          data={modal}
        />
      )}
      <div>
        <div className="table-nav">
          <button
            onClick={() => navigate("/")}
            style={{ backgroundColor: "", marginLeft: "12px" }}
          >
            BACK
          </button>
          <span>Welcome {name}</span>
          <button
            onClick={logoutHandler}
            style={{
              backgroundColor: "#FFBF00",
              marginRight: "12px",
            }}
          >
            LOGOUT
          </button>
        </div>
        <div className="table-container">
          <div>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>User-id</th>
                  <th>Date-time</th>
                  <th>Activity-type</th>
                  <th>Activity-detail</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((userData: any, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{userData.id}</td>
                      <td>
                        {new Date(userData.datetime).toLocaleDateString(
                          "en-GB"
                        )}
                        &nbsp;&nbsp;
                        {new Date(userData.datetime).toLocaleTimeString()}
                      </td>
                      <td>{userData.activitytype}</td>
                      <td>{userData.activitydetail}</td>
                      <td>
                        <button
                          className=""
                          onClick={() =>
                            setModal((data) => {
                              return { ...data, ...userData, open: true };
                            })
                          }
                        >
                          EDIT
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
