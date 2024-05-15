import L from "leaflet";
import { createSignal } from "solid-js";
import { SchoolType } from "../../../../_entities/school.entity";
import { ViewManager } from "../../ViewManager";
import Point from "../../map/component/atom/Point";
import { blinkingSchools } from "../../map/component/organism/Points";
import { SchoolPointUtils } from "../../map/component/schoolPoint.utils";
import { COLOR_BLUE_BASE, COLOR_SCHOOL_FOCUS } from "../../map/constant";

export interface SchoolPointProps {
  school: SchoolType;
  map: L.Map;
}

export const [schoolPointOnClick, setSchoolPointOnClick] = createSignal<
  ((school: SchoolType) => void) | undefined
>();

export function SchoolPoint(props: SchoolPointProps) {
  function tooltip() {
    if (!props.school.name) return undefined;
    const tooltip = L.tooltip({
      className: "point-tooltip",
      opacity: 1,
      direction: "top",
    });
    const pos = L.latLng(props.school.lat, props.school.lon);
    tooltip.setLatLng(pos);
    tooltip.setContent(props.school.name);
    return tooltip;
  }

  // createEffect(() => {
  //   //TODO dont Work

  //   if (addLineCurrentStep() === AddLineStep.schoolSelection) {
  //     const stopFiltering = addLineSelectedSchool().filter(
  //       (school) => school.id == props.school.id
  //     );
  //     const circle = linkMap.get(props.school.leafletId);
  //     if (stopFiltering.length > 0) {
  //       circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });
  //     } else {
  //       circle?.setStyle({ fillColor: COLOR_SCHOOL_LIGHT });
  //     }
  //   }
  // });

  function onClick(school: SchoolType) {
    if (schoolPointOnClick()) {
      (schoolPointOnClick() as (school: SchoolType) => void)(school);
    } else {
      ViewManager.schoolDetails(school);
    }
  }

  return (
    <Point
      point={props.school}
      map={props.map}
      isBlinking={blinkingSchools().includes(props.school.id)}
      borderColor={COLOR_BLUE_BASE}
      fillColor={COLOR_SCHOOL_FOCUS}
      radius={12}
      weight={3}
      onClick={() => onClick(props.school)}
      tootlip={tooltip()}
      //TODO supprimer les dépenses à SchoolPointUtils
      onMouseOver={() => SchoolPointUtils.onMouseOver(props.school)}
      onMouseOut={() => SchoolPointUtils.onMouseOut()}
      onMouseUp={() => SchoolPointUtils.onMouseUp(props.school)}
      onRightClick={() => SchoolPointUtils.onRightClick(props.school)}
    />
  );
}
