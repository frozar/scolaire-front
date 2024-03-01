import { JSXElement } from "solid-js";
import { ZoomInIcon } from "../../../../icons/ZoomInIcon";
import { ZoomOutIcon } from "../../../../icons/ZoomOutIcon";
import {
  ServiceGridUtils,
  ZoomTypeEnum,
} from "../../../../utils/serviceGrid.utils";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { setZoom, zoom, zoomLevels } from "../organism/ServiceGrid";
import { refScroll } from "../organism/Services";
import "./ServiceGridZoomButtons.css";

export function ServiceGridZoomButtons(): JSXElement {
  function onClickZoom(zoomType: ZoomTypeEnum): void {
    setZoom((prev) => {
      const zoomLevelIndex = zoomLevels.indexOf(prev);
      return zoomType == ZoomTypeEnum.in
        ? zoomLevels[zoomLevelIndex + 1]
        : zoomLevels[zoomLevelIndex - 1];
    });

    ServiceGridUtils.adaptScrollPositionToZoom(refScroll(), zoomType);
  }

  return (
    <div id="service-grid-zoom-buttons">
      <ButtonIcon
        icon={<ZoomOutIcon />}
        onClick={() => onClickZoom(ZoomTypeEnum.out)}
        disable={zoom() == zoomLevels[0]}
        class="service-grid-zoom-button"
      />
      <ButtonIcon
        icon={<ZoomInIcon />}
        onClick={() => onClickZoom(ZoomTypeEnum.in)}
        disable={zoom() == zoomLevels.at(-1)}
        class="service-grid-zoom-button"
      />
    </div>
  );
}
