import { getExportConfirmation } from "../signaux";
import { ExportTypeEnum } from "../type";
import { exportGtfs } from "./gtfsExport";
import { exportImages } from "./imageExport";

const exportHandlers = {
  [ExportTypeEnum.gtfs]: exportGtfs,
  [ExportTypeEnum.image]: exportImages,
};

export function getExportDate() {
  const date = new Date();
  const zeroPad = (num: number, places: number) =>
    String(num).padStart(places, "0");
  const year = date.getFullYear();
  const month = zeroPad(date.getMonth(), 2);
  const day = zeroPad(date.getDate(), 2);
  const hour = zeroPad(date.getHours(), 2);
  const minute = zeroPad(date.getMinutes(), 2);

  return { year, month, day, hour, minute };
}

export function exportData() {
  const exportType = getExportConfirmation()["exportType"];
  if (exportType == null) {
    return;
  }
  exportHandlers[exportType]();
}
