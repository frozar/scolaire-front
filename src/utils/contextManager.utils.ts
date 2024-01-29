import { GradeType } from "../_entities/grade.entity";
import {
  TripDirectionEntity,
  TripDirectionType,
} from "../_entities/trip-direction.entity";
import { TripEntity, TripType } from "../_entities/trip.entity";
import { WaypointEntity } from "../_entities/waypoint.entity";
import { updatePointColor } from "../leafletUtils";
import { disableSpinningWheel, enableSpinningWheel } from "../signaux";
import { AssociatedItem } from "../views/content/board/component/molecule/CheckableElementList";
import {
  onTripDirection,
  tripDaysAndDirection,
} from "../views/content/board/component/organism/AssignDaysAndDirectionToTrip";
import {
  DrawTripStep,
  currentDrawTrip,
  currentStep,
  displayTripMode,
  displayTripModeEnum,
  drawTripCheckableGrade,
  isInUpdate,
  setCurrentDrawTrip,
  setCurrentStep,
  setCurrentTripIndex,
  setDisplayTripMode,
  setDrawTripCheckableGrade,
  setIsInUpdate,
} from "../views/content/board/component/organism/DrawTripBoard";
import { changeBoard } from "../views/content/board/component/template/ContextManager";
import { getSelectedLine } from "../views/content/map/component/organism/BusLines";
import { setselectedTrip } from "../views/content/map/component/organism/Trips";
import { quitModeDrawTrip } from "../views/content/map/shortcut";
import { CurrentDrawTripUtils } from "./currentDrawTrip.utils";
import { GradeUtils } from "./grade.utils";
import { MapElementUtils } from "./mapElement.utils";
import { TripUtils } from "./trip.utils";

export namespace ContextUtils {
  function isValidable(grade: GradeType) {
    if (GradeUtils.getRemainingQuantity(grade.id as number) == 0) return false;

    const selectedGradeId = currentDrawTrip()
      ?.schools.map((school) => school.grades.map((gradeMap) => gradeMap.id))
      .flat();

    return selectedGradeId?.includes(grade.id);
  }

  function defineTripCheckableGrade() {
    setDrawTripCheckableGrade(
      getSelectedLine()?.grades.map((grade) => {
        return {
          item: grade,
          done: isValidable(grade),
        };
      }) as AssociatedItem[]
    );
  }

  export async function nextStep() {
    enableSpinningWheel();
    let tripDirection: TripDirectionType;

    switch (currentStep()) {
      case DrawTripStep.schoolSelection:
        if ((currentDrawTrip()?.schools.length ?? 0) < 1) {
          break;
        }
        defineTripCheckableGrade();
        setCurrentStep(DrawTripStep.gradeSelection);
        break;

      case DrawTripStep.gradeSelection:
        const grades = drawTripCheckableGrade()
          .filter((grade) => grade.done)
          .map((grade) => grade.item) as GradeType[];

        const days = tripDaysAndDirection()
          .filter((item) => item.keep)
          .map((item) => item.day);

        tripDirection = TripDirectionEntity.findDirectionByDirectionName(
          onTripDirection()
        );

        setCurrentDrawTrip((trip) => {
          if (!trip) return trip;
          return { ...trip, grades, days, tripDirectionId: tripDirection.id };
        });
        setCurrentStep(DrawTripStep.editTrip);
        break;

      case DrawTripStep.buildReverse:
      case DrawTripStep.editTrip:
        if (!TripUtils.isValidTrip(currentDrawTrip())) break;

        if (!currentDrawTrip()?.waypoints) {
          const waypoints = WaypointEntity.createWaypointsFromTrip(
            currentDrawTrip() as TripType
          );
          setCurrentDrawTrip((trip) => {
            if (!trip) return trip;
            return { ...trip, waypoints };
          });
        }

        if (displayTripMode() == displayTripModeEnum.straight) {
          await CurrentDrawTripUtils.updatePolylineWithOsrm(
            currentDrawTrip() as TripType
          );
        }

        await TripUtils.createOrUpdateTrip();

        setCurrentDrawTrip(TripEntity.defaultTrip());
        setCurrentTripIndex(0);
        setIsInUpdate(false);

        setCurrentStep(DrawTripStep.initial);
        updatePointColor();
    }
    disableSpinningWheel();
  }

  export function prevStep() {
    switch (currentStep()) {
      case DrawTripStep.schoolSelection:
        setCurrentDrawTrip(TripEntity.defaultTrip());
        quitModeDrawTrip();

        setCurrentStep(DrawTripStep.initial);
        changeBoard("line");
        MapElementUtils.deselectAllPointsAndBusTrips();

        break;

      case DrawTripStep.gradeSelection:
        setCurrentStep(DrawTripStep.schoolSelection);
        break;

      case DrawTripStep.buildReverse:
      case DrawTripStep.editTrip:
        if (drawTripCheckableGrade().length == 0) defineTripCheckableGrade();
        if (isInUpdate()) {
          setselectedTrip(currentDrawTrip());
          quitModeDrawTrip();
          setIsInUpdate(false);
          setCurrentStep(DrawTripStep.initial);
          changeBoard("line-details");
        } else {
          if (displayTripMode() == displayTripModeEnum.onRoad) {
            setCurrentDrawTrip((trip) => {
              if (!trip) return trip;
              return { ...trip, latLngs: [] };
            });
          }
          setCurrentStep(DrawTripStep.gradeSelection);
        }
        break;
    }
    setDisplayTripMode((prev) =>
      prev == displayTripModeEnum.straight ? prev : displayTripModeEnum.straight
    );
  }
}
