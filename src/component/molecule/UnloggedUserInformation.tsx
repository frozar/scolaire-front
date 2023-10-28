import { createEffect, createSignal } from "solid-js";
import { useStateGui } from "../../StateGui";
import { getAuthenticatedUser } from "../../signaux";
import DialogueBox from "./DialogueBox";

const [, { getSelectedMenu }] = useStateGui();

interface DialogueBoxProps {
  incMessage?: number;
}

export default function (props: DialogueBoxProps) {
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

  function mod(value: number, n: number) {
    return ((value % n) + n) % n;
  }

  const indexMessage = () => {
    if (props.incMessage !== null && props.incMessage !== undefined) {
      return mod(props.incMessage, 3);
    }

    return mod(incMessage(), 3);
  };

  return (
    <DialogueBox>
      <div class="flex h-full items-center justify-center">
        <div class="text-2xl text-center">{userMessages[indexMessage()]}</div>
      </div>
    </DialogueBox>
  );
}
