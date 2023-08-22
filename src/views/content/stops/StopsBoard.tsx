import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { StopType } from "../../../_entities/stop.entity";
import { StopService } from "../../../_services/stop.service";
import ImportCsvCanvas from "../../../component/ImportCsvCanvas";
import ImportCsvDialogBox from "../../../component/ImportCsvDialogBox";
import PageTitle from "../../../component/atom/PageTitle";
import RemoveRamassageConfirmation from "../../../userInformation/RemoveRamassageConfirmation";
import {
  getStops,
  setStops,
} from "../graphicage/component/organism/StopPoints";
import Checkbox from "../schools/component/atom/Checkbox";
import TableHeaderCell from "../schools/component/molecule/TableHeaderCell";
import TableBody from "../schools/component/organism/TableBody";
import TableHeader from "../schools/component/organism/TableHeader";
import TableWraper from "../schools/component/organism/TableWraper";
import EditStop from "./EditStop";
import StopItem from "./StopItem";
import Filters, { searchInputKeyword } from "./component/organism/Filters";

export async function fetchStop() {
  const stops: StopType[] = await StopService.getAll();
  setStops(stops.sort((a, b) => a.name.localeCompare(b.name)));
}

function preventDefaultHandler(e: DragEvent) {
  e.preventDefault();
}

// TODO: checkbox selection when select all by GlobalCheckbox then deselect one and reselect all, here have a bug
export const [globalChecked, setGlobalChecked] = createSignal<boolean>(false);

export default function () {
  let stopDiv!: HTMLDivElement;
  const [refCheckboxGlobal, setRefCheckbox] = createSignal<HTMLInputElement>(
    document.createElement("input")
  );

  const filteredStops = () =>
    getStops().filter((e) =>
      e.name.toLowerCase().includes(searchInputKeyword().toLowerCase())
    );

  const selectedStops = () => getStops().filter((ram) => ram.selected());

  createEffect(() => {
    refCheckboxGlobal().checked = globalChecked();
  });

  createEffect(() => {
    if (filteredStops().length == selectedStops().length)
      setGlobalChecked(true);
    else setGlobalChecked(false);
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

  const globalCheckboxOnChange = () => setGlobalChecked((bool) => !bool);

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

          <TableWraper>
            <table class="min-w-full table-content">
              <TableHeader>
                <TableHeaderCell>
                  <Checkbox
                    ariaDescribedby="stop-item"
                    name="stop"
                    ref={setRefCheckbox}
                    onChange={globalCheckboxOnChange}
                  />
                </TableHeaderCell>
                <TableHeaderCell>Nom</TableHeaderCell>
                <TableHeaderCell>Nombre d'élèves</TableHeaderCell>
                <TableHeaderCell>
                  Nombre d'établissements desservis
                </TableHeaderCell>
                <TableHeaderCell>Nombre de lignes</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableHeader>
              <TableBody>
                <For each={filteredStops()}>
                  {(fields) => {
                    return <StopItem item={fields} setStops={setStops} />;
                  }}
                </For>
              </TableBody>
            </table>
          </TableWraper>
        </div>
        <EditStop />
      </div>
    </>
  );
}
