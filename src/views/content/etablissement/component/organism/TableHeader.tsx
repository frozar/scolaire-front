import TableHeaderCol from "../molecule/TableHeaderCol";

interface TableHeaderProps {
  checkBoxHandler?: (checked: boolean) => void;
}

export default function (props: TableHeaderProps) {
  return (
    <thead>
      <tr>
        <TableHeaderCol
          label="Nom"
          startItem={true}
          checkBoxHandler={props.checkBoxHandler}
        />
        <TableHeaderCol label="Nombre d'élèves" />
        <TableHeaderCol label="Nombre de lignes" />
        <TableHeaderCol label="Actions" endItem={true} />
      </tr>
    </thead>
  );
}
