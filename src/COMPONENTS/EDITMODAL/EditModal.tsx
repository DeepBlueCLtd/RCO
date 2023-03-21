import React, { useState } from "react";
import ReactDOM from "react-dom";
//@ts-ignore
import Modal from "react-modal";
import "./editmodal.css";
export const EditModal = (props: any) => {
  const [newData, setNewData] = useState({
    activitytype: props.data.activitytype,
    activitydetail: props.data.activitydetail,
  });

  const customStyles = {
    content: {
      top: "30%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      width: "500px",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const editHandler = () => {
    //@ts-ignore
    const tableData = JSON.parse(localStorage.getItem("tabledata"));
    const newTableData = tableData.map((userData: any) => {
      if (userData.id === props.data.id) {
        userData.activitytype = newData.activitytype;
        userData.activitydetail = newData.activitydetail;
        return userData;
      }
      return userData;
    });
    localStorage.setItem("tabledata", JSON.stringify(newTableData));
    props.setModalIsOpen((data: any) => {
      return { ...data, open: false };
    });
  };

  return (
    <Modal
      isOpen={props.modalIsOpen}
      onRequestClose={() =>
        props.setModalIsOpen((data: any) => {
          return { ...data, open: false };
        })
      }
      style={customStyles}
      contentLabel="Example Modal"
    >
      <h4 style={{ margin: 0, textAlign: "center", fontSize: "large" }}>
        Edit Data
      </h4>
      <hr />
      <div>
        <div className="modal-data">
          <strong>
            <span>Id : </span>
          </strong>
          <input
            disabled
            type="text"
            defaultValue={props.data.id}
            className="editInput"
          />
        </div>{" "}
        <div className="modal-data">
          <strong>
            <span>Name : </span>
          </strong>
          <input
            disabled
            type="text"
            defaultValue={props.data.name}
            className="editInput"
          />
        </div>
        <div className="modal-data">
          <strong>
            <span>Date-Time : </span>
          </strong>
          <input
            className="editInput"
            disabled
            type="text"
            defaultValue={`${new Date(props.data.datetime).toLocaleDateString(
              "en-GB"
            )} ${new Date(props.data.datetime).toLocaleTimeString()} `}
          />
        </div>
        <div className="modal-data">
          <strong>
            <span>Activity-type : </span>
          </strong>
          <input
            type="text"
            className="editInput"
            defaultValue={props.data.activitytype}
            onChange={(e) =>
              setNewData((prevData) => {
                return { ...prevData, activitytype: e.target.value };
              })
            }
          />
        </div>
        <div className="modal-data">
          <strong>
            <span>Activity-detail : </span>
          </strong>
          <input
            className="editInput"
            type="text"
            defaultValue={props.data.activitydetail}
            onChange={(e) =>
              setNewData((prevData) => {
                return { ...prevData, activitydetail: e.target.value };
              })
            }
          />
        </div>
        <hr style={{ marginTop: "15px" }} />
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={editHandler}
            style={{
              backgroundColor: "#1778F2",
              color: "white",
              padding: "7px 15px",
            }}
          >
            EDIT
          </button>
          <button
            onClick={() => props.setModalIsOpen(false)}
            style={{
              marginLeft: "7px",
              backgroundColor: "#D6001C",
              color: "white",
              padding: "7px 15px",
            }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </Modal>
  );
};
