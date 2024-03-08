import { LabeledInputNumber } from "../../../../../component/molecule/LabeledInputNumber";
import { SchoolUtils } from "../../../../../utils/school.utils";
import CollapsibleElement from "../../../board/component/organism/CollapsibleElement";
import { schoolDetailEditing, schoolDetails } from "../template/SchoolDetails";

export function SchoolSettings() {
  function onChangeWaitingTime(element: HTMLInputElement) {
    if (!element.value || element.value === "")
      element.value = schoolDetails()?.waitingTime.toString() as string;
    SchoolUtils.updateSchoolDetails({ waitingTime: Number(element.value) });
  }

  return (
    <CollapsibleElement title="Paramètres">
      <LabeledInputNumber
        label="Temps d'attente en seconde sur l'école "
        onChange={onChangeWaitingTime}
        selector={{
          value: schoolDetails()?.waitingTime as number,
          disabled: !schoolDetailEditing(),
        }}
      />
    </CollapsibleElement>
  );
}
