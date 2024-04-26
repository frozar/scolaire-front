import L from "leaflet";
import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { getSchools } from "../../../../../_stores/school.store";
import { getStops } from "../../../../../_stores/stop.store";
import { getWays } from "../../../../../_stores/way.store";
import Button from "../../../../../component/atom/Button";
import { SchoolDetailUtils } from "../../../../../utils/school-details.utils";
import { setWayLineColor } from "../../../_component/molecule/WayLine";
import { setDisplayBusStops } from "../../../_component/organisme/BusStopPoints";
import { setDisplaySchools } from "../../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../../_component/organisme/StopPoints";
import { setDisplayWays } from "../../../_component/organisme/Ways";
import {
  leafletMap,
  setMapOnClick,
} from "../../../_component/template/MapContainer";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import { BusStopsDisplay } from "../../../busStops/organism/BusStopsDisplay";
import { BusStopsMenu } from "../../../busStops/organism/BusStopsMenu";
import SchoolDetailsHeader from "../molecule/SchoolDetailsHeader";
import { SchoolDetailsContent } from "../organism/SchoolDetailsContent";
import { SchoolDetailsPanels } from "../organism/SchoolDetailsPanels";
import { SchoolSettings } from "../organism/SchoolSettings";

//TODO doit être un SchoolType ou Undefined
export const [schoolDetailEditing, setSchoolDetailEditing] =
  createSignal<boolean>(false);

export const [schoolDetails, setSchoolDetails] = createSignal<SchoolType>();

export function SchoolDetails() {
  const [isChoosingLocal, setIsChoosingLocal] = createSignal(false);

  onMount(async () => {
    if (filterStops(schoolDetails() as SchoolType).length > 0) {
      const locations: L.LatLng[] = [];
      filterStops(schoolDetails() as SchoolType).forEach((stop) => {
        const latlong = L.latLng(stop.lat, stop.lon);
        locations.push(latlong);
      });
      const polygon = L.polygon(locations);
      leafletMap()?.fitBounds(polygon.getBounds(), { maxZoom: 13 });
    } else {
      const centerView = L.latLng(
        schoolDetails()?.lat as number,
        (schoolDetails()?.lon as number) - 0.025
      );
      leafletMap()?.setView(centerView, 14);
    }

    setWayLineColor("#888888");
    setMapData(schoolDetails());
  });

  onCleanup(() => {
    setSchoolDetails();
    setSchoolDetailEditing(false);
    setMapData(schoolDetails());
    setMapOnClick(undefined);
  });

  function toggleChoosingLocal() {
    if (isChoosingLocal()) return;
    setIsChoosingLocal(true);
    setMapOnClick(() => setLocation);
    setDisplayBusStops([]);
  }

  function cancel() {
    setSchoolDetails((prev) => {
      return getSchools().filter((school) => school.id == prev?.id)[0];
    });
    setSchoolDetailEditing(false);
    setMapData(schoolDetails());
  }

  function setLocation(e: L.LeafletMouseEvent) {
    if (!schoolDetailEditing()) return;
    if (!isChoosingLocal()) return;
    setSchoolDetails((prev) => {
      return { ...prev, lat: e.latlng.lat, lon: e.latlng.lng } as SchoolType;
    });
    setMapData(schoolDetails());
    setIsChoosingLocal(false);
    setMapOnClick(undefined);
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
            <BusStopsMenu
              item={schoolDetails() as SchoolType}
              schoolSetter={setSchoolDetails}
              isSchool
            />
            <div>
              <div class="text-xl">Coordonnées</div>
              <Button
                label="Modifier l'emplacement"
                onClick={toggleChoosingLocal}
                isDisabled={isChoosingLocal()}
              />
              <p>Latitude : {schoolDetails()?.lat} </p>
              <p>Latitude : {schoolDetails()?.lon} </p>
              <div />
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
        <BusStopsDisplay item={schoolDetails() as SchoolType} />
        <SchoolDetailsPanels />
      </Show>
    </section>
  );
}

function setMapData(school: SchoolType | undefined) {
  if (school) {
    setDisplaySchools([school]);
    setDisplayStops(filterStops(school));
    setDisplayBusStops(school.busStops);
    showWays(school);
    // setDisplayBusStops(filterBusStops(school));
    // setDisplayTrips(filterTrips(school));
  } else {
    setDisplayStops([]);
    setDisplaySchools([]);
    setDisplayBusStops([]);
    setDisplayWays([]);
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

function showWays(school: SchoolType) {
  const ids: number[] = [];
  school.busStops.forEach((item) => ids.push(item.way));
  setDisplayWays(getWays().filter((item) => ids.includes(item.id)));
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
