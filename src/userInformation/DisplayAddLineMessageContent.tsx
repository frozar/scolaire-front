import "../index.css";
export default function DisplayAddLineMessageContent() {
  return (
    <div
      class="v-snack nav-notify v-snack--active v-snack--has-background v-snack--multi-line v-snack--top"
      style="padding-bottom: 0px; padding-top: 0px;"
    >
      <div class="v-snack__wrapper v-sheet theme--dark red" style="">
        <div role="status" aria-live="polite" class="v-snack__content">
          <div class="text-left">
            <i
              aria-hidden="true"
              class="v-icon notranslate mr-3 mdi mdi-alert theme--dark"
            ></i>
            <span>You are not authorized to access this resource.</span>
          </div>
        </div>
        <div class="v-snack__action "></div>
      </div>
    </div>
  );
}

// <div>
// <div>
//   <kbd class="kbd">Entrée</kbd> Sauvegarder
//   <kbd class="kbd ml-2">Echap</kbd> Abandonner les modifications
// </div>
// </div>
