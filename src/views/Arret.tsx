import { createStore } from "solid-js/store";

function StopLineBoard(props) {
  return (
    <tr>
      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        Lindsay Walton
      </td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        Front-end Developer
      </td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        lindsay.walton@example.com
      </td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Member</td>
      <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
        <a href="#" class="text-indigo-600 hover:text-indigo-900">
          Edit
        </a>
      </td>
    </tr>
  );
}
export default function () {
  const [stop] = createStore([
    {
      name: "Arret du stade",
      nbStudent: 74,
      nbEstablishmentDiserved: 3,
      nbLine: 3,
    },
    {
      name: "Arret du stade",
      nbStudent: 74,
      nbEstablishmentDiserved: 3,
      nbLine: 3,
    },
  ]);

  return (
    <div id="arrets-board" class="w-full mx-8">
      <div class="px-4 sm:px-6 lg:px-8">
        <header>
          <h1 class="text-2xl">Gérer les arrets</h1>
          <div id="filters" class="flex w-full">
            <div class="left flex w-1/2 gap-3">
              <select class=" block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2  sm:text-sm sm:leading-6">
                <option selected>Colone</option>
              </select>

              <button
                type="button"
                class="rounded-md bg-[#0CC683] px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0ea76f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0CC683]"
              >
                Ajouter
              </button>
              <div class="relative rounded-md shadow-sm">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    class="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset   sm:text-sm sm:leading-6"
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </div>
        </header>
      </div>
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Nom
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Nombre d'élèves
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Nombre d’établissement desservi
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Nombre de lignes
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span class="">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <StopLineBoard />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
