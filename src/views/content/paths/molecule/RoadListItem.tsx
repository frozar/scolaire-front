import { PathType } from "../../../../_entities/road.entity";
import Pellet from "../../../../component/atom/Pellet";
import CardWrapper from "../../../../component/molecule/CardWrapper";
import { ViewManager } from "../../ViewManager";

interface RoadListItemProps {
  road: PathType;
}

export function RoadListItem(props: RoadListItemProps) {
  return (
    <CardWrapper
      class="path-item"
      onClick={() => ViewManager.pathDetails(props.road)}
    >
      <Pellet color={props.road.color} />
      <p>{props.road.name}</p>
      <div>{props.road.ways.length} chemins</div>
    </CardWrapper>
  );
}
