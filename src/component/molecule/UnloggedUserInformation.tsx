import { createEffect, createSignal } from "solid-js";
import { useStateGui } from "../../StateGui";
import { getAuthenticatedUser } from "../../signaux";
import DialogueBox from "./DialogueBox";

const [, { getSelectedMenu }] = useStateGui();

export default function () {
  const [previousSelectedMenu, setPreviousSelectedMenu] = createSignal("");
  const [incMessage, setIncMessage] = createSignal(0);

  createEffect(() => {
    if (getAuthenticatedUser()) {
      return;
    }

    if (getSelectedMenu() != previousSelectedMenu()) {
      setPreviousSelectedMenu(getSelectedMenu());
      setIncMessage((prev) => prev + 1);
    }
  });

  const userMessages = [
    "En haut, à droite, pour vous connectez",
    "Vous devriez vous connecter",
    "En haut, à droite, vous trouverez le bouton de connection",
  ];

  const indexMessage = () => incMessage() % 3;

  return (
    <DialogueBox>
      <div class="flex h-full items-center justify-center">
        <div class="text-2xl">{userMessages[indexMessage()]}</div>
      </div>
    </DialogueBox>
  );
}
