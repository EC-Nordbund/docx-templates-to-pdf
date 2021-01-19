# docx-templates-to-pdf

This is a helper Package on top of docx-templates and gotenberg-js-client to fill docx template Documents with data and convert it into PDF-Files.

> Note this is a simple wrapper only 30 Lines of Code. So for your use case it might be easier to write some helpers on your own.

## API

> 

The simple syntax you can see in the .d.ts file:

```ts
/// <reference types="node" />
import { UserOptions } from "docx-templates/lib/types";
declare type modifiedConfig = Omit<UserOptions, "template" | "queryVars">;
declare type DATA = Record<string, any>;
declare type Template = UserOptions["template"];
export declare class Gotenberg {
    protected url: string;
    constructor(url: string);
    fillDocToPdf(file: Template, data: DATA[], config?: modifiedConfig): Promise<NodeJS.ReadableStream>;
    fillDocToPdf(file: Template, data: [DATA], config: modifiedConfig, onlyDocx: true): Promise<ArrayBufferLike>;
}
```

As you can see we export a class `Gotenberg` wich has to be created with a `url`. The class has one method `fillDocToPdf`. This expects a Buffer as a file and a Array of Data objects as data. Additionaly we can provide a config object. This ist nearly the same config as the options of `docx-templates`. If we provide a query-Resolver for data (so a function) the data will be injected as `queryVars` not as `data`. If data is a single Object you can provid `onlyDocx` as `true` and get a `ArrayBufferLike` for the filled `docx` file. In all other cases you get a `NodeJS.ReadableStream` as a Result.

