import { useStateGui } from "../../StateGui";
import { ServiceUtils } from "../../_services/_utils.service";
import {
  AuthenticatedUserStore,
  authenticated,
} from "../../_stores/authenticated-user.store";
import { MapStore } from "../../_stores/map.store";
import { UserOrganizationStore } from "../../_stores/user-organization.store";
import { setSelectedOrganisation } from "../content/board/component/organism/OrganisationSelector";

const [, { getActiveOrganizationId }] = useStateGui();

const XANO_AUTH_URL = import.meta.env.VITE_XANO_URL_AUTH;
// TODO l'url ne doit pas être bonne.... pensez à mettre dans le .env
const REDIRECT_URI =
  "https://demo.xano.com/xano-auth0-oauth/assets/oauth/auth0/index.html";

export type xanoUser = {
  name: string;
  token: string;
  email: string;
  picture: string;
  nickname: string;
  role: string;
  //TODO rebaptiser "organizations"
  organisation: OrganisationType[];
};

// TODO créer un UserService et un UserEntity...
//TODO représente the AuthenticatedUserOrganizationsType
export type OrganisationType = {
  organisation_id: number;
  user_privilege: string;
  name: string;
};

export async function logout() {
  AuthenticatedUserStore.unset();
}

async function handleAuthenticateUser(e: {
  data: { args: { code: string }; type: string };
}) {
  if (e && e["data"] && e["data"]["type"] == "oauth:auth0") {
    const code = e.data.args.code;

    await authenticateUser(code);
  }
}

async function authenticateUser(code: string) {
  const authenticatedUserResponse = await fetch(
    XANO_AUTH_URL + "/continue?code=" + code + "&redirect_uri=" + REDIRECT_URI,
    {
      method: "GET",
    }
  ).catch((err) => {
    console.log("Log in failed", err);
    closeOauthWindow();
  });

  const user = await authenticatedUserResponse?.json().catch((err) => {
    console.log("Log in failed", err);
    closeOauthWindow();
  });
  if (user) {
    AuthenticatedUserStore.set(user);
    const org = UserOrganizationStore.get().find(
      (item) => item.organisation_id == getActiveOrganizationId()
    );
    if (org) {
      setSelectedOrganisation(org);
      MapStore.fetchUserMaps();
    }
  }
}

let currentOauthWindow: Window | null;

function closeOauthWindow() {
  window.removeEventListener("message", handleAuthenticateUser);
  if (currentOauthWindow) currentOauthWindow.close();
}

export async function login() {
  if (currentOauthWindow) currentOauthWindow.close();

  try {
    const url = await getAuthUrl();
    if (!url) return;

    currentOauthWindow = window.open(
      "",
      "auth0Oauth",
      "scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=" +
        300 +
        ",height=" +
        500 +
        ",left=2500,top=100"
    );

    if (!currentOauthWindow) return;

    currentOauthWindow.location.href = url;

    window.removeEventListener("message", handleAuthenticateUser);
    window.addEventListener("message", handleAuthenticateUser);
  } catch (err) {
    console.log("Log in failed", err);
    closeOauthWindow();
  }
}

async function getAuthUrl() {
  const response = await fetch(
    XANO_AUTH_URL + "/init?redirect_uri=" + REDIRECT_URI,
    {
      method: "GET",
    }
  );
  const jsonResponse = await response.json();
  return jsonResponse.authUrl;
}

export async function tryConnection() {
  const user: xanoUser | undefined = AuthenticatedUserStore.get();

  if (user) {
    AuthenticatedUserStore.set(user);
    const res = await ServiceUtils.get("/auth/me", false, true);

    if (res && res.isAuthenticated) {
      const org = UserOrganizationStore.get().find(
        (item) => item.organisation_id == getActiveOrganizationId()
      );

      if (org) setSelectedOrganisation(org);
      MapStore.fetchUserMaps();
    } else {
      AuthenticatedUserStore.unset();
    }
  } else {
    AuthenticatedUserStore.unset();
  }
}

export function getToken() {
  return authenticated() ? AuthenticatedUserStore.getToken() : "";
}

function headerJson(token: string): HeadersInit {
  return {
    ...headerAuthorization(token),
    "Content-Type": "application/json",
  };
}

function headerAuthorization(token: string): HeadersInit {
  return {
    authorization: token,
  };
}

export function authenticateWrap(
  callback: (headers: HeadersInit) => Response | PromiseLike<Response> | void,
  authorizationOnly = false
) {
  const token = getToken();
  if (token) {
    const headers: HeadersInit = authorizationOnly
      ? headerAuthorization(token)
      : headerJson(token);

    return callback(headers);
  }
}
