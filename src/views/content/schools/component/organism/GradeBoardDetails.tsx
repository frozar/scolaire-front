import { JSXElement } from "solid-js";
import { GradeBoardDetailsHeader } from "./GradeBoardDetailsHeader";
import { GradeBoardDetailsSchedules } from "./GradeBoardDetailsSchedules";

// TODO: Display more informations as linked stops, trips and quantity
export function GradeBoardDetails(): JSXElement {
  return (
    <section>
      <GradeBoardDetailsHeader />
      <GradeBoardDetailsSchedules />
      {/* TODO: Display linked entity informations (stops, trips) and quantity infos */}
    </section>
  );
}
