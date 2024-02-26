import { Show, createEffect, createSignal, on } from "solid-js";
import { Transition } from "solid-transition-group";
import { MapStore, userMaps } from "../../../_stores/map.store";
import Modal from "../../../component/molecule/Modal";
import { authenticated } from "../../../signaux";
import CreateMap from "./CreateMap";
import DeleteMapConfirmation from "./DeleteMapConfirmation";
import MapGridHeader from "./component/molecule/MapGridHeader";
import { MapTables } from "./component/organism/MapTables";

export type CarteToDeleteType =
  | {
      id: number;
      title: string;
    }
  | undefined;

const [displayedDeleteMapConfirmation, setDisplayedDeleteMapConfirmation] =
  createSignal<CarteToDeleteType>();

const [isDisplayedCreateMap, setIsDisplayedCreateMap] = createSignal(false);

export function Maps() {
  createEffect(
    on(authenticated, () => {
      if (authenticated()) MapStore.fetchUserMaps();
    })
  );

  return (
    <div class="px-10 w-full bg-white pt-4">
      <div class="h-[calc(100vh-60px)]">
        <MapGridHeader openCreateMapModal={openCreateMapModal} />
        <MapTables
          mapList={userMaps()}
          handleClickDelete={setDisplayedDeleteMapConfirmation}
        />
        {/* <MapGrid
          mapList={userMaps()}
          handleClickDelete={setDisplayedDeleteMapConfirmation}
        /> */}
      </div>

      <Modal show={isDisplayedCreateMap()}>
        <CreateMap />
      </Modal>

      <Transition
        name="slide-fade"
        enterActiveClass="ease-out duration-300"
        enterClass="opacity-0"
        enterToClass="opacity-100"
        exitActiveClass="ease-in duration-300"
        exitClass="opacity-100"
        exitToClass="opacity-0"
      >
        <Show when={displayedDeleteMapConfirmation()}>
          <DeleteMapConfirmation
            carteToDelete={displayedDeleteMapConfirmation()}
          />
        </Show>
      </Transition>
    </div>
  );
}

export function closeDeleteMapModal() {
  setDisplayedDeleteMapConfirmation(undefined);
}
function openCreateMapModal() {
  setIsDisplayedCreateMap(true);
}

export function closeCreateMapModal() {
  setIsDisplayedCreateMap(false);
}
