import { JSXElement } from "solid-js";
import { GradeBoardDetailsHeader } from "./GradeBoardDetailsHeader";
import { GradeBoardDetailsSchedules } from "./GradeBoardDetailsSchedules";
import { GradeDetailsPanels } from "./gradeDetailsPanels";

export function GradeBoardDetails(): JSXElement {
  return (
    <section>
      <GradeBoardDetailsHeader />
      <GradeBoardDetailsSchedules />
      <GradeDetailsPanels />
    </section>
  );
}
