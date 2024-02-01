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
      classList={{
        active: props.active,
      }}
    >
      {props.text}
    </button>
  );
}
