import "./LoggedInUserLogo.css";

export default function (props: { path: string }) {
  return (
    <img id="logged-in-user" src={props.path} alt="avatar logged in user" />
  );
}
