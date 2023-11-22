import { addNewGlobalWarningInformation } from "../signaux";
import { CsvUtils } from "./csv.utils";

export namespace FileUtils {
  function getImportedFile(
    files: FileList | null | undefined
  ): File | undefined {
    if (
      !files ||
      files === null ||
      files === undefined ||
      !containFiles(files)
    ) {
      addNewGlobalWarningInformation("Aucun fichier sélectionné");
      return;
    }

    if (!containOneFile(files)) {
      addNewGlobalWarningInformation("Veuillez importer un fichier à la fois");
      return;
    }
    return files[0];
  }

  function containFiles(files: FileList) {
    return files && files.length > 0;
  }

  function containOneFile(files: FileList) {
    return files && files.length === 1;
  }

  // TODO: Rename "checkFile" ?
  export async function importFile(
    files: FileList | null | undefined
  ): Promise<boolean> {
    const file = getImportedFile(files);

    if (!file) return false;
    const fileName = file.name;

    if (CsvUtils.fileExtensionIsCsv(fileName)) {
      console.log("todo: import");
      return true;
      // return CsvUtils.importCsvFile(file);
    }

    addNewGlobalWarningInformation("Type de Fichier non reconnu");
    return false;
  }
}
