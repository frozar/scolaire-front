import { useStateGui } from "../StateGui";
import { addNewUserInformation } from "../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../type";

const [, { getActiveMapId }] = useStateGui();

// TODO Need auth0 authentication
// TODO Refacto error management
export class ServiceUtils {
  static async generic(url: string, options = {}) {
    let response: Response;
    try {
      response = await fetch(url, options);
    } catch (error) {
      connexionError();
      return false;
    }

    if (!(await manageStatusCode(response))) return false;
    return await response.json();
  }

  static async get(url: string, urlNeedMap = true) {
    const response = await ServiceUtils.generic(buildXanoUrl(url, urlNeedMap));
    if (!response) return;
    return await response;
  }

  static async post(url: string, data: object, urlNeedMap = true) {
    const response = await ServiceUtils.generic(buildXanoUrl(url, urlNeedMap), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response) return;
    return await response.json();
  }

  static async patch(url: string, data: object, urlNeedMap = true) {
    const response = await ServiceUtils.generic(buildXanoUrl(url, urlNeedMap), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response) return false;
    return await response.json();
  }

  static async delete(url: string, urlNeedMap = true) {
    const response = await ServiceUtils.generic(buildXanoUrl(url, urlNeedMap), {
      method: "DELETE",
    });

    if (!response) return false;
    return await response.json();
  }
}

const buildXanoUrl = (url: string, urlNeedMap: boolean) => {
  let buildUrl = import.meta.env.VITE_XANO_URL;
  if (urlNeedMap) {
    buildUrl += "/map/" + getActiveMapId();
  }
  return buildUrl + url;
};

// TODO reformat this (copy/past from point.service.ts)
export const connexionError = () => {
  addNewUserInformation({
    displayed: true,
    level: MessageLevelEnum.error,
    type: MessageTypeEnum.global,
    content:
      "Désolé une erreur est survenue lors du chargement des données veuillez essayer ultérieurement",
  });
};

// TODO reformat this (copy/past from point.service.ts)
export const manageStatusCode = async (response: Response) => {
  if (response.status !== 200) {
    const json = await response.json();
    const message =
      json.detail ??
      "Désolé une erreur est survenue lors du chargement des données veuillez essayer ultérieurement";

    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.error,
      type: MessageTypeEnum.global,
      content: message,
    });

    return false;
  }

  return true;
};
