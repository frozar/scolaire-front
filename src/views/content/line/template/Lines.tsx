import L from "leaflet";
import { BiRegularExport } from "solid-icons/bi";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { LineType } from "../../../../_entities/line.entity";
import { SchoolType } from "../../../../_entities/school.entity";
import { StopType } from "../../../../_entities/stop.entity";
import { TripType } from "../../../../_entities/trip.entity";
import { getLines } from "../../../../_stores/line.store";
import { getSchools } from "../../../../_stores/school.store";
import { getStops } from "../../../../_stores/stop.store";
import PlusIcon from "../../../../icons/PlusIcon";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import { setDisplayTrips } from "../../_component/organisme/Trips";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import {
  DialogToDisplayEnum,
  setDialogToDisplay,
} from "../../board/component/organism/Dialogs";
import InputSearch from "../../schools/component/molecule/InputSearch";
import { LinesList } from "../organism/LinesList";

import { ViewManager } from "../../ViewManager";
import { leafletMap } from "../../_component/template/MapContainer";
import "./Lines.css";

export function Lines() {
  const [filteredLines, setFilteredLines] = createSignal<LineType[]>(
    getLines()
  );

  onMount(() => {
    setMapData(getStops(), getSchools(), filteredLines());
    const locations: L.LatLng[] = [];
    if (filteredLines().length > 0) {
      filteredLines().forEach((line) => {
        line.stops.forEach((stop) => {
          const latlong = L.latLng(stop.lat, stop.lon);
          if (!locations.includes(latlong)) locations.push(latlong);
        });
        line.schools.forEach((school) => {
          const latlong = L.latLng(school.lat, school.lon);
          if (!locations.includes(latlong)) locations.push(latlong);
        });
      });
      const polygon = L.polygon(locations);
      leafletMap()?.fitBounds(polygon.getBounds(), { maxZoom: 13 });
    }
  });

  onCleanup(() => {
    setMapData([], [], []);
  });

  createEffect(() => {
    setMapData(getStops(), getSchools(), filteredLines());
  });

  createEffect(() => {
    if (searchKeyword() == "") {
      setFilteredLines([...getLines()]);
    } else {
      setFilteredLines([
        ...getLines().filter((line) =>
          line.name?.toLowerCase().includes(searchKeyword().toLowerCase())
        ),
      ]);
    }
  });

  const [searchKeyword, setSearchKeyword] = createSignal<string>("");

  function onInputSearch(key: string) {
    setSearchKeyword(key);
  }

  return (
    <section>
      <header class="line-board-header">
        <div class="line-board-header-infos">
          <p>Total des lignes: {getLines().length}</p>
          <ButtonIcon
            icon={<BiRegularExport class="fill-green-base" />}
            onClick={displayExportDialog}
          />
          <ButtonIcon icon={<PlusIcon />} onClick={addLine} />
        </div>

        <InputSearch onInput={onInputSearch} />
      </header>
      <LinesList lines={filteredLines()} />
    </section>
  );
}

function setMapData(
  stops: StopType[],
  schools: SchoolType[],
  lines: LineType[]
) {
  setDisplayStops(stops);
  setDisplaySchools(schools);

  let trips: TripType[] = [];
  for (const line of lines) {
    trips = trips.concat(line.trips);
  }

  setDisplayTrips(trips);
}

function addLine() {
  ViewManager.lineAdd();
}

function displayExportDialog() {
  setDialogToDisplay(DialogToDisplayEnum.exportSelection);
}
