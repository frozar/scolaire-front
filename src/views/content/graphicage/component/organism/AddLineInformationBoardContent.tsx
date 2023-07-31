import { Show } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import Button from "../../../../../component/atom/Button";
import { PointRamassageType } from "../../../../../type";
import Timeline from "../../informationBoard/Timeline";
import {
  getTimelineInfosAddLineMode,
  lineUnderConstructionStopNames,
} from "../../line/busLinesUtils";
import BuildLineButton from "../atom/BuildLineButton";
import SelectedSchool from "../atom/SelectedSchool";

const [, { getLineUnderConstruction, confirmEtablissementSelection }] =
  useStateAction();

export default function () {
  const isValidate = () => getLineUnderConstruction().confirmSelection;
  const etablissementSelected = () =>
    getLineUnderConstruction().etablissementSelected;

  function buildLineClickHandler() {
    console.log("Etablissement selectionnés :");
    for (const etablissement of etablissementSelected() as PointRamassageType[]) {
      console.log(etablissement.name);
    }

    console.log("ramassages :");
    for (const stopName of lineUnderConstructionStopNames()) {
      console.log(stopName);
    }
  }

  return (
    <>
      <div class="mb-2 flex mr-3 w-full justify-between items-center p-2">
        <p />
        <p>Création d'une ligne</p>
        <BuildLineButton
          clickHandler={buildLineClickHandler}
          disabled={!isValidate()}
        />
      </div>

      <Show when={etablissementSelected() && !isValidate()}>
        <SelectedSchool
          schoolSelected={etablissementSelected() as PointRamassageType[]}
        />
      </Show>

      <Show
        when={
          etablissementSelected() &&
          etablissementSelected()?.length != 0 &&
          !getLineUnderConstruction().confirmSelection
        }
      >
        <Button onClick={confirmEtablissementSelection} label="Valider" />
      </Show>
      {/* TODO: Make it display correct quantities */}
      <Show when={getTimelineInfosAddLineMode().length != 0}>
        <Timeline item={getTimelineInfosAddLineMode()} />
      </Show>
    </>
  );
}
