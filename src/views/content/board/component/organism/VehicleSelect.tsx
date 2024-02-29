import { createEffect, createSignal, on, onMount } from "solid-js";
import { TransporterType } from "../../../../../_entities/transporter.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
  TripDirectionType,
} from "../../../../../_entities/trip-direction.entity";
import { LabeledInputSelect } from "../../../../../component/molecule/LabeledInputSelect";
import { addNewUserInformation } from "../../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../../type";
import { getAllTransporter } from "../../../allotment/molecule/TransporterTable";
import { BusCategoryType, getBus } from "../../../bus/organism/Bus";
import { quantity, totalToDrop } from "../molecule/TripTimelineItemWrapper";

interface DisplayBestVehicleProps {
  allotment_id: number;
  direction_id: number;
}

export function VehicleSelect(props: DisplayBestVehicleProps) {
  const [transporters, setTransporters] = createSignal<TransporterType[]>([]);
  const [vehicleOptions, setVehiclesOptions] = createSignal<BusCategoryType[]>(
    []
  );
  const [direction, setDirection] = createSignal<TripDirectionType>();
  const [defaultVehicle, setDefaultVehicle] = createSignal(0);

  function setSelectOptions() {
    const tmp: number[] = [];
    transporters().forEach((item) => {
      item.vehicles.forEach((item) => {
        if (!tmp.includes(Number(item.bus_categories_id))) {
          tmp.push(Number(item.bus_categories_id));
        }
      });
    });
    setVehiclesOptions(
      getBus().filter((bus) => {
        if (!tmp.includes(Number(bus.id))) return;
        return bus;
      })
    );
    vehicleOptions().sort((a, b) => {
      return a.capacity - b.capacity;
    });
    setDefaultVehicle(Number(vehicleOptions()[0].id));
  }

  function getBestVehicle() {
    let neededPlaces = 0;
    direction()?.type == TripDirectionEnum.going
      ? (neededPlaces = quantity())
      : (neededPlaces = totalToDrop());
    for (let i = 0; i < vehicleOptions().length; i++) {
      if (vehicleOptions()[i].capacity >= neededPlaces) {
        setDefaultVehicle(Number(vehicleOptions()[i].id));
        break;
      }
    }
  }

  onMount(() => {
    setTransporters(
      getAllTransporter().filter(
        (item) => item.allotment_id == props.allotment_id
      )
    );
    if (transporters().length <= 0) {
      console.log("No transporter available");
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content: "Aucun transporteur dans l'allotissement",
      });
      return;
    }
    setSelectOptions();
    setDirection(TripDirectionEntity.FindDirectionById(props.direction_id));
  });

  createEffect(on(quantity, () => getBestVehicle()));

  return (
    <div>
      <LabeledInputSelect
        label="Véhicule"
        defaultValue={defaultVehicle()}
        onChange={() => console.log()}
        options={vehicleOptions().map((vehicle) => {
          const textToDisplay =
            vehicle.name + " (" + vehicle.capacity.toString() + " places)";
          return {
            value: Number(vehicle.id),
            text: textToDisplay,
          };
        })}
      />
    </div>
  );
}
