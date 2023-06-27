import { CgCloseO } from "solid-icons/cg";
import { HiSolidLocationMarker } from "solid-icons/hi";
import { Show, createSignal } from "solid-js";
import { useStateGui } from "../../../StateGui";
import { addNewUserInformation } from "../../../signaux";
import {
  EtablissementItemType,
  MessageLevelEnum,
  MessageTypeEnum,
} from "../../../type";
import { authenticateWrap } from "../../layout/authentication";
import { fetchEtablissement } from "./Etablissement";

const [, { getActiveMapId }] = useStateGui();

export const [toggledEditStop, setToggledEditStop] = createSignal(false);

export function toggleEditStop() {
  setToggledEditStop((bool) => !bool);
}

export const [dataToEdit, setDataToEdit] =
  createSignal<EtablissementItemType>();

export default function () {
  let name!: HTMLInputElement;
  let lon!: HTMLInputElement;
  let lat!: HTMLInputElement;

  const handleClickAddStop = () => {
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

    authenticateWrap((headers) => {
      console.log(getActiveMapId());
      fetch(
        import.meta.env.VITE_BACK_URL +
          "/map/" +
          getActiveMapId() +
          "/etablissement",
        {
          method: "post",
          headers,
          body: JSON.stringify({
            name: nameStop,
            lon: lonStop,
            lat: latStop,
          }),
        }
      )
        .then(async (res) => {
          const json = await res.json();
          console.log("json", json);

          if (res.status !== 201) {
            addNewUserInformation({
              displayed: true,
              level: MessageLevelEnum.error,
              type: MessageTypeEnum.global,
              content: json["detail"],
            });

            return;
          }

          addNewUserInformation({
            displayed: true,
            level: MessageLevelEnum.success,
            type: MessageTypeEnum.global,
            content: json["message"],
          });
          toggleEditStop();

          fetchEtablissement();
        })
        .catch((err) => {
          console.error(err);
        });
    });
  };

  const handleClickEditStop = () => {
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

    // eslint-disable-next-line solid/reactivity
    authenticateWrap((headers) => {
      fetch(
        import.meta.env.VITE_BACK_URL +
          `/map/${getActiveMapId()}/etablissement/${dataToEdit()?.id}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            name: nameStop,
            lon: lonStop,
            lat: latStop,
          }),
        }
      )
        .then(async (res: Response) => {
          const json = await res.json();
          console.log(json);

          if (res.status != 200) {
            addNewUserInformation({
              displayed: true,
              level: MessageLevelEnum.error,
              type: MessageTypeEnum.global,
              content: json["detail"],
            });
            return;
          }

          addNewUserInformation({
            displayed: true,
            level: MessageLevelEnum.success,
            type: MessageTypeEnum.global,
            content: json["message"],
          });

          fetchEtablissement();
        })
        .catch((err) => {
          console.error(err);

          addNewUserInformation({
            displayed: true,
            level: MessageLevelEnum.error,
            type: MessageTypeEnum.global,
            content: err.message,
          });
        });
    });
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
