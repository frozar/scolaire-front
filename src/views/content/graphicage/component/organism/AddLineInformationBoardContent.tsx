import { Show } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import Button from "../../../../../component/atom/Button";
import TimelineAddMode from "../../informationBoard/TimelineAddMode";
import { DrawHelperButton } from "../atom/DrawHelperButton";
import SelectedSchool from "../atom/SelectedSchool";
import "./AddLineInformationBoardContent.css";
import { LeafletSchoolType } from "./SchoolPoints";

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

  return (
    <div class="add-line-information-board-content">
      <div class="add-line-information-board-content-header">
        <Show when={etablissementSelected()}>
          <SelectedSchool
            schoolSelected={etablissementSelected() as LeafletSchoolType[]}
          />
        </Show>

        <Show
          when={typeof etablissementSelected() != "undefined" && isValidate()}
        >
          <DrawHelperButton schools={etablissementSelected()} />
        </Show>
      </div>

      <Show
        when={
          etablissementSelected() &&
          etablissementSelected()?.length != 0 &&
          !getLineUnderConstruction().confirmSelection
        }
      >
        <div class="confirm-etablissement-selection">
          <Button onClick={confirmEtablissementSelection} label="Valider" />
        </div>
      </Show>
      <Show when={getLineUnderConstruction().stops.length != 0}>
        <div class="bus-line-information-board-content">
          <TimelineAddMode
            line={getLineUnderConstruction}
            setLine={setLineUnderConstruction}
          />
        </div>
      </Show>
    </div>
  );
}
