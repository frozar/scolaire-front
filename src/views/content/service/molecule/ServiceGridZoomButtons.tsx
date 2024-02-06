import { JSXElement } from "solid-js";
import { ZoomInIcon } from "../../../../icons/ZoomInIcon";
import { ZoomOutIcon } from "../../../../icons/ZoomOutIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { setZoom, zoom } from "../organism/ServiceGrid";

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
    <>
      <ButtonIcon
        icon={<ZoomOutIcon />}
        onClick={onClickZoomOut}
        disable={zoom() == 1}
      />
      {/* TODO: Define max level of zoom and put condition in `disable` */}
      <ButtonIcon icon={<ZoomInIcon />} onClick={onClickZoomIn} />
    </>
  );
}
