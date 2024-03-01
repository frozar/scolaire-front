import { JSXElement } from "solid-js";
import { ZoomInIcon } from "../../../../icons/ZoomInIcon";
import { ZoomOutIcon } from "../../../../icons/ZoomOutIcon";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { setZoom, zoom, zoomLevels } from "../organism/ServiceGrid";
import { refScroll } from "../organism/Services";
import "./ServiceGridZoomButtons.css";

export function ServiceGridZoomButtons(): JSXElement {
  // TODO: Define specific zoom levels
  function onClickZoomIn(): void {
    // setZoom((prev) => {
    //   return prev + 1;
    // });
    setZoom((prev) => {
      const zoomLevelIndex = zoomLevels.indexOf(prev);
      return zoomLevels[zoomLevelIndex + 1];
    });

    ServiceGridUtils.adaptScrollPositionToZoomIn(refScroll());
  }

  function onClickZoomOut(): void {
    // setZoom((prev) => {
    //   return prev - 1;
    // });
    setZoom((prev) => {
      const zoomLevelIndex = zoomLevels.indexOf(prev);
      return zoomLevels[zoomLevelIndex - 1];
    });

    ServiceGridUtils.adaptScrollPositionToZoomOut(refScroll());
  }

  return (
    <div id="service-grid-zoom-buttons">
      <ButtonIcon
        icon={<ZoomOutIcon />}
        onClick={onClickZoomOut}
        disable={zoom() == zoomLevels[0]}
        class="service-grid-zoom-button"
      />
      {/* TODO: Define max level of zoom and put condition in `disable` */}
      <ButtonIcon
        icon={<ZoomInIcon />}
        onClick={onClickZoomIn}
        disable={zoom() == zoomLevels.at(-1)}
        class="service-grid-zoom-button"
      />
    </div>
  );
}
