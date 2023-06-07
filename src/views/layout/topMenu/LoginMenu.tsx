import { createSignal, onMount } from "solid-js";
import {
  getProfilePic,
  isAuthenticated,
  login,
  logout,
} from "./authentication";
import { authenticated, setAuthenticated } from "../../../signaux";
import Login from "../../../component/molecule/Login";

export default function () {
  const [show, setShow] = createSignal(false);
  const toggleShow = () => setShow((show) => !show);
  const handleLogin = async () => {
    if (!authenticated()) {
      await login();
    } else {
      await logout();
    }
    toggleShow();
  };

  onMount(async () => {
    setAuthenticated(await isAuthenticated());
  });

  return (
    <Login
      show={show}
      toggleShow={toggleShow}
      handleLogin={handleLogin}
      getProfilePic={getProfilePic}
      authenticated={authenticated}
      xOffset={() => -11}
    />
  );
}
