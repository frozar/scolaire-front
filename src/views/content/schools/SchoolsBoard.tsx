import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { SchoolType } from "../../../_entities/school.entity";
import { SchoolService } from "../../../_services/school.service";
import ImportCsvCanvas from "../../../component/ImportCsvCanvas";
import ImportCsvDialogBox from "../../../component/ImportCsvDialogBox";
import PageTitle from "../../../component/atom/PageTitle";
import RemoveRamassageConfirmation from "../../../userInformation/RemoveRamassageConfirmation";
import {
  getSchools,
  setSchools,
} from "../graphicage/component/organism/SchoolPoints";
import SchoolItem from "./SchoolItem";
import Checkbox from "./component/atom/Checkbox";
import TableHeaderCell from "./component/molecule/TableHeaderCell";
import Filters, { searchInputKeyword } from "./component/organism/Filters";
import TableBody from "./component/organism/TableBody";
import TableHeader from "./component/organism/TableHeader";

export async function fetchEtablissement() {
  const schools: SchoolType[] = await SchoolService.getAll();
  setSchools(schools.sort((a, b) => a.name.localeCompare(b.name)));
}

function preventDefaultHandler(e: DragEvent) {
  e.preventDefault();
}

export default function () {
  let schoolDiv!: HTMLDivElement;

  const [refCheckbox, setRefCheckbox] = createSignal<HTMLInputElement>(
    document.createElement("input")
  );

  const filteredSchools = () =>
    getSchools().filter((e) =>
      e.name.toLowerCase().includes(searchInputKeyword().toLowerCase())
    );

  const selectedSchools = () =>
    getSchools().filter((school) => school.selected());

  createEffect(() => {
    refCheckbox().checked = selectedSchools().length == getSchools().length;
  });

  const [displayImportCsvCanvas, setDisplayImportCsvCanvas] =
    createSignal(false);

  function dragEnterHandler(e: DragEvent) {
    e.preventDefault();
    setDisplayImportCsvCanvas(true);
  }

  onMount(async () => {
    await fetchEtablissement();
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

  // TODO: check why when checking global checkbox, only one item is selected
  const globalCheckboxOnChange = () => {
    getSchools().map((school) => {
      school.setSelected(refCheckbox().checked);
      console.log(school.selected(), refCheckbox().checked);
    });
  };

  return (
    <>
      <ImportCsvDialogBox />
      <ImportCsvCanvas
        display={displayImportCsvCanvas()}
        setDisplay={setDisplayImportCsvCanvas}
        callbackSuccess={() => {
          fetchEtablissement();
        }}
      />
      <RemoveRamassageConfirmation />

      <div class="content-pane" ref={schoolDiv}>
        <div id="ramassages-board">
          <header>
            <PageTitle title="Etablissements" />

            <Filters />
          </header>

          <div class="board-content">
            <div class="h-[78vh]">
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
                      return (
                        <SchoolItem
                          item={fields}
                          setEtablissements={setSchools}
                        />
                      );
                    }}
                  </For>
                </TableBody>
              </table>
            </div>
          </div>
        </div>
        {/* <EditStop /> */}
      </div>
    </>
  );
}
