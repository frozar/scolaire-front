import "./AllotmentEditHeader.css";

export function AllotmentEditHeader(props: { title: string }) {
  return (
    <div class="allotment-edit-header">
      <p>Editer : {props.title}</p>
    </div>
  );
}
