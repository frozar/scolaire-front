import L from "leaflet";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { LineType } from "../../../../_entities/line.entity";
import { TripType } from "../../../../_entities/trip.entity";
import { BusLineService } from "../../../../_services/line.service";
import { LineStore } from "../../../../_stores/line.store";
import PencilIcon from "../../../../icons/PencilIcon";
import PlusIcon from "../../../../icons/PlusIcon";
import TrashIcon from "../../../../icons/TrashIcon";
import { setRemoveConfirmation } from "../../../../userInformation/RemoveConfirmation";
import { ViewManager } from "../../ViewManager";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import { setDisplayTrips } from "../../_component/organisme/Trips";
import { leafletMap } from "../../_component/template/MapContainer";
import BoardTitle from "../../board/component/atom/BoardTitle";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import InputSearch from "../../schools/component/molecule/InputSearch";
import { TripsList } from "../../schools/component/organism/TripsList";
import "./LineDetails.css";

export const [selectedLine, setSelectedLine] = createSignal<LineType>();

export function LineDetails() {
  const localLine: LineType = selectedLine() as LineType;
  const localTrips: TripType[] = localLine.trips;
  const [filteredTrips, setFilteredTrips] =
    createSignal<TripType[]>(localTrips);

  onMount(() => {
    setDisplaySchools(localLine.schools);
    setDisplayStops(localLine.stops);
    setDisplayTrips(filteredTrips());

    const locations: L.LatLng[] = [];
    localLine.stops.forEach((stop) => {
      const latlong = L.latLng(stop.lat, stop.lon);
      if (!locations.includes(latlong)) locations.push(latlong);
    });
    localLine.schools.forEach((school) => {
      const latlong = L.latLng(school.lat, school.lon);
      if (!locations.includes(latlong)) locations.push(latlong);
    });
    const polygon = L.polygon(locations);
    leafletMap()?.fitBounds(polygon.getBounds(), { maxZoom: 14 });
  });

  createEffect(() => {
    setDisplaySchools(localLine.schools);
    setDisplayStops(localLine.stops);
    setDisplayTrips(filteredTrips());
  });

  onCleanup(() => {
    setDisplaySchools([]);
    setDisplayStops([]);
    setDisplayTrips([]);
  });

  const [searchKeyword, setSearchKeyword] = createSignal<string>("");

  function onInputSearch(key: string) {
    setSearchKeyword(key);
  }

  createEffect(() => {
    if (searchKeyword() == "") {
      setFilteredTrips([...localTrips]);
    } else {
      setFilteredTrips([
        ...localTrips.filter((trip) =>
          trip.name?.toLowerCase().includes(searchKeyword().toLowerCase())
        ),
      ]);
    }
  });

  function onClickDeleteLine() {
    setRemoveConfirmation({
      textToDisplay: "Êtes-vous sûr de vouloir supprimer la line : ",
      itemName: localLine.name ?? "Undefined",
      validate: DeleteLine,
    });
  }

  async function DeleteLine() {
    const responseId: number = await BusLineService.delete(
      localLine.id as number
    );
    if (!responseId) return false;
    LineStore.remove(responseId);
    ViewManager.lines();
    return true;
  }

  return (
    <section>
      <header class="trips-board-header">
        <div class="flex justify-between">
          <BoardTitle title={localLine.name ?? "Undefined"} />

          <div class="actions flex gap-5 items-center">
            <ButtonIcon icon={<TrashIcon />} onClick={onClickDeleteLine} />
            <ButtonIcon
              icon={<PencilIcon />}
              onClick={() => ViewManager.LineEdit(localLine)}
            />
            <ButtonIcon
              icon={<PlusIcon />}
              onClick={() => ViewManager.tripAdd(selectedLine() as LineType)}
            />
          </div>
        </div>
        <div class="trips-board-header-infos">
          <p>Nombre de courses: {localTrips.length}</p>
        </div>

        <InputSearch onInput={onInputSearch} />
      </header>

      <TripsList trips={filteredTrips()} />
    </section>
  );
}
