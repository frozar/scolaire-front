import {
  Auth0Client,
  LogoutOptions,
  createAuth0Client,
} from "@auth0/auth0-spa-js";
import {
  getAuthenticatedUser,
  setAuthenticated,
  setAuthenticatedUser,
} from "../../signaux";
const XANO_AUTH_URL =
  "https://x8ki-letl-twmt.n7.xano.io/api:elCAJnQ5/oauth/auth0";
const REDIRECT_URI =
  "https://demo.xano.com/xano-auth0-oauth/assets/oauth/auth0/index.html";

export type xanoUser = {
  name: string;
  token: string;
  email: string;
  picture: string;
  nickname: string;
};

let currentUser: xanoUser;

export const auth0Client: Auth0Client = await createAuth0Client({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  },
});

export async function logout() {
  try {
    console.log("Logging out");
    const options: LogoutOptions = {
      logoutParams: {
        returnTo: window.location.origin,
      },
    };
    auth0Client.logout(options);
    setAuthenticatedUser(undefined);
  } catch (err) {
    console.log("Log out failed", err);
  }
}

async function getUser(e: { data: { args: { code: string }; type: string } }) {
  if (e && e["data"] && e["data"]["type"] == "oauth:auth0") {
    const code = e.data.args.code;

    const res = await fetch(
      XANO_AUTH_URL +
        "/continue?code=" +
        code +
        "&redirect_uri=" +
        REDIRECT_URI,
      {
        method: "GET",
      }
    ).catch((err) => {
      console.log("Log in failed", err);
      closeOauthWindow();
    });

    currentUser = await res?.json().catch((err) => {
      console.log("Log in failed", err);
      closeOauthWindow();
    });
  }
}

let currentOauthWindow: Window;

function closeOauthWindow() {
  window.removeEventListener("message", getUser);
  if (currentOauthWindow) currentOauthWindow.close();
}

export async function login() {
  const currentOauthWindow = window.open(
    "",
    "auth0Oauth",
    "scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=660,left=100,top=100"
  );
  if (!currentOauthWindow) return;

  try {
    const url = await getAuthUrl();
    if (!url) return closeOauthWindow();

    currentOauthWindow.location.href = url;

    window.removeEventListener("message", getUser);
    window.addEventListener("message", getUser);
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
  const user = getAuthenticatedUser();
  if (!user || !user.sub) {
    if (await auth0Client.isAuthenticated()) {
      const user = await auth0Client.getUser();
      console.log(user);
      setAuthenticatedUser(user);
    }
  }
}

export async function isAuthenticated() {
  await tryConnection();
  const user = getAuthenticatedUser();
  if (!user || !user.sub) {
    return false;
  }
  return true;
}

export const getProfilePicture = () => {
  const user = getAuthenticatedUser();
  if (user && user.sub) return user.picture;
  else return "";
};

export function getToken() {
  if (import.meta.env.VITE_AUTH0_DEV_MODE === "true") {
    return "fakeToken";
  }
  try {
    return currentUser.token;
  } catch (error) {
    console.error("ERROR: getToken");
    console.error(error);
    return "errorToken";
  }
}

function headerJson(token: string): HeadersInit {
  return {
    ...headerAuthorization(token),
    "Content-Type": "application/json",
  };
}

function headerAuthorization(token: string): HeadersInit {
  console.log("Bearer " + token);
  return {
    authorization: token,
  };
}

export function authenticateWrap(
  callback: (headers: HeadersInit) => Response | PromiseLike<Response> | void,
  authorizationOnly = false
) {
  return getToken()
    .then((token) => {
      const headers: HeadersInit = authorizationOnly
        ? headerAuthorization(token)
        : headerJson(token);

      return callback(headers);
    })
    .catch((error) => {
      console.error("ERROR: authenticateWrap");
      console.error(error);
    });
}

export async function asyncAuthenticateWrap(authorizationOnly = false) {
  try {
    const token = await getToken();
    const headers: HeadersInit = authorizationOnly
      ? headerAuthorization(token)
      : headerJson(token);

    return headers;
  } catch (error) {
    console.error("ERROR: authenticateWrap");
    console.error(error);
  }
}

window.onload = async () => {
  const query = window.location.search;
  const shouldParseResult = query.includes("code=") && query.includes("state=");

  if (shouldParseResult) {
    try {
      await auth0Client.handleRedirectCallback();
      const user = await auth0Client.getUser();
      setAuthenticatedUser(user);
      setAuthenticated(true);
    } catch (err) {
      console.log("Error parsing redirect:", err);
    }
    window.history.replaceState({}, document.title, "/");
  }
};
