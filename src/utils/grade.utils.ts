import { getSchools } from "../views/content/map/component/organism/SchoolPoints";

export namespace GradeUtils {
  export function getName(gradeId: number) {
    return getSchools()
      .flatMap((school) => school.grades)
      .filter((grade) => grade.id == gradeId)[0].name;
  }
}
