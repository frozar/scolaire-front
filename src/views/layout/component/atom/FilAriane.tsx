import "./FilAriane.css";

let filAriane = "";
export const setFilAriane = (text: string) => (filAriane = text);

export default function () {
  return <div class="fil-arian">{filAriane}</div>;
}
