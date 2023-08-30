import { SchoolType } from "../_entities/school.entity";
import { StopType } from "../_entities/stop.entity";
import { addNewGlobalWarningInformation } from "../signaux";
import { CsvUtils } from "./csv.utils";

export namespace FileUtils {
  async function importOneFile(
    file: File
  ): Promise<{ schools?: SchoolType[]; stops?: StopType[] }> {
    const fileName = file.name;
    if (CsvUtils.fileExtensionIsCsv(fileName)) {
      return CsvUtils.importCsvFile(file);
    }
    addNewGlobalWarningInformation("Type de Fichier non reconnu");
    return {};
  }

  export async function importFile(
    files: FileList | null | undefined
  ): Promise<{ schools?: SchoolType[]; stops?: StopType[] }> {
    if (
      !files ||
      files === null ||
      files === undefined ||
      !containFiles(files)
    ) {
      addNewGlobalWarningInformation("Aucun fichier sélectionné");
      return {};
    }

    if (!containOneFile(files)) {
      addNewGlobalWarningInformation("Veuillez importer un fichier à la fois");
      return {};
    }

    const file = files[0];
    return importOneFile(file);
  }

  function containFiles(files: FileList) {
    return files && files.length > 0;
  }

  function containOneFile(files: FileList) {
    return files && files.length === 1;
  }
}
