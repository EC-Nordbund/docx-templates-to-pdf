import { createReport } from "docx-templates";
import { gotenberg, pipe, office, please, convert } from "gotenberg-js-client";
import { IncomingMessage } from "http";

async function fillDoc(file: Buffer, data: any): Promise<ArrayBuffer> {
  return (await createReport({
    template: file,
    data,
  })).buffer
}

function fillDocs(file: Buffer, data: any[]): Promise<ArrayBuffer[]> {
  return Promise.all(data.map(v => fillDoc(file, v)))
}

function convertDocx2Pdf(url: string, file: ArrayBuffer[] | ArrayBuffer) {
  if (!Array.isArray(file)) {
    file = [file]
  }
  return pipe(gotenberg(url), convert, office, please)(file.map((v, i) => ([`${i}.docx`, Buffer.from(v)])))
}

export function createGotenberg(url: string) {
  return async function fillDocToPdf(file: Buffer, data: any | any[]) {
    if (Array.isArray(data)) {
      return convertDocx2Pdf(url, await fillDocs(file, data))
    } else {
      return convertDocx2Pdf(url, await fillDoc(file, data))
    }
  }
}