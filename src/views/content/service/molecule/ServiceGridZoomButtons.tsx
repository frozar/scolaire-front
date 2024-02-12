import { JSXElement } from "solid-js";
import { ZoomInIcon } from "../../../../icons/ZoomInIcon";
import { ZoomOutIcon } from "../../../../icons/ZoomOutIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { setZoom, zoom } from "../organism/ServiceGrid";
import "./ServiceGridZoomButtons.css";

export function ServiceGridZoomButtons(): JSXElement {
  // TODO: Define specific zoom levels
  function onClickZoomIn(): void {
    setZoom((prev) => {
      return prev + 1;
    });
  }

  function onClickZoomOut(): void {
    setZoom((prev) => {
      return prev - 1;
    });
  }

  return (
    <div id="service-grid-zoom-buttons">
      <ButtonIcon
        icon={<ZoomOutIcon />}
        onClick={onClickZoomOut}
        disable={zoom() == 1}
        class="service-grid-zoom-button"
      />
      {/* TODO: Define max level of zoom and put condition in `disable` */}
      <ButtonIcon
        icon={<ZoomInIcon />}
        onClick={onClickZoomIn}
        class="service-grid-zoom-button"
      />
    </div>
  );
}
