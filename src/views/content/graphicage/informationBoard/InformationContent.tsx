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
  MessageLevelEnum,
  MessageTypeEnum,
  LineType,
  PointToDisplayType,
} from "../../../../type";
import { PointIdentityType } from "../../../../type";
import { addNewUserInformation } from "../../../../signaux";
import { useStateAction } from "../../../../StateAction";
import {
  authenticateWrap,
  getToken,
} from "../../../layout/topMenu/authentication";
import {
  getSelectedBusLineId,
  selectedBusLineStopNames,
  lineUnderConstructionStopNames,
  getSelectedBusLine,
} from "../line/busLinesUtils";
import Timeline from "./Timeline";
import {
  linkBusLinePolyline,
  pickerColor,
  setBusLines,
} from "../line/BusLines";
import { getSelectedPoint } from "../Point";

const [, { isInAddLineMode, resetLineUnderConstruction }] = useStateAction();

export default function () {
  createEffect(() => {
    // When switching mode

    if (!isInAddLineMode()) {
      resetLineUnderConstruction();
    }
  });

  const selectedIdentity = createMemo<PointIdentityType | null>(() => {
    const wkSelectedElement = getSelectedPoint();
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

    if (id == -1 || nature == null) {
      return [];
    } else {
      const URL =
        import.meta.env.VITE_BACK_URL +
        "/get_associated_points" +
        "?id=" +
        id +
        "&nature=" +
        nature;

      // TODO:
      // Attemp to use authenticateWrap failed => Don't use the 'createResource' from solidjs
      return getToken()
        .then(async (token) => {
          return fetch(URL, {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }).then((res) => {
            return res.json();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // TODO: Don't use the 'createResource' from solidjs
  const [associatedPoints] = createResource(
    fetchAssociatedPointsParameters,
    fetchAssociatedPoints
  );

  const ptToDisplay = () => {
    const wkAssociatedPoints = associatedPoints();

    return wkAssociatedPoints ? wkAssociatedPoints : [];
  };

  const firstColumnTitle = () => {
    const wkSelectedElement = getSelectedPoint();
    if (!wkSelectedElement) {
      return "";
    }

    return isPointRamassage(wkSelectedElement) ? "Etablissement" : "Ramassage";
  };

  const handleColorPicker = (e: InputEvent) => {
    if (!e.target) {
      return;
    }

    const newColor = (e.target as HTMLInputElement).value;

    const selectedBusLineId = getSelectedBusLineId();

    if (!selectedBusLineId) {
      return;
    }

    linkBusLinePolyline[selectedBusLineId].polyline.setStyle({
      color: newColor,
    });

    const arrows = linkBusLinePolyline[selectedBusLineId].arrows;

    for (const arrow of arrows) {
      const arrowHTML = arrow.getElement();
      if (!arrowHTML) {
        return;
      }

      const iconHTMLorNull = arrowHTML.firstElementChild;
      if (!iconHTMLorNull) {
        return;
      }

      const iconHTML = iconHTMLorNull as SVGElement;
      iconHTML.setAttribute("fill", newColor);
    }
  };

  const handleColorChanged = (e: Event) => {
    if (!e.target) {
      return;
    }

    const selectedBusLine = getSelectedBusLine();
    if (!selectedBusLine) {
      return;
    }

    const selectedBusLineId = selectedBusLine.idBusLine;
    const color = (e.target as HTMLInputElement).value;

    authenticateWrap((headers) => {
      fetch(import.meta.env.VITE_BACK_URL + `/line/${selectedBusLineId}`, {
        headers,
        method: "PATCH",
        body: JSON.stringify({ color: color }),
      })
        .then(() => {
          setBusLines((prevBusLines) => {
            const busLinesWithoutSelectedBusLine = prevBusLines.filter(
              (busLine) => busLine.idBusLine != selectedBusLineId
            );

            const busLineWithNewColor: LineType = {
              ...selectedBusLine,
              color,
            };

            return [...busLinesWithoutSelectedBusLine, busLineWithNewColor];
          });
        })
        .catch((err) => console.log(err));
    }).catch(() => {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content:
          "Une erreur est survenue lors de la modification de couleur de la ligne",
      });
    });
  };

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        "align-items": "center",
      }}
    >
      <Switch fallback={<span>Aucun élément sélectionné</span>}>
        <Match when={getSelectedPoint()}>
          <h2>{getSelectedPoint()?.name}</h2>
          <Show
            when={0 < ptToDisplay().length}
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
        <Match when={getSelectedBusLineId()}>
          <div class="flex items-center gap-3">
            Couleur de la ligne
            <input
              id="nativeColorPicker1"
              type="color"
              class="border-[0.5px] p-0 border-slate-400"
              value={pickerColor()}
              onInput={handleColorPicker}
              onChange={handleColorChanged}
            />
          </div>
          <Timeline stopNames={selectedBusLineStopNames()} />
        </Match>
        <Match
          when={
            isInAddLineMode() && lineUnderConstructionStopNames().length != 0
          }
        >
          <Timeline stopNames={lineUnderConstructionStopNames()} />
        </Match>
      </Switch>
    </div>
  );
}
