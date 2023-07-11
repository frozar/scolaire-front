import InputText from "../atom/InputText";
import SearchLogo from "../atom/SearchLogo";
import "./InputSearch.css";

interface InputSearchProps {
  onInput: (key: string) => void;
}

export default function (props: InputSearchProps) {
  return (
    <div class="input-field">
      <SearchLogo />
      <InputText
        name="search"
        placeholder="Recherche"
        onInput={(key: string) => props.onInput(key)}
      />
    </div>
  );
}
