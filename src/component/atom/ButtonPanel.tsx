import "./ButtonPanel.css";

interface ButtonPanelProps {
  text: string;
  onClick: () => void;
  active: boolean;
}

export function ButtonPanel(props: ButtonPanelProps) {
  return (
    <button
      onClick={() => props.onClick()}
      class="panel-button"
      classList={{
        active: props.active,
      }}
    >
      {props.text}
    </button>
  );
}
