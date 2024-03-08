import { Show } from "solid-js";
import { QuantityUtils } from "../../../../../utils/quantity.utils";
import { stopDetails } from "../template/StopDetails";

export function RemainingStudentInformation() {
  return (
    //TODO passer le stop en paramètre
    <Show
      when={QuantityUtils.stopHasRemainingStudentToGet(
        stopDetails()?.id as number
      )}
    >
      Des élèves restent à transporter
    </Show>
  );
}
