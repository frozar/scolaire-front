import { SchoolType } from "../_entities/school.entity";
import { StopType } from "../_entities/stop.entity";
import { addNewGlobalWarningInformation } from "../signaux";
import { setSchools } from "../views/content/graphicage/component/organism/SchoolPoints";
import { setStops } from "../views/content/graphicage/component/organism/StopPoints";
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

  async function importFile(
    files: FileList | null | undefined
  ): Promise<{ schools?: SchoolType[]; stops?: StopType[] }> {
    const file = getImportedFile(files);

    if (!file) return {};

    const { schools, stops } = await importOneFile(file);

    if (!schools && !stop) {
      return {};
    }
    return { schools, stops };
  }

  export async function importFileAndUpdate(
    files: FileList | null | undefined
  ): Promise<boolean> {
    const { schools, stops } = await importFile(files);

    if (!schools && !stops) return false;

    schools ? setSchools(schools) : "";
    stops ? setStops(stops) : "";

    return true;
  }
}
