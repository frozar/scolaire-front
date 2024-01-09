import { JSXElement, createSignal } from "solid-js";
import { GtfsEntity } from "../../../../../_entities/gtfs.entity";
import { GtfsService } from "../../../../../_services/gtfs.service";
import Button from "../../../../../component/atom/Button";
import { addNewUserInformation } from "../../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../../type";
import { CsvUtils } from "../../../../../utils/csv.utils";
import { DialogUtils } from "../../../../../utils/dialog.utils";
import { ExportSelectionCheckbox } from "../atom/exportSelectionCheckbox";
import { CsvEnum } from "./ImportSelection";

export function ExportSelection(): JSXElement {
  const [exportGtfs, setExportGtfs] = createSignal(false);
  const [exportSchools, setExportSchools] = createSignal(false);
  const [exportStops, setExportStops] = createSignal(false);
  const [exportStudent, setExportStudent] = createSignal(false);

  function onClick(): void {
    if (exportGtfs()) {
      const data = GtfsEntity.formatData();
      if (!GtfsEntity.isDataValid(data)) {
        addNewUserInformation({
          displayed: true,
          level: MessageLevelEnum.error,
          type: MessageTypeEnum.global,
          content: "Données manquantes pour produire un GTFS",
        });
      } else {
        GtfsService.get(data);
      }
    }
    if (exportSchools()) CsvUtils.exportCsv(CsvEnum.schools);
    if (exportStops()) CsvUtils.exportCsv(CsvEnum.stops);
    if (exportStudent()) CsvUtils.exportStudentsCsv();

    DialogUtils.closeDialog();
  }

  return (
    <>
      <div id="import-dialog-title">Séléctionner le type d'export :</div>
      <ExportSelectionCheckbox label="GTFS" setter={setExportGtfs} />
      <ExportSelectionCheckbox
        label="Établissements"
        setter={setExportSchools}
      />
      <ExportSelectionCheckbox label="Arrêts" setter={setExportStops} />
      <ExportSelectionCheckbox label="Élèves" setter={setExportStudent} />

      {/* TODO: Refactor footer dialog content */}
      <div class="import-dialog-buttons">
        <Button
          onClick={DialogUtils.closeDialog}
          label={"Annuler"}
          variant="danger"
          isDisabled={false}
        />
        <Button
          onClick={onClick}
          label={"Valider"}
          variant="primary"
          isDisabled={
            exportGtfs() == false &&
            exportSchools() == false &&
            exportStops() == false &&
            exportStudent() == false
          }
        />
      </div>
    </>
  );
}
