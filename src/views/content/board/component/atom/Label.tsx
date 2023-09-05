export default function (props: { label: string; for?: string }) {
  return <label for={props.for}>{props.label}</label>;
}
