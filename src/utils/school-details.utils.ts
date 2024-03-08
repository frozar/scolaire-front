import { SchoolType } from "../_entities/school.entity";
import { SchoolStore } from "../_stores/school.store";
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
        SchoolStore.update(schoolDetails() as SchoolType);
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
