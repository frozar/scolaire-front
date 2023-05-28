import Button from "./atom/Button";
import { openImportCsvBox } from "../signaux";

export default function () {
  return <Button onClickHandler={openImportCsvBox}>Importer</Button>;
}
