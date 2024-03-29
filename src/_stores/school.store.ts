import { createSignal } from "solid-js";
import { GradeType } from "../_entities/grade.entity";
import { SchoolType } from "../_entities/school.entity";
import { SchoolService } from "../_services/school.service";
import { StopUtils } from "../utils/stop.utils";
import {
  schoolDetails,
  setSchoolDetails,
} from "../views/content/schools/component/template/SchoolDetails";

export const [getSchools, setSchools] = createSignal<SchoolType[]>([]);

export namespace SchoolStore {
  export function set(
    schools: SchoolType[] | ((prev: SchoolType[]) => SchoolType[])
  ) {
    setSchools(schools);
  }

  export function get(schoolId: number): SchoolType {
    return getSchools().find((school) => school.id == schoolId) as SchoolType;
  }

  export async function update(school: SchoolType) {
    const updatedSchool: SchoolType = await SchoolService.update(school);
    setSchools((prev) => {
      return [...prev].map((school_) => {
        if (school_.id == school.id) school_ = updatedSchool;
        return school_;
      });
    });

    StopUtils.reBuildGradeAssociationMatrix();

    if (schoolDetails()?.id == updatedSchool.id)
      setSchoolDetails(updatedSchool);
  }

  export function addGrade(grade: GradeType) {
    set((prev) => {
      const output = prev.map((school) => {
        if (school.id == grade.schoolId) {
          school.grades.push(grade);
        }
        return school;
      });
      return output;
    });
  }
}
