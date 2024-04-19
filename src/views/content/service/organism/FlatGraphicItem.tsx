import { Setter } from "solid-js";
import { FlatGraphicType } from "../../../../_entities/flatGraphic.entity";
import Button from "../../../../component/atom/Button";

interface FlatGraphicItemProps {
  graphicItem: FlatGraphicType;
  currentGraphic: number;
  graphicSetter: Setter<number>;
}

export function FlatGraphicItem(props: FlatGraphicItemProps) {
  function isSelected() {
    if (props.graphicItem.id == props.currentGraphic) {
      return true;
    }
    return false;
  }

  return (
    <Button
      label={props.graphicItem.name}
      onClick={() => props.graphicSetter(props.graphicItem.id as number)}
      active={isSelected()}
      variant="outline"
      size="3xl"
    />
  );
}
