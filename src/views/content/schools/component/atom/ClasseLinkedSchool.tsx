import "./ClasseLinkedSchool.css";

interface ClasseLinkedSchoolProps {
  schools: string[];
}

export default function (props: ClasseLinkedSchoolProps) {
  return (
    <div class="linked-schools-item">
      {props.schools.map((school, index) => (
        <>
          <p>{school}</p>
          {index !== props.schools.length - 1 && <span>|</span>}
        </>
      ))}
    </div>
  );
}
