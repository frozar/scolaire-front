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

  export async function checkFile(
    files: FileList | null | undefined
  ): Promise<File | undefined> {
    const file = getImportedFile(files);

    if (!file) return;
    const fileName = file.name;

    if (CsvUtils.fileExtensionIsCsv(fileName)) {
      return file;
    }

    addNewGlobalWarningInformation("Type de Fichier non reconnu");
    return;
  }
}
