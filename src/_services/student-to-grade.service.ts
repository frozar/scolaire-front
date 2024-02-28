import {
  AssociatedSchoolType,
  AssociatedStopType,
  EntityUtils,
} from "../_entities/_utils.entity";
import {
  SchoolDBType,
  SchoolEntity,
  SchoolType,
} from "../_entities/school.entity";
import {
  DBAssociatedStop,
  StopDBType,
  StopEntity,
  StopType,
} from "../_entities/stop.entity";
import { StudentToGradeEntity } from "../_entities/student-to-grade.entity";
import { StudentDiffType, StudentModifiedDiff } from "../utils/csv.utils";
import { GradeUtils } from "../utils/grade.utils";
import { SchoolUtils } from "../utils/school.utils";
import { StopUtils } from "../utils/stop.utils";
import { setSchools } from "../views/content/map/component/organism/SchoolPoints";
import { setStops } from "../views/content/map/component/organism/StopPoints";
import { ServiceUtils } from "./_utils.service";

export type StudentToGrade = {
  id: number;
  school_name: string;
  stop_name: string;
  class_name: string;
  quantity: number;
};

export class StudentToGradeService {
  static async import(
    students_to_grades: Omit<StudentToGrade, "id">[]
  ): Promise<{ schools: SchoolType[]; stops: StopType[] }> {
    const xanoResult: { schools: SchoolDBType[]; stops: StopDBType[] } =
      await ServiceUtils.post("/student-to-grade/import", {
        students_to_grades: students_to_grades,
      });

    const new_schools = xanoResult.schools.map((dbSchool) =>
      SchoolEntity.build(dbSchool)
    );

    const new_stops = xanoResult.stops.map((dbStop) =>
      StopEntity.build(dbStop)
    );

    return { schools: new_schools, stops: new_stops };
  }

  // TODO: Rewrite / refactor
  static async importStudents(
    studentDiffFiltered: Omit<StudentDiffType, "nbOfLineIgnored">
  ) {
    // TODO: Clean
    type studentDBType = {
      added: { stop_id: number; grade_id: number; quantity: number }[];
      added_with_grade: {
        stop_id: number;
        quantity: number;
        grade_name: string;
      }[];
      modified: StudentModifiedDiff[];
      deleted: number[];
      new_grades: { name: string; school_id: number }[];
    };

    const added: { stop_id: number; grade_id: number; quantity: number }[] = [];
    const added_with_grade: {
      stop_id: number;
      quantity: number;
      grade_name: string;
    }[] = [];
    const existingGradeNames = GradeUtils.getAll().map((grade) => grade.name);

    for (const _added of studentDiffFiltered.added) {
      // Case grade already exist
      if (existingGradeNames.includes(_added.grade_name)) {
        added.push({
          stop_id: StopUtils.getIdFromName(_added.stop_name),
          grade_id: GradeUtils.getIdFromName(_added.grade_name),
          quantity: _added.quantity,
        });
        // Case new grade
      } else {
        added_with_grade.push({
          stop_id: StopUtils.getIdFromName(_added.stop_name),
          quantity: _added.quantity,
          grade_name: _added.grade_name,
        });
      }
    }

    const new_grades = studentDiffFiltered.newGrades.map((newGrade) => {
      return {
        name: newGrade.gradeName,
        school_id: SchoolUtils.getIdFromName(newGrade.schoolName),
      };
    });

    const studentDB: studentDBType = {
      added,
      modified: studentDiffFiltered.modified,
      deleted: studentDiffFiltered.deleted,
      new_grades,
      added_with_grade,
    };

    // TODO: Put in a "student_to_grade" service file ?
    const xanoResult: {
      schools: { school: SchoolDBType[] };
      stops: { stop: StopDBType[] };
    } = await ServiceUtils.post("/student/import", studentDB);

    setSchools(
      xanoResult.schools.school.map((school) => SchoolEntity.build(school))
    );
    setStops(xanoResult.stops.stop.map((stop) => StopEntity.build(stop)));
  }

  static async create(
    gradeToSchool: Omit<AssociatedStopType, "idClassToSchool">,
    schoolId: number
  ): Promise<AssociatedSchoolType> {
    const dbFormat = StudentToGradeEntity.dbFormat(gradeToSchool, schoolId);
    const response: DBAssociatedStop = await ServiceUtils.post(
      "/student-to-grade",
      dbFormat
    );
    return EntityUtils.formatAssociatedGradeToSchoolForStop([response])[0];
  }

  static async update(
    gradeToSchool: AssociatedStopType,
    schoolId: number
  ): Promise<AssociatedSchoolType> {
    const dbFormat = StudentToGradeEntity.dbFormat(gradeToSchool, schoolId);
    const response: DBAssociatedStop = await ServiceUtils.patch(
      "/student-to-grade/" + gradeToSchool.idClassToSchool,
      dbFormat
    );
    return EntityUtils.formatAssociatedGradeToSchoolForStop([response])[0];
  }

  // Backend will return only the id deleted
  static async delete(id: number): Promise<number> {
    const response = await ServiceUtils.delete("/student-to-grade/" + id);
    return response;
  }
}
