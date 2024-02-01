import { PathType } from "../../../../../_entities/path.entity";
import Pellet from "../../../../../component/atom/Pellet";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import { IconToolTip } from "../../../../../component/molecule/IconTooltip";
import ArretsLogo from "../../../../../icons/ArretsLogo";
import VoirieLogo from "../../../../../icons/VoirieLogo";
import { PathUtil } from "../../../../../utils/path.utils";

import "./PathItem.css";

interface PathItemListProps {
  path: PathType;
  lineId: number;
}

export function PathItem(props: PathItemListProps) {
  return (
    <CardWrapper class="path-item">
      <Pellet color={props.path.color} />

      <p>{props.path.name}</p>

      <div class="informations">
        <div class="info-item ">
          <IconToolTip
            icon={<VoirieLogo />}
            tooltipText="Nombre de trip qui utilise le chemin"
          />
          {PathUtil.getTripUsingPath(props.path.id as number, props.lineId)}
        </div>

        <div class="info-item">
          <IconToolTip
            icon={<ArretsLogo />}
            tooltipText="Nombre d'arrêts du chemin'"
          />
          {props.path.points.length}
        </div>
      </div>
    </CardWrapper>
  );
}
