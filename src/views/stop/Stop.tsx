import { createStore } from "solid-js/store";
import { AiOutlineSearch } from "solid-icons/ai";
import EditStop, { setDataToEdit, toggleEditStop } from "./EditStop";
import { For, createEffect, createSignal, onMount } from "solid-js";
import StopItems from "./StopItem";
import { StopItemType } from "../../type";
import { displayDownloadErrorMessage } from "../../userInformation/utils";
import { getExportDate } from "../graphicage/rightMapMenu/export/export";
import { download } from "../graphicage/rightMapMenu/export/csvExport";
export const [selected, setSelected] = createSignal<StopLineItem[]>([]);
export const [stop, setStop] = createStore([]);

export const addSelected = (item: StopItemType) =>
  setSelected([...selected(), item]);

export const removeSelected = (item: StopItemType) => {
  const items = selected().filter((stop) => stop.id != item.id);
  setSelected(items);
};

export const [isChecked, setIsChecked] = createSignal(false);

function StopLineBoard(props: { item: StopLineItem }) {
  const item = props.item;
  return (
    <tr>
      <td class="flex items-center">
        <input
          id="comments"
          aria-describedby="comments-description"
          name="comments"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 relative right-2"
        />
        {item.name}
      </td>
      <td>{item.quantity}</td>
      <td>{item.nbEtablissement}</td>
      <td>{item.nbLine}</td>
      <td>
        <a href="#" class="text-[#0CC683] mr-2">
          Editer
        </a>

        <a href="#" class="text-[#F44434]">
          Supprimer
        </a>
      </td>
    </tr>
  );
}
export default function () {
  const [refSelect, setRefSelect] = createSignal<HTMLSelectElement>();
  let refCheckbox!: HTMLInputElement;

  createEffect(() => {
    refSelect()?.addEventListener("change", (e) => {
      if (e.target?.value == "delete") {
        console.log("Send request to delete all selected item: ", selected());
      }
    });
  });

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
    const [stop, setStop] = createStore<StopLineItem[]>([]);
    onMount(() => {
      fetch(
        import.meta.env.VITE_BACK_URL + "/ramassages_associated_bus_lines_info",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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
            }[]
          ) => {
            setStop(
              res.map((elt) => {
                return {
                  id: elt.id,
                  name: elt.name,
                  quantity: elt.quantity,
                  nbLine: elt.nb_line,
                  nbEtablissement: elt.nb_etablissement,
                };
              })
            );
          }
        );
    });

    return (
      <div class="flex w-full">
        <div id="arrets-board">
          <header>
            <h1>Gérer les arrêts</h1>
            <div id="filters">
              <div class="left">
                <select ref={setRefSelect}>
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
                  />
                </div>
              </div>

              <div class="right">
                <button
                  class="btn-arret-export-import"
                  onClick={() => {
                    fetch(import.meta.env.VITE_BACK_URL + "/export/input")
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
                        const fileName = `${year}-${month}-${day}_${hour}-${minute}_input.zip`;
                        download(fileName, blob);
                      })
                      .catch(() => {
                        displayDownloadErrorMessage();
                      });
                  }}
                >
                  Exporter
                </button>
                <button class="btn-arret-export-import">Importer</button>
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
                    <th scope="col">Nombre d’établissements desservis</th>
                    <th scope="col">Nombre de lignes</th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span class="">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <For each={stop}>
                    {(fields) => <StopItems item={fields} />}
                  </For>
                </tbody>
              </table>
            </div>
          </div>
          <EditStop />
        </div>
      </div>
    );
  });
}
