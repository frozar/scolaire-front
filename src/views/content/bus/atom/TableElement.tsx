import "./TableElement.css";

interface TableElementProps {
  text: string;
}

export function TableElement(props: TableElementProps) {
  return <td class="tableElement">{props.text}</td>;
}
