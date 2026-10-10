import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export function ViolationCategoryChart({ data }) {
  return (
    <Card
      title="Violations by PPE Category"
      subtitle="Aligned with trained YOLOv8 (best.pt) violation classes"
      action={<Badge variant="demo">Demo Breakdown</Badge>}
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 6, right: 20, left: 20, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="category"
              width={145}
              tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value, _name, props) => [
                `${value} incidents (class: ${props.payload.modelClass})`,
                'Count',
              ]}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={22}>
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color || '#dc2626'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
