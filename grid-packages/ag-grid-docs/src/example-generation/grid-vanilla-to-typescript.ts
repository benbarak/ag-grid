import { addBindingImports, ImportType } from './parser-utils';
const fs = require('fs-extra');

export function vanillaToTypescript(bindings: any, mainFilePath: string): (importType: ImportType) => string {
    const { gridSettings, externalEventHandlers, imports } = bindings;

    // attach external handlers to window
    let toAttach = '';
    if (externalEventHandlers?.length > 0) {
        let externalBindings = externalEventHandlers.map(e => ` (<any>window).${e.name} = ${e.name};`)
        toAttach = [
            "\n",
            "if (typeof window !== 'undefined') {",
            "// Attach external event handlers to window so they can be called from index.html",
            ...externalBindings,
            "}"
        ].join('\n');
    }

    const tsFile = fs.readFileSync(mainFilePath, 'utf8')


    return importType => {

        let unWrapped = tsFile
            // unwrap the setup code from the DOM loaded event as the DOM is loaded before the typescript file is transpiled.
            // Regex
            // (.*DOMContentLoaded.*)\n Match the line with DOMContentLoaded
            // (.|\n)*? Match the shortest number of lines until the next part matches (body of the event handler)
            // (\n}\)) Match a }) on a new line with no indentation
            .replace(/(.*DOMContentLoaded.*)\n((.|\n)*?)(\n}\))/g, '$2')
            .replace(/new agGrid.Grid/g, 'new Grid');

        if (unWrapped.includes('DOMContentLoaded')) {
            console.error('DomContentLoaded replace failed for', mainFilePath);
            throw Error('DomContentLoaded replace failed for ' + mainFilePath)
        }

        // Need to replace module imports with their matching package import
        let formattedImports = '';
        let importStrings = [];

        if (gridSettings.enterprise) {
            importStrings.push("import 'ag-grid-enterprise';");
        }
        importStrings.push(`import { Grid } from '${importType === 'packages' ? 'ag-grid-community' : '@ag-grid-community/core'}';`);

        if (imports.length > 0) {
            addBindingImports(imports, importStrings, importType === 'packages', false);
            formattedImports = `${importStrings.join('\n')}\n`;

            // Remove the original import statements
            unWrapped = unWrapped.replace(/import ((.|\n)*?)from.*\n/g, '');
        }
        return `${formattedImports}${unWrapped} ${toAttach || ''}`;
    };
}

if (typeof window !== 'undefined') {
    (<any>window).vanillaToTypescript = vanillaToTypescript;
}
