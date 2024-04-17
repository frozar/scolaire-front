import { createSignal } from "solid-js";
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

export const [editLine, setEditLine] = createSignal<LineType>(
  BusLineEntity.defaultBusLine()
);

export function LineEdit() {
  async function submit(line: LineType) {
    enableSpinningWheel();
    const updated = await BusLineService.update(line);
    LineStore.set((prev) => {
      return prev.map((line) => {
        if (line.id == updated.id) return updated;
        return line;
      });
    });
    disableSpinningWheel();
    ViewManager.lineDetails(updated);
    addNewGlobalSuccessInformation(updated.name + " a bien édité");
  }

  return (
    <div>
      <LineAddOrUpdate line={editLine()} submitFunction={submit} />
    </div>
  );
}
