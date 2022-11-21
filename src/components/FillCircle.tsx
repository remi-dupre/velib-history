import "../style/FillCircle.css";

type FillCircleParams = {
  size: number;
  capacity: number;
  mechanical: number;
  ebike: number;
  withLabel?: boolean;
};

export default function FillCircle({
  size,
  capacity,
  mechanical,
  ebike,
  withLabel,
}: FillCircleParams): JSX.Element {
  const showLabel = withLabel == null ? true : withLabel;
  const total = mechanical + ebike;
  const mechanicalPercentage = (mechanical + ebike) / capacity;
  const ebikePercentage = ebike / capacity;

  const style = {
    height: `${size}px`,
    width: `${size}px`,
    fontSize: `${0.15 * size}px`,
  };

  return (
    <div className="fill-circle-container" style={style}>
      <div className="total-container">
        <div className="total">{total}</div>
        {showLabel && <div className="label">bikes</div>}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-1 -1 34 34"
        className="fill-circle"
      >
        <circle cx="16" cy="16" r="15" className="background" />

        <circle
          cx="16"
          cy="16"
          r="15"
          className="mechanical"
          strokeDashoffset={100 - mechanicalPercentage * 100}
        />

        <circle
          cx="16"
          cy="16"
          r="15"
          className="ebike"
          strokeDashoffset={100 - ebikePercentage * 100}
        />
      </svg>
    </div>
  );
}
