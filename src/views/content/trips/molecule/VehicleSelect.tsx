import { createEffect, createSignal, onMount } from "solid-js";
import { TransporterType } from "../../../../_entities/transporter.entity";
import { TripPointType } from "../../../../_entities/trip.entity";
import { AllotmentStore } from "../../../../_stores/allotment.store";
import { BusStore } from "../../../../_stores/bus.store";
import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import { QuantityUtils } from "../../../../utils/quantity.utils";
import { BusCategoryType } from "../../bus/organism/Bus";

export function VehicleSelect(props: {
  tripPoints: TripPointType[];
  allotment_id: number;
  busCategoryId: number;
  onUpdateVehicule: (id: number) => void;
}) {
  // eslint-disable-next-line solid/reactivity
  const allotmentBus: BusCategoryType[] = getAllotmentBus(props.allotment_id);

  const [localCategoryId, setLocalCategoryId] = createSignal<number>(0);
  const [neededQuantity, setNeededQuantite] = createSignal<number>(0);

  onMount(() => {
    setLocalCategoryId(props.busCategoryId);
    setNeededQuantite(QuantityUtils.getQuantityUsedInTrip(props.tripPoints));
  });
  createEffect(() => {
    setNeededQuantite(QuantityUtils.getQuantityUsedInTrip(props.tripPoints));
  });

  createEffect(() => {
    if (allotmentBus.length > 0) {
      let selectedId;
      for (const cat of allotmentBus) {
        if (cat.capacity >= neededQuantity()) {
          selectedId = cat.id;
          break;
        }
      }
      if (!selectedId) {
        const biggestBus: BusCategoryType =
          allotmentBus[allotmentBus.length - 1];
        selectedId = biggestBus.id;
      }
      setLocalCategoryId(selectedId as number);
    }
  });

  function onChange(id: number) {
    props.onUpdateVehicule(id);
  }

  return (
    <div>
      <LabeledInputSelect
        label="Véhicule"
        defaultValue={localCategoryId()}
        onChange={(value) => onChange(Number(value))}
        options={allotmentBus.map((vehicle) => {
          return {
            value: Number(vehicle.id),
            text:
              vehicle.name + " (" + vehicle.capacity.toString() + " places)",
          };
        })}
      />
    </div>
  );
}

function getAllotmentBus(allotmentId: number): BusCategoryType[] {
  const transporters: TransporterType[] = setTransporters(allotmentId);
  const output: BusCategoryType[] = [];
  transporters.forEach((item) => {
    item.vehicles.forEach((item) => {
      if (!output.some((cat) => cat.id == item.bus_categories_id)) {
        output.push(BusStore.getById(item.bus_categories_id as number));
      }
    });
  });
  output.sort((a, b) => {
    return a.capacity - b.capacity;
  });
  return output;
}
function setTransporters(allotmentId: number) {
  const allotment = AllotmentStore.get().filter((a) => a.id == allotmentId)[0];
  return allotment.transporters;
}
