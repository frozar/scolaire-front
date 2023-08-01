import { addNewUserInformation } from "../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../type";

export class ServiceUtils {
  /**
   * Function using fetch with GET method
   * @param url the Get URL
   * @returns
   */
  // TODO Need auth0 authentication
  static async get(url: string) {
    let response: Response;
    try {
      response = await fetch(import.meta.env.VITE_XANO_URL + url);
    } catch (error) {
      connexionError();
      return false;
    }

    if (!(await manageStatusCode(response))) return;
    return await response.json();
  }

  static async post(url: string, data: object) {
    let response: Response;
    try {
      response = await fetch(import.meta.env.VITE_XANO_URL + url, {
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

  static async delete(url: string) {
    let response: Response;
    try {
      response = await fetch(import.meta.env.VITE_XANO_URL + url, {
        method: "DELETE",
      });
    } catch (error) {
      connexionError();
      return false;
    }

    if (!(await manageStatusCode(response))) return false;
    return true;
  }
}

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
