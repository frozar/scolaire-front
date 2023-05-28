import { AiOutlineSearch } from "solid-icons/ai";
import EditStop, { setDataToEdit, toggleEditStop } from "./EditRamassage";
import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import StopItems from "./RamassageItem";
import { StopItemType } from "../../type";
import { displayDownloadErrorMessage } from "../../userInformation/utils";
import { getExportDate } from "../graphicage/rightMapMenu/export/export";
import RemoveRamassageConfirmation from "../../userInformation/RemoveRamassageConfirmation";
import ImportCsvModal from "../../component/ImportCsvModal";
import { download } from "../../utils";
import { getToken } from "../../auth/auth";
import ImportCsvCanvas from "../../component/ImportCsvCanvas";
import ImportCsvButton from "../../component/ImportCsvButton";

const [ramassages, setRamassages] = createSignal<StopItemType[]>([]);

export function fetchRamassage() {
  getToken()
    .then((token) => {
      fetch(
        import.meta.env.VITE_BACK_URL + "/ramassages_associated_bus_lines_info",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          return res.json();
        })
        .then(
          (
            res: {
              id: number;
              name: string;
              quantity: number;
              nb_etablissement: number;
              nb_line: number;
              lon: number;
              lat: number;
            }[]
          ) => {
            setRamassages(
              res
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
          }
        );
    })
    .catch((err) => {
      console.log(err);
    });
}

function preventDefaultHandler(e: DragEvent) {
  e.preventDefault();
}

export default function () {
  let stopDiv!: HTMLDivElement;
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
      <ImportCsvModal doesCheckInputFilenameFormat={false} />
      <ImportCsvCanvas
        display={displayImportCsvCanvas()}
        setDisplay={setDisplayImportCsvCanvas}
        callback={() => {
          fetchRamassage();
        }}
      />
      <RemoveRamassageConfirmation />
      <div class="flex w-full" ref={stopDiv}>
        <div id="ramassages-board">
          <header>
            <h1>Points de ramassage</h1>
            <div id="filters">
              <div class="left">
                {/* <select ref={setRefSelect} disabled> */}
                <select disabled>
                  <option selected value="null">
                    Action
                  </option>
                  <option class="fill-red" value="delete">
                    Supprimer
                  </option>
                </select>

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
                <button
                  class="btn-arret-export-import"
                  onClick={() => {
                    getToken()
                      .then((token) => {
                        fetch(
                          import.meta.env.VITE_BACK_URL +
                            "/export/ramassages_input",
                          {
                            method: "GET",
                            headers: {
                              "Content-Type": "application/json",
                              authorization: `Bearer ${token}`,
                            },
                          }
                        )
                          .then((response) => {
                            if (!response.ok) {
                              displayDownloadErrorMessage();
                            } else {
                              return response.blob();
                            }
                          })
                          .then((blob: Blob | undefined) => {
                            if (!blob) {
                              return;
                            }

                            const { year, month, day, hour, minute } =
                              getExportDate();
                            const fileName = `${year}-${month}-${day}_${hour}-${minute}_ramassage.csv`;
                            download(fileName, blob);
                          })
                          .catch(() => {
                            displayDownloadErrorMessage();
                          });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                >
                  Exporter
                </button>
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
