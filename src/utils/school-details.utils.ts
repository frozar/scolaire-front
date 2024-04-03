import { SchoolType } from "../_entities/school.entity";
import { SchoolStore } from "../_stores/school.store";
import {
  addNewGlobalSuccessInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../signaux";
import {
  schoolDetailEditing,
  schoolDetails,
  setSchoolDetailEditing,
  setSchoolDetails,
} from "../views/content/schools/component/template/SchoolDetails";
import { SchoolUtils } from "./school.utils";

export namespace SchoolDetailUtils {
  export async function edit() {
    if (!schoolDetailEditing()) {
      setSchoolDetailEditing(true);
    } else {
      if (
        SchoolUtils.isValidSchool(schoolDetails() as SchoolType) &&
        SchoolUtils.get(schoolDetails()?.id ?? 0) != schoolDetails()
      ) {
        enableSpinningWheel();
        await SchoolStore.update(schoolDetails() as SchoolType);
        disableSpinningWheel();
        addNewGlobalSuccessInformation("Modifications apportées");
        setSchoolDetailEditing(false);
      }
    }
  }

  export function update(schoolDetails: Partial<SchoolType>) {
    setSchoolDetails((prev) => {
      if (!prev) return prev;
      return { ...prev, ...schoolDetails };
    });
  }
}
