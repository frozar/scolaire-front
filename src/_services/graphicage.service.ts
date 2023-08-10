import { LeafletSchoolType } from "../views/content/graphicage/component/organism/SchoolPoints";
import { LeafletStopType } from "../views/content/graphicage/component/organism/StopPoints";
import { connexionError, manageStatusCode } from "./_utils.service";

const host = import.meta.env.VITE_BACK_URL;

export class GraphicageService {
  static async drawHelper(data: DrawHelperDataType) {
    let response: Response;
    try {
      response = await fetch(host + "/generator/draw-helper", {
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
    // console.log(response);
    return await response.json();
  }
}

export type DrawHelperDataType = {
  schools: LeafletSchoolType[];
  selected: (LeafletStopType | LeafletSchoolType)[];
  stops: LeafletStopType[];
  capacity: number;
  timeLimitSeconds: number;
  nbLimitSolution: number;
};
