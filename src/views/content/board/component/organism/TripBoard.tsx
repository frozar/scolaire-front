import SchoolsEnumeration from "../molecule/SchoolsEnumeration";
import Metrics from "./Metrics";

import { useStateAction } from "../../../../../StateAction";
import { TripEntity, TripType } from "../../../../../_entities/trip.entity";
import UpdatePen from "../../../../../icons/UpdatePen";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { selectedTrip } from "../../../map/component/organism/Trips";
import RemoveTripButton from "../atom/RemoveCourseButton";
import ButtonIcon from "../molecule/ButtonIcon";
import { changeBoard, toggleDrawMod } from "../template/ContextManager";
import CollapsibleElement from "./CollapsibleElement";
import "./CourseInformationBoardContent.css";
import {
  DrawTripStep,
  setCurrentDrawTrip,
  setCurrentStep,
  setCurrentTripIndex,
  setIsInUpdate,
} from "./DrawTripBoard";
import { TripTimeline } from "./TripTimeline";
const [, { setModeDrawTrip }] = useStateAction();

export function TripBoard() {
  // TODO revoir le code pour setter une const trip

  return (
    <div class="bus-trip-information-board-content">
      {/* TODO Put th e2 next component in "organism" */}
      <div class="bus-trip-information-board-content-title">
        <div class="bus-trip-information-board-content-name">
          {selectedTrip()?.name}
        </div>
        <ButtonIcon icon={<UpdatePen />} onClick={addTrip} />

        {/* <UpdateTripButton trip={selectedTrip() as TripType} /> */}
        <RemoveTripButton trip={selectedTrip() as TripType} />
      </div>
      <div class="bus-trip-information-board-content-schools">
        <SchoolsEnumeration
          schoolsName={
            selectedTrip()?.schools.map((school) => school.name) ?? []
          }
        />
      </div>

      <CollapsibleElement title="Métriques">
        <Metrics trip={selectedTrip()} />
      </CollapsibleElement>

      <CollapsibleElement title="TimeLine" class="timeline-collapsise">
        <TripTimeline
          trip={selectedTrip() ?? TripEntity.defaultTrip()}
          inDraw={false}
        />
      </CollapsibleElement>
    </div>
  );
}

async function addTrip() {
  setIsInUpdate(true);
  setCurrentDrawTrip({
    ...(selectedTrip() as TripType),
    points: [...(selectedTrip() as TripType).points],
  });
  changeBoard("trip-draw");
  setCurrentTripIndex((selectedTrip() as TripType).points.length);

  MapElementUtils.deselectAllPointsAndBusTrips();
  toggleDrawMod();
  setCurrentStep(DrawTripStep.editTrip);
  setModeDrawTrip();
}
