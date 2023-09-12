import { Setter } from "solid-js";
import { Panels } from "../organism/SchoolDetails";

interface PanelsButtonProps {
  setOnPanel: Setter<Panels>;
}

export default function (props: PanelsButtonProps) {
  return (
    <div class="labels flex gap-2 text-xs text-white">
      <button
        class="px-4 py-2 bg-green-base flex justify-center rounded-2xl"
        onClick={() => props.setOnPanel(Panels.classes)}
      >
        classes
      </button>
      <button
        class="px-4 py-2 bg-green-base flex justify-center rounded-2xl"
        onClick={() => props.setOnPanel(Panels.lines)}
      >
        lignes: Todo
      </button>
    </div>
  );
}
