const { readFileSync, createWriteStream } = require("fs");
const { fillDocToPdf, fillDocsToPdf } = require("..");

const file = readFileSync('./demo/testdoc.docx');


(async () => {
  // Single Document
  const f = await fillDocToPdf('https://gotenberg.ec-nordbund.de', file, { version: 1 })

  f.pipe(createWriteStream('./out.pdf'))

  // Multiple Document
  const data = new Array(2).fill(0).map(v => ({ version: Math.random() }))
  
  const g = await fillDocsToPdf('https://gotenberg.ec-nordbund.de', file, data)
  g.pipe(createWriteStream('./out2.pdf'))
})()



