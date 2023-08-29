import Papa from "papaparse";
import {
  SchoolDBType,
  SchoolEntity,
  SchoolType,
} from "../_entities/school.entity";
import { StopDBType, StopEntity, StopType } from "../_entities/stop.entity";
import { StudentToSchool } from "../_services/student-to-school.service";
import { addNewUserInformation } from "../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../type";

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

export function fileExtensionIsCsv(fileName: string) {
  const regexExtention = new RegExp(".csv$");
  if (!regexExtention.test(fileName)) {
    return false;
  }
  return true;
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

async function parsedCsvFileToSchoolData(
  file: File
): Promise<Pick<SchoolDBType, "name" | "location">[] | undefined> {
  const parsedFile = await parseFile(file);

  const correctHeader = ["name", "lat", "lon"];
  if (!isCorrectHeader(parsedFile.meta.fields, correctHeader)) {
    return;
  }
  let parsedData = parsedFile.data as Pick<
    SchoolType,
    "name" | "lon" | "lat"
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
  let parsedData = parsedFile.data as Pick<StopType, "name" | "lon" | "lat">[];
  parsedData = parsedData.filter((data) => data.lat && data.lon && data.name);

  return StopEntity.dataToDB(parsedData);
}
async function parsedCsvFileToStudentToSchoolData(
  file: File
): Promise<StudentToSchool[] | undefined> {
  const parsedFile = await parseFile(file);

  const correctHeader = ["school_name", "stop_name", "quantity"];
  if (!isCorrectHeader(parsedFile.meta.fields, correctHeader)) {
    return;
  }

  let parsedData = parsedFile.data as StudentToSchool[];
  parsedData = parsedData.filter(
    (data) => data.school_name && data.stop_name && data.quantity
  );

  return parsedData;
}

export function isSchoolFile(fileName: string) {
  return fileNameIsCorrect(fileName, "etablissement");
}

export function isStopFile(fileName: string) {
  return fileNameIsCorrect(fileName, "ramassage");
}

export function isStudentToSchoolFile(fileName: string) {
  return fileNameIsCorrect(fileName, "eleve_vers_etablissement");
}

export async function parsedCsvFileData(file: File) {
  const fileName = file.name;
  if (isSchoolFile(fileName)) {
    return await parsedCsvFileToSchoolData(file);
  } else if (isStopFile(fileName)) {
    return await parsedCsvFileToStopData(file);
  } else if (isStudentToSchoolFile(fileName)) {
    return await parsedCsvFileToStudentToSchoolData(file);
  } else return;
}
