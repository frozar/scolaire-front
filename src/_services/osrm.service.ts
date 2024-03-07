import L, { LatLng } from "leaflet";
import { useStateGui } from "../StateGui";
import {
  TripMetricType,
  TripPointType,
  TripType,
} from "../_entities/trip.entity";
import { WaypointType } from "../_entities/waypoint.entity";
import { userMaps } from "../_stores/map.store";
import { MapsUtils } from "../utils/maps.utils";
import { MetricsUtils } from "../utils/metrics.utils";
import { getSelectedWays } from "../views/content/map/component/molecule/LineWeight";
import { getConflictWays } from "../views/content/stops/component/organism/VoirieItems";
import { ServiceUtils } from "./_utils.service";

const osrm = import.meta.env.VITE_API_OSRM_URL;
const osrmTable = osrm + "/table/v1/driving";
const host = import.meta.env.VITE_BACK_URL;
const [, { getActiveMapId }] = useStateGui();

export type osrmResponseType = {
  routes: routesType[];
  waypoints: {
    name: string;
    distance: number;
    hint: string;
    locations: number[];
  }[];
};

type osrmTableResponseType = {
  durations: number[][];
};

export type step = {
  flaxib_way_id: number;
  flaxib_weight: weight[];
  coordinates?: L.LatLng[];
  name?: string;
};

export type weight = {
  weight: number;
  start: number;
  end: number;
};

export class OsrmService {
  static async getRoadPolyline(trip: TripType): Promise<{
    latlngs: L.LatLng[];
    projectedLatlngs: L.LatLng[];
    metrics: TripMetricType;
    legsDurations: number[];
    legsDistances: number[];
    stepsWeight: step[];
  }> {
    const points: TripPointType[] = trip.tripPoints;
    let waypoints: WaypointType[] = trip.waypoints ?? points;
    waypoints = waypoints.length > 0 ? waypoints : points;
    if (waypoints.length <= 1) {
      return {
        latlngs: [],
        projectedLatlngs: [],
        metrics: {},
        legsDurations: [],
        legsDistances: [],
        stepsWeight: [],
      };
    }
    const waypointsStringified = this.buildPositionURL(waypoints);

    const timecode = 420;

    const responses = await ServiceUtils.generic(
      host +
        "/osrm/road?map_id=" +
        getActiveMapId() +
        "&timecode=" +
        timecode +
        "&waypoints=" +
        waypointsStringified,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = responses[0];
    const response_direct = responses[1];

    // const directWaypointsStringified = this.buildPositionURL([
    //   points[0],
    //   points[points.length - 1],
    // ]);
    // const response_direct = await ServiceUtils.generic(
    //   host +
    //     "/osrm/osrm_utils?map_id=" +
    //     getActiveMapId() +
    //     "&timecode=" +
    //     timecode +
    //     "&waypoints=" +
    //     directWaypointsStringified,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // const response_direct = await ServiceUtils.generic(
    //   osrm +
    //     "/" +
    //     directWaypointsStringified +
    //     "?geometries=geojson&overview=full"
    // );

    if (!response)
      return {
        latlngs: [],
        projectedLatlngs: [],
        metrics: {},
        legsDurations: [],
        legsDistances: [],
        stepsWeight: [],
      };
    return this.formatResponse(
      response,
      response_direct,
      points,
      response.waypoints
    );
  }

  static async setWeight(
    wayId: number,
    flaxibWeight: number,
    start: number,
    end: number
  ): Promise<any> {
    const content = JSON.stringify({
      map_id: getActiveMapId(),
      way_id: wayId,
      flaxib_weight: flaxibWeight,
      start,
      end,
    });
    return await ServiceUtils.generic(host + "/osrm/weight", {
      method: "POST",
      body: content,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static async setWeights(
    flaxibWeight: number,
    start: number,
    end: number
  ): Promise<any> {
    const update = getSelectedWays()
      .map((way) => {
        return {
          map_id: getActiveMapId(),
          way_id: way.flaxib_way_id,
          flaxib_weight: flaxibWeight,
          start,
          end,
        };
      })
      .filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.end === value.end &&
              t.start === value.start &&
              t.way_id === value.way_id
          )
      );
    const conflict = getConflictWays().map((conflict) => {
      return {
        way_id: conflict.flaxib_way_id,
        map_id: getActiveMapId(),
        flaxibWeight: conflict.weight.weight,
        start: conflict.weight.start,
        end: conflict.weight.end,
      };
    });
    const content = JSON.stringify({ update: update, conflict: conflict });
    return await ServiceUtils.generic(host + "/osrm/weights", {
      method: "POST",
      body: content,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static async getWaysWithWeight(): Promise<any> {
    const curMap = MapsUtils.getSelectedMap(userMaps());
    if (curMap) {
      const res = await ServiceUtils.generic(
        host +
          "/osrm/ways?map_id=" +
          getActiveMapId() +
          "&min_X=" +
          curMap.bounding_box.min_X +
          "&min_Y=" +
          curMap.bounding_box.min_Y +
          "&max_X=" +
          curMap.bounding_box.max_X +
          "&max_Y=" +
          curMap.bounding_box.max_Y +
          "&srid=" +
          curMap.bounding_box.srid,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res;
    }
  }

  static async deleteWeight(
    wayID: number,
    start: number,
    end: number
  ): Promise<any> {
    const res = await ServiceUtils.generic(
      host +
        "/osrm/weight?map_id=" +
        getActiveMapId() +
        "&way_id=" +
        wayID +
        "&start=" +
        start +
        "&end=" +
        end,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  }

  static async deleteWeights(
    waysID: number[],
    start: number,
    end: number
  ): Promise<any> {
    const res = await ServiceUtils.generic(
      host +
        "/osrm/weights?map_id=" +
        getActiveMapId() +
        "&start=" +
        start +
        "&end=" +
        end,
      {
        method: "DELETE",
        body: JSON.stringify(waysID),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  }

  private static buildPositionURL(points: WaypointType[]): string {
    return points.map((point) => point.lon + "," + point.lat).join(";");
  }

  private static buildTableURL(latlngs: LatLng[]): string {
    return latlngs.map((latlng) => latlng.lng + "," + latlng.lat).join(";");
  }

  static async getHlpMatrix(latlngs: LatLng[]): Promise<number[][]> {
    const response: osrmTableResponseType = await ServiceUtils.generic(
      osrmTable + "/" + this.buildTableURL(latlngs)
    );
    return response["durations"];
  }

  private static formatResponse(
    response: osrmResponseType,
    response_direct: osrmResponseType,
    points: TripPointType[],
    waypoints: waypointsType[]
  ): {
    latlngs: L.LatLng[];
    projectedLatlngs: L.LatLng[];
    metrics: TripMetricType;
    legsDurations: number[];
    legsDistances: number[];
    stepsWeight: step[];
  } {
    let latlngs: L.LatLng[] = [];
    let projectedLatlngs: L.LatLng[] = [];
    let metrics: TripMetricType = {};
    if (!response || response.routes[0] == undefined)
      return {
        latlngs,
        projectedLatlngs,
        metrics,
        legsDurations: [],
        legsDistances: [],
        stepsWeight: [],
      };

    const routes = response.routes;
    const legsDurations = routes[0].legs.map((item) => item.duration);
    const legsDistances = routes[0].legs.map((item) => item.distance);
    const stepsWeight = routes[0].legs.flatMap((leg) => {
      return leg.steps.flatMap((step) => {
        console.log("step.flaxib_way_ids");
        return step.flaxib_way_ids.map((elem, i) => {
          return {
            flaxib_way_id: elem,
            flaxib_weight: step.current_way_weight[i],
          };
        });
      });
    });

    const coordinates = routes[0].geometry.coordinates;

    latlngs = coordinates.map((elt: number[]) => L.latLng(elt[1], elt[0]));

    projectedLatlngs = waypoints.map((waypoint) =>
      L.latLng(waypoint.location[1], waypoint.location[0])
    );

    metrics = MetricsUtils.getAll(response, response_direct, points);

    return {
      latlngs,
      projectedLatlngs,
      metrics,
      legsDurations,
      legsDistances,
      stepsWeight,
    };
  }
}

type waypointsType = {
  hint: string;
  distance: number;
  name: string;
  location: number[];
};

type routesType = {
  distance: number;
  duration: number;
  geometry: {
    coordinates: number[][];
    type: string;
  };
  legs: { weight: number; duration: number; distance: number; steps: step[] }[];
};
