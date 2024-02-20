import "./TransporterEditMenuHeader.css";

export function TransporterEditMenuHeader(props: { title: string }) {
  return (
    <div class="transporter-header">
      <p>Editer : {props.title}</p>
    </div>
  );
}
