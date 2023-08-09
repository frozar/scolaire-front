import { For } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import { LineUnderConstructionType } from "../../../../type";
import { TimelineAddPointButton } from "../component/atom/TimelineAddPointButton";
import TimelineItemAddMode from "../component/atom/TimelineItemAddMode";

const [, { isInAddLineMode }] = useStateAction();

export default function (props: {
  //TODO pas utile de les passer en paramètre ce sont des signaux
  line: () => LineUnderConstructionType;
  setLine: (line: LineUnderConstructionType) => void;
}) {
  return (
    <div class="timeline-add-mode">
      {/* TODO use only 1 div for defining "timeline-add-mode" component wherever possible */}

      <For each={props.line()?.stops}>
        {(stop, i) => (
          <>
            <TimelineAddPointButton
              indice={i()}
              setter={props.setLine}
              getter={props.line}
            />

            <TimelineItemAddMode
              pointsResource={stop}
              indice={i()}
              setter={props.setLine}
              getter={props.line}
              isInAddLineMode={isInAddLineMode()}
            />
          </>
        )}
      </For>
    </div>
  );
}
