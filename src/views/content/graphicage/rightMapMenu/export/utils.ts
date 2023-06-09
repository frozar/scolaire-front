import { getExportConfirmationDialogBox } from "../../../../../signaux";
import { ExportTypeEnum } from "../../../../../type";
import { exportCsv } from "./csvExport";
import { exportGtfs } from "./gtfsExport";
import { exportImages } from "./imageExport";

const exportHandlers = {
  [ExportTypeEnum.gtfs]: exportGtfs,
  [ExportTypeEnum.csv]: exportCsv,
  [ExportTypeEnum.image]: exportImages,
};

export function getTimestamp() {
  const date = new Date();
  const zeroPad = (num: number, places: number) =>
    String(num).padStart(places, "0");
  const year = date.getFullYear();
  const month = zeroPad(date.getMonth() + 1, 2);
  const day = zeroPad(date.getDate(), 2);
  const hour = zeroPad(date.getHours(), 2);
  const minute = zeroPad(date.getMinutes(), 2);
  const second = zeroPad(date.getSeconds(), 2);

  return { year, month, day, hour, minute, second };
}

export function exportData() {
  const exportType = getExportConfirmationDialogBox()["exportType"];
  if (exportType == null) {
    return;
  }
  exportHandlers[exportType]();
}
