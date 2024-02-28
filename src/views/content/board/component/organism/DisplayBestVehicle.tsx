import { onMount } from "solid-js";
import { getAllTransporter } from "../../../allotment/molecule/TransporterTable";

export function DisplayBestVehicle(props: { allotment_id: number }) {
  function bestVehicle() {
    const transporters = getAllTransporter().filter(
      (item) => item.allotment_id == props.allotment_id
    );
    console.log(transporters);
  }

  onMount(() => {
    bestVehicle();
  });

  return (
    <div>
      <p> Meilleur véhicule :</p>
      <p class="font-bold text-sm">uh</p>
    </div>
  );
}
