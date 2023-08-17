import Button from "../../../../../component/atom/Button";
import "./AddLineInformationBoardContent.css";

// const [
//   ,
//   {
//     getLineUnderConstruction,
//     setLineUnderConstruction,
//     confirmEtablissementSelection,
//   },
// ] = useStateAction();
export default function (props: {
  nextStep: () => void;
  previousStep: () => void;
}) {
  return (
    <div class="">
      <Button
        onClick={props.previousStep}
        label={"Annuler"}
        variant="primary"
        isDisabled={false}
      />
      <Button
        onClick={props.nextStep}
        label={"Valider"}
        variant="primary"
        isDisabled={false}
      />
    </div>
  );
}
