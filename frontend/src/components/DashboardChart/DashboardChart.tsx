import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Sector,
  Rectangle,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'
import type { PieSectorShapeProps } from 'recharts/types/polar/Pie'
import type { BarShapeProps } from 'recharts/types/cartesian/Bar'

const DEFAULT_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

interface DashboardChartProps {
  title: string
  type: 'bar' | 'pie' | 'donut'
  data: readonly unknown[]
  dataKey: string
  xAxisKey?: string
  colors?: string[]
}

export default function DashboardChart({ title, type, data, dataKey, xAxisKey, colors }: DashboardChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-md">{title}</h3>
        <div className="flex items-center justify-center h-48 text-on-surface-variant font-body-md text-body-md">
          No data available
        </div>
      </div>
    )
  }

  const chartColors = colors ?? DEFAULT_COLORS

  const dataWithFill = (data as Record<string, unknown>[]).map((item, i) => ({
    ...item,
    fill: chartColors[i % chartColors.length],
  }))

  const renderPieShape = (props: PieSectorShapeProps) => {
    return <Sector {...props} />
  }

  const renderBarShape = (props: BarShapeProps, index: string | number | undefined) => {
    return (
      <Rectangle
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
        fill={chartColors[Number(index ?? 0) % chartColors.length]}
        radius={[4, 4, 0, 0]}
      />
    )
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
      <h3 className="font-headline-md text-headline-md text-on-surface mb-md">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'pie' || type === 'donut' ? (
            <PieChart>
              <Pie
                data={dataWithFill}
                dataKey={dataKey}
                nameKey={xAxisKey ?? 'name'}
                cx="50%"
                cy="50%"
                innerRadius={type === 'donut' ? 60 : 0}
                outerRadius={90}
                label={({ name, value }: { name?: string; value: number }) => `${name ?? ''} (${value})`}
                shape={renderPieShape}
              />
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <BarChart data={dataWithFill} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey={xAxisKey ?? 'name'} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} radius={[4, 4, 0, 0]} shape={renderBarShape} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
