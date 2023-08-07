import { Show } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import Button from "../../../../../component/atom/Button";
import { PointRamassageType } from "../../../../../type";
import TimelineAddMode from "../../informationBoard/TimelineAddMode";
import { lineUnderConstructionStopNames } from "../../line/busLinesUtils";
import BuildLineButton from "../atom/BuildLineButton";
import SelectedSchool from "../atom/SelectedSchool";
import SelectedSchoolItem from "../atom/SelectedSchoolItem";

const [
  ,
  {
    getLineUnderConstruction,
    setLineUnderConstruction,
    confirmEtablissementSelection,
  },
] = useStateAction();

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
  //TODO Refactor all
  return (
    <>
      <div class="mb-2 flex mr-3 w-full justify-between items-center p-2">
        <p />
        <Show
          when={
            etablissementSelected() &&
            etablissementSelected()?.length != 0 &&
            getLineUnderConstruction().confirmSelection
          }
          fallback={<p>Sélectionner un établissement</p>}
        >
          <SelectedSchoolItem
            etablissement={etablissementSelected()[0] as PointRamassageType}
          />
        </Show>

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
      {/* TODO: Fix timeline */}
      <Show when={getLineUnderConstruction().stops.length != 0}>
        <TimelineAddMode
          line={getLineUnderConstruction}
          setLine={setLineUnderConstruction}
        />
      </Show>
    </>
  );
}
