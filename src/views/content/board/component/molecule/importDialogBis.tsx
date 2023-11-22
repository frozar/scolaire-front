import { Setter, createEffect, createSignal } from "solid-js";
import Button from "../../../../../component/atom/Button";

enum CsvTypeEnum {
  stop = "stops",
  schools = "schools",
  students = "students",
}
export default function (props: { setIsDisplayed: Setter<boolean> }) {
  const [importCsvType, setImportCsvType] = createSignal<CsvTypeEnum>();

  const [refButton, setRefButton] = createSignal<
    HTMLButtonElement | undefined
  >();

  createEffect(() => {
    refButton()?.focus();
  });

  function closeDialog() {
    props.setIsDisplayed(false);
  }

  async function handlerOnClickSoumettre() {
    console.log("TODO");

    closeDialog();
  }

  function onChangeCsvType(event: Event & { target: HTMLInputElement }) {
    const csvType = event.target.value as CsvTypeEnum;
    setImportCsvType(csvType);
    console.log("csvType selected =>", importCsvType());
  }
  return (
    <>
      <h3 class="drawer-helper-dialog-title">
        Séléctionner un type de fichier:
      </h3>
      <div>
        <input
          type="radio"
          id="schools"
          name="import_csv"
          value="schools"
          onChange={onChangeCsvType}
        />
        <label for="schools">Établissements</label>
      </div>

      <div>
        <input
          type="radio"
          id="stops"
          name="import_csv"
          value="stops"
          onChange={onChangeCsvType}
        />
        <label for="stops">Arrêts</label>
      </div>

      <div>
        <input
          type="radio"
          id="students"
          name="import_csv"
          value="students"
          onChange={onChangeCsvType}
        />
        <label for="students">Élèves</label>
      </div>

      <div class="draw-helper-dialog-buttons">
        <Button
          onClick={closeDialog}
          label={"Annuler"}
          variant="danger"
          isDisabled={false}
        />
        <Button
          ref={setRefButton}
          onClick={handlerOnClickSoumettre}
          label={"Soumettre"}
          variant="primary"
          isDisabled={false}
        />
      </div>
    </>
  );
}
