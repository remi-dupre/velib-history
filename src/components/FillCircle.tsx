import "../style/FillCircle.css";

type FillCircleParams = {
  capacity: number;
  mechanical: number;
  ebike: number;
};

export default function FillCircle({
  capacity,
  mechanical: mecanical,
  ebike,
}: FillCircleParams): JSX.Element {
  const mecanicalPercentage = mecanical / capacity;
  const ebikePercentage = (mecanical + ebike) / capacity;
  console.log(mecanical, ebike, capacity);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-1 -1 34 34"
      className="fill-circle"
    >
      <circle cx="16" cy="16" r="15.9155" className="background" />

      <circle
        cx="16"
        cy="16"
        r="15.9155"
        className="ebike"
        strokeDashoffset={100 - ebikePercentage * 100}
      />

      <circle
        cx="16"
        cy="16"
        r="15.9155"
        className="mecanicle"
        strokeDashoffset={100 - mecanicalPercentage * 100}
      />
    </svg>
  );
}
