import * as fs from "fs";
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

// Used to export the file into a .docx file
Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("test.docx", buffer);
});

// Done! A file called 'My Document.docx' will be in your file system.
