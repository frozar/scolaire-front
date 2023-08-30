import { SchoolType } from "../_entities/school.entity";
import { StopType } from "../_entities/stop.entity";
import { addNewGlobalWarningInformation } from "../signaux";
import { CsvUtils } from "./csv.utils";

export namespace FileUtils {
  export async function importFile(
    file: File
  ): Promise<{ schools?: SchoolType[]; stops?: StopType[] }> {
    const fileName = file.name;
    if (CsvUtils.fileExtensionIsCsv(fileName)) {
      return CsvUtils.importCsvFile(file);
    }
    addNewGlobalWarningInformation("Type de Fichier non reconnu");
    return {};
  }
}
