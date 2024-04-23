import { Setter, Show } from "solid-js";
import { FlatGraphicType } from "../../../../_entities/flatGraphic.entity";
import Button from "../../../../component/atom/Button";
import UpdatePen from "../../../../icons/UpdatePen";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./FlatGraphicItem.css";

interface FlatGraphicItemProps {
  graphicItem: FlatGraphicType;
  currentGraphic: number;
  graphicSetter: Setter<number>;
  editButtonClicked: Setter<boolean>;
}

export function FlatGraphicItem(props: FlatGraphicItemProps) {
  function isSelected() {
    if (props.graphicItem.id == props.currentGraphic) {
      return true;
    }
    return false;
  }

  return (
    <div class="flat-graphic-item">
      <Button
        label={props.graphicItem.name}
        onClick={() => props.graphicSetter(props.graphicItem.id as number)}
        active={isSelected()}
        variant="outline"
        size="3xl"
      />
      <div>
        <Show fallback={<div />} when={isSelected()}>
          <ButtonIcon
            icon={<UpdatePen />}
            onClick={() => props.editButtonClicked(true)}
          />
        </Show>
      </div>
    </div>
  );
}
