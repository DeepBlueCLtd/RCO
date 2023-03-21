// @ts-ignore
import { setProfileDetails } from "../REDUX/profileDetailSlice";

export function Logout(dispatch: Function, navigate: Function) {
  // @ts-ignore
  localStorage.setItem("isLoggedIn", false);
  dispatch(
    setProfileDetails({
      id: "",
      name: "",
      adminRights: "",
      // @ts-ignore
      isLoggedin: JSON.parse(localStorage.getItem("isLoggedin")) || false,
    })
  );
  navigate("/");
}
