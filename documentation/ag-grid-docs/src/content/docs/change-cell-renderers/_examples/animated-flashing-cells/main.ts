import { ClientSideRowModelModule } from 'ag-grid-community';
import type { GridApi, GridOptions } from 'ag-grid-community';
import { createGrid } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

let gridApi: GridApi;

function formatNumber(number: number) {
    return Math.floor(number).toLocaleString();
}

const pRandom = (() => {
    // From https://stackoverflow.com/a/3062783
    let seed = 123_456_789;
    const m = 2 ** 32;
    const a = 1_103_515_245;
    const c = 12_345;

    return () => {
        seed = (a * seed + c) % m;
        return seed / m;
    };
})();

const gridOptions: GridOptions = {
    columnDefs: [
        { field: 'a', enableCellChangeFlash: true },
        { field: 'b', enableCellChangeFlash: true },
        { field: 'c', cellRenderer: 'agAnimateShowChangeCellRenderer' },
        { field: 'd', cellRenderer: 'agAnimateShowChangeCellRenderer' },
        { field: 'e', cellRenderer: 'agAnimateSlideCellRenderer' },
        { field: 'f', cellRenderer: 'agAnimateSlideCellRenderer' },
    ],
    defaultColDef: {
        flex: 1,
        cellClass: 'align-right',
        valueFormatter: (params) => {
            return formatNumber(params.value);
        },
    },
    rowData: createRowData(),
    onGridReady: () => {
        const updateValues = () => {
            const rowCount = gridApi!.getDisplayedRowCount();
            // pick 2 cells at random to update
            for (let i = 0; i < 2; i++) {
                const row = Math.floor(pRandom() * rowCount);
                const rowNode = gridApi!.getDisplayedRowAtIndex(row)!;
                const col = ['a', 'b', 'c', 'd', 'e', 'f'][Math.floor(pRandom() * 6)];
                rowNode.setDataValue(col, Math.floor(pRandom() * 10000));
            }
        };

        setInterval(updateValues, 250);
    },
};

function createRowData() {
    const rowData = [];

    for (let i = 0; i < 20; i++) {
        rowData.push({
            a: Math.floor(((i + 323) * 145045) % 10000),
            b: Math.floor(((i + 323) * 543020) % 10000),
            c: Math.floor(((i + 323) * 305920) % 10000),
            d: Math.floor(((i + 323) * 204950) % 10000),
            e: Math.floor(((i + 323) * 103059) % 10000),
            f: Math.floor(((i + 323) * 468276) % 10000),
        });
    }

    return rowData;
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    const gridDiv = document.querySelector<HTMLElement>('#myGrid')!;
    gridApi = createGrid(gridDiv, gridOptions);
});
