import { JSXElement, Show, mergeProps } from "solid-js";

interface InputSearchProps {
  onInput: (e: string) => void;
  haveIcon?: boolean;
  icon?: JSXElement;
  placeholder?: string;
  name?: string;
}

export default function (props: InputSearchProps) {
  const mergedProps = mergeProps({ haveIcon: false }, props);

  const Icon = () => props.icon ?? <></>;

  return (
    <div class="input-field">
      <Show when={mergedProps.haveIcon}>
        <div class="input-search-logo">
          <Icon />
        </div>
      </Show>

      <input
        class="bg-white"
        type="text"
        name="search"
        placeholder="Recherche"
        onInput={(e) => props.onInput(e.target.value)}
      />
    </div>
  );
}
