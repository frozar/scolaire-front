export interface TableBodyRowProps {
  label: string;
}

export default function (props: TableBodyRowProps) {
  return <td>{props.label}</td>;
}
