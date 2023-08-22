import { AiOutlineSearch } from "solid-icons/ai";
import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { useStateGui } from "../../../StateGui";
import { StopType } from "../../../_entities/stop.entity";
import { StopService } from "../../../_services/stop.service";
import ExportCsvButton from "../../../component/ExportCsvButton";
import ImportCsvButton from "../../../component/ImportCsvButton";
import ImportCsvCanvas from "../../../component/ImportCsvCanvas";
import ImportCsvDialogBox from "../../../component/ImportCsvDialogBox";
import ActionSelector from "../../../component/atom/ActionSelector";
import Button from "../../../component/atom/Button";
import PageTitle from "../../../component/atom/PageTitle";
import RemoveRamassageConfirmation from "../../../userInformation/RemoveRamassageConfirmation";
import {
  getStops,
  setStops,
} from "../graphicage/component/organism/StopPoints";
import EditStop, { setDataToEdit, toggleEditStop } from "./EditStop";
import StopItems from "./StopItem";

const [, { getActiveMapId }] = useStateGui();

export async function fetchStop() {
  const stops: StopType[] = await StopService.getAll();
  setStops(stops.sort((a, b) => a.name.localeCompare(b.name)));
}

function preventDefaultHandler(e: DragEvent) {
  e.preventDefault();
}

export default function () {
  let stopDiv!: HTMLDivElement;
  let refCheckbox!: HTMLInputElement;

  const [keyword, setKeyword] = createSignal("");

  const filteredRamassages = () =>
    getStops().filter((e) =>
      e.name.toLowerCase().includes(keyword().toLowerCase())
    );

  const selectedRamassages = () => getStops().filter((ram) => ram.selected);

  createEffect(() => {
    refCheckbox.checked =
      filteredRamassages().length != 0 &&
      selectedRamassages().length == filteredRamassages().length;
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
            <div>
              <PageTitle title="Points de ramassage" />
            </div>
            <div id="filters">
              <div class="left">
                <ActionSelector isDisabled={true} />
                <Button
                  label="Ajouter"
                  onClick={() => {
                    setDataToEdit();
                    toggleEditStop();
                  }}
                />

                <div class="input-field">
                  <div class="input-search-logo">
                    <AiOutlineSearch />
                  </div>
                  <input
                    class="bg-white"
                    type="text"
                    name="search"
                    placeholder="Recherche"
                    onInput={(e) => {
                      setKeyword(e.currentTarget.value);
                    }}
                  />
                </div>
              </div>

              <div class="right">
                <ExportCsvButton
                  exportRoute={`/map/${getActiveMapId()}/export/csv_ramassage`}
                  filename="ramassage"
                />
                <ImportCsvButton />
              </div>
            </div>
          </header>
          <div class="board-content">
            <div class="h-[78vh]">
              <table class="min-w-full">
                <thead>
                  <tr>
                    <th scope="col" class="pl-4 pr-3 sm:pl-0 flex items-center">
                      <input
                        id="comments"
                        aria-describedby="comments-description"
                        name="comments"
                        type="checkbox"
                        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 relative right-2"
                        onChange={(e) => {
                          setStops((stops) =>
                            stops.map((eta) => ({
                              ...eta,
                              selected: e.target.checked,
                            }))
                          );
                        }}
                        ref={refCheckbox}
                      />
                      Nom
                    </th>
                    <th scope="col">Nombre d'élèves</th>
                    <th scope="col">Nombre d'établissements desservis</th>
                    <th scope="col">Nombre de lignes</th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span class="">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <For each={filteredRamassages()}>
                    {(fields) => (
                      <StopItems item={fields} setRamassages={setStops} />
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <EditStop />
      </div>
    </>
  );
}
