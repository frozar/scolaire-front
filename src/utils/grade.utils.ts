import { GradeType } from "../_entities/grade.entity";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";

export namespace GradeUtils {
  function getGrade(gradeId: number): GradeType {
    return getSchools()
      .flatMap((school) => school.grades)
      .filter((grade) => grade.id == gradeId)[0];
  }

  export function getName(gradeId: number): string {
    return getGrade(gradeId).name;
  }

  export function getSchoolId(gradeId: number): number {
    return getSchools().filter((school) =>
      school.grades.some((grade) => grade.id == gradeId)
    )[0].id;
  }
}
