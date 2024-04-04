import { createSignal } from "solid-js";
import { LineType } from "../../../../_entities/line.entity";

import { BusLineService } from "../../../../_services/line.service";
import { LineStore } from "../../../../_stores/line.store";
import {
  addNewGlobalSuccessInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { ViewManager } from "../../ViewManager";
import { LineCreateOrUpdateStepper } from "../organism/LineCreateOrUpdateStepper";

export const [editLine, setEditLine] = createSignal<LineType>();

export function LineEdit() {
  return (
    <LineCreateOrUpdateStepper
      line={editLine() as LineType}
      firstPrevious={() => ViewManager.lineDetails(editLine() as LineType)}
      lastNext={register}
    />
  );
}

async function register(line: LineType) {
  enableSpinningWheel();
  const editedLine: LineType = await BusLineService.update(line);
  LineStore.update(editedLine);
  disableSpinningWheel();
  ViewManager.lines();
  addNewGlobalSuccessInformation(line.name + " a été modifié");
}
