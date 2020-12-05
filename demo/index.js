const { readFileSync, createWriteStream } = require("fs");
const { createGotenberg } = require("..");

const file = readFileSync('./demo/testdoc.docx');
const gotenberg = createGotenberg('https://gotenberg.ec-nordbund.de');

(async () => {
  // Single Document
  const f = await gotenberg(file, { version: 1 })

  f.pipe(createWriteStream('./out.pdf'))

  // Multiple Document
  const data = new Array(2).fill(0).map(v => ({ version: Math.random() }))

  const g = await gotenberg(file, data)
  g.pipe(createWriteStream('./out2.pdf'))
})()



