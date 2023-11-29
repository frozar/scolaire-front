import _ from "lodash";
import Papa from "papaparse";
import { LocationDBType } from "../_entities/_utils.entity";
import { SchoolDBType, SchoolType } from "../_entities/school.entity";
import { StopDBType, StopEntity, StopType } from "../_entities/stop.entity";
import { SchoolService } from "../_services/school.service";
import { StopService } from "../_services/stop.service";
import {
  StudentToGrade,
  StudentToGradeService,
} from "../_services/student-to-grade.service";
import { addNewUserInformation } from "../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../type";
import { download } from "../utils";
import { CsvEnum } from "../views/content/board/component/molecule/ImportSelection";
import {
  getSchools,
  setSchools,
} from "../views/content/map/component/organism/SchoolPoints";
import {
  getStops,
  setStops,
} from "../views/content/map/component/organism/StopPoints";
import { GradeUtils } from "./grade.utils";
import { SchoolUtils } from "./school.utils";
import { StopUtils } from "./stop.utils";

export type CsvDiffType = {
  added: string[]; // names
  modified: number[]; // ids
  deleted: number[]; // ids
};

export type importItemDBType = {
  items_to_add: Pick<SchoolDBType, "name" | "location">[];
  items_to_modify: Pick<SchoolDBType, "id" | "location">[];
  items_to_delete: number[];
};

type studentExportType = {
  school_name: string;
  stop_name: string;
  grade_name: string;
  quantity: number;
};

type ItemExportType = {
  name: string;
  lat: number;
  lon: number;
};

export namespace CsvUtils {
  export async function importItems(
    file: File,
    filteredDiffs: CsvDiffType,
    importType: CsvEnum
  ): Promise<(StopType | SchoolType)[]> {
    const parsedFileData = (await parseCsvItem(file)) as Omit<
      StopDBType,
      "id" | "associated_grade"
    >[];

    const diffDBData: importItemDBType = {
      items_to_add: [],
      items_to_modify: [],
      items_to_delete: [],
    };

    filteredDiffs.deleted.forEach((itemId) =>
      diffDBData.items_to_delete.push(itemId)
    );
    filteredDiffs.added.forEach((name) => {
      const item = parsedFileData.filter((item) => item.name == name)[0];
      diffDBData.items_to_add.push(item);
    });
    filteredDiffs.modified.forEach((diffItem) => {
      let item: StopType | SchoolType;
      if (importType == CsvEnum.schools) item = SchoolUtils.get(diffItem);
      else item = StopUtils.get(diffItem);

      const location = parsedFileData.filter(
        (data) => data.name == item.name
      )[0].location;
      diffDBData.items_to_modify.push({ id: item.id, location });
    });

    if (importType == CsvEnum.schools) {
      return await SchoolService.import(diffDBData);
    } else return await StopService.import(diffDBData);
  }

  export async function getDiff(file: File, csvType: CsvEnum) {
    const csvItems = (await parseCsvItem(file)) as {
      name: string;
      location: LocationDBType;
    }[];

    const diff: CsvDiffType = { added: [], modified: [], deleted: [] };

    let items: (SchoolType | StopType)[];
    if (csvType == CsvEnum.schools) items = getSchools();
    else items = getStops();

    loop: for (const csvItem of csvItems) {
      for (const item of items) {
        // Case modified
        if (csvItem.name == item.name) {
          if (
            _.round(csvItem.location.data.lat, 12) != item.lat ||
            _.round(csvItem.location.data.lng, 12) != item.lon
          ) {
            diff.modified.push(item.id);
            continue loop;
          }
        }
      }

      // Case added
      if (!items.some((item) => item.name == csvItem.name)) {
        diff.added.push(csvItem.name);
      }
    }

    // Check if deleted
    for (const item of items) {
      if (!csvItems.some((csvItem) => csvItem.name == item.name)) {
        diff.deleted.push(item.id);
      }
    }
    return diff;
  }

  // TODO: Rewrite / Refactor
  export async function getStudentsDiff(file: File): Promise<StudentDiffType> {
    const csvItems = (await parsedCsvFileToStudentToGradeData(
      file
    )) as StudentCsv[];

    // TODO: For existing grades, check that the school_name is corresponding
    // Check if schools and stops exists otherwise don't keep the line
    const csvItemsFiltered: StudentCsv[] = [];
    csvItems.forEach((csvItem) => {
      if (
        getSchools()
          .map((school) => school.name)
          .includes(csvItem.school_name) &&
        getStops()
          .map((stop) => stop.name)
          .includes(csvItem.stop_name)
      ) {
        csvItemsFiltered.push(csvItem);
      }
    });

    // Create diff object
    const diff: StudentDiffType = {
      added: [],
      modified: [],
      deleted: [],
      newGrades: [],
    };

    // New grades
    const gradeNames = getSchools()
      .flatMap((school) => school.grades)
      .map((grade) => grade.name);

    csvItems.forEach((csvItem) => {
      if (
        !gradeNames.includes(csvItem.grade_name) &&
        !diff.newGrades.includes(csvItem.grade_name)
      )
        diff.newGrades.push(csvItem.grade_name);
    });

    loop: for (const csvItem of csvItems) {
      for (const stop of getStops()) {
        for (const associated of stop.associated) {
          if (
            SchoolUtils.getName(associated.schoolId) == csvItem.school_name &&
            stop.name == csvItem.stop_name &&
            GradeUtils.getName(associated.gradeId) == csvItem.grade_name
          ) {
            // Case modified
            if (associated.quantity != csvItem.quantity) {
              diff.modified.push({
                id: associated.idClassToSchool,
                quantity: csvItem.quantity,
              });
              continue loop;
              // Case nothing changed
            } else continue loop;
            // Case added with a new grade
          } else if (
            SchoolUtils.getName(associated.schoolId) == csvItem.school_name &&
            stop.name == csvItem.stop_name &&
            diff.newGrades.includes(csvItem.grade_name)
          ) {
            diff.added.push({ ...csvItem });
            continue loop;
          }
        }
      }
      // Case added
      diff.added.push({ ...csvItem });
    }

    // Case deleted
    for (const stop of getStops()) {
      for (const associated of stop.associated) {
        if (
          csvItems.filter(
            (csvItem) =>
              csvItem.school_name == SchoolUtils.getName(associated.schoolId) &&
              csvItem.stop_name == stop.name &&
              csvItem.grade_name == GradeUtils.getName(associated.gradeId)
          ).length == 0
        )
          diff.deleted.push(associated.idClassToSchool);
      }
    }
    return diff;
  }

  export function fileExtensionIsCsv(fileName: string) {
    const regexExtention = new RegExp(".csv$");
    if (!regexExtention.test(fileName)) {
      return false;
    }
    return true;
  }

  function getCsvBlobFromObject(
    csvItems: (ItemExportType | studentExportType)[]
  ): Blob {
    const csv = Papa.unparse(csvItems);
    return new Blob([csv], { type: "text/csv;charset=utf-8," });
  }

  export function exportCsv(type: CsvEnum.schools | CsvEnum.stops) {
    let items: (SchoolType | StopType)[] = [];
    if (type == CsvEnum.schools) items = getSchools();
    else if (type == CsvEnum.stops) items = getStops();
    else return;

    const csvItems: ItemExportType[] = [];
    items.forEach((item) =>
      csvItems.push({ name: item.name, lat: item.lat, lon: item.lon })
    );

    const blob = getCsvBlobFromObject(csvItems);

    download(`${type}.csv`, blob);
  }

  export function exportStudentsCsv(): void {
    const studentsCsv: studentExportType[] = [];

    getStops().forEach((stop) =>
      stop.associated.forEach((assoc) => {
        studentsCsv.push({
          school_name: SchoolUtils.getName(assoc.schoolId),
          stop_name: stop.name,
          grade_name: GradeUtils.getName(assoc.gradeId),
          quantity: assoc.quantity,
        });
      })
    );

    const blob = getCsvBlobFromObject(studentsCsv);

    download("students.csv", blob);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function importStudentToGradeCSVFile(parsedFileData: StudentToGrade[]) {
    const { schools, stops } = await StudentToGradeService.import(
      parsedFileData
    );
    if (stops && schools) {
      setSchools(schools);
      setStops(stops);
      return true;
    }
    return false;
  }

  async function parseFile(file: File): Promise<Papa.ParseResult<unknown>> {
    const res = new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete(results) {
          resolve(results);
        },
        error(err) {
          reject(err);
        },
      });
    });
    return res as Promise<Papa.ParseResult<unknown>>;
  }

  function isCorrectHeader(
    currentHeader: string[] | undefined,
    correctHeader: string[]
  ) {
    if (currentHeader?.toString() != correctHeader.toString()) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content:
          "Erreur de formatage du header. \n Veuillez utiliser le header suivant: ['name', 'lat', 'lon']",
      });
      return false;
    }
    return true;
  }

  async function parseCsvItem(file: File) {
    const parsedFile = await parseFile(file);

    const correctHeader = ["name", "lat", "lon"];
    if (!isCorrectHeader(parsedFile.meta.fields, correctHeader)) {
      return;
    }
    let parsedData = parsedFile.data as Pick<
      StopType,
      "name" | "lon" | "lat"
    >[];
    parsedData = parsedData.filter((data) => data.lat && data.lon && data.name);

    return StopEntity.dataToDB(parsedData);
  }

  async function parsedCsvFileToStudentToGradeData(
    file: File
  ): Promise<StudentCsv[] | undefined> {
    const parsedFile = await parseFile(file);
    const correctHeader = [
      "school_name",
      "stop_name",
      "grade_name",
      "quantity",
    ];
    if (!isCorrectHeader(parsedFile.meta.fields, correctHeader)) {
      return;
    }
    let parsedData = parsedFile.data as StudentCsv[];
    parsedData = parsedData.filter(
      (data) => data.school_name && data.stop_name && data.quantity
    );
    return parsedData;
  }
}

export type StudentCsv = {
  id?: number;
  school_name: string;
  stop_name: string;
  grade_name: string;
  quantity: number;
};

export type StudentModifiedDiff = Pick<StudentCsv, "id" | "quantity">;

export type StudentDiffType = {
  added: StudentCsv[];
  modified: StudentModifiedDiff[];
  deleted: number[]; // studentToGrade ids
  newGrades: string[]; // gradeNames
};
