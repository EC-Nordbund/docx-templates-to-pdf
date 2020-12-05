# docx-templates-to-pdf

This is a helper Package on top of docx-templates and gotenberg-js-client to fill docx template Documents with data and convert it into PDF-Files.

> Note this is a simple wrapper only 30 Lines of Code. So for your use case it might be easier to write some helpers on your own.

## API

The simple syntax you can see in the .d.ts file:

```ts
/// <reference types="node" />
import { UserOptions } from "docx-templates/lib/types";
export declare function createGotenberg(
  url: string
): (
  file: UserOptions["template"],
  data: any | any[],
  config?: Omit<UserOptions, "template" | "data" | "query" | "queryVars">
) => Promise<NodeJS.ReadableStream>;
```

We only export a function called `createGotenberg` wich recives one string - a URL to your gotenberg instance and returns a new function.

The returned function recives 2 or 3 Arguments. The first is a Buffer of the file. The second argument is the data to inject in the document (or a array for multiple documents). The third arguments is optional and can be added to configure docx-templates. These options are directly injected. Only the options template, data, query and queryVars are not allowed.

The function returns a ReadableStream.
