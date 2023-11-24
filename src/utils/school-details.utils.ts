import { SchoolType } from "../_entities/school.entity";
import {
  schoolDetailEditing,
  schoolDetails,
  setSchoolDetailEditing,
  setSchoolDetailsItem,
} from "../views/content/schools/component/organism/SchoolDetails";
import { SchoolUtils } from "./school.utils";

export namespace SchoolDetailUtils {
  export async function editSchoolDetail() {
    if (!schoolDetailEditing()) {
      setSchoolDetailEditing(true);
    } else {
      if (
        SchoolUtils.isValidSchool(schoolDetails() as SchoolType) &&
        SchoolUtils.get(schoolDetails()?.id ?? 0) != schoolDetails()
      ) {
        setSchoolDetailEditing(false);
        SchoolUtils.updateSchool(schoolDetails() as SchoolType);
      }
    }
  }

  export function updateSchoolDetails(schoolDetails: Partial<SchoolType>) {
    setSchoolDetailsItem((prev) => {
      if (!prev) return prev;
      return { ...prev, ...schoolDetails };
    });
  }
}
