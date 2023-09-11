import { Show, createEffect, createSignal } from "solid-js";
import {
  defaultLineUnderConstruction,
  useStateAction,
} from "../../../../../StateAction";

import SelectedSchool from "../atom/SelectedSchool";

import {
  BusLineType,
  WaypointType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-line.entity";
import { BusLineService } from "../../../../../_services/bus-line.service";

import DrawModeBoardContentFooter from "./DrawModeBoardContentFooter";

import "../../../../../css/timeline.css";
import { LineUnderConstructionType, NatureEnum } from "../../../../../type";
import { ColorPicker } from "../../../board/component/atom/ColorPicker";

import CurvedLine from "../../../../../icons/CurvedLine";
import SimpleLine from "../../../../../icons/SimpleLine";
import {
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import {
  getBusLines,
  updateBusLines,
} from "../../../map/component/organism/BusLines";
import { quitModeAddLine } from "../../../map/shortcut";
import { DrawHelperButton } from "../atom/DrawHelperButton";
import ButtonIcon from "../molecule/ButtonIcon";
import LabeledInputField from "../molecule/LabeledInputField";
import SchoolsEnumeration from "../molecule/SchoolsEnumeration";
import { changeBoard } from "../template/ContextManager";
import Metrics from "./Metrics";
import Timeline from "./Timeline";

const [
  ,
  {
    getLineUnderConstruction,
    setLineUnderConstruction,
    updateNameLineUnderConstruction,
  },
] = useStateAction();

export enum drawModeStep {
  start,
  schoolSelection,
  editLine,
}

export const [currentStep, setCurrentStep] = createSignal<drawModeStep>(
  drawModeStep.start
);

export enum displayLineModeEnum {
  straight = "straight",
  onRoad = "onRoad",
}

const setColorOnLine = (color: string): BusLineType | undefined => {
  const line: LineUnderConstructionType | undefined =
    getLineUnderConstruction();

  if (!line) return;

  line.busLine.setColor(color);

  return line.busLine;
};

const onInput = (color: string) => {
  const line: BusLineType | undefined = setColorOnLine(color);

  if (!line) return;
};

const onChange = async (color: string) => {
  const line: BusLineType | undefined = setColorOnLine(color);

  if (!line) return;

  // TODO Patch the Line Bus Color

  const updatedLine: BusLineType = await BusLineService.update({
    id: line.id,

    color: line.color,

    latLngs: line.latLngs,
    metrics: line.metrics,
  });

  console.log(updatedLine);
};

async function onClick() {
  if (displayLineMode() == displayLineModeEnum.straight) {
    if (getLineUnderConstruction().busLine.points.length < 2) {
      return;
    }
    if (!getLineUnderConstruction().busLine.waypoints) {
      const waypoints: WaypointType[] = [];

      for (const point of getLineUnderConstruction().busLine.points) {
        if (point.nature == NatureEnum.school) {
          waypoints.push({
            idSchool: point.id,
            lon: point.lon,
            lat: point.lat,
          });
        } else if (point.nature == NatureEnum.stop) {
          waypoints.push({
            idStop: point.id,
            lon: point.lon,
            lat: point.lat,
          });
        }
      }

      setLineUnderConstruction({
        ...getLineUnderConstruction(),
        busLine: {
          ...getLineUnderConstruction().busLine,
          waypoints: waypoints,
        },
      });
    }

    await updatePolylineWithOsrm(getLineUnderConstruction().busLine);

    setDisplayLineMode(displayLineModeEnum.onRoad);
  } else if (displayLineMode() == displayLineModeEnum.onRoad) {
    getLineUnderConstruction().busLine.setLatLngs([]);

    setDisplayLineMode(displayLineModeEnum.straight);
  }
}

export const [displayLineMode, setDisplayLineMode] =
  createSignal<displayLineModeEnum>(displayLineModeEnum.straight);

export default function () {
  const [lineName, setLineName] = createSignal<string>(
    getLineUnderConstruction().busLine.name ??
      getLineUnderConstruction().busLine.schools[0].name
  );

  const etablissementSelected = () => {
    return getLineUnderConstruction().busLine.schools;
  };

  createEffect(() => {
    updateNameLineUnderConstruction(lineName());
  });

  return (
    <div class="add-line-information-board-content">
      <Show when={currentStep() == drawModeStep.schoolSelection}>
        <SelectedSchool schoolSelected={etablissementSelected()} />
      </Show>

      <Show when={currentStep() == drawModeStep.editLine}>
        <div class="bus-line-information-board-content-schools">
          <SchoolsEnumeration
            schoolsName={getLineUnderConstruction().busLine.schools.map(
              (school) => school.name
            )}
          />
          <Show when={getLineUnderConstruction().busLine.points.length > 0}>
            <DrawHelperButton
              schools={getLineUnderConstruction().busLine.schools}
            />
          </Show>
        </div>
        <Metrics line={getLineUnderConstruction().busLine} />
        <LabeledInputField
          value={lineName()}
          onInput={(e) => setLineName(e.target.value)}
          name="line-name"
          placeholder="Entrer le nom de la ligne"
        />

        <div class="flex mt-4 justify-between">
          <ColorPicker
            defaultColor={getLineUnderConstruction().busLine.color()}
            title="Couleur de la ligne"
            onInput={onInput}
            onChange={onChange}
          />

          <Show
            when={displayLineMode() == displayLineModeEnum.straight}
            fallback={
              <ButtonIcon
                icon={<SimpleLine />}
                onClick={onClick}
                class="line-to-road-btn-icon"
              />
            }
          >
            <ButtonIcon
              icon={<CurvedLine />}
              onClick={onClick}
              class="line-to-road-btn-icon"
            />
          </Show>
        </div>
      </Show>

      <Show when={currentStep() == drawModeStep.editLine}>
        <div class="bus-line-information-board-content">
          <Show
            when={getLineUnderConstruction().busLine.points.length > 0}
            fallback={
              <div class="flex w-4/5 justify-center absolute bottom-[120px]">
                Veuillez sélectionner des arrêts sur la carte
              </div>
            }
          >
            <Timeline />
          </Show>
        </div>
      </Show>

      <DrawModeBoardContentFooter
        nextStep={{
          callback: nextStep,
          label: currentStep() == drawModeStep.editLine ? "Valider" : "Suivant",
        }}
        previousStep={{
          callback: prevStep,
          label:
            currentStep() === drawModeStep.schoolSelection
              ? "Annuler"
              : "Précédant",
        }}
      />
    </div>
  );
}

// TODO after creating line set it as selected and show the timeline in the information board in read mod
async function createOrUpdateBusLine(busLine: BusLineType) {
  busLine.setSelected(true);
  if (busLine.id == undefined) {
    await createBusLine(busLine);
  } else {
    await updateBusLine(busLine);
  }
  quitModeAddLine();
  setCurrentStep(drawModeStep.start);
  changeBoard("line");
  selectedUpdatedBusLine(busLine);
}

function selectedUpdatedBusLine(busLine: BusLineType) {
  getBusLines()
    .filter((line) => line.id === busLine.id)[0]
    .setSelected(true);
}

async function createBusLine(busLine: BusLineType) {
  const newBusLine: BusLineType = await BusLineService.create(busLine);
  updateBusLines(newBusLine);
}

async function updateBusLine(busLine: BusLineType) {
  const updatedBusLine: BusLineType = await BusLineService.update(busLine);
  updateBusLines(updatedBusLine);
}

async function nextStep() {
  enableSpinningWheel();
  switch (currentStep()) {
    case drawModeStep.schoolSelection:
      if (getLineUnderConstruction().busLine.schools.length < 1) {
        break;
      }
      setCurrentStep(drawModeStep.editLine);
    case drawModeStep.editLine:
      if (getLineUnderConstruction().busLine.points.length < 2) {
        break;
      }
      if (displayLineMode() == displayLineModeEnum.straight) {
        await updatePolylineWithOsrm(getLineUnderConstruction().busLine);
      }

      await createOrUpdateBusLine(getLineUnderConstruction().busLine);
  }
  disableSpinningWheel();
}

function prevStep() {
  switch (currentStep()) {
    case drawModeStep.schoolSelection:
      setLineUnderConstruction(defaultLineUnderConstruction());
      quitModeAddLine();

      setCurrentStep(drawModeStep.start);
      break;
    case drawModeStep.editLine:
      setLineUnderConstruction(defaultLineUnderConstruction());

      if (displayLineMode() == displayLineModeEnum.onRoad) {
        getLineUnderConstruction().busLine.setLatLngs([]);
      }

      setCurrentStep(drawModeStep.schoolSelection);
      break;
  }
  setDisplayLineMode((prev) =>
    prev == displayLineModeEnum.straight ? prev : displayLineModeEnum.straight
  );
}
