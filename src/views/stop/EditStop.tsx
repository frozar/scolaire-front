import { CgCloseO } from "solid-icons/cg";
import { HiSolidLocationMarker } from "solid-icons/hi";
import { Show, createSignal } from "solid-js";
import { MessageLevelEnum, MessageTypeEnum, StopItemType } from "../../type";
import { displayArret } from "./Stop";
import { addNewUserInformation } from "../../signaux";

export const [toggledEditStop, setToggledEditStop] = createSignal(false);
export const toggleEditStop = () => setToggledEditStop(!toggledEditStop());
export const [dataToEdit, setDataToEdit] = createSignal<StopItemType>();

export default function () {
  let name!: HTMLInputElement;
  let lon!: HTMLInputElement;
  let lat!: HTMLInputElement;
  const handleClickAddStop = () => {
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
    fetch(import.meta.env.VITE_BACK_URL + "/point_ramassage", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: dataToEdit()?.id,
        name: nameStop,
        lon: lonStop,
        lat: latStop,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (!isNaN(res)) {
          addNewUserInformation({
            displayed: true,
            level: MessageLevelEnum.success,
            type: MessageTypeEnum.global,
            content: "L'arrêt a été crée",
          });
          toggleEditStop();
        } else {
          console.error(res.message.split(":").join("\n"));
          addNewUserInformation({
            displayed: true,
            level: MessageLevelEnum.error,
            type: MessageTypeEnum.global,
            content:
              "Erreur lors de la modification : \n" + res.message.split(":")[1],
          });
        }
        displayArret();
      });
  };

  const handleClickEditStop = () => {
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
    fetch(import.meta.env.VITE_BACK_URL + "/point_ramassage", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: dataToEdit()?.id,
        name: nameStop,
        lon: lonStop,
        lat: latStop,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res === "UPDATE 1") {
          addNewUserInformation({
            displayed: true,
            level: MessageLevelEnum.success,
            type: MessageTypeEnum.global,
            content: "L'arrêt a été modifié",
          });
          toggleEditStop();
        } else {
          addNewUserInformation({
            displayed: true,
            level: MessageLevelEnum.error,
            type: MessageTypeEnum.global,
            content: "Erreur lors de la modification : " + res,
          });
        }
        displayArret();
      });
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
            ref={lat}
            type="text"
            id="Latitude"
            value={dataToEdit()?.lat ? String(dataToEdit()?.lat) : ""}
          />
        </div>
        <div class="group inline-grid w-full">
          <label for="Longitude">Longitude</label>
          <input
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
