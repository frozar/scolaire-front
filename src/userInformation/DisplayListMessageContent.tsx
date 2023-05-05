import { For } from "solid-js";

export default function (list: string[]) {
  return (
    <table class="min-w-full divide-y divide-gray-300 scrollit">
      <tbody>
        <tr style="display: flex; flex-direction: column; align-items: center;">
          <For each={list}>
            {(pt) => (
              <td class="whitespace py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {pt}
              </td>
            )}
          </For>
        </tr>
      </tbody>
    </table>
  );
}
