import { createReport } from "docx-templates";
import { UserOptions } from "docx-templates/lib/types";
import { gotenberg, pipe, office, please, convert, set, timeout } from "gotenberg-js-client";

async function fillDoc(file: Buffer, data: any, config: Partial<UserOptions>): Promise<ArrayBuffer> {
  return (await createReport({
    ...config,
    template: file,
    data,
  })).buffer
}

function fillDocs(file: Buffer, data: any[], config: Partial<UserOptions>): Promise<ArrayBuffer[]> {
  return Promise.all(data.map(v => fillDoc(file, v, config)))
}

function convertDocx2Pdf(url: string, file: ArrayBuffer[] | ArrayBuffer) {
  if (!Array.isArray(file)) {
    file = [file]
  }
  return pipe(gotenberg(url), convert, office, set(timeout(15)), please)(file.map((v, i) => ([`${i}.docx`, Buffer.from(v)])))
}

export function createGotenberg(url: string) {
  return async function fillDocToPdf(file: UserOptions['template'], data: any | any[], config: Omit<UserOptions, 'template' | 'data' | 'query' | 'queryVars'> = {}) {
    if (Array.isArray(data)) {
      return convertDocx2Pdf(url, await fillDocs(file, data, config))
    } else {
      return convertDocx2Pdf(url, await fillDoc(file, data, config))
    }
  }
}
