import { GradeType } from "../_entities/grade.entity";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";

export namespace GradeUtils {
  function getGrade(gradeId: number): GradeType {
    return getSchools()
      .flatMap((school) => school.grades)
      .filter((grade) => grade.id == gradeId)[0];
  }
  // ! Useless ?
  export function getName(gradeId: number): string {
    // return getSchools()
    //   .flatMap((school) => school.grades)
    //   .filter((grade) => grade.id == gradeId)[0].name;
    return getGrade(gradeId).name;
  }
  //! useles ?
  export function getSchoolId(gradeId: number): number {
    // const test =  getSchools()
    //   .flatMap((school) => school.grades)
    //   .filter((grade) => grade.id == gradeId)[0];
    return getSchools().filter((school) =>
      school.grades.some((grade) => grade.id == gradeId)
    )[0].id;
    // ! schoolId est manquant (undefined)
    // return getGrade(gradeId).schoolId as number;
  }
}
