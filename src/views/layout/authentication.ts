import { Auth0Client, createAuth0Client } from "@auth0/auth0-spa-js";
import { createSignal } from "solid-js";
import { setAuthenticated } from "../../signaux";
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
  code: string;
};

// let currentUser: xanoUser | undefined;

export const [currentUser, setCurrentUser] = createSignal<
  xanoUser | undefined
>();

export const auth0Client: Auth0Client = await createAuth0Client({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  },
});

export async function logout() {
  setCurrentUser(undefined);
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
    const user = await res?.json().catch((err) => {
      console.log("Log in failed", err);
      closeOauthWindow();
    });
    if (user) {
      setCurrentUser({ ...user, code });
      setAuthenticated(true);
    }
  }
}

let currentOauthWindow: Window | null;

function closeOauthWindow() {
  window.removeEventListener("message", getUser);
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
  const user = currentUser();
  if (!user) {
    // login(); //TODO find how to maintain a session
  }
}

export async function isAuthenticated() {
  await tryConnection(); //TODO a refaire
  const user = currentUser();
  if (!user) {
    return false;
  }
  return true;
}

export function getToken() {
  if (currentUser()) return currentUser()?.token;

  if (import.meta.env.VITE_AUTH0_DEV_MODE === "true") {
    return "fakeToken";
  }

  return "";
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

window.onload = async () => {
  //TODO fix to keep the same session
  // const query = window.location.search;
  // const shouldParseResult = query.includes("code=") && query.includes("state=");
  // if (shouldParseResult) {
  //   try {
  //     await auth0Client.handleRedirectCallback();
  //     const user = await auth0Client.getUser();
  //     setAuthenticatedUser(user);
  //     setAuthenticated(true);
  //   } catch (err) {
  //     console.log("Error parsing redirect:", err);
  //   }
  //   window.history.replaceState({}, document.title, "/");
  // }
};
