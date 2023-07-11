import { AiOutlineSearch } from "solid-icons/ai";
import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { useStateGui } from "../../../StateGui";
import ExportCsvButton from "../../../component/ExportCsvButton";
import ImportCsvButton from "../../../component/ImportCsvButton";
import ImportCsvCanvas from "../../../component/ImportCsvCanvas";
import ImportCsvDialogBox from "../../../component/ImportCsvDialogBox";
import ActionSelector from "../../../component/atom/ActionSelector";
import { addNewUserInformation } from "../../../signaux";
import { MessageLevelEnum, MessageTypeEnum, StopItemType } from "../../../type";
import RemoveRamassageConfirmation from "../../../userInformation/RemoveRamassageConfirmation";
import { authenticateWrap } from "../../layout/authentication";
import EditStop, { setDataToEdit, toggleEditStop } from "./EditRamassage";
import StopItems from "./RamassageItem";

const [, { getActiveMapId }] = useStateGui();

const [ramassages, setRamassages] = createSignal<StopItemType[]>([]);

export function fetchRamassage() {
  authenticateWrap((headers) => {
    fetch(
      import.meta.env.VITE_BACK_URL +
        `/map/${getActiveMapId()}/dashboard/ramassages`,
      {
        method: "GET",
        headers,
      }
    )
      .then(async (res) => {
        const json = await res.json();

        if (res.status !== 200) {
          console.error(json["detail"]);
          return;
        }

        const data: {
          id: number;
          name: string;
          quantity: number;
          nb_etablissement: number;
          nb_line: number;
          lon: number;
          lat: number;
        }[] = json["content"];

        setRamassages(
          data
            .map((elt) => {
              return {
                ...elt,
                nbEtablissement: elt.nb_etablissement,
                nbLine: elt.nb_line,
                selected: false,
              };
            })
            .sort((a, b) => a.name.localeCompare(b.name))
        );
      })
      .catch((err) => {
        console.error(err);

        addNewUserInformation({
          displayed: true,
          level: MessageLevelEnum.error,
          type: MessageTypeEnum.global,
          content: err.message,
        });
      });
  });
}

function preventDefaultHandler(e: DragEvent) {
  e.preventDefault();
}

export default function () {
  let ramassageDiv!: HTMLDivElement;
  let refCheckbox!: HTMLInputElement;

  const [keyword, setKeyword] = createSignal("");

  const filteredRamassages = () =>
    ramassages().filter((e) =>
      e.name.toLowerCase().includes(keyword().toLowerCase())
    );

  const selectedRamassages = () => ramassages().filter((ram) => ram.selected);

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
    fetchRamassage();
    ramassageDiv.addEventListener("dragenter", dragEnterHandler);
    ramassageDiv.addEventListener("drop", preventDefaultHandler);
    ramassageDiv.addEventListener("dragleave", preventDefaultHandler);
    ramassageDiv.addEventListener("dragend", preventDefaultHandler);
    ramassageDiv.addEventListener("dragover", preventDefaultHandler);
  });

  onCleanup(() => {
    ramassageDiv.removeEventListener("dragenter", dragEnterHandler);
    ramassageDiv.removeEventListener("drop", preventDefaultHandler);
    ramassageDiv.removeEventListener("dragleave", preventDefaultHandler);
    ramassageDiv.removeEventListener("dragend", preventDefaultHandler);
    ramassageDiv.removeEventListener("dragover", preventDefaultHandler);
  });

  return (
    <>
      <ImportCsvDialogBox />
      <ImportCsvCanvas
        display={displayImportCsvCanvas()}
        setDisplay={setDisplayImportCsvCanvas}
        callbackSuccess={() => {
          fetchRamassage();
        }}
      />
      <RemoveRamassageConfirmation />
      <div class="flex w-full bg-white" ref={ramassageDiv}>
        <div id="ramassages-board">
          <header>
            <h1>Points de ramassage</h1>
            <div id="filters">
              <div class="left">
                <ActionSelector isDisabled={true} />

                <button
                  type="button"
                  class="btn-arret-add"
                  onClick={() => {
                    setDataToEdit();
                    toggleEditStop();
                  }}
                >
                  Ajouter
                </button>

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
                          setRamassages((ramassages) =>
                            ramassages.map((eta) => ({
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
                      <StopItems item={fields} setRamassages={setRamassages} />
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
