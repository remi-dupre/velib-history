import "../style/FillHistory.css";

import {
  Area,
  ComposedChart,
  Legend,
  Line,
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
  ...params
}: FillHistoryParams): JSX.Element {
  const mini = params.mini ?? false;
  const now = nowTimestamp();
  const estimateStart = params.estimate[0].last_reported;

  // Trucate the estimate to only be displayed for the end of the day in mini mode
  const estimate: StationStatus[] = mini ? [] : params.estimate;

  if (mini) {
    for (let i = 0; i < params.estimate.length; i++) {
      const x = params.estimate[i];

      if (i + 1 >= params.estimate.length) {
        estimate.push(x);
        break;
      }

      const y = params.estimate[i + 1];

      if (y.last_reported < now) {
        continue;
      }

      // Cut the segment at the intersection with now
      if (x.last_reported < now) {
        x.num_bikes_available *=
          (now - x.last_reported) / (y.last_reported - x.last_reported);
        x.last_reported = now;
      }

      estimate.push(x);
    }
  }

  const chartData = history.map((info) => ({
    hour: Math.max(0, (info.last_reported - from) / 3600),
    label: formatTime(info.last_reported),
    mechanical: info.num_bikes_available_types.mechanical,
    ebike: info.num_bikes_available_types.ebike,
    capacity: capacity,
  }));

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
          legendType="rect"
        />

        <Area
          type="basis"
          isAnimationActive={false}
          stackId="1"
          name="mechanical"
          dataKey="mechanical"
          fill="var(--velib-mechanical-color)"
          stroke="var(--velib-mechanical-color-dark)"
          legendType="rect"
        />

        <XAxis
          hide={mini}
          tickSize={3}
          type="number"
          domain={[0, 24]}
          ticks={[6, 12, 18, 24]}
          allowDecimals={false}
          dataKey="hour"
        />

        <YAxis
          hide={mini}
          width={20}
          tickSize={3}
          domain={[0, capacity]}
          ticks={ticks}
          padding={{ top: 12 }}
        />

        <ReferenceLine x={(now - from) / 3600} stroke="darkgray" />

        {[...Array(estimate.length - 1).keys()].map((i) => (
          <ReferenceLine
            isFront={true}
            stroke="var(--velib-station-dark)"
            strokeWidth={1}
            strokeDasharray={mini ? "1 1" : "3 5"}
            segment={[
              {
                x: (estimate[i].last_reported - estimateStart) / 3600,
                y: estimate[i].num_bikes_available,
              },
              {
                x: (estimate[i + 1].last_reported - estimateStart) / 3600,
                y: estimate[i + 1].num_bikes_available,
              },
            ]}
          />
        ))}

        {!mini && (
          <>
            <ReferenceLine y={capacity} stroke="gray" strokeDasharray="4 6" />

            <Line
              name="estimate"
              dataKey="does-not-exist"
              stroke="var(--velib-station-dark)"
              strokeDasharray="3 5"
              legendType="plainline"
            />

            <Legend align="right" verticalAlign="top" />

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
