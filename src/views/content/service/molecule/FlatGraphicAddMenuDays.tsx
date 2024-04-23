import "./FlatGraphicAddMenuDays.css";

interface FlatGraphicAddMenuDaysProps {
  onChange: (number: number) => void;
}

export function FlatGraphicAddMenuDays(props: FlatGraphicAddMenuDaysProps) {
  return (
    <div class="days-container">
      <div class="days-item">
        <p>Lundi</p>
        <input type="checkbox" onChange={() => props.onChange(0)} />
      </div>
      <div class="days-item">
        <p>Mardi</p>
        <input type="checkbox" onChange={() => props.onChange(1)} />
      </div>
      <div class="days-item">
        <p>Mercredi</p>
        <input type="checkbox" onChange={() => props.onChange(2)} />
      </div>
      <div class="days-item">
        <p>Jeudi</p>
        <input type="checkbox" onChange={() => props.onChange(3)} />
      </div>
      <div class="days-item">
        <p>Vendredi</p>
        <input type="checkbox" onChange={() => props.onChange(4)} />
      </div>
      <div class="days-item">
        <p>Samedi</p>
        <input type="checkbox" onChange={() => props.onChange(5)} />
      </div>
    </div>
  );
}
