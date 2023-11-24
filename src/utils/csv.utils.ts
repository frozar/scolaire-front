import Papa from "papaparse";
import {
  SchoolDBType,
  SchoolEntity,
  SchoolType,
  importSchoolsDBType,
} from "../_entities/school.entity";
import { StopDBType, StopEntity, StopType } from "../_entities/stop.entity";
import { SchoolService } from "../_services/school.service";
import { StopService } from "../_services/stop.service";
import {
  StudentToGrade,
  StudentToGradeService,
} from "../_services/student-to-grade.service";
import { addNewUserInformation } from "../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../type";
import {
  getSchools,
  setSchools,
} from "../views/content/map/component/organism/SchoolPoints";
import { setStops } from "../views/content/map/component/organism/StopPoints";
import { SchoolUtils } from "./school.utils";

export type SchoolsCsvDiffType = {
  added: string[]; // schoolNames
  modified: number[]; // ids
  deleted: number[]; // ids
};

export namespace CsvUtils {
  export async function importSchools(
    file: File,
    filteredDiffs: SchoolsCsvDiffType
  ): Promise<SchoolType[]> {
    const parsedFileData = (await parseCsvFileToSchoolData(file)) as Pick<
      SchoolDBType,
      "name" | "location"
    >[];

    const diffDBData: importSchoolsDBType = {
      schools_to_add: [],
      schools_to_modify: [],
      schools_to_delete: [],
    };
    filteredDiffs.deleted.forEach((schoolIid) =>
      diffDBData.schools_to_delete.push(schoolIid)
    );
    filteredDiffs.added.forEach((name) => {
      const school = parsedFileData.filter((school) => school.name == name)[0];
      diffDBData.schools_to_add.push(school);
    });
    filteredDiffs.modified.forEach((schoolId) => {
      const school = SchoolUtils.get(schoolId);
      const location = parsedFileData.filter(
        (data) => data.name == school.name
      )[0].location;
      diffDBData.schools_to_modify.push({ id: school.id, location });
    });

    return await SchoolService.import(diffDBData);
  }
  export async function getImportSchoolsCsvDiff(
    file: File
  ): Promise<SchoolsCsvDiffType> {
    const schoolsFromCsv = (await parseCsvFileToSchoolData(file)) as Pick<
      SchoolDBType,
      "name" | "location"
    >[];

    const diff: SchoolsCsvDiffType = { added: [], modified: [], deleted: [] };

    // Check if modified or added
    loop: for (const schoolFromCsv of schoolsFromCsv) {
      for (const school of getSchools()) {
        // Case modified
        if (schoolFromCsv.name == school.name) {
          if (
            schoolFromCsv.location.data.lat != school.lat ||
            schoolFromCsv.location.data.lng != school.lon
          ) {
            diff.modified.push(school.id);
            continue loop;
          }
        }
      }

      // Case added
      if (!getSchools().some((school) => school.name == schoolFromCsv.name)) {
        diff.added.push(schoolFromCsv.name);
      }
    }

    // Check if deleted
    for (const school of getSchools()) {
      if (
        !schoolsFromCsv.some(
          (schoolFromCsv) => schoolFromCsv.name == school.name
        )
      ) {
        diff.deleted.push(school.id);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function importStopCSVFile(
    parsedFileData: Pick<StopDBType, "name" | "location">[]
  ) {
    const stops: StopType[] = await StopService.import(
      parsedFileData as Pick<StopDBType, "name" | "location">[]
    );
    if (stops) {
      setStops(stops);
      return true;
    }
    return false;
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

  function fileNameIsCorrect(fileName: string, fileNameType: string) {
    const strReg =
      "[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}-[0-9]{2}-[0-9]{2}_" +
      fileNameType +
      ".csv";
    const regex = new RegExp(strReg);

    if (!regex.test(fileName)) {
      return false;
    }
    return true;
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

  export async function parseCsvFileToSchoolData(
    file: File
  ): Promise<Pick<SchoolDBType, "name" | "location">[] | undefined> {
    const parsedFile = await parseFile(file);

    const correctHeader = ["name", "lat", "lon"];
    if (!isCorrectHeader(parsedFile.meta.fields, correctHeader)) {
      return;
    }
    let parsedData = parsedFile.data as Pick<
      SchoolType,
      "name" | "lon" | "lat" | "hours"
    >[];
    parsedData = parsedData.filter((data) => data.lat && data.lon && data.name);

    return SchoolEntity.dataToDB(parsedData);
  }

  async function parsedCsvFileToStopData(
    file: File
  ): Promise<Pick<StopDBType, "name" | "location">[] | undefined> {
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
  ): Promise<StudentToGrade[] | undefined> {
    const parsedFile = await parseFile(file);
    const correctHeader = ["school_name", "stop_name", "quantity"];
    if (!isCorrectHeader(parsedFile.meta.fields, correctHeader)) {
      return;
    }
    let parsedData = parsedFile.data as StudentToGrade[];
    parsedData = parsedData.filter(
      (data) => data.school_name && data.stop_name && data.quantity
    );
    return parsedData;
  }

  function isSchoolFile(fileName: string) {
    return fileNameIsCorrect(fileName, "etablissement");
  }

  function isStopFile(fileName: string) {
    return fileNameIsCorrect(fileName, "ramassage");
  }

  function isStudentToGradeFile(fileName: string) {
    return fileNameIsCorrect(fileName, "eleve_vers_etablissement");
  }
  // TODO: Delete ?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function parsedCsvFileData(file: File) {
    const fileName = file.name;
    if (isSchoolFile(fileName)) {
      return await parseCsvFileToSchoolData(file);
    } else if (isStopFile(fileName)) {
      return await parsedCsvFileToStopData(file);
    } else if (isStudentToGradeFile(fileName)) {
      return await parsedCsvFileToStudentToGradeData(file);
    } else return;
  }
}
