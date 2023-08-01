import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { SchoolType } from "../../../_entities/school.entity";
import { StopType } from "../../../_entities/stop.entity";
import { SchoolService } from "../../../_services/school.service";
import ImportCsvCanvas from "../../../component/ImportCsvCanvas";
import ImportCsvDialogBox from "../../../component/ImportCsvDialogBox";
import PageTitle from "../../../component/atom/PageTitle";
import RemoveRamassageConfirmation from "../../../userInformation/RemoveRamassageConfirmation";
import EditStop from "./EditEtablissement";
import EtablissementItem from "./EtablissementItem";
import Checkbox from "./component/atom/Checkbox";
import TableHeaderCell from "./component/molecule/TableHeaderCell";
import Filters, { searchInputKeyword } from "./component/organism/Filters";
import TableBody from "./component/organism/TableBody";
import TableHeader from "./component/organism/TableHeader";

export const [etablissements, setEtablissements] = createSignal<SchoolType[]>(
  []
);

export async function fetchEtablissement() {
  const schools: SchoolType[] | StopType[] = await SchoolService.getAll();
  setEtablissements(schools.sort((a, b) => a.name.localeCompare(b.name)));
}

function preventDefaultHandler(e: DragEvent) {
  e.preventDefault();
}

export default function () {
  let etablissementDiv!: HTMLDivElement;

  const [refCheckbox, setRefCheckbox] = createSignal<HTMLInputElement>(
    document.createElement("input")
  );

  const filteredEtablissements = () =>
    etablissements().filter((e) =>
      e.name.toLowerCase().includes(searchInputKeyword().toLowerCase())
    );

  const selectedEtablissements = () =>
    etablissements().filter((eta) => eta.selected);

  createEffect(() => {
    refCheckbox().checked =
      filteredEtablissements().length != 0 &&
      selectedEtablissements().length == filteredEtablissements().length;
  });

  const [displayImportCsvCanvas, setDisplayImportCsvCanvas] =
    createSignal(false);

  function dragEnterHandler(e: DragEvent) {
    e.preventDefault();
    setDisplayImportCsvCanvas(true);
  }

  onMount(() => {
    fetchEtablissement();
    etablissementDiv.addEventListener("dragenter", dragEnterHandler);
    etablissementDiv.addEventListener("drop", preventDefaultHandler);
    etablissementDiv.addEventListener("dragleave", preventDefaultHandler);
    etablissementDiv.addEventListener("dragend", preventDefaultHandler);
    etablissementDiv.addEventListener("dragover", preventDefaultHandler);
  });

  onCleanup(() => {
    etablissementDiv.removeEventListener("dragenter", dragEnterHandler);
    etablissementDiv.removeEventListener("drop", preventDefaultHandler);
    etablissementDiv.removeEventListener("dragleave", preventDefaultHandler);
    etablissementDiv.removeEventListener("dragend", preventDefaultHandler);
    etablissementDiv.removeEventListener("dragover", preventDefaultHandler);
  });

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
      <div class="flex w-full bg-white" ref={etablissementDiv}>
        <div id="ramassages-board">
          <header>
            <div>
              <PageTitle title="Etablissements" />
            </div>
            <Filters />
          </header>
          <div class="board-content">
            <div class="h-[78vh]">
              <table class="min-w-full">
                <TableHeader>
                  <TableHeaderCell>
                    <Checkbox
                      ariaDescribedby="etablissement-item"
                      name="etablissement"
                      ref={setRefCheckbox}
                      onChange={() => {
                        setEtablissements((etablissements) =>
                          etablissements.map((eta) => ({
                            ...eta,
                            selected: refCheckbox().checked,
                          }))
                        );
                      }}
                    />
                  </TableHeaderCell>
                  <TableHeaderCell>Nom</TableHeaderCell>
                  <TableHeaderCell>Nombre de d'élèves</TableHeaderCell>
                  <TableHeaderCell>Nombre de lignes</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableHeader>

                <TableBody>
                  <For each={filteredEtablissements()}>
                    {(fields) => {
                      return (
                        <EtablissementItem
                          item={fields}
                          setEtablissements={setEtablissements}
                        />
                      );
                    }}
                  </For>
                </TableBody>
              </table>
            </div>
          </div>
        </div>
        <EditStop />
      </div>
    </>
  );
}
