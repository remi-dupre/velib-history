import "../style/StationList.css";

import { Link } from "react-router-dom";

import { StationNearby } from "../models/api";
import FillCircle from "./FillCircle";

function StationListItem(nearby: StationNearby): JSX.Element {
  const detail = nearby.station;
  const capacity = detail.info.capacity;
  const { mechanical, ebike } = detail.current_status.num_bikes_available_types;

  return (
    <li key={detail.info.station_id}>
      <Link to={`/station/${detail.info.station_id}`}>
        <FillCircle
          size={40}
          capacity={capacity}
          mechanical={mechanical}
          ebike={ebike}
          withLabel={false}
        />
        <div className="detail">
          <h4>{detail.info.name}</h4>
          <br />
          <p>
            {Math.trunc(nearby.dist)}m, {mechanical} mechanical, {ebike}{" "}
            electrical, {capacity - mechanical - ebike} free
          </p>
        </div>
        <div className="graph" />
      </Link>
    </li>
  );
}

export type StationListParams = {
  details: StationNearby[];
};

export default function StationList({
  details,
}: StationListParams): JSX.Element {
  return <ul className="stations-list">{details.map(StationListItem)}</ul>;
}
