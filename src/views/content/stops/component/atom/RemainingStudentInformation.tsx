import { Show } from "solid-js";
import { QuantityUtils } from "../../../../../utils/quantity.utils";
import { stopDetailsItem } from "../organism/StopDetails";

export function RemainingStudentInformation() {
  return (
    <Show
      when={QuantityUtils.stopHasRemainingStudentToGet(
        stopDetailsItem()?.id as number
      )}
    >
      Des élèves restants sont à récuperés
    </Show>
  );
}
