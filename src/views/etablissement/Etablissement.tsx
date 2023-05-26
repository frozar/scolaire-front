import { createStore } from "solid-js/store";
import { AiOutlineSearch } from "solid-icons/ai";
import EditStop, { setDataToEdit, toggleEditStop } from "./EditEtablissement";
import { For, createEffect, createSignal, onMount } from "solid-js";
import EtablissementItem from "./EtablissementItem";
import { EtablissementItemType } from "../../type";
import { displayDownloadErrorMessage } from "../../userInformation/utils";
import { getExportDate } from "../graphicage/rightMapMenu/export/export";
import RemoveRamassageConfirmation from "../../userInformation/RemoveRamassageConfirmation";
import { openRemoveImportCsvBox } from "../../signaux";
import ImportCsv from "../../userInformation/ImportCsv";
import { download } from "../../utils";
import { getToken } from "../../auth/auth";

export const [selected, setSelected] = createSignal<EtablissementItemType[]>(
  []
);

const [keyword, setkeyword] = createSignal<string>("");

export const [stop, setStop] = createStore<EtablissementItemType[]>([]);
export const [displaystop, setDisplayStop] = createStore<
  EtablissementItemType[]
>([]);
export const addSelected = (item: EtablissementItemType) =>
  setSelected([...selected(), item]);

export const removeSelected = (item: EtablissementItemType) => {
  const items = selected().filter((stop) => stop.id != item.id);
  setSelected(items);
};

export const [isChecked, setIsChecked] = createSignal(false);

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
            setStop(
              res
                .map((elt) => {
                  return {
                    id: elt.id,
                    name: elt.name,
                    quantity: elt.quantity,
                    nbLine: elt.nb_line,
                    lon: elt.lon,
                    lat: elt.lat,
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

export default function () {
  createEffect(() => {
    fetchEtablissement();
  });
  // const [refSelect, setRefSelect] = createSignal<HTMLSelectElement>();
  // eslint-disable-next-line prefer-const
  let refCheckbox: HTMLInputElement = document.createElement("input");

  // createEffect(() => {
  //   refSelect()?.addEventListener("change", (e) => {
  //     if (e.target?.value == "delete") {
  //       console.log("Send request to delete all selected item: ", selected());
  //     }
  //   });
  // });

  createEffect(() => {
    if (selected().length == stop.length) {
      refCheckbox.checked = true;
    } else {
      refCheckbox.checked = false;
    }
  });

  createEffect(() => {
    refCheckbox?.addEventListener("change", () => {
      setIsChecked(!isChecked());
    });

    onMount(() => {
      fetchEtablissement();
    });
  });

  // eslint-disable-next-line prefer-const
  let etablissementDiv: HTMLDivElement = document.createElement("div");

  // TODO: uncomment the ImportCsvCanvas
  // const [displayImportCsvCanvas, setDisplayImportCsvCanvas] =
  //   createSignal(false);

  onMount(() => {
    etablissementDiv.addEventListener(
      "dragenter",
      (e) => {
        e.preventDefault();
        // TODO: uncomment the ImportCsvCanvas
        // setDisplayImportCsvCanvas(true);
      },
      false
    );
    etablissementDiv.addEventListener("drop", (e) => e.preventDefault(), false);
    etablissementDiv.addEventListener(
      "dragleave",
      (e) => e.preventDefault(),
      false
    );
    etablissementDiv.addEventListener(
      "dragend",
      (e) => e.preventDefault(),
      false
    );
    etablissementDiv.addEventListener(
      "dragover",
      (e) => e.preventDefault(),
      false
    );
  });

  return (
    <>
      <ImportCsv />
      {/* TODO: uncomment the ImportCsvCanvas */}
      {/* <ImportCsvCanvas
        display={displayImportCsvCanvas()}
        setDisplay={setDisplayImportCsvCanvas}
      /> */}
      <RemoveRamassageConfirmation />
      <div class="flex w-full" ref={etablissementDiv}>
        <div id="arrets-board">
          <header>
            <h1>Gérer les établissements</h1>
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
                    type="email"
                    name="email"
                    id="email"
                    class=""
                    placeholder="Recherche"
                    onInput={(e) => {
                      setkeyword(e.currentTarget.value);
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
                            const fileName = `${year}-${month}-${day}_${hour}-${minute}_etablissements.csv`;
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
                <button
                  class="btn-arret-export-import"
                  onClick={openRemoveImportCsvBox}
                >
                  Importer
                </button>
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
                  <For
                    each={stop.filter((e) =>
                      e.name.toUpperCase().includes(keyword().toUpperCase())
                    )}
                  >
                    {(fields) => {
                      return <EtablissementItem item={fields} />;
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
