import "../style/StationList.css";

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faBolt,
  faChargingStation,
} from "@fortawesome/free-solid-svg-icons";

import { StationNearby } from "../models/api";
import FillCircle from "./FillCircle";
import FillHistory from "./FillHistory";
import { dayStartTimestamp } from "../util/time";

function StationListItem(nearby: StationNearby): JSX.Element {
  const from = dayStartTimestamp();
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
            {Math.trunc(nearby.dist)}m -{" "}
            <span className="mechanical">
              {mechanical}
              <FontAwesomeIcon icon={faGear} />
            </span>{" "}
            <span className="ebike">
              {ebike}
              <FontAwesomeIcon icon={faBolt} />
            </span>{" "}
            <span className="station">
              {capacity - mechanical - ebike}
              <FontAwesomeIcon icon={faChargingStation} />
            </span>
          </p>
        </div>
        <div className="graph-container">
          <FillHistory
            className="graph"
            from={from}
            capacity={capacity}
            history={detail.today_history}
            estimate={detail.today_estimate}
            mini={true}
          />
        </div>
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
