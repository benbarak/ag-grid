import type { _SortGridApi } from '../api/gridApi';
import { baseCommunityModule } from '../interfaces/iModule';
import type { _ModuleWithApi, _ModuleWithoutApi } from '../interfaces/iModule';
import { RowNodeSorter } from './rowNodeSorter';
import { onSortChanged } from './sortApi';
import { SortIndicatorComp } from './sortIndicatorComp';
import { SortService } from './sortService';

export const SortCoreModule: _ModuleWithoutApi = {
    ...baseCommunityModule('SortCoreModule'),
    beans: [SortService, RowNodeSorter],
};

export const SortIndicatorCompModule: _ModuleWithoutApi = {
    ...baseCommunityModule('SortIndicatorCompModule'),
    userComponents: {
        agSortIndicator: SortIndicatorComp,
    },
    dependsOn: [SortCoreModule],
};

export const SortApiModule: _ModuleWithApi<_SortGridApi> = {
    ...baseCommunityModule('SortApiModule'),
    apiFunctions: {
        onSortChanged,
    },
    dependsOn: [SortCoreModule],
};

export const SortModule: _ModuleWithoutApi = {
    ...baseCommunityModule('SortModule'),
    dependsOn: [SortApiModule, SortIndicatorCompModule],
};
