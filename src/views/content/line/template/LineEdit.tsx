import { createSignal } from "solid-js";
import { LineType } from "../../../../_entities/line.entity";

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
  console.log(line);

  //TODO have to fix the Xano endpoint -> do like create endpoint
  // enableSpinningWheel();
  // const editedLine: LineType = await BusLineService.update(line);
  // LineStore.update(editedLine);
  // disableSpinningWheel();
  // ViewManager.lines();
}
