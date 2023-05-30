import { getProfilePic } from "../../../auth/auth";

export default function () {
  const path = getProfilePic();

  return <img class="w-10 h-10 rounded-full" src={path as string} alt="" />;
}
