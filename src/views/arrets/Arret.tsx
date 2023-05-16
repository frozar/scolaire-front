import { createStore } from "solid-js/store";
import { AiOutlineSearch } from "solid-icons/ai";
import Addmodal from "./AddStopModal";
import { For, createSignal } from "solid-js";
import StopItems from "./StopItems";

export default function () {
  const [stop] = createStore([
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
    {
      name: "Arret du stade",
      quantity: 74,
      nb_etablissement: 3,
      nb_line: 3,
    },
  ]);

  const [toggledModal, setToggledModal] = createSignal(false);
  const toggleModal = () => setToggledModal(!toggledModal());
  return (
    <div class="flex w-full">
      <div id="arrets-board">
        <header>
          <h1>Gérer les arrets</h1>
          <div id="filters">
            <div class="left">
              <select>
                <option selected>Colone</option>
              </select>

              <button
                type="button"
                class="btn-arret-add"
                onClick={() => setToggledModal(!toggledModal())}
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
                    />
                    Nom
                  </th>
                  <th scope="col">Nombre d'élèves</th>
                  <th scope="col">Nombre d’établissement desservi</th>
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
                      name={fields.name}
                      quantity={fields.quantity}
                      nbEtablissement={fields.nb_etablissement}
                      nbLine={fields.nb_line}
                    />
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Addmodal toggledModal={toggledModal} toggleModal={toggleModal} />
    </div>
  );
}
