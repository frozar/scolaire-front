import "./TableHeader.css";

export function TableHeader() {
  return (
    <thead>
      <tr class="tableHeader">
        <th class="tableHeaderItem">Nom</th>
        <th class="tableHeaderItem">Nombre Courses</th>
        <th class="tableHeaderItem">Nombre Bus</th>
        <th class="tableHeaderItem">Actions</th>
      </tr>
    </thead>
  );
}
