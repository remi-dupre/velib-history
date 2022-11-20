import "../style/StationView.css";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { StationDetail } from "../models/api";

import FillCircle from "./FillCircle";

type TParams = { id: string };

export default function StationView(): JSX.Element {
  const params = useParams<TParams>();
  const id = Number(params.id);
  const [detail, setDetail] = useState<StationDetail | undefined>(undefined);

  useEffect(() => {
    fetch(`https://velib-history-api.dupre.io/stations/${id}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setDetail(result as StationDetail);
        },
        (error) => {
          console.error(`Could not load station details: ${error}`);
        }
      );
  }, []);

  if (!detail) {
    return (
      <div className="App">
        <h2>Loading...</h2>
      </div>
    );
  }

  const capacity = detail.info.capacity;
  const { mechanical, ebike } = detail.current_status.num_bikes_available_types;

  return (
    <div className="station-view">
      <h2>{detail.info.name}</h2>
      <div className="recap">
        <FillCircle capacity={capacity} mechanical={mechanical} ebike={ebike} />
        <ul className="detail">
          <li>
            <strong>{mechanical}</strong> mechanical
          </li>
          <li>
            <strong>{ebike}</strong> ebike
          </li>
          <li>
            <strong>{capacity - mechanical - ebike}</strong> free
          </li>
        </ul>
      </div>
    </div>
  );
}
