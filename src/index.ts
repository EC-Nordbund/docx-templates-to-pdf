import { createReport } from "docx-templates";
import { UserOptions } from "docx-templates/lib/types";
import {
  gotenberg,
  pipe,
  office,
  please,
  convert,
  set,
  timeout,
} from "gotenberg-js-client";

type config = Omit<UserOptions, "template" | "queryVars">;

type DATA = Record<string, any>;
type Template = UserOptions["template"];

export class Gotenberg {
  constructor(protected url: string) {}

  public async fillDocToPdf(
    file: Template,
    data: DATA[],
    config?: config
  ): Promise<NodeJS.ReadableStream>;
  public async fillDocToPdf(
    file: Template,
    data: [DATA],
    config: config,
    onlyDocx: true
  ): Promise<ArrayBufferLike>;
  public async fillDocToPdf(
    file: Template,
    data: DATA[],
    config: config = {},
    onlyDocx = false
  ) {
    const query = typeof config.data === "function";

    const docx = await Promise.all(
      data.map((v) =>
        createReport({
          ...config,
          template: file,
          ...(query ? { queryVars: v } : { data: v }),
        }).then((v) => v.buffer)
      )
    );

    if (onlyDocx && data.length === 1) {
      return docx[0] as any;
    }

    return pipe(
      gotenberg(this.url),
      convert,
      office,
      set(timeout(30)),
      please
    )(docx.map((v, i) => [`${i}.docx`, Buffer.from(v)]));
  }
}
