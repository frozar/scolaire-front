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
    //TODO: Find a way to sort data so storybook tests doesn't fail anymore
    // getSchools().sort((a, b) => a.name.localeCompare(b.name));
  }

  export function get(schoolId: number): SchoolType {
    return getSchools().find((school) => school.id == schoolId) as SchoolType;
  }

  export function add(school: SchoolType) {
    set((prev) => {
      return [...prev, school];
    });
  }

  export function getAllOfGrades(grades: GradeType[]): SchoolType[] {
    const gradesId: number[] = grades.map((grade) => grade.id) as number[];

    const output: SchoolType[] = [];
    for (const school of getSchools()) {
      if (
        school.grades.some((grade) => grade.id && gradesId.includes(grade.id))
      ) {
        output.push(school);
      }
    }

    return output;
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

  export function getGradeFromId(id: number) {
    for (const school of getSchools()) {
      for (const grade of school.grades) {
        if (grade.id && id == grade.id) {
          return grade;
        }
      }
    }
  }

  export function editGrade(grade: GradeType) {
    const schoolToUpdate = get(grade.schoolId as number);

    const gradeIndex = schoolToUpdate.grades.findIndex(
      (item) => item.id == grade.schoolId
    );
    schoolToUpdate.grades[gradeIndex] = grade;

    const schoolIndex = getSchools().findIndex(
      (item) => item.id == grade.schoolId
    );

    set((prev) => {
      if (!prev) return prev;
      const schools = [...prev];
      schools[schoolIndex] = schoolToUpdate;

      return schools;
    });
  }
}
