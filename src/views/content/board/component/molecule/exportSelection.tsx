import { JSXElement, Setter, createSignal } from "solid-js";
import { GtfsService } from "../../../../../_services/gtfs.service";
import Button from "../../../../../component/atom/Button";
import { CsvUtils } from "../../../../../utils/csv.utils";
import { DialogUtils } from "../../../../../utils/dialog.utils";
import { CsvEnum } from "./ImportSelection";

export function ExportSelection(): JSXElement {
  const [exportGtfs, setExportGtfs] = createSignal(false);
  const [exportSchools, setExportSchools] = createSignal(false);
  const [exportStops, setExportStops] = createSignal(false);
  const [exportStudent, setExportStudent] = createSignal(false);

  function onClick(): void {
    if (exportGtfs()) GtfsService.get();
    if (exportSchools()) CsvUtils.exportCsv(CsvEnum.schools);
    if (exportStops()) CsvUtils.exportCsv(CsvEnum.stops);
    if (exportStudent()) CsvUtils.exportStudentsCsv();

    DialogUtils.closeDialog();
  }

  return (
    // TODO: Refactor checkbox component and use everywhere
    <>
      <div id="import-dialog-title">Séléctionner le type d'export :</div>

      <div class="input-checkbox">
        <div class="flex">
          <input
            type="checkbox"
            onChange={(event) => onChange(setExportGtfs, event.target.checked)}
          />
          <label>GTFS</label>
        </div>
      </div>

      <div class="input-checkbox">
        <div class="flex">
          <input
            type="checkbox"
            onChange={(event) =>
              onChange(setExportSchools, event.target.checked)
            }
          />
          <label>Établissements</label>
        </div>
      </div>

      <div class="input-checkbox">
        <div class="flex">
          <input
            type="checkbox"
            onChange={(event) => onChange(setExportStops, event.target.checked)}
          />
          <label>Arrêts</label>
        </div>
      </div>

      <div class="input-checkbox">
        <div class="flex">
          <input
            type="checkbox"
            onChange={(event) =>
              onChange(setExportStudent, event.target.checked)
            }
          />
          <label>Élèves</label>
        </div>
      </div>

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

function onChange(setter: Setter<boolean>, checked: boolean) {
  setter(checked);
}
