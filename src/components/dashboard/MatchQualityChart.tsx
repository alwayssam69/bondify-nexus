
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const MatchQualityChart = () => {
  // Sample data for the chart - in a real app this would come from your API
  const matchQualityData = [
    { name: 'High Match (80%+)', value: 12, color: '#22c55e' },  // Green
    { name: 'Good Match (60-79%)', value: 18, color: '#3b82f6' }, // Blue
    { name: 'Average Match (40-59%)', value: 9, color: '#f59e0b' }, // Orange
    { name: 'Low Match (<40%)', value: 5, color: '#6b7280' },     // Gray
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">
        Match Quality Distribution
      </h3>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={matchQualityData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {matchQualityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} matches`, null]}
              contentStyle={{ 
                borderRadius: '0.375rem', 
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                backgroundColor: 'rgba(255,255,255,0.9)'
              }}
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MatchQualityChart;
