import SchoolsEnumeration from "../molecule/SchoolsEnumeration";
import Metrics from "./Metrics";

import { useStateAction } from "../../../../../StateAction";
import { GradeEntity, HourFormat } from "../../../../../_entities/grade.entity";
import { TripEntity, TripType } from "../../../../../_entities/trip.entity";
import { TripService } from "../../../../../_services/trip.service";
import TrashIcon from "../../../../../icons/TrashIcon";
import UpdatePen from "../../../../../icons/UpdatePen";
import { setRemoveConfirmation } from "../../../../../userInformation/RemoveConfirmation";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { setLines } from "../../../map/component/organism/BusLines";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import { selectedTrip } from "../../../map/component/organism/Trips";
import ButtonIcon from "../molecule/ButtonIcon";
import { changeBoard, toggleDrawMod } from "../template/ContextManager";
import CollapsibleElement from "./CollapsibleElement";
import {
  DrawTripStep,
  setCurrentDrawTrip,
  setCurrentStep,
  setCurrentTripIndex,
  setIsInUpdate,
} from "./DrawTripBoard";
import "./TripInformationBoardContent.css";
import { TripTimeline } from "./TripTimeline";
import { DisplayTripDaysAndDirection } from "./displayTripDaysAndDirection";
const [, { setModeDrawTrip }] = useStateAction();

// TODO revoir le code pour setter une const trip
export function TripBoard() {
  const startHour = GradeEntity.getStringFromHourFormat(
    selectedTrip()?.startTime as HourFormat
  );

  return (
    <div class="bus-trip-information-board-content">
      {/* TODO Put th e2 next component in "organism" */}
      <div class="bus-trip-information-board-content-title">
        <div class="bus-trip-information-board-content-name">
          {selectedTrip()?.name}
        </div>
        <ButtonIcon icon={<UpdatePen />} onClick={addTrip} />
        <ButtonIcon icon={<TrashIcon />} onClick={displayRemoveConfirmation} />
      </div>
      <div class="bus-trip-information-board-content-schools">
        <SchoolsEnumeration
          schoolsName={
            selectedTrip()?.schools.map((school) => school.name) ?? []
          }
        />
      </div>

      <div class="start-bus my-3">
        <label for="">Horraire de départ:</label>
        {" " + startHour}
      </div>

      <CollapsibleElement title="Métriques">
        <Metrics trip={selectedTrip()} />
      </CollapsibleElement>
      <DisplayTripDaysAndDirection />
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
    points: [...(selectedTrip() as TripType).tripPoints],
  });
  changeBoard("trip-draw");
  setCurrentTripIndex((selectedTrip() as TripType).tripPoints.length);

  MapElementUtils.deselectAllPointsAndBusTrips();
  toggleDrawMod();
  setCurrentStep(DrawTripStep.editTrip);
  setModeDrawTrip();
}

function displayRemoveConfirmation() {
  async function deleteTrip() {
    const idToCheck = (selectedTrip() as TripType).id;
    if (!idToCheck) return false;

    const idToRemove: number = idToCheck;
    const deletedTripId: number = await TripService.delete(idToRemove);

    if (deletedTripId) {
      changeBoard("trip");
      MapElementUtils.deselectAllPointsAndBusTrips();

      setLines((prev) =>
        prev.map((line) => {
          return {
            ...line,
            trips: line.trips.filter((trip) => trip.id != deletedTripId),
          };
        })
      );
      return true;
    } else {
      return false;
    }
  }
  deselectAllPoints();
  if ((selectedTrip() as TripType).id) {
    setRemoveConfirmation({
      textToDisplay: "Êtes-vous sûr de vouloir supprimer la course : ",
      itemName: (selectedTrip() as TripType).name as string,
      validate: deleteTrip,
    });
  }
}
