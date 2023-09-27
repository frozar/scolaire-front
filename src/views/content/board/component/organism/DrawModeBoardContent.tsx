import { Show, createEffect, createSignal } from "solid-js";
import {
  defaultLineUnderConstruction,
  useStateAction,
} from "../../../../../StateAction";

import SelectedSchool from "../atom/SelectedSchool";

import {
  BusLineType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-line.entity";
import { BusLineService } from "../../../../../_services/bus-line.service";

import DrawModeBoardContentFooter from "./DrawModeBoardContentFooter";

import "../../../../../css/timeline.css";
import { LineUnderConstructionType } from "../../../../../type";
import { ColorPicker } from "../../../board/component/atom/ColorPicker";

import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import CurvedLine from "../../../../../icons/CurvedLine";
import SimpleLine from "../../../../../icons/SimpleLine";
import { updateOnMapPointColor } from "../../../../../leafletUtils";
import {
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import {
  getBusLines,
  setBusLines,
  updateBusLines,
} from "../../../map/component/organism/BusLines";
import { quitModeAddLine } from "../../../map/shortcut";
import { DrawHelperButton } from "../atom/DrawHelperButton";
import {
  setUnmodifiedBusLine,
  unmodifiedBusLine,
} from "../atom/UpdateLineButton";
import ButtonIcon from "../molecule/ButtonIcon";
import LabeledInputField from "../molecule/LabeledInputField";
import SchoolsEnumeration from "../molecule/SchoolsEnumeration";
import { changeBoard, setOnBoard } from "../template/ContextManager";
import CollapsibleElement from "./CollapsibleElement";
import Metrics from "./Metrics";
import Timeline from "./Timeline";

const [
  ,
  {
    getLineUnderConstruction,
    setLineUnderConstruction,
    updateNameLineUnderConstruction,
    setModeRead,
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
};

async function onClick() {
  if (displayLineMode() == displayLineModeEnum.straight) {
    if (getLineUnderConstruction().busLine.points.length < 2) {
      return;
    }
    if (!getLineUnderConstruction().busLine.waypoints) {
      const waypoints = WaypointEntity.createWaypointsFromPoints(
        getLineUnderConstruction().busLine
      );
      setLineUnderConstruction({
        ...getLineUnderConstruction(),
        busLine: {
          ...getLineUnderConstruction().busLine,
          waypoints,
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
        <CollapsibleElement title="Métriques">
          <Metrics line={getLineUnderConstruction().busLine} />
        </CollapsibleElement>
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
              <div class="flex w-4/5 text-xs justify-center absolute bottom-[500px]">
                Veuillez sélectionner des points sur la carte
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
// TODO: Fix wrong point color is displayed on map after creating / modifying a line
async function createOrUpdateBusLine(busLine: BusLineType) {
  busLine.setSelected(true);
  if (busLine.id == undefined) {
    await createBusLine(busLine);
  } else {
    await updateBusLine(busLine);
  }
  quitModeAddLine();
  setCurrentStep(drawModeStep.start);
  setDisplayLineMode((prev) =>
    prev == displayLineModeEnum.straight ? prev : displayLineModeEnum.straight
  );
  selectedUpdatedBusLine(getBusLines().at(-1) as BusLineType);
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
      if (!getLineUnderConstruction().busLine.waypoints) {
        const waypoints = WaypointEntity.createWaypointsFromPoints(
          getLineUnderConstruction().busLine
        );
        setLineUnderConstruction({
          ...getLineUnderConstruction(),
          busLine: {
            ...getLineUnderConstruction().busLine,
            waypoints,
          },
        });
      }
      if (displayLineMode() == displayLineModeEnum.straight) {
        await updatePolylineWithOsrm(getLineUnderConstruction().busLine);
      }

      await createOrUpdateBusLine(getLineUnderConstruction().busLine);
      setModeRead();
      changeBoard("line-details");
      updateOnMapPointColor();
  }
  disableSpinningWheel();
}

function prevStep() {
  switch (currentStep()) {
    case drawModeStep.schoolSelection:
      setLineUnderConstruction(defaultLineUnderConstruction());
      quitModeAddLine();

      setCurrentStep(drawModeStep.start);
      setOnBoard("line");
      break;
    case drawModeStep.editLine:
      const busLine = unmodifiedBusLine();
      if (busLine) {
        setBusLines((buslines) => {
          buslines = [
            ...buslines.filter(
              (busLine) => busLine.id != getLineUnderConstruction().busLine.id
            ),
          ];
          buslines.push(busLine);
          return buslines;
        });
        setUnmodifiedBusLine(undefined);
      }

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
