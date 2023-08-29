import { SchoolDBType, SchoolType } from "../_entities/school.entity";
import { StopDBType, StopType } from "../_entities/stop.entity";
import { SchoolService } from "../_services/school.service";
import { StopService } from "../_services/stop.service";
import {
  StudentToSchool,
  StudentToSchoolService,
} from "../_services/student-to-school.service";
import { addNewGlobalWarningInformation } from "../signaux";
import { setSchools } from "../views/content/graphicage/component/organism/SchoolPoints";
import {
  fileExtensionIsCsv,
  isSchoolFile,
  isStopFile,
  isStudentToSchoolFile,
  parsedCsvFileData,
} from "./csvUtils";

export async function importFile(
  file: File
): Promise<{ schools?: SchoolType[]; stops?: StopType[] }> {
  const fileName = file.name;
  if (fileExtensionIsCsv(fileName)) {
    return importCsvFile(file);
  }
  addNewGlobalWarningInformation("Type de Fichier non reconnu");
  return {};
}

async function importCsvFile(file: File) {
  {
    const parsedFileData = await parsedCsvFileData(file);
    const fileName = file.name;

    if (parsedFileData) {
      try {
        if (isSchoolFile(fileName)) {
          const schools: SchoolType[] = await SchoolService.import(
            parsedFileData as Pick<SchoolDBType, "name" | "location">[]
          );

          setSchools(schools);

          return { schools };
        } else if (isStopFile(fileName)) {
          const stops: StopType[] = await StopService.import(
            parsedFileData as Pick<StopDBType, "name" | "location">[]
          );

          return { stops };
        } else if (isStudentToSchoolFile(fileName)) {
          const { schools, stops } = await StudentToSchoolService.import(
            parsedFileData as StudentToSchool[]
          );

          return { stops, schools };
        } else {
          addNewGlobalWarningInformation("Nom de fichier non reconnu");

          return {};
        }
      } catch (err) {
        addNewGlobalWarningInformation("Erreur lors de l'importation");
        return {};
      }
    } else {
      addNewGlobalWarningInformation("Erreur de lecture du fichier");

      return {};
    }
  }
}
