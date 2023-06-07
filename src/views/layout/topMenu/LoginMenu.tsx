import { createEffect, onMount } from "solid-js";
import {
  getProfilePicture,
  isAuthenticated,
  login,
  logout,
} from "./authentication";
import { authenticated, setAuthenticated } from "../../../signaux";
import LoginDropdown from "../../../component/molecule/LoginDropdown";

export default function () {
  const handleLogin = async () => {
    if (!authenticated()) {
      await login();
    } else {
      await logout();
    }
  };

  onMount(async () => {
    setAuthenticated(await isAuthenticated());
  });

  createEffect(() => {
    console.log("getProfilePicture", getProfilePicture());
  });

  return (
    <LoginDropdown
      getProfilePicture={getProfilePicture}
      authenticated={authenticated}
      handleLogin={handleLogin}
      xOffset={-11}
    />
  );
}
