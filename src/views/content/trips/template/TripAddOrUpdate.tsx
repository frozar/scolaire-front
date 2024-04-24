import { Match, Show, Switch, createSignal, onMount } from "solid-js";
import { CalendarDayEnum } from "../../../../_entities/calendar.entity";
import { GradeType } from "../../../../_entities/grade.entity";
import { LineType } from "../../../../_entities/line.entity";
import { SchoolType } from "../../../../_entities/school.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../_entities/trip-direction.entity";
import { TripType } from "../../../../_entities/trip.entity";
import { disableSpinningWheel, enableSpinningWheel } from "../../../../signaux";
import { SelectGradesStep } from "../../line/organism/SelectGradesStep";
import { SelectSchoolsStep } from "../../line/organism/SelectSchoolsStep";
import { AssignallotmentStep } from "../organism/AssignAllotmentStep";
import { AssignDaysStep } from "../organism/AssignDaysStep";
import { AssignTripDirectionStep } from "../organism/AssignTripDirectionStep";

enum EditTripStep {
  schoolSelection,
  gradeSelection,
  editTrip,
  buildReverse,
}
const [currentStep, setCurrentStep] = createSignal<EditTripStep>(
  EditTripStep.schoolSelection
);
const [availableSchools, setAvailableSchools] = createSignal<SchoolType[]>([]);

export function TripAddOrUpdate(props: {
  trip: TripType;
  line: LineType;
  previous: () => void;
  next: () => void;
}) {
  const [currentTrip, setCurrentTrip] = createSignal<TripType>(props.trip);

  onMount(() => {
    setCurrentStep(EditTripStep.schoolSelection);

    setAvailableSchools(props.line.schools);
  });

  function nextStep(currentStep: EditTripStep) {
    switch (currentStep) {
      case EditTripStep.schoolSelection:
        setCurrentStep(EditTripStep.gradeSelection);
        break;
      case EditTripStep.gradeSelection:
        // setCurrentStep(EditTripStep.editTrip);
        console.log(currentTrip());
        break;
    }
  }

  function previousStep(currentStep: EditTripStep) {
    enableSpinningWheel();
    switch (currentStep) {
      case EditTripStep.schoolSelection:
        props.previous();
        break;
      case EditTripStep.gradeSelection:
        setCurrentStep(EditTripStep.schoolSelection);
        break;
    }
    disableSpinningWheel();
  }

  function onSchoolUpdate(schools: SchoolType[]) {
    setCurrentTrip((trip) => {
      return { ...trip, schools: schools };
    });
  }

  function onGradeUpdate(grades: GradeType[]) {
    setCurrentTrip((trip) => {
      return { ...trip, grades: grades };
    });
  }
  function onTripDirectionUpdate(direction: TripDirectionEnum) {
    setCurrentTrip((trip) => {
      return {
        ...trip,
        tripDirectionId: TripDirectionEntity.findIdByEnum(direction),
      };
    });
  }
  function onDaysUpdate(days: CalendarDayEnum[]) {
    setCurrentTrip((trip) => {
      trip.days = days;
      return trip;
    });
  }

  function onUpdateAllotment(allotmentId: number) {
    setCurrentTrip((trip) => {
      trip.allotmentId = allotmentId;
      return trip;
    });
    console.log("toto", currentTrip());
  }

  return (
    <div class="add-line-information-board-content">
      <Switch>
        <Match when={currentStep() == EditTripStep.schoolSelection}>
          <SelectSchoolsStep
            schools={currentTrip().schools}
            availableSchools={availableSchools()}
            nextStep={() => nextStep(EditTripStep.schoolSelection)}
            previousStep={() => previousStep(EditTripStep.schoolSelection)}
            onUpdate={onSchoolUpdate}
          />
        </Match>
        <Match when={currentStep() == EditTripStep.gradeSelection}>
          <SelectGradesStep
            schools={currentTrip().schools}
            grades={currentTrip().grades}
            nextStep={() => nextStep(EditTripStep.gradeSelection)}
            previousStep={() => previousStep(EditTripStep.gradeSelection)}
            onUpdate={onGradeUpdate}
          />

          <Show when={currentTrip().grades.length > 0}>
            {/* TODO doit filtrer si grade sélectionné n'ont pas aller ou retour */}
            <AssignTripDirectionStep
              directionId={currentTrip().tripDirectionId}
              onUpdateDirection={onTripDirectionUpdate}
            />
            <AssignDaysStep
              grades={currentTrip().grades}
              tripDirection={currentTrip().tripDirectionId}
              days={currentTrip().days}
              onUpdateDays={onDaysUpdate}
            />
            <AssignallotmentStep
              allotment={currentTrip().allotmentId as number}
              onUpdateAllotment={onUpdateAllotment}
            />
          </Show>
        </Match>
      </Switch>
    </div>
  );
}
