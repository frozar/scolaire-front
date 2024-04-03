import { Match, Switch, createSignal, onMount } from "solid-js";

import { BusLineEntity, LineType } from "../../../../_entities/line.entity";

import { SchoolType } from "../../../../_entities/school.entity";
import { disableSpinningWheel, enableSpinningWheel } from "../../../../signaux";
// TODO to fix -> doit importer un AddLineBoardContent ou similaire
import { GradeType } from "../../../../_entities/grade.entity";
import { StopType } from "../../../../_entities/stop.entity";
import { getStops } from "../../../../_stores/stop.store";
// import "./DrawTripBoard.css";
// import "../../../../../css/timeline.css";
// import "./AddLineBoardContent.css";
import { ColorPicker } from "../../board/component/atom/ColorPicker";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";
import { SelectGradesStep } from "./SelectGradesStep";
import { SelectSchoolsStep } from "./SelectSchoolsStep";
import { SelectStopsStep } from "./SelectStopsStep";

import "./LineCreateOrUpdateStepper.css";

enum AddLineStep {
  schoolSelection,
  gradeSelection,
  stopSelection,
}

const [currentLine, setCurrentLine] = createSignal<LineType>(
  BusLineEntity.defaultBusLine()
);
const [currentStep, setCurrentStep] = createSignal<AddLineStep>(
  AddLineStep.schoolSelection
);

export function LineCreateOrUpdateStepper(props: {
  line: LineType;
  firstPrevious: () => void;
  lastNext: (line: LineType) => void;
}) {
  onMount(() => {
    setCurrentLine(props.line);
    setCurrentStep(AddLineStep.schoolSelection);
  });

  function nextStep(currentStep: AddLineStep) {
    switch (currentStep) {
      case AddLineStep.schoolSelection:
        setCurrentStep(AddLineStep.gradeSelection);
        break;
      case AddLineStep.gradeSelection:
        setStopsFromGradeSelection();
        setCurrentStep(AddLineStep.stopSelection);
        break;
      case AddLineStep.stopSelection:
        props.lastNext(currentLine());
        break;
    }
  }

  function previousStep(currentStep: AddLineStep) {
    enableSpinningWheel();
    switch (currentStep) {
      case AddLineStep.schoolSelection:
        props.firstPrevious();
        // ViewManager.lineDetails(Line)
        break;
      case AddLineStep.gradeSelection:
        setCurrentStep(AddLineStep.schoolSelection);
        break;
      case AddLineStep.stopSelection:
        setCurrentStep(AddLineStep.gradeSelection);
        break;
    }
    disableSpinningWheel();
  }

  return (
    <div class="add-line-information-board-content">
      <Switch>
        <Match when={currentStep() == AddLineStep.schoolSelection}>
          <SelectSchoolsStep
            schools={currentLine().schools}
            nextStep={() => nextStep(AddLineStep.schoolSelection)}
            previousStep={() => previousStep(AddLineStep.schoolSelection)}
            onUpdate={onSchoolUpdate}
          />
        </Match>
        <Match when={currentStep() == AddLineStep.gradeSelection}>
          <SelectGradesStep
            schools={currentLine().schools}
            grades={currentLine().grades}
            nextStep={() => nextStep(AddLineStep.gradeSelection)}
            previousStep={() => previousStep(AddLineStep.gradeSelection)}
            onUpdate={onGradeUpdate}
          />
        </Match>
        <Match when={currentStep() == AddLineStep.stopSelection}>
          <LabeledInputField
            label="Nom de la ligne"
            value={currentLine()?.name ?? "default name"}
            onInput={(e) =>
              setCurrentLine((line) => {
                return { ...line, name: e.target.value };
              })
            }
            name="line-name"
            placeholder="Entrer le nom de la line"
          />

          <div class="flex mt-4 justify-between">
            <ColorPicker
              defaultColor={currentLine()?.color()}
              title="Couleur de la ligne"
              onInput={onColorUpdate}
              onChange={onColorUpdate}
            />
          </div>

          <SelectStopsStep
            grades={currentLine().grades}
            stops={currentLine().stops}
            nextStep={() => nextStep(AddLineStep.stopSelection)}
            previousStep={() => previousStep(AddLineStep.stopSelection)}
            onUpdate={onStopsUpdate}
          />
        </Match>
      </Switch>
    </div>
  );
}
function onColorUpdate(color: string) {
  currentLine().setColor(color);
}
function onGradeUpdate(grades: GradeType[]) {
  setCurrentLine((line) => {
    return { ...line, grades: grades };
  });
}
function onSchoolUpdate(schools: SchoolType[]) {
  setCurrentLine((line) => {
    return { ...line, schools: schools };
  });
}
function onStopsUpdate(stops: StopType[]) {
  setCurrentLine((line) => {
    return { ...line, stops: stops };
  });
}

function setStopsFromGradeSelection() {
  const selectedGradesId = currentLine().grades.map((grade) => grade.id);
  const stops = [
    ...getStops().filter((stop) =>
      stop.associated.some((associatedschool) =>
        selectedGradesId.includes(associatedschool.gradeId)
      )
    ),
  ];
  if (currentLine().stops.length == 0) {
    setCurrentLine((line) => {
      return { ...line, stops: stops };
    });
  }
}
