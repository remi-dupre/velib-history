import "../style/FillHistory.css";

import {
  Area,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  TooltipProps,
} from "recharts";

import { StationStatus } from "../models/api";
import { formatTime, nowTimestamp } from "../util/time";
import FillCircle from "./FillCircle";

type FillHistoryParams = {
  from: number;
  capacity: number;
  history: StationStatus[];
};

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const { capacity, mechanical, ebike, label } = payload[0].payload;

  return (
    <div className="history-tooltip" style={{ background: "white" }}>
      <FillCircle
        size={40}
        capacity={capacity}
        mechanical={mechanical}
        ebike={ebike}
        withLabel={false}
      />
      <div>
        <div className="detail">
          <h5>{label}</h5>
          <span>
            {`${mechanical} mechanical, ${ebike} electrical, ${
              capacity - mechanical - ebike
            } free`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FillHistory({
  from,
  capacity,
  history,
}: FillHistoryParams): JSX.Element {
  const chartData = history.map((info) => ({
    hour: Math.max(0, (info.last_reported - from) / 3600),
    label: formatTime(info.last_reported),
    mechanical: info.num_bikes_available_types.mechanical,
    ebike: info.num_bikes_available_types.ebike,
    capacity: capacity,
  }));

  const now = nowTimestamp();
  const lastData = chartData.at(-1);

  if (now - from < 24 * 3600 && lastData) {
    chartData.push({
      ...lastData,
      hour: (now - from) / 3600,
      label: "Now",
    });
  }

  return (
    <ResponsiveContainer>
      <ComposedChart data={chartData} height={400}>
        <XAxis
          type="number"
          domain={[0, 24]}
          ticks={[6, 12, 18, 24]}
          allowDecimals={false}
          dataKey="hour"
        />
        <Area
          type="basis"
          isAnimationActive={false}
          stackId="1"
          name="electrical"
          dataKey="ebike"
          fill="var(--velib-ebike-color)"
          stroke="var(--velib-ebike-color-dark)"
        />
        <Area
          type="basis"
          isAnimationActive={false}
          stackId="1"
          name="mechanical"
          dataKey="mechanical"
          fill="var(--velib-mechanical-color)"
          stroke="var(--velib-mechanical-color-dark)"
        />
        <ReferenceLine y={capacity} stroke="gray" strokeDasharray="4 6" />
        <Tooltip
          content={<CustomTooltip />}
          wrapperStyle={{ outline: "none" }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
