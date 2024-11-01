import { AgCharts } from 'ag-charts-community';
import type { AgChartInstance } from 'ag-charts-community';

import { BeanStub } from 'ag-grid-community';

const DEFAULT_POOLSIZE = 0;

export class SparklinePoolSvc extends BeanStub {
    beanName = 'sparklinePoolSvc' as const;

    private sparklinePool: AgChartInstance<any>[] = [];
    private poolSize: number = (window as any)['sparklinePoolSize'] ?? DEFAULT_POOLSIZE;

    public getOrCreate(options: any): AgChartInstance {
        let sparkline = this.sparklinePool.pop();

        if (sparkline) {
            sparkline.updateDelta(options);
        } else {
            sparkline = AgCharts.__createSparkline(options);
        }

        return sparkline;
    }

    public release(chart: AgChartInstance): void {
        if (this.sparklinePool.length >= this.poolSize) {
            chart.destroy();
        } else {
            this.sparklinePool.push(chart);
        }
    }
}
