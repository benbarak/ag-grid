export async function getData(delay: number = 100): Promise<any[]> {
    return new Promise(resolve => setTimeout(() => resolve(generateData()), delay));
}

function generateData(): any[] {
    return [
        { "period": "Q1 2023", "client": "TechNova Enterprises", "recurring": 15000, "individual": 5000 },
        { "period": "Q1 2023", "client": "InnoDyne Solutions", "recurring": 2000, "individual": 70000 },
        { "period": "Q1 2023", "client": "Unified Systems Ltd", "recurring": 10000, "individual": 40000 },
        { "period": "Q1 2023", "client": "Vertex Dynamics Inc", "recurring": 1800, "individual": 6000 },
        { "period": "Q1 2023", "client": "MacroWare Technologies", "recurring": 25000, "individual": 90000 },
        { "period": "Q1 2023", "client": "Nexa Innovations Corp", "recurring": 30000, "individual": 120000 },
        { "period": "Q1 2023", "client": "Synthetics Solutions Ltd", "recurring": 22000, "individual": 8000 },
        { "period": "Q1 2023", "client": "Optimal Systems Inc", "recurring": 28000, "individual": 100000 },
        { "period": "Q1 2023", "client": "TechEdge Ventures", "recurring": 3500, "individual": 130000 },
        { "period": "Q1 2023", "client": "Visionary Labs LLC", "recurring": 40000, "individual": 160000 },
        { "period": "Q2 2023", "client": "TechNova Enterprises", "recurring": 15500, "individual": 52000 },
        { "period": "Q2 2023", "client": "InnoDyne Solutions", "recurring": 20500, "individual": 7200 },
        { "period": "Q2 2023", "client": "Unified Systems Ltd", "recurring": 1050, "individual": 42000 },
        { "period": "Q2 2023", "client": "Vertex Dynamics Inc", "recurring": 18500, "individual": 62000 },
        { "period": "Q2 2023", "client": "MacroWare Technologies", "recurring": 25500, "individual": 9200 },
        { "period": "Q2 2023", "client": "Nexa Innovations Corp", "recurring": 30500, "individual": 122000 },
        { "period": "Q2 2023", "client": "Synthetics Solutions Ltd", "recurring": 22500, "individual": 8200 },
        { "period": "Q2 2023", "client": "Optimal Systems Inc", "recurring": 28500, "individual": 102000 },
        { "period": "Q2 2023", "client": "TechEdge Ventures", "recurring": 3550, "individual": 132000 },
        { "period": "Q2 2023", "client": "Visionary Labs LLC", "recurring": 40500, "individual": 162000 },
        { "period": "Q3 2023", "client": "TechNova Enterprises", "recurring": 16000, "individual": 54000 },
        { "period": "Q3 2023", "client": "InnoDyne Solutions", "recurring": 21000, "individual": 74000 },
        { "period": "Q3 2023", "client": "Unified Systems Ltd", "recurring": 11000, "individual": 4400 },
        { "period": "Q3 2023", "client": "Vertex Dynamics Inc", "recurring": 19000, "individual": 64000 },
        { "period": "Q3 2023", "client": "MacroWare Technologies", "recurring": 2600, "individual": 94000 },
        { "period": "Q3 2023", "client": "Nexa Innovations Corp", "recurring": 31000, "individual": 12400 },
        { "period": "Q3 2023", "client": "Synthetics Solutions Ltd", "recurring": 23000, "individual": 84000 },
        { "period": "Q3 2023", "client": "Optimal Systems Inc", "recurring": 29000, "individual": 104000 },
        { "period": "Q3 2023", "client": "TechEdge Ventures", "recurring": 3600, "individual": 134000 },
        { "period": "Q3 2023", "client": "Visionary Labs LLC", "recurring": 41000, "individual": 16400 },
        { "period": "Q4 2023", "client": "TechNova Enterprises", "recurring": 16500, "individual": 56000 },
        { "period": "Q4 2023", "client": "InnoDyne Solutions", "recurring": 2150, "individual": 76000 },
        { "period": "Q4 2023", "client": "Unified Systems Ltd", "recurring": 11500, "individual": 46000 },
        { "period": "Q4 2023", "client": "Vertex Dynamics Inc", "recurring": 19500, "individual": 6600 },
        { "period": "Q4 2023", "client": "MacroWare Technologies", "recurring": 26500, "individual": 9600 },
        { "period": "Q4 2023", "client": "Nexa Innovations Corp", "recurring": 31500, "individual": 126000 },
        { "period": "Q4 2023", "client": "Synthetics Solutions Ltd", "recurring": 23500, "individual": 86000 },
        { "period": "Q4 2023", "client": "Optimal Systems Inc", "recurring": 29500, "individual": 106000 },
        { "period": "Q4 2023", "client": "TechEdge Ventures", "recurring": 3650, "individual": 136000 },
        { "period": "Q4 2023", "client": "Visionary Labs LLC", "recurring": 41500, "individual": 166000 }
    ];
}
