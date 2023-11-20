import { GtfsData } from "../_entities/gtfs.entity";
import {
  displayDownloadSuccessMessage,
  displayOnGoingDownloadMessage,
} from "../userInformation/utils";
import { download } from "../utils";
import { getTimestamp } from "../views/content/map/rightMapMenu/export/utils";
import { ResponseTypeEnum, ServiceUtils } from "./_utils.service";

// TODO: Try to adapt exportGtfs to use auth0
export namespace GtfsService {
  async function getGtfs(url: string, data: object) {
    const headers = {
      "Content-Type": "application/json",
    };

    return await ServiceUtils.generic(
      import.meta.env.VITE_BACK_URL + url,
      {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      },
      false,
      ResponseTypeEnum.blob
    );
  }

  export async function get(data: GtfsData) {
    displayOnGoingDownloadMessage();

    const response = (await getGtfs("/export/gtfs", data)) as Blob;

    const { year, month, day, hour, minute } = getTimestamp();
    const fileName = `${year}-${month}-${day}_${hour}-${minute}_gtfs.zip`;
    download(fileName, response);

    displayDownloadSuccessMessage();
  }
}
