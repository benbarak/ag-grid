import type { _ModuleWithoutApi } from 'ag-grid-community';

import { EnterpriseCoreModule } from '../agGridEnterpriseModule';
import { baseEnterpriseModule } from '../moduleUtils';
import { sparklineCSS } from './sparkline.css-GENERATED';
import { SparklineCellRenderer } from './sparklineCellRenderer';
import { SparklinePoolSvc } from './sparklinePoolSvc';

export const SparklinesModule: _ModuleWithoutApi = {
    ...baseEnterpriseModule('SparklinesModule'),
    userComponents: { agSparklineCellRenderer: SparklineCellRenderer },
    beans: [SparklinePoolSvc],
    dependsOn: [EnterpriseCoreModule],
    css: [sparklineCSS],
};
