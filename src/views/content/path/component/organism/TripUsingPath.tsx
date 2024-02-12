import { PathType } from "../../../../../_entities/path.entity";
import { PathUtil } from "../../../../../utils/path.utils";
import CollapsibleElement from "../../../board/component/organism/CollapsibleElement";
import { TripsList } from "../../../schools/component/organism/TripsList";

interface TripUsingPathProps {
  path: PathType;
}

export function TripUsingPath(props: TripUsingPathProps) {
  return (
    <CollapsibleElement
      title="Courses utilisant le chemin"
      closedByDefault={() => true}
    >
      <TripsList trips={PathUtil.getTripsUsingPath(props.path?.id as number)} />
    </CollapsibleElement>
  );
}
