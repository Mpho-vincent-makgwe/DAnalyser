const fs = require('fs');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const pdf = require('pdf-parse');
const _ = require('lodash');

// Function to read and process data from different file formats
async function processData(file) {
    const extension = file.split('.').pop().toLowerCase();

    if (extension === 'xlsx' || extension === 'xls') {
        const workbook = xlsx.readFile(file);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        return xlsx.utils.sheet_to_json(sheet);
    } else if (extension === 'csv') {
        const data = [];
        return new Promise((resolve, reject) => {
            fs.createReadStream(file)
                .pipe(csv())
                .on('data', (row) => {
                    data.push(row);
                })
                .on('end', () => {
                    resolve(data);
                })
                .on('error', (err) => {
                    reject(err);
                });
        });
    } else if (extension === 'json') {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        return data;
    } else if (extension === 'pdf') {
        const pdfData = await pdf(fs.readFileSync(file));
        // Extract text from PDF and process it as needed
        // Example: const text = pdfData.text;
        // Process text data further as per requirements
        return null; // For simplicity, returning null for PDF data
    } else {
        console.log('Unsupported file format.');
        return null;
    }
}

// Function to eliminate duplicates and display data in JSON format
async function eliminateDuplicatesAndDisplay(file) {
    try {
        const data = await processData(file);

        // Eliminate duplicates based on some criteria (e.g., unique identifier)
        const uniqueData = _.uniqBy(data, 'id'); // Using lodash for simplicity, adjust as needed

        // Display the unique data in JSON format
        console.log(JSON.stringify(uniqueData, null, 2));
    } catch (error) {
        console.error('Error processing data:', error);
    }
}

// Usage example
const inputFile = 'path_to_your_file';
eliminateDuplicatesAndDisplay(inputFile);
