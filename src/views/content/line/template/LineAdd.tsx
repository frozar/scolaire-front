import { BusLineEntity, LineType } from "../../../../_entities/line.entity";

import { BusLineService } from "../../../../_services/line.service";
import { LineStore } from "../../../../_stores/line.store";
import { disableSpinningWheel, enableSpinningWheel } from "../../../../signaux";
import { ViewManager } from "../../ViewManager";
import { LineCreateOrUpdateStepper } from "../organism/LineCreateOrUpdateStepper";

export function LineAdd() {
  return (
    <LineCreateOrUpdateStepper
      line={BusLineEntity.defaultBusLine()}
      firstPrevious={() => ViewManager.lines()}
      lastNext={register}
    />
  );
}

async function register(line: LineType) {
  enableSpinningWheel();
  const newBusLine: LineType = await BusLineService.create(line);
  LineStore.add(newBusLine);
  disableSpinningWheel();
  ViewManager.lines();
}
