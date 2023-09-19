import { useStateGui } from "../StateGui";
import { addNewUserInformation } from "../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../type";
import { getToken } from "../views/layout/authentication";

const [, { getActiveMapId }] = useStateGui();

// TODO Need auth0 authentication
// TODO Refacto error management
export class ServiceUtils {
  static async generic(url: string, options = {}) {
    let response: Response;
    try {
      response = await fetch(url, { ...options });
    } catch (error) {
      connexionError();
      return false;
    }

    if (!(await manageStatusCode(response))) return false;
    return await response.json();
  }

  static async get(url: string, urlNeedMap = true) {
    const headers = await createXanoAuthenticateHeader();
    return await this.generic(this.buildXanoUrl(url, urlNeedMap), {
      method: "GET",
      headers,
    });
  }

  static async post(url: string, data: object, urlNeedMap = true) {
    const headers = {
      ...(await createXanoAuthenticateHeader()),
      "Content-Type": "application/json",
    };

    return await this.generic(this.buildXanoUrl(url, urlNeedMap), {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
  }

  static async patch(url: string, data: object, urlNeedMap = true) {
    const headers = {
      ...(await createXanoAuthenticateHeader()),
      "Content-Type": "application/json",
    };
    return await this.generic(this.buildXanoUrl(url, urlNeedMap), {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
  }

  static async delete(url: string, urlNeedMap = true) {
    const headers = await createXanoAuthenticateHeader();
    return await this.generic(this.buildXanoUrl(url, urlNeedMap), {
      method: "DELETE",
      headers,
    });
  }

  static buildXanoUrl(url: string, urlNeedMap: boolean) {
    let buildUrl = import.meta.env.VITE_XANO_URL;
    if (urlNeedMap) {
      buildUrl += "/map/" + getActiveMapId();
    }
    return buildUrl + url;
  }
}

// TODO reformat this (copy/past from point.service.ts)
export const connexionError = () => {
  addNewUserInformation({
    displayed: true,
    level: MessageLevelEnum.error,
    type: MessageTypeEnum.global,
    content: "Une erreur est survenue lors du chargement des données.",
  });
};

// TODO reformat this (copy/past from point.service.ts)
export const manageStatusCode = async (response: Response) => {
  const error: { message?: string } = {};

  switch (response.status) {
    case 429:
      const json = await response.json();

      error.message =
        json.detail ??
        "Trop de requêtes effectuer, veuillez essayer ultérieurement";
      break;
  }

  if (response.status !== 200) {
    const json = await response.json();
    const message =
      json.detail ?? "Une erreur est survenue lors du chargement des données.";

    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.error,
      type: MessageTypeEnum.global,
      content: error.message ?? message,
    });

    return false;
  }

  return true;
};

const createXanoAuthenticateHeader = async () => {
  return getToken()
    ? {
        "X-Xano-Authorization-Only": true,
        "X-Xano-Authorization": await getToken(),
      }
    : {};
};
