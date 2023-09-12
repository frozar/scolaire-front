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
    console.log(await getToken());
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
    const XANO_AUTH_URL =
      "https://x8ki-letl-twmt.n7.xano.io/api:elCAJnQ5/oauth/auth0";
    const redirect_uri =
      "https://demo.xano.com/xano-auth0-oauth/assets/oauth/auth0/index.html";
    // const res = await fetch(
    //   "https://x8ki-letl-twmt.n7.xano.io/api:elCAJnQ5/oauth/auth0/init?redirect_uri=https://demo.xano.com/xano-auth0-oauth/assets/oauth/auth0/index.html"
    // );
    // console.log(res.body);

    const res = await fetch(
      XANO_AUTH_URL + "/init?redirect_uri=" + redirect_uri,
      {
        method: "GET",
      }
    );
    const response: { authUrl: string } = await res.json();
    const url = response.authUrl;
    console.log(url);

    const callback = async (e) => {
      if (e && e["data"] && e["data"]["type"] == "oauth:auth0") {
        try {
          console.log(e);
          const code = e.data.args.code;
          console.log(code);
          const res = await fetch(
            XANO_AUTH_URL +
              "/continue?code=" +
              code +
              "&redirect_uri=" +
              redirect_uri,
            {
              method: "GET",
            }
          );
          const response = await res.json();
          console.log(response);
        } catch (e) {
          window.removeEventListener("message", callback);
        }
        // authenticating = true;
        // api.get({
        //   endpoint: this.apiUrl,
        //   params: {
        //     code: e["data"]["args"]["code"],
        //     redirect_uri: this.redirect_uri,
        //   },
        // }).subscribe((response: any) => {
        //   this.result = response;
        //   window.removeEventListener('message', callback);
        // }, err => {
        //   this.authenticating = false;
        //   window.removeEventListener('message', this.callback);
        //   this.toast.error(_.get(err, "error.message") || "An unknown error has occured.");
        // });
      }
    };

    const oauthWindow = window.open(
      "",
      "auth0Oauth",
      "scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=660,left=100,top=100"
    );
    window.removeEventListener("message", callback);
    window.addEventListener("message", callback);

    oauthWindow.location.href = response.authUrl;

    // const res2 = await fetch(url, {
    //   method: "GET",
    // });
    // console.log(res2);
    // const options: RedirectLoginOptions = {
    //   authorizationParams: {
    //     redirect_uri: url,
    //   },
    // };
    // await auth0Client.loginWithRedirect(options);
  } catch (err) {
    console.log("Log in failed", err);
  }
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

export async function getToken() {
  if (import.meta.env.VITE_AUTH0_DEV_MODE === "true") {
    console.log("fake token");
    return "fakeToken";
  }
  try {
    const token = await auth0Client.getTokenSilently();
    console.log(token);
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

  // .then((token) => {
  //   const headers: HeadersInit = authorizationOnly
  //     ? headerAuthorization(token)
  //     : headerJson(token);

  //   callback(headers);
  // })
  // .catch((error) => {
  //   console.error("ERROR: authenticateWrap");
  //   console.error(error);
  // });
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
