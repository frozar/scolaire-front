import { createSignal } from "solid-js";
import { BusService } from "../../../../_services/bus.service";
import {
  addNewGlobalSuccessInformation,
  addNewGlobalWarningInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { BusCategoryType } from "../../bus/organism/Bus";
import { VehicleMenuHeader } from "../atom/VehicleMenuHeader";
import { VehicleMenuContent } from "./VehicleMenuContent";
import { setIsVehicleMenuOpened } from "./vehicle/VehicleTab";

export function AddVehicleMenu() {
  const [isPMRSelected, setIsPMRSelected] = createSignal(true);

  const [getNewBus, setNewBus] = createSignal<BusCategoryType>({
    name: "",
    capacity: 0,
    capacity_standing: 0,
    capacity_pmr: 0,
    category: "bus",
    accessibility: "PMR",
    height: 0,
    length: 0,
    width: 0,
  });

  function resetDefaultValues() {
    setNewBus({
      name: "",
      capacity: 0,
      capacity_standing: 0,
      capacity_pmr: 0,
      category: "bus",
      accessibility: "PMR",
      height: 0,
      length: 0,
      width: 0,
    });
  }

  async function createNewVehicle() {
    if (getNewBus().name == "") {
      addNewGlobalWarningInformation("Veuillez entrer un nom");
      return;
    }
    if (getNewBus().capacity == 0) {
      addNewGlobalWarningInformation("Veuillez entrer la capacité du véhicule");
      return;
    }
    if (
      getNewBus().length == 0 ||
      getNewBus().width == 0 ||
      getNewBus().height == 0
    ) {
      addNewGlobalWarningInformation("Veuillez entrer le gabarit du véhicule");
      return;
    }
    enableSpinningWheel();
    await BusService.create(getNewBus());
    disableSpinningWheel();
    addNewGlobalSuccessInformation(
      "Le véhicule " + getNewBus().name + " a bien été créé"
    );
    setIsVehicleMenuOpened(false);
    resetDefaultValues();
  }

  return (
    <div>
      <VehicleMenuHeader />
      <VehicleMenuContent
        busItem={getNewBus()}
        isPMROn={isPMRSelected()}
        setBusItem={setNewBus}
        setIsPMROn={setIsPMRSelected}
        submit={createNewVehicle}
      />
    </div>
  );
}
