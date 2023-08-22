import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { StopType } from "../../../_entities/stop.entity";
import { StopService } from "../../../_services/stop.service";
import ImportCsvCanvas from "../../../component/ImportCsvCanvas";
import ImportCsvDialogBox from "../../../component/ImportCsvDialogBox";
import PageTitle from "../../../component/atom/PageTitle";
import RemoveRamassageConfirmation from "../../../userInformation/RemoveRamassageConfirmation";
import { setSchools } from "../graphicage/component/organism/SchoolPoints";
import {
  getStops,
  setStops,
} from "../graphicage/component/organism/StopPoints";
import SchoolItem from "../schools/SchoolItem";
import Checkbox from "../schools/component/atom/Checkbox";
import TableHeaderCell from "../schools/component/molecule/TableHeaderCell";
import TableBody from "../schools/component/organism/TableBody";
import TableHeader from "../schools/component/organism/TableHeader";
import EditStop from "./EditStop";
import Filters, { searchInputKeyword } from "./component/organism/Filters";

export async function fetchStop() {
  const stops: StopType[] = await StopService.getAll();
  setStops(stops.sort((a, b) => a.name.localeCompare(b.name)));
}

function preventDefaultHandler(e: DragEvent) {
  e.preventDefault();
}

export default function () {
  let stopDiv!: HTMLDivElement;
  // let refCheckbox!: HTMLInputElement;
  const [refCheckbox, setRefCheckbox] = createSignal<HTMLInputElement>(
    document.createElement("input")
  );
  const filteredStops = () =>
    getStops().filter((e) =>
      e.name.toLowerCase().includes(searchInputKeyword().toLowerCase())
    );

  const selectedStops = () => getStops().filter((ram) => ram.selected);

  createEffect(() => {
    refCheckbox().checked =
      filteredStops().length != 0 &&
      selectedStops().length == filteredStops().length;
  });

  const [displayImportCsvCanvas, setDisplayImportCsvCanvas] =
    createSignal(false);

  function dragEnterHandler(e: DragEvent) {
    e.preventDefault();
    setDisplayImportCsvCanvas(true);
  }

  onMount(() => {
    fetchStop();
    stopDiv.addEventListener("dragenter", dragEnterHandler);
    stopDiv.addEventListener("drop", preventDefaultHandler);
    stopDiv.addEventListener("dragleave", preventDefaultHandler);
    stopDiv.addEventListener("dragend", preventDefaultHandler);
    stopDiv.addEventListener("dragover", preventDefaultHandler);
  });

  onCleanup(() => {
    stopDiv.removeEventListener("dragenter", dragEnterHandler);
    stopDiv.removeEventListener("drop", preventDefaultHandler);
    stopDiv.removeEventListener("dragleave", preventDefaultHandler);
    stopDiv.removeEventListener("dragend", preventDefaultHandler);
    stopDiv.removeEventListener("dragover", preventDefaultHandler);
  });

  // TODO: check why when checking global checkbox, only one item is selected
  const globalCheckboxOnChange = () => {
    getStops().map((stop) => {
      stop.setSelected(refCheckbox().checked);
      console.log(stop.selected(), refCheckbox().checked);
    });
  };

  return (
    <>
      <ImportCsvDialogBox />
      <ImportCsvCanvas
        display={displayImportCsvCanvas()}
        setDisplay={setDisplayImportCsvCanvas}
        callbackSuccess={() => {
          fetchStop();
        }}
      />
      <RemoveRamassageConfirmation />
      <div class="flex w-full bg-white" ref={stopDiv}>
        <div id="ramassages-board">
          <header>
            <PageTitle title="Points de ramassage" />
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
                  <For each={filteredStops()}>
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
        <EditStop />
      </div>
    </>
  );
}
