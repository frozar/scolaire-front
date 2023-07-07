import { openImportCsvBox } from "../signaux";
import Button from "./atom/Button";

export default function () {
  return <Button onClick={openImportCsvBox} label="Importer" />;
}
