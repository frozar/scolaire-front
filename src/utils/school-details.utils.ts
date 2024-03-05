import { SchoolType } from "../_entities/school.entity";
import { SchoolStore } from "../_stores/school.store";
import {
  schoolDetailEditing,
  schoolDetailsItem,
  setSchoolDetailEditing,
  setSchoolDetailsItem,
} from "../views/content/schools/component/organism/SchoolDetails";
import { SchoolUtils } from "./school.utils";

export namespace SchoolDetailUtils {
  export async function edit() {
    if (!schoolDetailEditing()) {
      setSchoolDetailEditing(true);
    } else {
      if (
        SchoolUtils.isValidSchool(schoolDetailsItem() as SchoolType) &&
        SchoolUtils.get(schoolDetailsItem()?.id ?? 0) != schoolDetailsItem()
      ) {
        SchoolStore.update(schoolDetailsItem() as SchoolType);
        setSchoolDetailEditing(false);
      }
    }
  }

  export function update(schoolDetails: Partial<SchoolType>) {
    setSchoolDetailsItem((prev) => {
      if (!prev) return prev;
      return { ...prev, ...schoolDetails };
    });
  }
}
