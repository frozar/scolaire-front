import { createSignal, mergeProps, onMount } from "solid-js";
import { COLOR_GREEN_BASE } from "../../views/content/map/constant";
import "./Pellet.css";

interface PelletProps {
  color?: string;
}

export default function (props: PelletProps) {
  const mergedProps = mergeProps({ color: COLOR_GREEN_BASE }, props);
  const [ref, setRef] = createSignal<HTMLDivElement>(
    document.createElement("div")
  );

  onMount(() => {
    if (ref() != undefined) ref().style.backgroundColor = mergedProps.color;
  });

  return <div class="pellet" ref={setRef} />;
}
