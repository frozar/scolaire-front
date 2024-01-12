import { DrawHelperEntity } from "../_entities/drawhelper.entity";
import { TripPointType } from "../_entities/trip.entity";
import {
  DrawHelperDataType,
  GraphicageService,
} from "../_services/graphicage.service";
import { disableSpinningWheel, enableSpinningWheel } from "../signaux";
import { CurrentDrawTripUtils } from "./currentDrawTrip.utils";

export namespace DrawHelperUtils {
  export async function drawHelper(data: DrawHelperDataType) {
    enableSpinningWheel();
    const response = await GraphicageService.drawHelper(data);

    //TODO Resolve type problem and add quantity here ?
    const points: TripPointType[] = DrawHelperEntity.formatTripPoints(response);

    CurrentDrawTripUtils.updatePoints(points);
    CurrentDrawTripUtils.updateTripPoints(points);

    disableSpinningWheel();
  }
}
