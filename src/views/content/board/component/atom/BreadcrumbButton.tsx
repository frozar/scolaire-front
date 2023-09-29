interface BreadcrumbButtonProps {
  text: string;
  onClick: () => void;
}

export default function (props: BreadcrumbButtonProps) {
  return (
    <button class="breadcrumb" onClick={() => props.onClick()}>
      {props.text}
    </button>
  );
}
