import { Match, Switch, createSignal, onMount } from "solid-js";
import { GradeType } from "../../../../_entities/grade.entity";
import { BusLineEntity, LineType } from "../../../../_entities/line.entity";
import { SchoolType } from "../../../../_entities/school.entity";
import { StopType } from "../../../../_entities/stop.entity";
import { getStops } from "../../../../_stores/stop.store";
import { ViewManager } from "../../ViewManager";
import { LineEditInput } from "../organism/LineEditInput";
import { SelectGradesStep } from "../organism/SelectGradesStep";
import { SelectSchoolsStep } from "../organism/SelectSchoolsStep";
import { SelectStopsStep } from "../organism/SelectStopsStep";

enum LineStep {
  schoolSelection,
  gradeSelection,
  stopSelection,
}

interface LineAddOrUpdateProps {
  line: LineType;
  submitFunction: (line: LineType) => void;
}

export function LineAddOrUpdate(props: LineAddOrUpdateProps) {
  const [localLine, setLocalLine] = createSignal<LineType>(
    BusLineEntity.defaultBusLine()
  );

  const [currentStep, setCurrentStep] = createSignal<LineStep>(
    LineStep.schoolSelection
  );

  onMount(() => {
    if (props.line != localLine()) setLocalLine(props.line);
    setCurrentStep(LineStep.schoolSelection);
  });

  function setStopsFromGradeSelection() {
    const selectedGradesId = localLine().grades.map((grade) => grade.id);

    const stops = [
      ...getStops().filter((stop) =>
        stop.associated.some((associatedschool) =>
          selectedGradesId.includes(associatedschool.gradeId)
        )
      ),
    ];
    onStopsUpdate(stops);
  }

  function onColorUpdate(color: string) {
    localLine().setColor(color);
  }

  function onGradeUpdate(grades: GradeType[]) {
    setLocalLine((line) => {
      return { ...line, grades: grades };
    });
  }

  function onSchoolUpdate(schools: SchoolType[]) {
    setLocalLine((line) => {
      return { ...line, schools: schools };
    });
  }

  function onStopsUpdate(stops: StopType[]) {
    setLocalLine((line) => {
      return { ...line, stops: stops };
    });
  }

  function onNameUpdate(value: string) {
    setLocalLine((line) => {
      return { ...line, name: value };
    });
  }

  function nextStep(currentStep: LineStep) {
    switch (currentStep) {
      case LineStep.schoolSelection:
        setCurrentStep(LineStep.gradeSelection);
        break;
      case LineStep.gradeSelection:
        setStopsFromGradeSelection();
        setCurrentStep(LineStep.stopSelection);
        break;
      case LineStep.stopSelection:
        props.submitFunction(localLine());
        break;
    }
  }

  function previousStep(currentStep: LineStep) {
    switch (currentStep) {
      case LineStep.schoolSelection:
        ViewManager.lineDetails(props.line);
        break;
      case LineStep.gradeSelection:
        setCurrentStep(LineStep.schoolSelection);
        break;
      case LineStep.stopSelection:
        setCurrentStep(LineStep.gradeSelection);
        break;
    }
  }

  return (
    <div>
      <Switch>
        <Match when={currentStep() == LineStep.schoolSelection}>
          <SelectSchoolsStep
            schools={localLine().schools}
            nextStep={() => nextStep(LineStep.schoolSelection)}
            previousStep={() => previousStep(LineStep.schoolSelection)}
            onUpdate={onSchoolUpdate}
          />
        </Match>
        <Match when={currentStep() == LineStep.gradeSelection}>
          <SelectGradesStep
            schools={localLine().schools}
            grades={localLine().grades}
            nextStep={() => nextStep(LineStep.gradeSelection)}
            previousStep={() => previousStep(LineStep.gradeSelection)}
            onUpdate={onGradeUpdate}
          />
        </Match>
        <Match when={currentStep() == LineStep.stopSelection}>
          <LineEditInput
            line={localLine()}
            colorInput={onColorUpdate}
            nameInput={onNameUpdate}
          />
          <SelectStopsStep
            grades={localLine().grades}
            stops={localLine().stops}
            nextStep={() => nextStep(LineStep.stopSelection)}
            previousStep={() => previousStep(LineStep.stopSelection)}
            onUpdate={onStopsUpdate}
          />
        </Match>
      </Switch>
    </div>
  );
}
