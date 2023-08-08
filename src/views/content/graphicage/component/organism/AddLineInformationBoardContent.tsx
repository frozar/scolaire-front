import { Show } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import Button from "../../../../../component/atom/Button";
import TimelineAddMode from "../../informationBoard/TimelineAddMode";
import { DrawHelperButton } from "../atom/DrawHelperButton";
import SelectedSchool from "../atom/SelectedSchool";
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
    <>
      <Show
        when={typeof etablissementSelected() != "undefined" && isValidate()}
      >
        <DrawHelperButton schools={etablissementSelected()} />
      </Show>

      <Show when={etablissementSelected() && !isValidate()}>
        <SelectedSchool
          schoolSelected={etablissementSelected() as LeafletSchoolType[]}
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
