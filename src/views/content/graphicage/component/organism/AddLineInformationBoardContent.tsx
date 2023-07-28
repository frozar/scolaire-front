import { For, Show } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import Timeline from "../../informationBoard/Timeline";
import { lineUnderConstructionStopNames } from "../../line/busLinesUtils";

const [, { getLineUnderConstruction, confirmEtablissementSelection }] =
  useStateAction();

export default function () {
  const isValidate = () => getLineUnderConstruction().confirmSelection;
  const etablissementSelected = () =>
    getLineUnderConstruction().etablissementSelected;

  return (
    <>
      <p>Création d'une ligne</p>
      <Show when={etablissementSelected() && !isValidate()}>
        <For each={etablissementSelected()}>
          {(etablissement) => (
            <p>
              {etablissement.name} - {etablissement.quantity}
            </p>
          )}
        </For>
      </Show>
      <Show
        when={
          etablissementSelected() &&
          etablissementSelected()?.length != 0 &&
          !getLineUnderConstruction().confirmSelection
        }
      >
        <button onClick={() => confirmEtablissementSelection()}>
          <p>Valider</p>
        </button>
      </Show>
      <Show when={lineUnderConstructionStopNames().length != 0}>
        <Timeline stopNames={lineUnderConstructionStopNames()} />
      </Show>
    </>
  );
}
