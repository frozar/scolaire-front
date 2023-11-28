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
import { CsvEnum } from "../views/content/board/component/molecule/ImportSelection";
import {
  getSchools,
  setSchools,
} from "../views/content/map/component/organism/SchoolPoints";
import {
  getStops,
  setStops,
} from "../views/content/map/component/organism/StopPoints";
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
          const { lat: csvLat, lng: csvLng } = roundLikeXano(
            csvItem.location.data.lat,
            csvItem.location.data.lng
          );
          if (csvLat != item.lat || csvLng != item.lon) {
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

  export function fileExtensionIsCsv(fileName: string) {
    const regexExtention = new RegExp(".csv$");
    if (!regexExtention.test(fileName)) {
      return false;
    }
    return true;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
}

// in xano geographical point rounded as an absolute number with 12 after decimal point
function roundLikeXano(lat: number, lng: number) {
  let _lat = _.round(Math.abs(lat), 12);
  if (lat < 0) _lat = -_lat;

  let _lng = _.round(Math.abs(lng), 12);
  if (lng < 0) _lng = -lng;

  return { lat: _lat, lng: _lng };
}
