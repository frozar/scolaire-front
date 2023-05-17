import { createStore } from "solid-js/store";
import { AiOutlineSearch } from "solid-icons/ai";
import EditStop, { setDataToEdit, toggleEditStop } from "./EditStop";
import { For, createEffect, createSignal } from "solid-js";
import StopItems from "./StopItem";
import { StopLineItem } from "../../type";

export const [selected, setSelected] = createSignal<StopLineItem[]>([]);
export const [stop, setStop] = createStore([
  {
    id: 1,
    name: "Arret du stade",
    quantity: 74,
    nb_etablissement: 3,
    nb_line: 3,
    lon: 23.43,
    lat: 23.54,
    selected: false,
  },
]);

export const addSelected = (item: StopLineItem) =>
  setSelected([...selected(), item]);

export const removeSelected = (item: StopLineItem) => {
  const items = selected().filter((stop) => stop.id != item.id);
  setSelected(items);
};

export const [isChecked, setIsChecked] = createSignal(false);

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
              <button class="btn-arret-export-import">Exporter</button>
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
                  {(fields) => (
                    <StopItems
                      id={fields.id}
                      name={fields.name}
                      quantity={fields.quantity}
                      nbEtablissement={fields.nb_etablissement}
                      nbLine={fields.nb_line}
                      lon={fields.lon}
                      lat={fields.lat}
                    />
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <EditStop />
    </div>
  );
}
