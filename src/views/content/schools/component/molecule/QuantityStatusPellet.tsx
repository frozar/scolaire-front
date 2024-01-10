import { Match, Switch, createEffect, createSignal } from "solid-js";
import { PelletIcon } from "../../../../../icons/CirclePellet";
import { SchoolUtils } from "../../../../../utils/school.utils";
import { getLines } from "../../../map/component/organism/BusLines";

enum RemainingStatusEnum {
  allTaken,
  partialTaken,
  NoOneTaken,
}

export function QuantityStatusPellet(props: { schoolId: number }) {
  const [remainingStatus, setRemainingStatus] =
    createSignal<RemainingStatusEnum>(RemainingStatusEnum.NoOneTaken);

  createEffect(() => {
    if (getLines().length > 0) {
      const goingComingHasRemainging = SchoolUtils.hasRemainingStudentToGet(
        props.schoolId
      );

      if (goingComingHasRemainging[0] && goingComingHasRemainging[1])
        setRemainingStatus(RemainingStatusEnum.NoOneTaken);
      else if (goingComingHasRemainging[0] != goingComingHasRemainging[1])
        setRemainingStatus(RemainingStatusEnum.partialTaken);
      else setRemainingStatus(RemainingStatusEnum.allTaken);
    }
  });
  return (
    <Switch>
      <Match when={remainingStatus() == RemainingStatusEnum.NoOneTaken}>
        <PelletIcon color="red" />
      </Match>
      <Match when={remainingStatus() == RemainingStatusEnum.partialTaken}>
        <PelletIcon color="orange" />
      </Match>
      <Match when={remainingStatus() == RemainingStatusEnum.allTaken}>
        <PelletIcon color="green" />
      </Match>
    </Switch>
  );
}
