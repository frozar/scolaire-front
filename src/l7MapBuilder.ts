import { createEffect, createMemo } from "solid-js";

import L from "leaflet";
import { LineLayer } from "@antv/l7";
import { L7Layer } from "@antv/l7-leaflet";
import fetchWorker from "./worker?worker";
import { dataToL7Format, L7Format } from "./workerUtils";
import { colorBarRGB, altitudeMin, altitudeMax, stepSize } from "./color";
import { getLeafletMap, setLeafletMap } from "./global/leafletMap";
import {
  enableSpinningWheel,
  disableSpinningWheel,
  lineUnderConstructionState,
} from "./signaux";

import { useStateAction } from "./StateAction";

const [stateAction] = useStateAction();

function handleDataFormatL7(
  dataFormatL7: any,
  nbPostCodes: number,
  scene: any,
  nbDataHandled: number[],
  allDataFormatL7: L7Format[],
  callbackAllDataReceived: () => void
) {
  // Sanity check
  nbDataHandled.push(0);

  if (!dataFormatL7) {
    return;
  }

  // console.log("dataFormatL7", dataFormatL7);
  allDataFormatL7.push(dataFormatL7);

  if (nbDataHandled.length !== nbPostCodes) {
    return;
  }

  // If all messages from workers are received, build the big layer
  // which contain all the route to display
  callbackAllDataReceived();

  // console.log("allDataFormatL7", allDataFormatL7);

  const mergedDataFormatL7 = ((allDataFormatL7: L7Format[]): L7Format => {
    let new_features = [];
    for (let data of allDataFormatL7) {
      for (let feature of data.features) {
        new_features.push(feature);
      }
    }

    return {
      ...allDataFormatL7[0],
      features: new_features,
    };
  })(allDataFormatL7);

  // console.log("mergedDataFormatL7", mergedDataFormatL7);

  // // Compute total length of road network
  // let totalRouteLength = 0;
  // for (const feature of mergedDataFormatL7.features) {
  //   totalRouteLength += feature.properties.length_m;
  // }

  // console.log("nb feature", mergedDataFormatL7.features.length);
  const layer = new LineLayer({})
    .source(mergedDataFormatL7)
    .size(3)
    .shape("line")
    .texture("arrow")
    .color("color")
    .animate({
      interval: 1,
      duration: 1,
      trailLength: 2,
    })
    .style({
      opacity: 0.6,
      lineTexture: true,
      iconStep: 10,
      borderWidth: 0.4,
      borderColor: "#fff",
    });

  let runOnce = false;
  layer.hooks.afterRender.tap("disableSpinningWheel", () => {
    if (!runOnce) {
      disableSpinningWheel();
      runOnce = true;
    }
  });

  scene.addLayer(layer);
}

function factoryOnMessageWorker(
  workers: Worker[],
  runPostCodes: number[],
  scene: any,
  nbDataHandled: number[],
  allDataFormatL7: any[]
) {
  return function (e: any) {
    const dataFormatL7 = e.data;
    handleDataFormatL7(
      dataFormatL7,
      runPostCodes.length,
      scene,
      nbDataHandled,
      allDataFormatL7,
      () => {
        workers.map((worker) => worker.terminate());
      }
    );
  };
}

function addLegend(map: L.Map) {
  /*Legend specific*/
  // @ts-expect-error
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "legend box-showoff prevent-select");
    div.innerHTML += "<h4>Altitude (m)</h4>";

    for (let alt = altitudeMin; alt <= altitudeMax; alt += stepSize) {
      const color = colorBarRGB(altitudeMin, altitudeMax, alt, {
        style: "step",
        step: stepSize,
      });

      div.innerHTML +=
        '<div class="row">' +
        '<div class="colorBox" style="background:' +
        color +
        '"></div><div class="textContainer"><div>' +
        alt +
        (alt + stepSize <= altitudeMax
          ? "&ndash;" + (alt + stepSize) + "</div></div>"
          : "+</div></div>") +
        "</div>";
    }

    return div;
  };

  legend.addTo(map);
}

export function buildMapL7(div: HTMLDivElement) {
  enableSpinningWheel();

  setLeafletMap(
    L.map(div, {
      zoomControl: false,
      zoomSnap: 0.1,
      zoomDelta: 0.1,
      wheelPxPerZoomLevel: 200,
    }).setView([-20.930746, 55.527503], 13)
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(getLeafletMap());

  addLegend(getLeafletMap());

  // If a line is under construction, disable the possibility
  // to pan the map
  createEffect(() => {
    const dragging = getLeafletMap().dragging;
    if (dragging) {
      if (lineUnderConstructionState().active) {
        dragging.disable();
      } else {
        dragging.enable();
      }
    }
  });

  // The argument in the constructor of the 'L7Layer' is simply pass to
  // Leaflet Layer as options for the constructor
  const l7layer = new L7Layer({});
  l7layer.addTo(getLeafletMap());

  const scene = l7layer.getScene();
  // To retrieve control over the cursor, remove the 'l7-interactive' class
  scene.getMapCanvasContainer().classList.remove("l7-interactive");

  createEffect(() => {
    const hasAnimation = stateAction.altimetry.animation;
    if (scene.getLayers().length) {
      for (const layer of scene.getLayers()) {
        if (hasAnimation) {
          layer.animate({
            interval: 1,
            duration: 1,
            trailLength: 2,
          });
        } else {
          layer.animate(false);
        }
      }
    }
  });

  let runPostCodes = [97418];
  if (import.meta.env.PROD) {
    runPostCodes = [97418];
  }

  let allDataFormatL7: any[] = [];
  let nbDataHandled: number[] = [];
  // if worker is supported by the navigator
  if (window.Worker) {
    const nbWorkers = navigator.hardwareConcurrency;
    const workers = [...Array(nbWorkers).keys()].map(() => new fetchWorker());

    for (const postCode of runPostCodes) {
      const URLtoFetch =
        import.meta.env.VITE_BACK_URL +
        "/get_routes_by_postcode_raw?postCode=" +
        // "/get_routes_by_postcode_restick?postCode=" +
        postCode.toString();
      workers[postCode % nbWorkers].postMessage(URLtoFetch);
    }

    workers.map(
      (worker) =>
        (worker.onmessage = factoryOnMessageWorker(
          workers,
          runPostCodes,
          scene,
          nbDataHandled,
          allDataFormatL7
        ))
    );
  } else {
    for (const postCode of runPostCodes) {
      fetch(
        import.meta.env.VITE_BACK_URL +
          "/get_routes_by_postcode_raw?postCode=" +
          postCode.toString()
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.length === 0) {
            return;
          }
          const dataFormatL7 = dataToL7Format(data);
          handleDataFormatL7(
            dataFormatL7,
            runPostCodes.length,
            scene,
            nbDataHandled,
            allDataFormatL7,
            () => {}
          );
        });
    }
  }
}
