import { createEffect, createSignal } from "solid-js";
import InformationContent from "../../../content/graphicage/informationBoard/InformationContent";
import InformationBoardLayout from "../template/InformationBoardLayout";

type BoardsType = "home" | "schools" | "stops";

export const [isInDrawMod, setIsDrawMod] = createSignal<boolean>(false);
export const toggleDrawMod = () => setIsDrawMod((bool) => !bool);

export const [onBoard, setOnBoard] = createSignal<BoardsType>("home");

export default function () {
  createEffect(() => {
    if (isInDrawMod()) {
      console.log("In add/edit line mode");
    } else {
      console.log("In read mode");
    }
  });

  return (
    <section>
      <InformationBoardLayout>
        <InformationContent />
      </InformationBoardLayout>
    </section>
  );
}
