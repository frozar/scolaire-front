import "./LoginMenu.css";

export interface LoginMenuProps {
  onClick: () => void;
  authenticated: boolean;
}

export default function (props: LoginMenuProps) {
  return (
    <button id="login-menu" onClick={() => props.onClick()}>
      {props.authenticated ? "Se déconnecter" : "Se connecter"}
    </button>
  );
}
