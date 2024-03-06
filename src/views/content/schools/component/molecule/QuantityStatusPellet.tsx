import { Match, Show, Switch, createEffect, createSignal } from "solid-js";
import { getLines } from "../../../../../_stores/line.store";
import { PelletIcon } from "../../../../../icons/CirclePellet";
import { SchoolUtils } from "../../../../../utils/school.utils";
import Tooltip from "../../../map/rightMapMenu/component/atom/Tooltip";

enum RemainingStatusEnum {
  allTaken,
  partialTaken,
  NoOneTaken,
}

export function QuantityStatusPellet(props: { schoolId: number }) {
  const [tooltipIsDisplayed, setTooltipIsDisplayed] = createSignal(false);
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
    <div
      onMouseOver={() => setTooltipIsDisplayed(true)}
      onMouseLeave={() => setTooltipIsDisplayed(false)}
    >
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

      <Show when={tooltipIsDisplayed()}>
        <div class={"absolute transform  "}>
          <Switch>
            <Match when={remainingStatus() == RemainingStatusEnum.NoOneTaken}>
              <Tooltip tooltip="Aucun élèves récupérées" />
            </Match>
            <Match when={remainingStatus() == RemainingStatusEnum.partialTaken}>
              <Tooltip tooltip="Une partie des élèves récupérées" />
            </Match>
            <Match when={remainingStatus() == RemainingStatusEnum.allTaken}>
              <Tooltip tooltip="Tous les élèves récupérées" />
            </Match>
          </Switch>
        </div>
      </Show>
    </div>
  );
}
