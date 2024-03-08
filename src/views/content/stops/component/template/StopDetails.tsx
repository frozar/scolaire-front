import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import { getSchools } from "../../../../../_stores/school.store";
import { getTrips } from "../../../../../_stores/trip.store";
import { LabeledInputNumber } from "../../../../../component/molecule/LabeledInputNumber";
import { NatureEnum } from "../../../../../type";
import { StopUtils } from "../../../../../utils/stop.utils";
import { setDisplaySchools } from "../../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../../_component/organisme/StopPoints";
import { setDisplayTrips } from "../../../_component/organisme/Trips";
import { RemainingStudentInformation } from "../atom/RemainingStudentInformation";
import { StopActionsPanelsButtons } from "../molecul/StopActionsPanelsButtons";
import { StopDetailsHeader } from "../molecul/StopDetailsHeader";
import { StopFooter } from "../molecul/StopFooter";
import { StopContentPanels } from "../organism/StopContentPanels";
import "./StopDetails.css";

export const [stopDetailsItem, setStopDetailsItem] = createSignal<StopType>();

export enum StopPanels {
  grades = "grades",
  trips = "trips",
}

// TODO revoir les utilisations du signal stopDetails et revoir les setStopDetails
export const [stopDetails, setStopDetails] = createSignal<StopType>();

export function StopDetails() {
  const [editItem, setEditItem] = createSignal<boolean>(false);

  const [onPanel, setOnPanel] = createSignal<StopPanels>(StopPanels.grades);
  const [addQuantity, setAddQuantity] = createSignal<boolean>(false);

  onMount(() => {
    setMapData(stopDetails());
  });

  onCleanup(() => {
    setStopDetails();
    setMapData(stopDetails());
  });

  function toggleEditItem() {
    setEditItem((bool) => !bool);
  }
  const toggleInAddQuantity = () => setAddQuantity((prev) => !prev);

  function onChangeWaitingTime(element: HTMLInputElement) {
    StopUtils.updateStopDetailsItem({ waitingTime: Number(element.value) });
  }

  return (
    <section>
      <Show when={stopDetails()}>
        <StopDetailsHeader
          stop={stopDetails() as StopType}
          editing={editItem}
          toggleEditing={toggleEditItem}
        />
        <LabeledInputNumber
          onChange={onChangeWaitingTime}
          selector={{
            disabled: !editItem(),
            value: stopDetails()?.waitingTime as number,
          }}
          label="Temps d'attente en seconde sur l'arrêt"
        />
        <Show when={!editItem()}>
          <RemainingStudentInformation />

          <StopActionsPanelsButtons
            stop={stopDetails() as StopType}
            onPanel={onPanel}
            setOnPanel={setOnPanel}
            toggleInAddQuantity={toggleInAddQuantity}
          />

          <StopContentPanels
            stop={stopDetails() as StopType}
            onPanel={onPanel}
            setOnPanel={setOnPanel}
            inAddQuantity={addQuantity}
            toggleInAddQuantity={toggleInAddQuantity}
          />
        </Show>
        <StopFooter editItem={editItem()} toggleEdit={toggleEditItem} />
      </Show>
    </section>
  );
}

function setMapData(stop: StopType | undefined) {
  if (stop) {
    setDisplayStops([stop]);
    setDisplaySchools(filterSchools(stop));
    setDisplayTrips(filterTrips(stop));
  } else {
    setDisplayStops([]);
    setDisplaySchools([]);
    setDisplayTrips([]);
  }
}

function filterSchools(stop: StopType) {
  return getSchools().filter((school) => {
    const associatedStops = school.associated;
    let isAssociated = false;
    for (const assoStop of associatedStops) {
      if (assoStop.stopId == stop.id) {
        isAssociated = true;
        break;
      }
    }
    return isAssociated;
  });
}

function filterTrips(stop: StopType) {
  return getTrips().filter((trip) => {
    const points = trip.tripPoints;
    let isTrip = false;
    for (const point of points) {
      if (point.nature == NatureEnum.stop && point.id == stop.id) {
        isTrip = true;
        break;
      }
    }
    return isTrip;
  });
}
