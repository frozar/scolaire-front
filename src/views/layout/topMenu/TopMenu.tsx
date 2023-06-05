import { onMount } from "solid-js";

import { authenticated, setAuthenticated } from "../../../signaux";
import TopNav from "../../../component/organism/TopNav";

import {
  getProfilePicture,
  isAuthenticated,
  login,
  logout,
} from "./authentication";

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

  return (
    <TopNav
      handleLogin={handleLogin}
      getProfilePicture={getProfilePicture}
      authenticated={authenticated}
    />
  );
}
