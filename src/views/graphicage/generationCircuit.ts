import _ from "lodash";
import {
  addNewUserInformation,
  busLines,
  disableSpinningWheel,
  enableSpinningWheel,
  fetchBusLines,
  points,
} from "../../signaux";
import {
  LineType,
  MessageLevelEnum,
  MessageTypeEnum,
  NatureEnum,
  PointIdentityType,
  PointRamassageType,
} from "../../type";
import { addBusLine } from "../../request";
import { useStateAction } from "../../StateAction";

const [, { setModeRead }] = useStateAction();

function compute_unplanned_stops(
  all_pois: PointIdentityType[],
  planned_stops: PointIdentityType[]
) {
  return _.differenceWith(all_pois, planned_stops, _.isEqual);
}

export function generateCircuit(
  nbVehicles: number,
  vehiculesCapacity: number,
  maximumTravelDistance: number,
  globalSpanCostCoefficient: number,
  timeLimitSeconds: number
) {
  // TODO: This must be rewrite. The existing lines should drive the sanity check.
  // Which students are not already taken by a bus?
  const all_pois = points().map(
    (elt: PointRamassageType): PointIdentityType => {
      const { id, id_point, nature } = elt;
      return { id, id_point, nature };
    }
  );

  const planned_stops: PointIdentityType[] = _.flattenDeep(
    busLines().map((elt: LineType) => elt.stops)
  );

  const unplanned_stops = compute_unplanned_stops(all_pois, planned_stops);

  if (unplanned_stops.length == 0) {
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.error,
      type: MessageTypeEnum.global,
      content: "Aucun Point d'Intéret libre pour la génération de lignes.",
    });
    return;
  }

  const unplanned_ramassage = unplanned_stops.filter(
    (elt: PointIdentityType) => elt.nature == NatureEnum.ramassage
  );
  const unplanned_etablissement = unplanned_stops.filter(
    (elt: PointIdentityType) => elt.nature == NatureEnum.etablissement
  );

  if (unplanned_ramassage.length == 0) {
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.error,
      type: MessageTypeEnum.global,
      content: "Aucun arrêt de ramassage pour la génération de lignes.",
    });
    return;
  }

  // Even if some lin arrive to an etablissement, it doesn't mean the etablissement
  // doesn't expect more student to come
  if (unplanned_etablissement.length == 0) {
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.error,
      type: MessageTypeEnum.global,
      content: "Aucun établissement pour la génération de lignes.",
    });
    return;
  }
  const ramassageIds: number[] = unplanned_ramassage.map(
    (elt: PointIdentityType) => elt["id"]
  );
  const etablissementIds: number[] = unplanned_etablissement.map(
    (elt: PointIdentityType) => elt["id"]
  );

  enableSpinningWheel();
  fetch(import.meta.env.VITE_BACK_URL + "/generator/school_bus_circuit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ramassage_ids: ramassageIds,
      etablissement_ids: etablissementIds,
      num_vehicles: nbVehicles,
      vehicules_capacity: vehiculesCapacity,
      maximum_travel_distance: maximumTravelDistance,
      global_span_cost_coefficient: globalSpanCostCoefficient,
      time_limit_seconds: timeLimitSeconds,
    }),
  })
    .then(async (res) => {
      const data = await res.json();
      console.log("data:", data);
      if (!data) {
        const nbRamassage = ramassageIds.length;
        const nbEtablissement = etablissementIds.length;
        addNewUserInformation({
          displayed: true,
          level: MessageLevelEnum.error,
          type: MessageTypeEnum.global,
          content:
            "Erreur lors de la génération de circuit. [ramassage:" +
            String(nbRamassage) +
            ", etablissement:" +
            String(nbEtablissement) +
            "]",
        });
        console.error("Error: data", data);
        disableSpinningWheel();
        return;
      }
      for (const route of data) {
        const idsPoint = route["steps"].map(
          (step: {
            load: number;
            distance: number;
            id: number;
            id_point: number;
            nature: string;
          }) => step["id_point"]
        );

        // TODO: differ add line with a dialog box
        // const res = await addBusLine(idsPoint);
        await addBusLine(idsPoint);

        // TODO: Deal case of error
        // await res.json();
        setModeRead();
        fetchBusLines();
        disableSpinningWheel();
      }
    })
    .catch((e) => {
      const nbRamassage = ramassageIds.length;
      const nbEtablissement = etablissementIds.length;
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content:
          "Erreur lors de la génération de circuit. [ramassage:" +
          String(nbRamassage) +
          ", etablissement:" +
          String(nbEtablissement) +
          "]",
      });
      console.error("Error:", e);
      disableSpinningWheel();
    });
}
