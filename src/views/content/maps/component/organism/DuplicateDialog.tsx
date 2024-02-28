import { createSignal } from "solid-js";
import { useStateGui } from "../../../../../StateGui";
import { userMaps } from "../../../../../_stores/map.store";
import Button from "../../../../../component/atom/Button";
import CardTitle from "../../../../../component/atom/CardTitle";
import { LabeledCheckbox } from "../../../../../component/molecule/LabeledCheckbox";
import {
  DuplicateUtils,
  setInDucplication,
} from "../../../../../utils/duplicate.utils";
import { Dialog } from "../../../board/component/molecule/Dialog";

const [, { getActiveMapId }] = useStateGui();

enum FieldToDuplicateEnum {
  trips,
  paths,
  calendars,
  lines,
  calendarPeriod,
  hours,
}

type DuplicateField = {
  trips: boolean;
  paths: boolean;
  calendar: boolean;
  lines: boolean;
};

export const [fieldToDuplicate, setFieldToDuplciate] =
  createSignal<DuplicateField>({
    trips: false,
    paths: false,
    calendar: false,
    lines: false,
  });

function updateFieldToDuplicate(field: FieldToDuplicateEnum) {
  setFieldToDuplciate((prev) => {
    const fields_ = { ...prev };

    switch (field) {
      case FieldToDuplicateEnum.lines:
        if (!fields_.lines) {
          console.log("select line");
          fields_.trips = true;
          fields_.paths = true;
        } else {
          console.log("deselect lione");
          fields_.trips = false;
          fields_.paths = false;
        }

        fields_.lines = !fields_.lines;
        break;
      case FieldToDuplicateEnum.trips:
        fields_.trips = !fields_.trips;
        break;
      case FieldToDuplicateEnum.paths:
        fields_.paths = !fields_.paths;
        break;
      case FieldToDuplicateEnum.calendars:
        fields_.calendar = !fields_.calendar;
        break;
    }

    return fields_;
  });
}

export function DuplicateDialog() {
  const mapToDuplicate = userMaps().filter(
    (map) => map.id === getActiveMapId()
  )[0];

  return (
    <Dialog>
      <CardTitle title={"Duplication de la carte " + mapToDuplicate.name} />

      <p>Sélectionner ce qui dois être dupliquer:</p>

      <LabeledCheckbox
        checked={fieldToDuplicate().lines}
        label="Lignes"
        onChange={() => updateFieldToDuplicate(FieldToDuplicateEnum.lines)}
      />
      <LabeledCheckbox
        disabled={!fieldToDuplicate().lines}
        checked={fieldToDuplicate().trips}
        label="Courses"
        onChange={() => updateFieldToDuplicate(FieldToDuplicateEnum.trips)}
      />
      <LabeledCheckbox
        disabled={!fieldToDuplicate().lines}
        checked={fieldToDuplicate().paths}
        label="Chemins"
        onChange={() => updateFieldToDuplicate(FieldToDuplicateEnum.paths)}
      />

      <LabeledCheckbox
        checked={fieldToDuplicate().paths}
        label="Calendriers"
        onChange={() => updateFieldToDuplicate(FieldToDuplicateEnum.calendars)}
      />

      <div class="flex justify-end gap-2">
        <Button
          variant="danger"
          label="Annuler"
          onClick={() => setInDucplication(false)}
        />
        <Button label="Valider" onClick={() => DuplicateUtils.duplicate()} />
      </div>
    </Dialog>
  );
}
