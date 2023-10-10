import Papa from "papaparse";
import {
  SchoolDBType,
  SchoolEntity,
  SchoolType,
} from "../_entities/school.entity";
import { StopDBType, StopEntity, StopType } from "../_entities/stop.entity";
import { ClassStudentToSchoolTypeFormated } from "../_entities/student-to-school.entity";
import { SchoolService } from "../_services/school.service";
import { StopService } from "../_services/stop.service";
import { StudentToSchoolService } from "../_services/student-to-school.service";
import {
  addNewGlobalWarningInformation,
  addNewUserInformation,
} from "../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../type";
import { setSchools } from "../views/content/map/component/organism/SchoolPoints";
import { setStops } from "../views/content/map/component/organism/StopPoints";

export namespace CsvUtils {
  export async function importCsvFile(file: File): Promise<boolean> {
    const parsedFileData = await parsedCsvFileData(file);
    const fileName = file.name;

    if (parsedFileData) {
      try {
        if (isSchoolFile(fileName)) {
          return importSchoolCSVFile(
            parsedFileData as Pick<SchoolDBType, "name" | "location">[]
          );
        } else if (isStopFile(fileName)) {
          return importStopCSVFile(
            parsedFileData as Pick<StopDBType, "name" | "location">[]
          );
        } else if (isStudentToSchoolFile(fileName)) {
          return importStudentToSchoolCSVFile(
            parsedFileData as ClassStudentToSchoolTypeFormated[]
          );
        } else {
          addNewGlobalWarningInformation("Nom de fichier non reconnu");
          return false;
        }
      } catch (err) {
        addNewGlobalWarningInformation("Erreur lors de l'importation");
        return false;
      }
    } else {
      addNewGlobalWarningInformation("Erreur de lecture du fichier");
      return false;
    }
  }

  export function fileExtensionIsCsv(fileName: string) {
    const regexExtention = new RegExp(".csv$");
    if (!regexExtention.test(fileName)) {
      return false;
    }
    return true;
  }

  async function importSchoolCSVFile(
    parsedFileData: Pick<SchoolDBType, "name" | "location">[]
  ) {
    const schools: SchoolType[] = await SchoolService.import(
      parsedFileData as Pick<SchoolDBType, "name" | "location">[]
    );
    if (schools) {
      setSchools(schools);
      return true;
    }
    return false;
  }

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

  async function importStudentToSchoolCSVFile(
    parsedFileData: ClassStudentToSchoolTypeFormated[]
  ) {
    const { schools, stops } = await StudentToSchoolService.import(
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
    let parsedData = parsedFile.data as Pick<
      StopType,
      "name" | "lon" | "lat"
    >[];
    parsedData = parsedData.filter((data) => data.lat && data.lon && data.name);

    return StopEntity.dataToDB(parsedData);
  }
  async function parsedCsvFileToStudentToSchoolData(
    file: File
  ): Promise<ClassStudentToSchoolTypeFormated[] | undefined> {
    const parsedFile = await parseFile(file);

    const correctHeader = ["school_name", "stop_name", "quantity"];
    if (!isCorrectHeader(parsedFile.meta.fields, correctHeader)) {
      return;
    }

    let parsedData = parsedFile.data as ClassStudentToSchoolTypeFormated[];
    parsedData = parsedData.filter(
      (data) => data.school.name && data.stop.name && data.quantity
    );

    return parsedData;
  }

  function isSchoolFile(fileName: string) {
    return fileNameIsCorrect(fileName, "etablissement");
  }

  function isStopFile(fileName: string) {
    return fileNameIsCorrect(fileName, "ramassage");
  }

  function isStudentToSchoolFile(fileName: string) {
    return fileNameIsCorrect(fileName, "eleve_vers_etablissement");
  }

  async function parsedCsvFileData(file: File) {
    const fileName = file.name;
    if (isSchoolFile(fileName)) {
      return await parsedCsvFileToSchoolData(file);
    } else if (isStopFile(fileName)) {
      return await parsedCsvFileToStopData(file);
    } else if (isStudentToSchoolFile(fileName)) {
      return await parsedCsvFileToStudentToSchoolData(file);
    } else return;
  }
}
