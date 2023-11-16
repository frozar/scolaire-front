import { GtfsData } from "../_entities/gtfs.entity";
import { displayDownloadSuccessMessage } from "../userInformation/utils";
import { download } from "../utils";
import { getTimestamp } from "../views/content/map/rightMapMenu/export/utils";
import { connexionError, manageStatusCode } from "./_utils.service";

export namespace GtfsService {
  async function generic(url: string, options = {}, returnError = false) {
    let response: Response;
    try {
      response = await fetch(url, { ...options });
    } catch (error) {
      if (returnError) {
        return error;
      }
      connexionError();
      return false;
    }

    if (!(await manageStatusCode(response))) return false;
    return await response.blob();
  }
  // TODO: Move !?
  async function postGtfs(url: string, data: object) {
    const headers = {
      "Content-Type": "application/json",
    };

    return await generic(import.meta.env.VITE_BACK_URL + url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
  }

  export async function get(data: GtfsData) {
    // ! Response type ?
    // TODO: Mettre en place le cas d'erreur !
    const response = (await postGtfs("/map/4/export/gtfsbis", data)) as Blob;
    console.log("response ====>", response);
    const { year, month, day, hour, minute } = getTimestamp();
    const fileName = `${year}-${month}-${day}_${hour}-${minute}_gtfs.zip`;
    download(fileName, response);
    displayDownloadSuccessMessage();
  }
}
