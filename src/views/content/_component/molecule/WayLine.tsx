import { LatLng } from "leaflet";
import { WayType } from "../../../../_entities/way.entity";
import Line from "../../map/component/atom/Line";
import { COLOR_GREEN_BASE } from "../../map/constant";

export function WayLine(props: { way: WayType; map: L.Map }) {
  return (
    <Line
      latlngs={props.way.coordinates as LatLng[]}
      leafletMap={props.map}
      color={COLOR_GREEN_BASE}
      opacity={1}
      lineId={props.way.id}
      withArrows={false}
      onMouseOver={() => console.log("Mouse Over")}
      onMouseOut={() => console.log("Mouse Out")}
      onClick={() => console.log("Mouse Click")}
      onMouseDown={() => console.log("Mouse Down")}
    />
  );
}
