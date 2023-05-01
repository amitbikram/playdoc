/** @satisfies {import('@webcontainer/api').FileSystemTree} */

export const files = {
    'index.js': {
      file: {
        contents: `
  import express from 'express';
  import {MediaHandler} from '@adobe/helix-mediahandler';
  import {docx2md} from '@adobe/helix-docx2md';
  import fetch from 'node-fetch';

  import docx from "docx";

const { Document, Bookmark, ExternalHyperlink, HeadingLevel, Header, Footer, Packer, Paragraph, TextRun, SectionType, InsertedTextRun, DeletedTextRun } = docx;

// Documents contain sections, you can have multiple sections per document, go here to learn more about sections
// This simple example will only contain one section
const doc = new Document({
    sections: [
        {
            properties: {
              type: SectionType.NEXT_COLUMN,
            },
            headers: {
                default: new Header({
                    children: [new Paragraph("Header text")],
                }),
            },
            footers: {
                default: new Footer({
                    children: [new Paragraph("Footer text")],
                }),
            },
            children: [
              new Paragraph({
                children: [
                    new TextRun("This is a simple demo "),
                    new TextRun({
                        text: "on how to "
                    }),
                    new InsertedTextRun({
                        text: "mark a text as an insertion ",
                        id: 0,
                        author: "Firstname Lastname",
                        date: "2020-10-06T09:00:00Z",
                    }),
                    new DeletedTextRun({
                        text: "or a deletion.",
                        id: 1,
                        author: "Firstname Lastname",
                        date: "2020-10-06T09:00:00Z",
                    })
                ],
            })
            ],
        },
        {
          properties: {
            type: SectionType.EVEN_PAGE,
          },
          children: [
              new Paragraph({
                  children: [
                      new TextRun("Hello World2"),
                      new TextRun({
                          text: "Foo Bar2",
                          bold: true,
                      }),
                      new TextRun({
                          text: "\tGithub is the best2",
                          bold: true,
                      }),
                  ],
              }),
          ],
      },
    ],
});

// Done! A file called 'My Document.docx' will be in your file system.

  
  const app = express();
  const port = 3111;
  
  app.get('/', async (req, res) => {
    let buffer = await Packer.toBuffer(doc);

const mediaHandler = new MediaHandler({ owner: 'adobecom', repo: 'milo', ref: 'main', contentBusId: '428c247cb451d4d92914028a176c9d2654b76bb578506f630497e817d8c' });
    const langstorePrevMd = await docx2md(buffer, { mediaHandler, gridtables: true });
    console.log(langstorePrevMd);
    res.send(langstorePrevMd);
  });
  
  app.listen(port, () => {
    console.log(\`App is live at http://localhost:\${port}\`);
  });`,
      },
    },
    'package.json': {
      file: {
        contents: `
  {
    "name": "example-app",
    "type": "module",
    "dependencies": {
      "express": "latest",
      "nodemon": "latest",
      "@adobe/helix-mediahandler": "latest",
      "@adobe/helix-docx2md": "latest",
      "node-fetch": "latest",
      "docx": "^8.0.3"
    },
    "scripts": {
      "start": "nodemon --watch './' index.js"
    }
  }`,
      },
    },
  };