import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { getSchools } from "../../../../../_stores/school.store";
import { getStops } from "../../../../../_stores/stop.store";
import { SchoolDetailUtils } from "../../../../../utils/school-details.utils";
import { setDisplaySchools } from "../../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../../_component/organisme/StopPoints";
import { setMapOnClick } from "../../../_component/template/MapContainer";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import SchoolDetailsHeader from "../molecule/SchoolDetailsHeader";
import { SchoolDetailsContent } from "../organism/SchoolDetailsContent";
import { SchoolDetailsPanels } from "../organism/SchoolDetailsPanels";
import { SchoolSettings } from "../organism/SchoolSettings";

//TODO doit être un SchoolType ou Undefined
export const [schoolDetailEditing, setSchoolDetailEditing] =
  createSignal<boolean>(false);

export const [schoolDetails, setSchoolDetails] = createSignal<SchoolType>();

export function SchoolDetails() {
  onMount(() => {
    setMapData(schoolDetails());
    setMapOnClick(() => setLocation);
  });

  onCleanup(() => {
    setSchoolDetails();
    setSchoolDetailEditing(false);
    setMapData(schoolDetails());
    setMapOnClick(undefined);
  });

  function cancel() {
    setSchoolDetails((prev) => {
      return getSchools().filter((school) => school.id == prev?.id)[0];
    });
    setSchoolDetailEditing(false);
  }

  function setLocation(e: L.LeafletMouseEvent) {
    if (!setSchoolDetailEditing) return;
    setSchoolDetails((prev) => {
      return { ...prev, lat: e.latlng.lat, lon: e.latlng.lng } as SchoolType;
    });
    setMapData(schoolDetails());
  }

  return (
    <section>
      <SchoolDetailsHeader school={schoolDetails() as SchoolType} />
      <SchoolSettings />

      <SchoolDetailsContent />

      <Show
        when={!schoolDetailEditing()}
        fallback={
          <div>
            <div>
              <div class="text-xl">Coordonnées</div>
              <p>Latitude : {schoolDetails()?.lat} </p>
              <p>Latitude : {schoolDetails()?.lon} </p>
            </div>
            <BoardFooterActions
              nextStep={{
                callback: SchoolDetailUtils.edit,
                label: "Valider",
              }}
              previousStep={{
                callback: () => cancel(),
                label: "Annuler",
              }}
            />
          </div>
        }
      >
        <SchoolDetailsPanels />
      </Show>
    </section>
  );
}

function setMapData(school: SchoolType | undefined) {
  if (school) {
    setDisplaySchools([school]);
    setDisplayStops(filterStops(school));
    // setDisplayTrips(filterTrips(school));
  } else {
    setDisplayStops([]);
    setDisplaySchools([]);
    // setDisplayTrips([]);
  }
}

function filterStops(school: SchoolType) {
  return getStops().filter((stop) => {
    let isAssociated = false;
    for (const assoSchool of stop.associated) {
      if (assoSchool.schoolId == school.id) {
        isAssociated = true;
        break;
      }
    }
    return isAssociated;
  });
}

// function filterTrips(school: SchoolType) {
//   return getTrips().filter((trip) => {
//     const points = trip.tripPoints;
//     let isTrip = false;
//     for (const point of points) {
//       if (point.nature == NatureEnum.school && point.id == school.id) {
//         isTrip = true;
//         break;
//       }
//     }
//     return isTrip;
//   });
// }
