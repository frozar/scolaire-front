import CollapsibleElement from "../organism/CollapsibleElement";
export default function () {
  return (
    <>
      <div id="import-dialog-title">Modifications à appliquer :</div>
      {/* TODO: Use collapsible */}
      <CollapsibleElement title="Ajouter">
        {/* ! for each data.added */}
        <div>TODO</div>
        {/* <For each={props.content}>
          {(elem, i) => {
            return (
              <CheckableElement
                content={elem}
                indice={i()}
                displayQuantity={props.displayQuantity}
              />
            );
          }}
        </For> */}
      </CollapsibleElement>
      <CollapsibleElement title="Modifier">
        <div>TODO</div>
      </CollapsibleElement>
      <CollapsibleElement title="Supprimer">
        <div>TODO</div>
      </CollapsibleElement>
    </>
  );
}
