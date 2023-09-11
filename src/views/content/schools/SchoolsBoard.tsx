import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { SchoolType } from "../../../_entities/school.entity";
import { SchoolService } from "../../../_services/school.service";
import ImportCsvCanvas from "../../../component/ImportCsvCanvas";
import ImportCsvDialogBox from "../../../component/ImportCsvDialogBox";
import { addNewUserInformation } from "../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../type";
import RemoveRamassageConfirmation from "../../../userInformation/RemoveRamassageConfirmation";
import { getSchools, setSchools } from "../map/component/organism/SchoolPoints";
import { searchInputKeyword } from "./component/organism/Filters";

export async function fetchSchool() {
  const schools: SchoolType[] = await SchoolService.getAll();
  setSchools(schools.sort((a, b) => a.name.localeCompare(b.name)));
}

function preventDefaultHandler(e: DragEvent) {
  e.preventDefault();
}

// TODO: checkbox selection when select all by GlobalCheckbox then deselect one and reselect the deselected, here have a bug
export const [globalChecked, setGlobalChecked] = createSignal<boolean>(false);

export const callbackSuccess = function (): void {
  addNewUserInformation({
    displayed: true,
    level: MessageLevelEnum.success,
    type: MessageTypeEnum.global,
    content: "Les établissements ont été mis à jour",
  });
};
export const callbackFail = function (): void {
  addNewUserInformation({
    displayed: true,
    level: MessageLevelEnum.success,
    type: MessageTypeEnum.global,
    content: "Des erreurs sont survenues lors de l'importation",
  });
};
export default function () {
  let schoolDiv!: HTMLDivElement;

  const [refCheckboxGlobal, setRefCheckbox] = createSignal<HTMLInputElement>(
    document.createElement("input")
  );
  setRefCheckbox;
  const filteredSchools = () =>
    getSchools().filter((e) =>
      e.name.toLowerCase().includes(searchInputKeyword().toLowerCase())
    );

  const selectedSchools = () =>
    getSchools().filter((school) => school.selected());

  createEffect(() => {
    refCheckboxGlobal().checked = globalChecked();
  });

  createEffect(() => {
    if (filteredSchools().length == selectedSchools().length)
      setGlobalChecked(true);
    else setGlobalChecked(false);
  });

  const [displayImportCsvCanvas, setDisplayImportCsvCanvas] =
    createSignal(false);

  function dragEnterHandler(e: DragEvent) {
    e.preventDefault();
    setDisplayImportCsvCanvas(true);
  }

  onMount(async () => {
    await fetchSchool();
    schoolDiv.addEventListener("dragenter", dragEnterHandler);
    schoolDiv.addEventListener("drop", preventDefaultHandler);
    schoolDiv.addEventListener("dragleave", preventDefaultHandler);
    schoolDiv.addEventListener("dragend", preventDefaultHandler);
    schoolDiv.addEventListener("dragover", preventDefaultHandler);
  });

  onCleanup(() => {
    schoolDiv.removeEventListener("dragenter", dragEnterHandler);
    schoolDiv.removeEventListener("drop", preventDefaultHandler);
    schoolDiv.removeEventListener("dragleave", preventDefaultHandler);
    schoolDiv.removeEventListener("dragend", preventDefaultHandler);
    schoolDiv.removeEventListener("dragover", preventDefaultHandler);
  });

  // const globalCheckboxOnChange = () => setGlobalChecked((bool) => !bool);

  return (
    <>
      <ImportCsvDialogBox
        callbackSuccess={callbackSuccess}
        callbackFail={callbackFail}
      />
      <ImportCsvCanvas
        display={displayImportCsvCanvas()}
        setDisplay={setDisplayImportCsvCanvas}
        callbackSuccess={callbackSuccess}
        callbackFail={callbackFail}
      />
      <RemoveRamassageConfirmation />

      <section>
        <div class="flex justify-between">
          <p>Total des établissements: 0</p>
          <button>+</button>
        </div>
      </section>

      {/* <div class="content-pane" ref={schoolDiv}>
        <div id="ramassages-board">
          <header>
            <PageTitle title="Etablissements" />

            <Filters />
          </header>

          <div class="board-content">
            <table class="min-w-full">
              <TableHeader>
                <TableHeaderCell>
                  <Checkbox
                    ariaDescribedby="school-item"
                    name="school"
                    ref={setRefCheckbox}
                    onChange={globalCheckboxOnChange}
                  />
                </TableHeaderCell>
                <TableHeaderCell>Nom</TableHeaderCell>
                <TableHeaderCell>Nombre de d'élèves</TableHeaderCell>
                <TableHeaderCell>Nombre de lignes</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableHeader>

              <TableBody>
                <For each={filteredSchools()}>
                  {(fields) => {
                    return <SchoolItem item={fields} setSchools={setSchools} />;
                  }}
                </For>
              </TableBody>
            </table>
          </div>
        </div>
        <EditSchool /> 
      </div> */}
    </>
  );
}
