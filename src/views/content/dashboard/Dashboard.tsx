import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { Transition } from "solid-transition-group";
import Modal from "../../../component/molecule/Moldal";
import CreateMap from "./CreateMap";
import DeleteMapConfirmation from "./DeleteMapConfirmation";
import MapGrid from "./component/molecule/MapGrid";
import MapGridHeader from "./component/molecule/MapGridHeader";
import { fetchUserMaps, setUserMaps, userMaps } from "./dashboard";

export type CarteToDeleteType =
  | {
      id: number;
      title: string;
    }
  | undefined;

const [displayedDeleteMapConfirmation, setDisplayedDeleteMapConfirmation] =
  createSignal<CarteToDeleteType>();

export function closeDeleteMapModal() {
  setDisplayedDeleteMapConfirmation(undefined);
}

const [isDisplayedCreateMap, setIsDisplayedCreateMap] = createSignal(false);

function openCreateMapModal() {
  setIsDisplayedCreateMap(true);
}

export function closeCreateMapModal() {
  setIsDisplayedCreateMap(false);
}

export default function () {
  onMount(() => {
    fetchUserMaps();
  });

  onCleanup(() => {
    setUserMaps([]);
  });

  return (
    <div class="mx-10 w-full bg-white">
      <div class="h-[calc(100vh-60px)] overflow-y-auto px-1.5">
        <div class="mt-5 mb-3">
          <MapGridHeader openCreateMapModal={openCreateMapModal} />
        </div>

        <MapGrid
          mapList={userMaps()}
          handleClickDelete={setDisplayedDeleteMapConfirmation}
        />
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
