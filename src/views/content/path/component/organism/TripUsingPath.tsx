import { PathType } from "../../../../../_entities/path.entity";
import { PathUtil } from "../../../../../utils/path.utils";
import CollapsibleElement from "../../../line/atom/CollapsibleElement";
import { TripsList } from "../../../schools/component/organism/TripsList";

interface TripUsingPathProps {
  path: PathType;
  openOnClick?: boolean;
}

export function TripUsingPath(props: TripUsingPathProps) {
  return (
    <CollapsibleElement
      title="Courses utilisant le chemin"
      closedByDefault={() => true}
    >
      <TripsList
        trips={PathUtil.getTripsUsingPath(props.path?.id as number)}
        openOnClick={props.openOnClick}
      />
    </CollapsibleElement>
  );
}
