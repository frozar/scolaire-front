import { Show } from "solid-js";
import { getExportLoading } from "../signaux";
import { getRemainingExport } from "../signaux";

export default function () {
  return (
    <Show when={getExportLoading()}>
      <p class="fixed bottom-0 right-0 p-2 m-4 mr-1 z-[1400]">
        <span
          class="bg-white bg-opacity-90 border-none text-black

            hover:bg-white font-bold py-2 px-4 rounded btn"
        >
          Exporting...
        </span>
      </p>
      {/* Show number of file remaining below spinning wheel*/}
      {/* <div class="fixed justify-center z-[1400] bottom-0 left-0 p-2 m-4 ml-1">
        <p>
          <span class="bg-white bg-opacity-90 border-none text-black">
            {getRemainingExport()} files remaining
          </span>
        </p>
      </div> */}
    </Show>
  );
}
