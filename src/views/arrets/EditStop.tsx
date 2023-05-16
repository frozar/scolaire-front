import { CgCloseO } from "solid-icons/cg";
import { HiSolidLocationMarker } from "solid-icons/hi";
import { createSignal } from "solid-js";
import { StopLineItem } from "../../type";

export const [toggledEditStop, setToggledEditStop] = createSignal(false);
export const toggleEditStop = () => setToggledEditStop(!toggledEditStop());
export const [dataToEdit, setDataToEdit] = createSignal<StopLineItem>();

export default function (props: any) {
  console.log(dataToEdit());

  return (
    <div id="stop-modal" classList={{ active: toggledEditStop() == true }}>
      <header>
        <button onClick={toggleEditStop} class="h-[30px] w-[30px] ">
          <CgCloseO class="w-full h-full fill-green " />
        </button>

        <h1>
          {dataToEdit() === undefined ? "Ajouter un arrêt" : "Éditer un arrêt"}
        </h1>
      </header>

      <section class="mt-6 flex flex-col gap-6">
        <div class="group inline-grid w-full">
          <label for="name">Nom</label>
          <input type="text" id="name" value={dataToEdit()?.name ?? ""} />
        </div>

        <h3 class="flex items-center">
          Arrêt <HiSolidLocationMarker />
        </h3>

        <div class="group inline-grid w-full">
          <label for="Latitude">Latitude</label>
          <input
            type="text"
            id="Latitude"
            value={dataToEdit()?.lat ? String(dataToEdit()?.lat) : ""}
          />
        </div>
        <div class="group inline-grid w-full">
          <label for="Longitude">Longitude</label>
          <input
            type="text"
            id="Longitude"
            value={dataToEdit()?.lat ? String(dataToEdit()?.lon) : ""}
          />
        </div>
      </section>
    </div>
  );
}
