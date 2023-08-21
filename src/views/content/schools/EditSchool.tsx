import { CgCloseO } from "solid-icons/cg";
import { HiSolidLocationMarker } from "solid-icons/hi";
import { Show, createSignal } from "solid-js";
import { SchoolType } from "../../../_entities/school.entity";
import { SchoolService } from "../../../_services/school.service";
import { addNewUserInformation } from "../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../type";
import {
  getSchools,
  setSchools,
} from "../graphicage/component/organism/SchoolPoints";
export const [toggledEditStop, setToggledEditStop] = createSignal(false);

export function toggleEditStop() {
  setToggledEditStop((bool) => !bool);
}

export const [dataToEdit, setDataToEdit] = createSignal<SchoolType>();

export default function () {
  let name!: HTMLInputElement;
  let lon!: HTMLInputElement;
  let lat!: HTMLInputElement;

  const handleClickAddStop = async () => {
    const nameStop = name.value;
    const lonStop = lon.value;
    const latStop = lat.value;
    if (!nameStop || !lonStop || !latStop) {
      const nameStr = !nameStop ? "Nom" : "";
      const lonStr = !lonStop ? "Longitude" : "";
      const latStr = !latStop ? "Latitude" : "";

      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content: `Information(s) manquante(s) : ${nameStr} ${latStr} ${lonStr}`,
      });

      return;
    }

    const school: SchoolType = await SchoolService.create({
      name: nameStop,
      lon: +lonStop,
      lat: +latStop,
    });

    if (school) {
      setSchools(
        [...getSchools(), school].sort((a, b) => a.name.localeCompare(b.name))
      );
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.success,
        type: MessageTypeEnum.global,
        content: `L'établissement ${school.name} a été ajouté.`,
      });
      toggleEditStop();
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
    if (!nameStop || !lonStop || !latStop) {
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

    const school: SchoolType = await SchoolService.update({
      id: idToEdit,
      name: nameStop,
      lon: +lonStop,
      lat: +latStop,
    });

    if (school != null) {
      setSchools(
        getSchools()
          .map((item) => {
            if (item.id == school.id) return school;
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
          {dataToEdit() === undefined
            ? "Ajouter un établissement"
            : "Éditer un établissement"}
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
