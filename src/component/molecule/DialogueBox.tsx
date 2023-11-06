import { JSXElement, children } from "solid-js";

interface DialogueBoxProps {
  children: JSXElement;
}

export default function (props: DialogueBoxProps) {
  const childs = children(() => props.children);

  return (
    <div class="relative min-w-[300px] w-2/3 min-h-[200px] h-1/5 rounded-lg bg-white p-4 shadow-xl transition-all">
      {childs()}
    </div>
  );
}
