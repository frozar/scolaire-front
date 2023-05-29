import { AiOutlineSearch } from "solid-icons/ai";
import EditStop, { setDataToEdit, toggleEditStop } from "./EditEtablissement";
import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import EtablissementItem from "./EtablissementItem";
import { EtablissementItemType } from "../../type";
import { displayDownloadErrorMessage } from "../../userInformation/utils";
import { getExportDate } from "../graphicage/rightMapMenu/export/export";
import RemoveRamassageConfirmation from "../../userInformation/RemoveRamassageConfirmation";
import ImportCsvDialogBox from "../../component/ImportCsvDialogBox";
import { download } from "../../utils";
import { getToken } from "../../auth/auth";
import ImportCsvCanvas from "../../component/ImportCsvCanvas";
import ImportCsvButton from "../../component/ImportCsvButton";

const [etablissements, setEtablissements] = createSignal<
  EtablissementItemType[]
>([]);

export function fetchEtablissement() {
  getToken()
    .then((token) => {
      fetch(
        import.meta.env.VITE_BACK_URL +
          "/etablissements_associated_bus_lines_info",
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
              nb_line: number;
              lon: number;
              lat: number;
            }[]
          ) => {
            setEtablissements(
              res
                .map((elt) => {
                  return {
                    ...elt,
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
  let etablissementDiv!: HTMLDivElement;
  let refCheckbox!: HTMLInputElement;

  const [keyword, setKeyword] = createSignal("");

  const filteredEtablissements = () =>
    etablissements().filter((e) =>
      e.name.toLowerCase().includes(keyword().toLowerCase())
    );

  const selectedEtablissements = () =>
    etablissements().filter((eta) => eta.selected);

  createEffect(() => {
    refCheckbox.checked =
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
      <div class="flex w-full" ref={etablissementDiv}>
        <div id="ramassages-board">
          <header>
            <h1>Etablissements</h1>
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
                  class="btn-arret-export-import disabled:bg-gray-300 disabled:opacity-75"
                  disabled
                  onClick={() => {
                    getToken()
                      .then((token) => {
                        fetch(
                          import.meta.env.VITE_BACK_URL +
                            "/export/etablissement_input",
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
                            const fileName = `${year}-${month}-${day}_${hour}-${minute}_etablissement.csv`;
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
                          setEtablissements((etablissements) =>
                            etablissements.map((eta) => ({
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
                    <th scope="col">Nombre de lignes</th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span class="">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
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
