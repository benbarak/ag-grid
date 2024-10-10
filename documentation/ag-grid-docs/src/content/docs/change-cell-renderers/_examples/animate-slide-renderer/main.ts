import { ClientSideRowModelModule } from 'ag-grid-community';
import type { ColDef, GridApi, GridOptions, ValueParserParams } from 'ag-grid-community';
import { createGrid } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const columnDefs: ColDef[] = [
    {
        headerName: 'Editable A',
        field: 'a',
        editable: true,
        valueParser: numberValueParser,
    },
    {
        headerName: 'Editable B',
        field: 'b',
        editable: true,
        valueParser: numberValueParser,
    },
    {
        headerName: 'API C',
        field: 'c',
        minWidth: 135,
        valueParser: numberValueParser,
        cellRenderer: 'agAnimateSlideCellRenderer',
    },
    {
        headerName: 'API D',
        field: 'd',
        minWidth: 135,
        valueParser: numberValueParser,
        cellRenderer: 'agAnimateSlideCellRenderer',
    },
    {
        headerName: 'Total',
        valueGetter: 'data.a + data.b + data.c + data.d',
        minWidth: 135,
        cellRenderer: 'agAnimateSlideCellRenderer',
    },
    {
        headerName: 'Average',
        valueGetter: '(data.a + data.b + data.c + data.d) / 4',
        minWidth: 135,
        cellRenderer: 'agAnimateSlideCellRenderer',
    },
];

let gridApi: GridApi;

const gridOptions: GridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        minWidth: 105,
        flex: 1,
        cellClass: 'align-right',
        valueFormatter: (params) => {
            return formatNumber(params.value);
        },
    },
    rowData: createRowData(),
};

function numberValueParser(params: ValueParserParams) {
    return Number(params.newValue);
}

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

function onUpdateSomeValues() {
    const rowCount = gridApi!.getDisplayedRowCount();
    for (let i = 0; i < 10; i++) {
        const row = Math.floor(pRandom() * rowCount);
        const rowNode = gridApi!.getDisplayedRowAtIndex(row)!;
        rowNode.setDataValue('c', Math.floor(pRandom() * 10000));
        rowNode.setDataValue('d', Math.floor(pRandom() * 10000));
    }
}

function createRowData() {
    const rowData = [];

    for (let i = 0; i < 20; i++) {
        rowData.push({
            a: Math.floor(((i + 323) * 25435) % 10000),
            b: Math.floor(((i + 323) * 23221) % 10000),
            c: Math.floor(((i + 323) * 468276) % 10000),
            d: 0,
        });
    }

    return rowData;
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    const gridDiv = document.querySelector<HTMLElement>('#myGrid')!;
    gridApi = createGrid(gridDiv, gridOptions);
});
