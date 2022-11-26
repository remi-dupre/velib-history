import "../style/StationView.css";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faBolt,
  faChargingStation,
} from "@fortawesome/free-solid-svg-icons";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { StationDetail } from "../models/api";
import { dayStartTimestamp } from "../util/time";
import FillCircle from "./FillCircle";
import FillHistory from "./FillHistory";
import Links from "./Links";
import StationList from "./StationList";
import config from "../config.json";

const UPDATE_FREQUENCY = 30;

type TParams = { id: string };

function update(id: number, setDetail: any): NodeJS.Timer {
  const from = dayStartTimestamp();

  function update() {
    fetch(`${config.api}/stations/${id}/history?from=${from}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setDetail(result as StationDetail);
        },
        (error) => {
          console.error(`Could not load station details: ${error}`);
        }
      );
  }

  update();
  return setInterval(update, UPDATE_FREQUENCY * 1000);
}

export default function StationView(): JSX.Element {
  const from = dayStartTimestamp();
  const params = useParams<TParams>();
  const id = Number(params.id);
  const [detail, setDetail] = useState<StationDetail | undefined>(undefined);
  const [updateInterval, _] = useState<NodeJS.Timer[]>([]);

  useEffect(() => {
    while (updateInterval.length > 0) {
      clearInterval(updateInterval.pop());
    }

    updateInterval.push(update(id, setDetail));
  }, [id]);

  if (!detail) {
    return (
      <div className="App">
        <h2>Loading...</h2>
      </div>
    );
  }

  const { mechanical, ebike } = detail.current_status.num_bikes_available_types;
  const capacity = detail.info.capacity;

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
            <ul className="detail">
              <li>
                <strong className="mechanical">
                  {mechanical} <FontAwesomeIcon icon={faGear} />{" "}
                </strong>
                mechanical
              </li>
              <li>
                <strong className="ebike">
                  {ebike} <FontAwesomeIcon icon={faBolt} />{" "}
                </strong>
                electrical
              </li>
              <li>
                <strong className="station">
                  {capacity - mechanical - ebike}{" "}
                  <FontAwesomeIcon icon={faChargingStation} />{" "}
                </strong>
                free
              </li>
            </ul>
          </div>
        </div>
        <div>
          <h3>History today</h3>
          <div style={{ height: "400px" }}>
            <FillHistory
              from={from}
              capacity={capacity}
              history={detail.history ?? detail.today_history}
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
        <StationList details={detail.nearby} />
        <h3>Links</h3>
        <Links />
      </section>
    </div>
  );
}
