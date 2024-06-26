import { For } from "solid-js";
import { OrganizationMemberType } from "../../../../_services/organisation.service";
import { OrganisationType } from "../../../layout/authentication";
import {
  DialogToDisplayEnum,
  setDialogToDisplay,
} from "../../board/component/organism/Dialogs";
import { OrganizationMembersTableItem } from "../molecule/OrganizationMembersTableItem";

export function OrganizationMembersTable(props: {
  members: OrganizationMemberType[];
  organization: OrganisationType;
}) {
  return (
    // TODO refacto the table to be reused... also the CSS
    <section class="page-layout">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h1 class="text-base font-semibold leading-6 text-gray-900">
              Membres de l'organisation : {props.organization.name}
            </h1>
          </div>
          <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setDialogToDisplay(DialogToDisplayEnum.addMember)}
              class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add user
            </button>
          </div>
        </div>
        <div class="mt-8 flow-root">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table class="min-w-full divide-green-base divide-y-4">
                <thead class="">
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
                      Email
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Privilège
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y-2 divide-green-base">
                  <For each={props.members}>
                    {(member) => (
                      <OrganizationMembersTableItem member={member} />
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
