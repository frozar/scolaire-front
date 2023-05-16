import {
  createMemo,
  Show,
  For,
  createResource,
  Switch,
  Match,
  createEffect,
} from "solid-js";
import InfoPointName from "./InfoPointName";
import {
  NatureEnum,
  isPointRamassage,
  PointEtablissementType,
  PointRamassageType,
  InfoPanelEnum,
} from "./type";
import { PointIdentityType, LineType } from "./type";
import {
  selectedElement,
  busLineSelected,
  busLines,
  points,
  infoToDisplay,
  setInfoToDisplay,
  stopIds,
  setStopIds,
  setBusLineSelected,
  timelineStopNames,
  setTimelineStopNames,
} from "./signaux";
import { useStateAction } from "./StateAction";
const [, { isInAddLineMode, isInReadMode }] = useStateAction();
type PointToDisplayType = {
  id_point: number;
  name: string;
  nature: NatureEnum;
  quantity: number;
};

type Item = {
  hour: string | undefined;
  name: string;
  caption: string | undefined;
};

const displayTimeline = (id_bus_line: number) => {
  function getStopIds(busLineId: LineType[], len: number) {
    return busLineId[0].stops.slice(0, len).map((stop) => stop.id_point);
  }
  function getStopsName(
    stops: PointRamassageType[] | PointEtablissementType[],
    len: number
  ) {
    return stops.slice(0, len).map((stop) => stop.name);
  }
  const busLine = busLines().filter(
    (busLine) => busLine.id_bus_line == id_bus_line
  );
  const lenBusLine = busLine[0].stops.length;
  const stopIds = getStopIds(busLine, lenBusLine);
  const stops = points().filter((point) => stopIds.includes(point.id_point));
  const stopNameList = getStopsName(stops, lenBusLine);
  return stopNameList;
};

function Timeline_item(props: Item) {
  return (
    <div
      class="v-timeline-item"
      style={{
        "--v-timeline-dot-size": "30px",
        "--v-timeline-line-inset": "0px",
      }}
    >
      <div class="v-timeline-item__body">
        <div class="d-flex">
          <Show when={props.hour != undefined}>
            <strong class="me-4">{props.hour}</strong>
          </Show>
          <div>
            <strong>{props.name}</strong>
            <Show when={props.caption != undefined}>
              <div class="text-caption"> {props.caption} </div>
            </Show>
          </div>
        </div>
      </div>
      <div class="v-timeline-divider">
        <div class="v-timeline-divider__before" />
        <div class="v-timeline-divider__dot v-timeline-divider__dot--size-small">
          <div class="v-timeline-divider__inner-dot bg-pink">
            <i class="" aria-hidden="true" />
          </div>
        </div>
        <div class="v-timeline-divider__after" />
      </div>
      {/* <div class="v-timeline-item__opposite" style={{ width: "0px" }}>
        test
      </div> */}
    </div>
  );
}
function Timeline() {
  return (
    <div class="timeline">
      <div
        class="v-timeline v-timeline--align-start v-timeline--justify-auto v-timeline--side-end v-timeline--vertical"
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={timelineStopNames()}>
          {(stop) => (
            <Timeline_item hour={undefined} name={stop} caption={undefined} />
          )}
        </For>
      </div>
    </div>
  );
}

export default function () {
  createEffect(() => {
    // AddLine mode
    if (stopIds().length != 0) {
      const stopsName = points()
        .filter((point) => [stopIds().at(-1)].includes(point.id_point))
        .map((stopName) => stopName.name)[0];

      setTimelineStopNames((names) => [...names, stopsName]);
    }
  });
  createEffect(() => {
    // Read mode
    if (busLineSelected() != -1) {
      setTimelineStopNames(displayTimeline(busLineSelected()));
    }
  });
  createEffect(() => {
    if (isInReadMode()) {
      setInfoToDisplay(InfoPanelEnum.nothing);
      setBusLineSelected(-1);
      setTimelineStopNames([]);
      setStopIds([]);
    }
    if (isInAddLineMode()) {
      setInfoToDisplay(InfoPanelEnum.edition);
      setTimelineStopNames([]);
    }
  });

  const selectedIdentity = createMemo<PointIdentityType | null>(() => {
    const wkSelectedElement = selectedElement();
    if (!wkSelectedElement) {
      return null;
    }

    const { id, id_point, nature } = wkSelectedElement;
    return { id, id_point, nature };
  });

  const fetchAssociatedPointsParameters = (): {
    id: number;
    nature: string;
  } => {
    const wkSelectedIdentity = selectedIdentity();
    if (!wkSelectedIdentity) {
      return { id: -1, nature: "" };
    }
    switch (wkSelectedIdentity.nature) {
      case NatureEnum.ramassage: {
        return { id: wkSelectedIdentity.id, nature: "ramassage" };
      }
      case NatureEnum.etablissement: {
        return { id: wkSelectedIdentity.id, nature: "etablissement" };
      }
      default: {
        return { id: -1, nature: "ramassage" };
      }
    }
  };

  const fetchAssociatedPoints = async (urlParameters: {
    id: number;
    nature: string;
  }): Promise<PointToDisplayType[]> => {
    const { id, nature } = urlParameters;

    // TODO: simplify this condition
    if (!(id != -1 && nature != null)) {
      return await new Promise((resolve) => {
        resolve([]);
      });
    } else {
      const URL =
        import.meta.env.VITE_BACK_URL +
        "/get_associated_points" +
        "?id=" +
        id +
        "&nature=" +
        nature;

      return (await fetch(URL)).json();
    }
  };

  const [associatedPoints] = createResource(
    fetchAssociatedPointsParameters,
    fetchAssociatedPoints
  );

  const natureOfOpposite = () => {
    const wkSelectedElement = selectedElement();
    if (!wkSelectedElement) {
      return NatureEnum.ramassage;
    }

    return isPointRamassage(wkSelectedElement)
      ? NatureEnum.etablissement
      : NatureEnum.ramassage;
  };
  const ptToDisplay = () => {
    const wkAssociatedPoints = associatedPoints();
    if (!wkAssociatedPoints) {
      return [];
    } else {
      return wkAssociatedPoints.map((elt: PointToDisplayType) => ({
        ...elt,
        nature: natureOfOpposite(),
      }));
    }
  };

  const firstColumnTitle = () => {
    const wkSelectedElement = selectedElement();
    if (!wkSelectedElement) {
      return "";
    }
    if (isPointRamassage(wkSelectedElement)) {
      return "Etablissement";
    } else {
      return "Ramassage";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        "align-items": "center",
      }}
    >
      <Switch fallback={<span>No element selected</span>}>
        <Match when={infoToDisplay() == InfoPanelEnum.point}>
          <h2>{selectedElement()?.name}</h2>
          <Show
            when={0 < ptToDisplay().length}
            fallback={<span>No element to display</span>}
          >
            <div class="px-4 sm:px-6 lg:px-8">
              <div class="mt-8 flex flex-col">
                <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              {firstColumnTitle()}
                            </th>
                            <th
                              scope="col"
                              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Quantité
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <For each={ptToDisplay()}>
                            {(pt) => (
                              <tr>
                                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  <InfoPointName point={pt} />
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {pt.quantity}
                                </td>
                              </tr>
                            )}
                          </For>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Show>
        </Match>
        <Match when={infoToDisplay() == InfoPanelEnum.line}>
          <Timeline />
        </Match>
        <Match
          when={
            infoToDisplay() == InfoPanelEnum.edition &&
            timelineStopNames().length != 0
          }
        >
          <Timeline />
        </Match>
      </Switch>
    </div>
  );
}
