import { createReport } from "docx-templates";
import { gotenberg, pipe, office, please, convert, set, filename, to, portrait, merge } from "gotenberg-js-client";
import { IncomingMessage } from "http";

async function fillDocx(file: Buffer, data: any): Promise<ArrayBuffer> {
  return (await createReport({
    template: file,
    data,
  })).buffer as ArrayBuffer
}

function convertDocx2Pdf(url: string, file: ArrayBuffer) {
  return pipe(gotenberg(url), convert, set(filename('out.pdf')), office, please)(['test.docx', Buffer.from(file)]) as Promise<IncomingMessage>
}

function convertDocs2Pdf(url: string, file: ArrayBuffer[]) {
  return pipe(gotenberg(url), convert, set(filename('out.pdf')), office, please)(file.map((v, i) => ([`${i}.docx`, Buffer.from(v)]))) as Promise<IncomingMessage>
}


export async function fillDocToPdf(url: string, file: Buffer, data: any) {
  return (await convertDocx2Pdf(url, await fillDocx(file, data)))
}

function fillDocs(file: Buffer, data: any[]): Promise<ArrayBuffer[]> {
  return Promise.all(data.map(v => fillDocx(file, v)))
}

export async function fillDocsToPdf(url: string, file: Buffer, data: any[]) {
  const filled = await fillDocs(file, data)
  return await convertDocs2Pdf(url, filled)

  // return pipe(gotenberg(url), merge, please)(finished.map((v, i) => ([`${i}.pdf`, v]))) as Promise<IncomingMessage>
}