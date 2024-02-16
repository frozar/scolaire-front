import { LabeledInputNumber } from "../../../../../component/molecule/LabeledInputNumber";
import { SchoolUtils } from "../../../../../utils/school.utils";
import CollapsibleElement from "../../../board/component/organism/CollapsibleElement";
import { schoolDetailEditing, schoolDetailsItem } from "./SchoolDetails";

export function SchoolSettings() {
  function onChangeWaitingTime(element: HTMLInputElement) {
    if (!element.value || element.value === "")
      element.value = schoolDetailsItem()?.waitingTime.toString() as string;
    SchoolUtils.updateSchoolDetails({ waitingTime: Number(element.value) });
  }

  return (
    <CollapsibleElement title="Paramètres">
      <LabeledInputNumber
        label="Temps d'attente en seconde sur l'école "
        onChange={onChangeWaitingTime}
        selector={{
          value: schoolDetailsItem()?.waitingTime as number,
          disabled: !schoolDetailEditing(),
        }}
      />
    </CollapsibleElement>
  );
}
