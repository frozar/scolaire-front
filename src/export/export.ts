import { getExportConfirmation } from "../signaux";
import { ExportTypeEnum } from "../type";
import { exportGtfs } from "./gtfsExport";
import { exportImages } from "./imageExport";

const exportHandlers = {
  [ExportTypeEnum.gtfs]: exportGtfs,
  [ExportTypeEnum.image]: exportImages,
};

export function exportData() {
  const exportType = () => getExportConfirmation()["exportType"];
  const type = exportType();
  if (!type && type !== ExportTypeEnum.gtfs) {
    return;
  }
  exportHandlers[type]();
}
