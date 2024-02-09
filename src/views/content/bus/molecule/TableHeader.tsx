import "./TableHeader.css";

export function TableHeader() {
  return (
    <thead>
      <tr class="tableHeader">
        <th class="tableheaderItem">Catégorie</th>
        <th class="tableheaderItem">Capacité</th>
        <th class="tableheaderItem">Courses</th>
        <th class="tableheaderItem">Nombre de Bus</th>
        <th class="tableheaderItem">Actions</th>
      </tr>
    </thead>
  );
}
