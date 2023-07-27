import { Show } from "solid-js";
import Timeline from "../../informationBoard/Timeline";
import { lineUnderConstructionStopNames } from "../../line/busLinesUtils";

export default function () {
  return (
    <>
      <p>AddLineInformationBoardContent</p>
      <Show when={lineUnderConstructionStopNames().length != 0}>
        <Timeline stopNames={lineUnderConstructionStopNames()} />
      </Show>
    </>
  );
}
