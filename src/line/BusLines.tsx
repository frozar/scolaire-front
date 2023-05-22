import L from "leaflet";
import { onCleanup, createEffect } from "solid-js";

import { fetchBusLines, setBusLines, busLines } from "../signaux";
import { pointsReady } from "../PointsRamassageAndEtablissement";
import {
  getBusLinePolyline,
  getLatLngs,
  busLinePolylineAttachEvent,
} from "./BusLinesFunction";
import { getLeafletMap } from "../signaux";

import { useStateAction } from "../StateAction";
const [, { isInRemoveLineMode }] = useStateAction();

export default function () {
  createEffect(() => {
    if (pointsReady()) {
      fetchBusLines();
    }
  });

  let busLinesPolyline: L.Polyline[] = [];

  createEffect(() => {
    // Anytime busLines() change the bus lines are redrawn
    for (const busLinePolyline of busLinesPolyline) {
      busLinePolyline.remove();
    }
    busLinesPolyline = [];

    for (const busLine of busLines()) {
      let busLinePolyline: L.Polyline = new L.Polyline([]);

      const leafletMap = getLeafletMap();
      if (!leafletMap) {
        return;
      }

      busLinePolyline = getBusLinePolyline(
        busLine.color,
        getLatLngs(busLine.stops)
      ).addTo(leafletMap);

      busLinePolylineAttachEvent(
        busLinePolyline,
        busLine.id_bus_line,
        busLine.color,
        isInRemoveLineMode
      );

      busLinesPolyline.push(busLinePolyline);
    }
    // À suppr: exemple d'affichage de route
    console.log("route test");
    const latlngsTest = [
      [55.517841, -20.95572],
      [55.517585, -20.955422],
      [55.51744, -20.954552],
      [55.51695, -20.954434],
      [55.517338, -20.953669],
      [55.517094, -20.95321],
      [55.517121, -20.95285],
      [55.517444, -20.952645],
      [55.517859, -20.952706],
      [55.517628, -20.952087],
      [55.517326, -20.952056],
      [55.516938, -20.95162],
      [55.517449, -20.951693],
      [55.517539, -20.95109],
      [55.517133, -20.951098],
      [55.516868, -20.950722],
      [55.516288, -20.950408],
      [55.51671, -20.950339],
      [55.516758, -20.949642],
      [55.51712, -20.948919],
      [55.517789, -20.948365],
      [55.517236, -20.948403],
      [55.516595, -20.949037],
      [55.516353, -20.949061],
      [55.516456, -20.947613],
      [55.515998, -20.946805],
      [55.516476, -20.946672],
      [55.516962, -20.947137],
      [55.516797, -20.946116],
      [55.516847, -20.944798],
      [55.517193, -20.945339],
      [55.517568, -20.944496],
      [55.517033, -20.943672],
      [55.516821, -20.943664],
      [55.516384, -20.944007],
      [55.51672, -20.943555],
      [55.517902, -20.943129],
      [55.517746, -20.942988],
      [55.518019, -20.942993],
      [55.517845, -20.942855],
      [55.518084, -20.94285],
      [55.517978, -20.942687],
      [55.518207, -20.942749],
      [55.518078, -20.942533],
      [55.518619, -20.942628],
      [55.518166, -20.942192],
      [55.518312, -20.942099],
      [55.51868, -20.942226],
      [55.518419, -20.941714],
    ];
    latlngsTest.map((elt) => elt.sort());
    let polylineTest = new L.Polyline(latlngsTest, { color: "red" }).addTo(
      getLeafletMap()
    );
  });

  onCleanup(() => {
    for (const busLinePolyline of busLinesPolyline) {
      busLinePolyline.remove();
    }
    busLinesPolyline = [];

    setBusLines([]);
  });

  return <></>;
}
