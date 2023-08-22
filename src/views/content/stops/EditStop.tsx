import { CgCloseO } from "solid-icons/cg";
import { HiSolidLocationMarker } from "solid-icons/hi";
import { Show, createSignal } from "solid-js";
import { StopType } from "../../../_entities/stop.entity";
import { StopService } from "../../../_services/stop.service";
import { addNewUserInformation } from "../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../type";
import {
  getStops,
  setStops,
} from "../graphicage/component/organism/StopPoints";
// import { getStops, setStops } from "./StopsBoard";

export const [toggledEditStop, setToggledEditStop] = createSignal(false);

export const toggleEditStop = () => setToggledEditStop((bool) => !bool);

export const [dataToEdit, setDataToEdit] = createSignal<StopType>();

export default function () {
  let name!: HTMLInputElement;
  let lon!: HTMLInputElement;
  let lat!: HTMLInputElement;
  const handleClickAddStop = async () => {
    const nameStop = name.value;
    const lonStop = lon.value;
    const latStop = lat.value;
    if (
      nameStop === null ||
      lonStop === null ||
      latStop === null ||
      nameStop === "" ||
      lonStop === "" ||
      latStop === ""
    ) {
      const nameStr = nameStop === null || nameStop === "" ? "Nom" : "";
      const lonStr = lonStop === null || lonStop === "" ? "Longitude" : "";
      const latStr = latStop === null || latStop === "" ? "Latitude" : "";

      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content:
          "Information(s) manquante(s) : " +
          nameStr +
          " " +
          latStr +
          " " +
          lonStr,
      });
      return;
    }

    const stop: StopType = await StopService.create({
      name: nameStop,
      lon: +lonStop,
      lat: +latStop,
    });

    if (stop) {
      setStops(
        [...getStops(), stop].sort((a, b) => a.name.localeCompare(b.name))
      );

      toggleEditStop();

      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.success,
        type: MessageTypeEnum.global,
        content: `Votre point de ramassage ${stop.name} a été ajouté.`,
      });
    }
  };

  const handleClickEditStop = async () => {
    const idToEdit = dataToEdit()?.id;
    if (!idToEdit) {
      return;
    }
    const nameStop = name.value;
    const lonStop = lon.value;
    const latStop = lat.value;
    if (
      nameStop === null ||
      lonStop === null ||
      latStop === null ||
      nameStop === "" ||
      lonStop === "" ||
      latStop === ""
    ) {
      const nameStr = nameStop === null || nameStop === "" ? "Nom" : "";
      const lonStr = lonStop === null || lonStop === "" ? "Longitude" : "";
      const latStr = latStop === null || latStop === "" ? "Latitude" : "";

      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content:
          "Information(s) manquante(s) : " +
          nameStr +
          " " +
          lonStr +
          " " +
          latStr,
      });
      return;
    }

    const stop: StopType = await StopService.update({
      id: idToEdit,
      name: nameStop,
      lon: +lonStop,
      lat: +latStop,
    });

    if (stop != null) {
      setStops(
        getStops()
          .map((item) => {
            console.log(item);
            if (item.id == stop.id) return stop;
            else return item;
          })
          .sort((a, b) => a.name.localeCompare(b.name))
      );

      toggleEditStop();
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.success,
        type: MessageTypeEnum.global,
        content: "La modification a été prise en compte.",
      });
    } else {
      toggleEditStop();
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content: "La modification a échouée.",
      });
    }
  };

  return (
    <div id="edit-stop" classList={{ active: toggledEditStop() == true }}>
      <header>
        <button onClick={toggleEditStop} class="">
          <CgCloseO class="" />
        </button>

        <h1>
          {dataToEdit() === undefined ? "Ajouter un arrêt" : "Éditer un arrêt"}
        </h1>
      </header>

      <section class="mt-6 flex flex-col gap-6">
        <div class="group inline-grid w-full">
          <label for="name">Nom</label>
          <input
            class="bg-white"
            ref={name}
            type="text"
            id="name"
            value={dataToEdit()?.name ?? ""}
          />
        </div>

        <h3 class="flex items-center">
          Arrêt <HiSolidLocationMarker />
        </h3>

        <div class="group inline-grid w-full">
          <label for="Latitude">Latitude</label>
          <input
            class="bg-white"
            ref={lat}
            type="text"
            id="Latitude"
            value={dataToEdit()?.lat ? String(dataToEdit()?.lat) : ""}
          />
        </div>
        <div class="group inline-grid w-full">
          <label for="Longitude">Longitude</label>
          <input
            class="bg-white"
            ref={lon}
            type="text"
            id="Longitude"
            value={dataToEdit()?.lat ? String(dataToEdit()?.lon) : ""}
          />
        </div>

        <div class="action">
          <Show
            when={dataToEdit() == undefined}
            fallback={
              <button class="green" onClick={handleClickEditStop}>
                Editer
              </button>
            }
          >
            <button class="green" onClick={handleClickAddStop}>
              Ajouter
            </button>
          </Show>
          <button onClick={toggleEditStop}>Annuler</button>
        </div>
      </section>
    </div>
  );
}
