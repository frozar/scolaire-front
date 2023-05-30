import {
  createAuth0Client,
  Auth0Client,
  RedirectLoginOptions,
  LogoutOptions,
} from "@auth0/auth0-spa-js";
import {
  getAuthtenticatedUser,
  setAuthenticated,
  setAuthtenticatedUser,
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
    setAuthtenticatedUser(undefined);
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
  const user = getAuthtenticatedUser();
  if (!user || !user.sub) {
    if (await auth0Client.isAuthenticated()) {
      const user = await auth0Client.getUser();
      setAuthtenticatedUser(user);
    }
  }
}

export async function isAuthenticated() {
  await tryConnection();
  const user = getAuthtenticatedUser();
  if (!user || !user.sub) {
    return false;
  }
  return true;
}

export function getProfilePic() {
  const user = getAuthtenticatedUser();
  if (!user || !user.sub) {
    return false;
  }
  return user.picture;
}

export async function getToken() {
  if (import.meta.env.VITE_AUTH0_DEV_MODE === "true") {
    return "fakeToken";
  }
  try {
    const token = await auth0Client.getTokenSilently();
    return token;
  } catch (err) {
    throw new Error("Could not get token");
  }
}

window.onload = async () => {
  const query = window.location.search;
  const shouldParseResult = query.includes("code=") && query.includes("state=");

  if (shouldParseResult) {
    try {
      await auth0Client.handleRedirectCallback();
      const user = await auth0Client.getUser();
      setAuthtenticatedUser(user);
      setAuthenticated(true);
    } catch (err) {
      console.log("Error parsing redirect:", err);
    }
    window.history.replaceState({}, document.title, "/");
  }
};
