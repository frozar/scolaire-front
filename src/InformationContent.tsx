import {
  createMemo,
  Show,
  For,
  createResource,
  Switch,
  Match,
  createEffect,
  createSignal,
} from "solid-js";
import InfoPointName from "./InfoPointName";
import {
  NatureEnum,
  isPointRamassage,
  PointEtablissementType,
  PointRamassageType,
  LastSelectionEnum,
} from "./type";
import { PointIdentityType, LineType } from "./type";
import {
  selectedElement,
  busLineSelected,
  busLines,
  points,
  lastSelectedInfo,
  editionStopId,
  setEditionStopId,
  setBusLineSelected,
} from "./signaux";
import { useStateAction } from "./StateAction";
const [, { isInAddLineMode, getLineUnderConstruction, isInReadMode }] =
  useStateAction();
type PointToDisplayType = {
  id_point: number;
  name: string;
  nature: NatureEnum;
  quantity: number;
};

type Item = {
  hour: string;
  name: string;
  caption: string | null;
};

export const [localEditionStopNames, setLocalEditionStopNames] =
  createSignal<any>([]);

const getPointRamassageName = (id_bus_line: number) => {
  console.log("id_bus_line");
  console.log(id_bus_line);
  function getStopIds(busLine: LineType[], len: number) {
    return busLine[0].stops.slice(0, len).map((stop) => stop.id_point);
  }

  function getStopsName(
    stops: PointRamassageType[] | PointEtablissementType[],
    len: number
  ) {
    return stops.slice(0, len).map((stop) => stop.name);
  }

  // Recup les id point dans busLines()
  const busLine = busLines().filter(
    (busLine) => busLine.id_bus_line == id_bus_line
  );
  const lenBusLine = busLine[0].stops.length;
  const stopIds = getStopIds(busLine, lenBusLine);
  // console.log(stopIds);

  // Recup nom des arrêts dans points()
  const stopsName = points().filter((point) =>
    stopIds.includes(point.id_point)
  );

  const stopNameList = getStopsName(stopsName, lenBusLine);
  console.log("stopNameList");
  console.log(stopNameList);
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
          <strong class="me-4">{props.hour}</strong>
          <div>
            <strong>{props.name}</strong>
            <Show when={props.caption != null}>
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
    </div>
  );
}
function Timeline() {
  return (
    <div class="pa-4">
      <div
        class="v-timeline v-timeline--align-start v-timeline--justify-auto v-timeline--side-end v-timeline--vertical"
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={localEditionStopNames()}>
          {(stop) => (
            <Timeline_item hour="heure" name={stop} caption="description" />
          )}
        </For>
      </div>
    </div>
  );
}

export default function () {
  createEffect(() => {
    // console.log("mode edition=>", isInAddLineMode());
    // console.log(getLineUnderConstruction());
    if (editionStopId().length != 0) {
      console.log("editionStopId()[-1]", editionStopId().at(-1));
      console.log("editionStopId", editionStopId());
      console.log("points()", points());
      console.log("arrayed", [editionStopId().at(-1)]);
      console.log(
        "laa=>",
        points().filter((point) =>
          [editionStopId().at(-1)].includes(point.id_point)
        )
      );
      // Recup nom des arrêts dans points()
      // ----
      const stopsName = points()
        .filter((point) => [editionStopId().at(-1)].includes(point.id_point))
        .map((stopName) => stopName.name)[0];
      // ---------
      // console.log("points", points());
      // console.log("stopsName", stopsName);
      // setLocalEditionStopNames(stopsName);
      // --------
      setLocalEditionStopNames((names) => [...names, stopsName]);
      console.log("localEditionStopNames()", localEditionStopNames());
    }
  });
  createEffect(() => {
    console.log("iciAvant");
    if (busLineSelected() != undefined) {
      console.log("ici");
      setLocalEditionStopNames(getPointRamassageName(busLineSelected()));
    }
  });
  createEffect(() => {
    if (isInReadMode()) {
      console.log("READ MODE");
      setBusLineSelected(undefined);
      setLocalEditionStopNames([]);
      setEditionStopId([]);
    }
  });
  // createEffect(() => {
  //   if (lastSelectedInfo() == LastSelectionEnum.edition) {
  //     if (localEditionStopNames()) {
  //       return;
  //     }
  //     setLocalEditionStopNames([]);
  //     console.log(
  //       "mode edition=> local edition names=>",
  //       localEditionStopNames()
  //     );
  //   }
  // });

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

    if (!(id != -1 && nature != null)) {
      return await new Promise((resolve, reject) => {
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
        <Match when={lastSelectedInfo() == LastSelectionEnum.point}>
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
        <Match when={lastSelectedInfo() == LastSelectionEnum.line}>
          <div>ligne selectionné</div>
          <Timeline />
        </Match>
        <Match
          when={
            lastSelectedInfo() == LastSelectionEnum.edition &&
            localEditionStopNames().length != 0
          }
        >
          <span>Mode édition</span>
          <Timeline />
        </Match>
      </Switch>
    </div>
  );
}
