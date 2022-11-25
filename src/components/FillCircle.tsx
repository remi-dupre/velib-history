import "../style/FillCircle.css";

const RADIUS = 15;
const PERIMETER = 2 * Math.PI * RADIUS;

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
        <circle
          cx={RADIUS + 1}
          cy={RADIUS + 1}
          r={RADIUS}
          className="background"
        />

        <circle
          cx={RADIUS + 1}
          cy={RADIUS + 1}
          r={RADIUS}
          className="mechanical"
          strokeDasharray={PERIMETER}
          strokeDashoffset={PERIMETER * (1 - mechanicalPercentage)}
        />

        <circle
          cx={RADIUS + 1}
          cy={RADIUS + 1}
          r={RADIUS}
          className="ebike"
          strokeDasharray={PERIMETER}
          strokeDashoffset={PERIMETER * (1 - ebikePercentage)}
        />
      </svg>
    </div>
  );
}
