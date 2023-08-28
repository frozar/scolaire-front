import { createSignal } from "solid-js";
import "./FilAriane.css";

export const [filAriane, setFilAriane] = createSignal<string>("Acceuil");
export default function () {
  return <div class="fil-arian">{filAriane()}</div>;
}
