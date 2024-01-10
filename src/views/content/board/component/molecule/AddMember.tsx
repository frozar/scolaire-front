import { JSXElement, createSignal } from "solid-js";
import { OrganisationService } from "../../../../../_services/organisation.service";
import Button from "../../../../../component/atom/Button";
import {
  addNewGlobalSuccessInformation,
  addNewGlobalWarningInformation,
} from "../../../../../signaux";
import { DialogUtils } from "../../../../../utils/dialog.utils";
import { setMember } from "../../../calendar/template/Organisation";
import { DialogToDisplayEnum, setDialogToDisplay } from "../organism/Dialogs";
import LabeledInputField from "./LabeledInputField";

export function AddMember(): JSXElement {
  async function onClick(): Promise<void> {
    if (validateEmail(memberMail())) {
      const res = await OrganisationService.addMember(memberMail());
      if (res) {
        setMember((member) => [...member, res]);

        addNewGlobalSuccessInformation("Utilisateur ajouté");
        setDialogToDisplay(DialogToDisplayEnum.none);
      } else {
        addNewGlobalWarningInformation(
          "Utilisateur inexistant ou déjà enregistrer dans l'organisation"
        );
      }
    } else {
      addNewGlobalWarningInformation("Adresse mail incorrect");
    }
  }

  function validateEmail(email: string) {
    const emailReg = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i
    );
    return emailReg.test(email);
  }

  const [memberMail, setMemberMail] = createSignal("");

  return (
    <>
      <div id="import-dialog-title">Ajouter un membre :</div>
      <LabeledInputField
        label="Adresse mail de l'utilisateur"
        value={""}
        onInput={(e) => setMemberMail(e.target.value)}
        name="mail"
        placeholder="exemple@mail.com"
      />
      <div class="import-dialog-buttons">
        <Button
          onClick={DialogUtils.closeDialog}
          label={"Annuler"}
          variant="danger"
          isDisabled={false}
        />
        <Button onClick={onClick} label={"Valider"} variant="primary" />
      </div>
    </>
  );
}
