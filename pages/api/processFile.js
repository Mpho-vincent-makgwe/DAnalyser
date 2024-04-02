const fs = require('fs');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const pdf = require('pdf-parse');
const { NextApiRequest, NextApiResponse } = require('next');

export default async function handler( NextApiRequest, NextApiResponse) {
  if (NextApiRequest.method === 'POST') {
    const { file, fileType } = NextApiRequest.body;
    console.log("File Type:", file); // Debugging

    try {
      let data;
      if (fileType === 'xlsx' || fileType === 'xls') {
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        data = xlsx.utils.sheet_to_json(sheet);
      } else if (fileType === 'csv') {
        data = [];
        fs.createReadStream(file.path)
          .pipe(csv())
          .on('data', (row) => {
            data.push(row);
          })
          .on('end', () => {
            NextApiResponse.status(200).json({ data });
          });
        return;
      } else if (fileType === 'json') {
        data = JSON.parse(fs.readFileSync(file.path, 'utf8'));
      } else if (fileType === 'pdf') {
        const pdfData = await pdf(fs.readFileSync(file.path));
        // Process text data from PDF as needed
        NextApiResponse.status(200).json({ data: pdfData.text });
        return;
      } else {
        NextApiResponse.status(400).json({ error: 'Unsupported file format.' });
        return;
      }

      // Process data further as needed
      NextApiResponse.status(200).json({ data });
    } catch (error) {
      console.error('Error processing file:', error);
      NextApiResponse.status(500).json({ error: 'Error processing file.' });
    }
  } else {
    NextApiResponse.status(405).json({ error: 'Method Not Allowed' });
  }
}
