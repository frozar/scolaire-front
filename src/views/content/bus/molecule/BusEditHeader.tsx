import "./BusEditHeader.css";

export function BusEditHeader(props: { title: string }) {
  return (
    <div class="bus-edit-header">
      <p>Editer : {props.title}</p>
    </div>
  );
}
