import { useStateGui } from "../StateGui";
import { addNewUserInformation } from "../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../type";

const [, { getActiveMapId }] = useStateGui();

// TODO Need auth0 authentication
// TODO Refacto error management
export class ServiceUtils {
  static async get(url: string, urlNeedMap = true) {
    let response: Response;
    try {
      response = await fetch(buildXanoUrl(url, urlNeedMap));
    } catch (error) {
      connexionError();
      return false;
    }

    if (!(await manageStatusCode(response))) return;
    return await response.json();
  }

  static async post(url: string, data: object, urlNeedMap = true) {
    let response: Response;
    try {
      response = await fetch(buildXanoUrl(url, urlNeedMap), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      connexionError();
      return false;
    }

    if (!(await manageStatusCode(response))) return;
    return await response.json();
  }

  static async patch(url: string, data: object, urlNeedMap = true) {
    let response: Response;
    try {
      response = await fetch(buildXanoUrl(url, urlNeedMap), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      connexionError();
      return false;
    }

    if (!(await manageStatusCode(response))) return;
    return await response.json();
  }

  static async delete(url: string, urlNeedMap = true) {
    let response: Response;
    try {
      response = await fetch(buildXanoUrl(url, urlNeedMap), {
        method: "DELETE",
      });
    } catch (error) {
      connexionError();
      return false;
    }

    if (!(await manageStatusCode(response))) return false;
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
const connexionError = () => {
  addNewUserInformation({
    displayed: true,
    level: MessageLevelEnum.error,
    type: MessageTypeEnum.global,
    content:
      "Désoler une erreur est survenue lors du chargement des données veuillez essayer ultérieument",
  });
};

// TODO reformat this (copy/past from point.service.ts)
const manageStatusCode = async (response: Response) => {
  if (response.status !== 200) {
    const json = await response.json();
    const message =
      json.detail ??
      "Désolé une erreur est survenue lors du chargement des données veuillez essayer ultérieument";

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
