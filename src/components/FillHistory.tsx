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

const TICK_INTERVAL = 10;

type FillHistoryParams = {
  className?: string;
  from: number;
  capacity: number;
  history: StationStatus[];
  estimate: StationStatus[];
  mini?: boolean;
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
  className,
  from,
  capacity,
  history,
  estimate,
  mini,
}: FillHistoryParams): JSX.Element {
  const isMini = mini ?? false;

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

  const ticks = [...Array(capacity + 1).keys()].filter(
    (v) => (capacity - v) % TICK_INTERVAL === 0 && 2 * v >= TICK_INTERVAL
  );

  return (
    <ResponsiveContainer className={className}>
      <ComposedChart
        data={chartData}
        height={400}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
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

        <XAxis
          hide={isMini}
          tickSize={3}
          type="number"
          domain={[0, 24]}
          ticks={[6, 12, 18, 24]}
          allowDecimals={false}
          dataKey="hour"
        />

        <YAxis
          hide={isMini}
          width={20}
          tickSize={3}
          domain={[0, capacity]}
          ticks={ticks}
          padding={{ top: 12 }}
        />

        <ReferenceLine x={(now - from) / 3600} stroke="darkgray" />

        {[...Array(24).keys()].map((i) => (
          <ReferenceLine
            isFront={true}
            stroke="black"
            strokeWidth={1}
            strokeDasharray={isMini ? "1 5" : "3 5"}
            segment={[
              { x: i, y: estimate[i].num_bikes_available },
              { x: i + 1, y: estimate[i + 1].num_bikes_available },
            ]}
          />
        ))}

        {!isMini && (
          <>
            <ReferenceLine y={capacity} stroke="gray" strokeDasharray="4 6" />

            <Tooltip
              content={<CustomTooltip />}
              wrapperStyle={{ outline: "none" }}
            />
          </>
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
