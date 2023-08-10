import { For, Match, Show, Switch, createEffect } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import { isLeafletStopType } from "../../../../type";
import AddLineInformationBoardContent from "../component/organism/AddLineInformationBoardContent";
import { getSelectedBusLine } from "../component/organism/BusLines";
import {
  LeafletSchoolType,
  getLeafletSchools,
} from "../component/organism/SchoolPoints";
import {
  LeafletStopType,
  getLeafletStops,
} from "../component/organism/StopPoints";
import InfoPointName from "./InfoPointName";

import { BusLineInformationBoardContent } from "../component/organism/BusLineInformationBoardContent";
import "./InformationContent.css";

const [, { isInAddLineMode, resetLineUnderConstruction }] = useStateAction();

export default function () {
  const getSelectedPoint = (): LeafletSchoolType | LeafletStopType | null => {
    const points = [...getLeafletStops(), ...getLeafletSchools()];

    const filteredArray = points.filter((point) => point.selected());

    if (filteredArray.length === 0) {
      return null;
    } else {
      return filteredArray[0];
    }
  };

  createEffect(() => {
    // When switching mode
    if (!isInAddLineMode()) {
      resetLineUnderConstruction();
    }
  });

  const firstColumnTitle = () => {
    const selectedPoint = getSelectedPoint();
    if (!selectedPoint) {
      return "";
    }

    return isLeafletStopType(selectedPoint) ? "Etablissement" : "Ramassage";
  };

  //TODO error with the associated Point (test with quantity)
  function getDisplayPoints(): LeafletSchoolType[] | LeafletStopType[] {
    const points = [...getLeafletStops(), ...getLeafletSchools()];

    const selectedPoint = getSelectedPoint();

    if (selectedPoint) {
      const associatedIdPoints = selectedPoint.associated.map(
        (point) => point.id
      );
      const nature = selectedPoint.nature;
      return points.filter(
        (point) =>
          nature != point.nature && associatedIdPoints?.includes(point.id)
      );
    } else return [];
  }

  return (
    <div class="information-content">
      <Switch fallback={<span>Aucun élément sélectionné</span>}>
        <Match when={getSelectedPoint()}>
          {/* TODO To atomise */}
          <h2>{getSelectedPoint()?.name}</h2>
          <Show
            when={0 < getDisplayPoints().length}
            fallback={<span>Aucun élément à afficher</span>}
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
                          <For each={getDisplayPoints()}>
                            {(pt) => (
                              <tr>
                                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  <InfoPointName point={pt} />
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {/* TODO add Quantity */}
                                  {
                                    pt.associated.filter(
                                      (point) =>
                                        point.id === getSelectedPoint()?.id
                                    )[0].quantity
                                  }
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
        <Match when={getSelectedBusLine()}>
          <BusLineInformationBoardContent />
        </Match>
        <Match when={isInAddLineMode()}>
          <AddLineInformationBoardContent />
        </Match>
      </Switch>
    </div>
  );
}
