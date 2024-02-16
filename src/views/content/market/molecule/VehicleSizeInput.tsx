interface VehicleSizeInputProps {
  defaultLength: number;
  defaultWidth: number;
  defaultHeight: number;
  onInputLenght: (value: number) => void;
  onInputWidth: (value: number) => void;
  onInputHeight: (value: number) => void;
}

export function VehicleSizeInput(props: VehicleSizeInputProps) {
  return <div>{props.defaultHeight}</div>;
}
