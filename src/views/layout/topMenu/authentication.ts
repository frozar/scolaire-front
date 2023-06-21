import {
  createAuth0Client,
  Auth0Client,
  RedirectLoginOptions,
  LogoutOptions,
} from "@auth0/auth0-spa-js";
import {
  getAuthenticatedUser,
  setAuthenticated,
  setAuthenticatedUser,
} from "../../../signaux";

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

export async function login() {
  try {
    const options: RedirectLoginOptions = {
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    };

    await auth0Client.loginWithRedirect(options);
  } catch (err) {
    console.log("Log in failed", err);
  }
}

export async function tryConnection() {
  const user = getAuthenticatedUser();
  if (!user || !user.sub) {
    if (await auth0Client.isAuthenticated()) {
      const user = await auth0Client.getUser();
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

async function getToken() {
  if (import.meta.env.VITE_AUTH0_DEV_MODE === "true") {
    return "fakeToken";
  }
  try {
    const token = await auth0Client.getTokenSilently();
    return token;
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
  return {
    authorization: "Bearer " + token,
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
