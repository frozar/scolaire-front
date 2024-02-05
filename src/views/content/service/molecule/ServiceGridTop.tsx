import { JSXElement } from "solid-js";
import { GridTopHour } from "../atom/GridTopHour";
import { GridTopMinutes } from "./GridTopMinutes";

interface ServiceGridTopProps {
  width: string;
}

export function ServiceGridTop(props: ServiceGridTopProps): JSXElement {
  return (
    <>
      <GridTopHour />
      <GridTopMinutes width={props.width} />
    </>
  );
}
