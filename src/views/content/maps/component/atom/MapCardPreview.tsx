import "./MapCardPreview.css";

export default function (props: { preview: string }) {
  return <img class="map-card-preview" src={props.preview} alt="map preview" />;
}
