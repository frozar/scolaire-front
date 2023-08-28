import Papa from "papaparse";
import {
  SchoolDBType,
  SchoolEntity,
  SchoolType,
} from "../_entities/school.entity";
import { StopDBType, StopEntity, StopType } from "../_entities/stop.entity";
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

export function fileExtensionIsCorrect(fileName: string) {
  const regexExtention = new RegExp(".csv$");
  if (!regexExtention.test(fileName)) {
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.error,
      type: MessageTypeEnum.global,
      content:
        "Fichier non reconnue. Veuillez utiliser des .csv lors de l'importation.",
    });
    return false;
  }
  return true;
}

export function fileNameIsCorrect(fileName: string, fileNameType: string) {
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

export function isCorrectHeader(
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

export async function parsedCsvFileToSchoolData(
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

export async function parsedCsvFileToStopData(
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

export async function parsedCsvFileData(file: File) {
  const fileName = file.name;
  if (fileNameIsCorrect(fileName, "etablissement")) {
    return await parsedCsvFileToSchoolData(file);
  } else if (fileNameIsCorrect(fileName, "ramassage")) {
    return await parsedCsvFileToStopData(file);
  } else return;
}
