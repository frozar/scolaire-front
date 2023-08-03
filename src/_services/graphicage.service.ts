import { PointIdentityType } from "../type";
import {
  PointInformation,
  PointInterface,
} from "../views/content/graphicage/component/atom/Point";
import { connexionError, manageStatusCode } from "./_utils.service";

const host = import.meta.env.VITE_BACK_URL;

export class GraphicageService {
  static async drawHelper(data: DrawHelperDataType) {
    let response: Response;
    console.log(data);
    try {
      response = await fetch(host + "/graphicage/draw-helper", {
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
    console.log (response);
    // return await response.json();
  }
}

export type DrawHelperDataType = {
  schools: PointInformation[];
  selected: PointIdentityType[];
  stops: PointInterface[];
};
