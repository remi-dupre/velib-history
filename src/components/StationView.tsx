import "../style/StationView.css";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { StationDetail } from "../models/api";
import { dayStartTimestamp } from "../util/time";
import FillCircle from "./FillCircle";
import FillHistory from "./FillHistory";
import Links from "./Links";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

type TParams = { id: string };

export default function StationView(): JSX.Element {
  const from = dayStartTimestamp();
  const params = useParams<TParams>();
  const id = Number(params.id);
  const [detail, setDetail] = useState<StationDetail | undefined>(undefined);

  useEffect(() => {
    const timeout = detail ? 30000 : 0;

    setTimeout(() => {
      fetch(
        `https://velib-history-api.dupre.io/stations/${id}/history?from=${from}`
      )
        .then((res) => res.json())
        .then(
          (result) => {
            setDetail(result as StationDetail);
          },
          (error) => {
            console.error(`Could not load station details: ${error}`);
          }
        );
    }, timeout);
  });

  if (!detail) {
    return (
      <div className="App">
        <h2>Loading...</h2>
      </div>
    );
  }

  const capacity = detail.info.capacity;
  const { mechanical, ebike } = detail.current_status.num_bikes_available_types;

  // const last_update = new Date(detail.current_status.last_reported * 1000);
  // <span className="last-update">{`Last updated: ${last_update.toISOString()}`}</span>

  return (
    <div className="station-view">
      <section className="main-column">
        <div>
          <h2>{detail.info.name}</h2>
          <div className="recap">
            <FillCircle
              size={100}
              capacity={capacity}
              mechanical={mechanical}
              ebike={ebike}
            />
            <div>
              <ul className="detail">
                <li>
                  <strong>{mechanical}</strong> mechanical
                </li>
                <li>
                  <strong>{ebike}</strong> electrical
                </li>
                <li>
                  <strong>{capacity - mechanical - ebike}</strong> free
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <h3>History today</h3>
          <div style={{ height: "400px" }}>
            <FillHistory
              from={from}
              capacity={capacity}
              history={detail.history}
            />
          </div>
        </div>
      </section>
      <section className="side-column">
        <MapContainer
          center={[detail.info.lat, detail.info.lon]}
          zoom={12}
          zoomControl={false}
          className="map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[detail.info.lat, detail.info.lon]} />
        </MapContainer>
        <h3>Stations nearby</h3>
        <ul className="stations-list">
          {[1, 2, 3, 4].map(() => (
            <li>
              <FillCircle
                size={40}
                capacity={capacity}
                mechanical={mechanical}
                ebike={ebike}
                withLabel={false}
              />
              <div className="detail">
                <h4>{detail.info.name}</h4> (368m)
                <br />
                <p>
                  {mechanical} mechanical, {ebike} electrical,{" "}
                  {capacity - mechanical - ebike} free
                </p>
              </div>
              <div className="graph" />
            </li>
          ))}
        </ul>
        <h3>Links</h3>
        <Links />
      </section>
    </div>
  );
}
