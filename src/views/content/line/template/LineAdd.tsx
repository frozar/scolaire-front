import { BusLineEntity, LineType } from "../../../../_entities/line.entity";
import { BusLineService } from "../../../../_services/line.service";
import { LineStore } from "../../../../_stores/line.store";
import {
  addNewGlobalSuccessInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { ViewManager } from "../../ViewManager";
import { LineAddOrUpdate } from "./LineAddOrUpdate";

export function LineAdd() {
  async function submit(line: LineType) {
    enableSpinningWheel();
    const newBusLine: LineType = await BusLineService.create(line);
    LineStore.add(newBusLine);
    disableSpinningWheel();
    addNewGlobalSuccessInformation(newBusLine.name + " a été créé");
    ViewManager.lines();
  }

  return (
    <div>
      <LineAddOrUpdate
        line={BusLineEntity.defaultBusLine()}
        submitFunction={submit}
      />
    </div>
  );
}
