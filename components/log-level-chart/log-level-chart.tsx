'use client';

import CustomTooltip from '@components/ui/custom-tooltip';
import LogLevelBar from '@components/log-level-chart/log-level-bar';
import { useLogLevelChart } from '@hooks/useLogLevelChart';

const LogLevelChart = () => {
  const {
    chartData,
    renderBarForDataPoint,
    chartRef,
    dateRange,
    showTooltip,
    hideTooltip
  } = useLogLevelChart();

  return (
    <div className="border-b">
      <div className='px-6 overflow-x-auto scrollbar-invisible'>
        <div ref={chartRef} className="h-20 flex justify-between min-w-max">
          {chartData.map((dataPoint, index) => (
            <LogLevelBar
              key={`dataPoint-${index}`}
              dataPoint={dataPoint}
              index={index}
              barProps={renderBarForDataPoint(dataPoint, index, chartData, dateRange)}
              onShowTooltip={showTooltip}
              onHideTooltip={hideTooltip}
            />
          ))}
        </div>
      </div>
      {/* 커스텀 툴팁 */}
      <CustomTooltip />
    </div>
  );
}

export default LogLevelChart;