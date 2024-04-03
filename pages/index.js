import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export default function Home() {
  const [jsonData, setJsonData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    await readFile(file);
  };

  const getFileType = (file) => {
    return file.name.split('.').pop().toLowerCase();
  };

  const readFile = async (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const binaryStr = reader.result;
      const fileType = getFileType(file);
      if (fileType === 'xlsx') {
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setJsonData(jsonData); // Set the XLSX data directly
      } else {
        const textData = reader.result;
        setJsonData(textData); // Set the text data directly
      }
    };
    reader.readAsBinaryString(file);
  };

  const removeDuplicates = () => {
    setLoading(true);
    setError('');
    try {
      let data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (Array.isArray(data)) {
        const uniqueData = [...new Set(data.map(JSON.stringify))].map(JSON.parse);
        setJsonData(uniqueData);
      } else {
        setError('Invalid data format for removing duplicates.');
      }
    } catch (error) {
      setError('Error processing data: ' + error.message);
    } finally {
      setLoading(false);
    }
  }
  
  

  const cleanMissingValues = () => {
    setLoading(true);
    try {
      let data;
      if (typeof jsonData === 'string') {
        data = JSON.parse(jsonData);
      } else {
        data = jsonData;
      }
      if (Array.isArray(data)) {
        const cleanedData = data.filter((item) =>
          Object.values(item).every((value) => value !== '')
        );
        setJsonData(cleanedData);
      }
    } catch (error) {
      console.error('Error processing data:', error);
      setJsonData('Error processing data');
    } finally {
      setLoading(false);
    }
  };

  const createOrderedListAZ = () => {
    setLoading(true);
    try {
      let data;
      if (typeof jsonData === 'string') {
        data = JSON.parse(jsonData);
      } else {
        data = jsonData;
      }
      if (Array.isArray(data)) {
        const orderedData = data.sort((a, b) => a.name.localeCompare(b.name));
        setJsonData(orderedData);
      }
    } catch (error) {
      console.error('Error processing data:', error);
      setJsonData('Error processing data');
    } finally {
      setLoading(false);
    }
  };

  const createOrderedListZA = () => {
    setLoading(true);
    try {
      let data;
      if (typeof jsonData === 'string') {
        data = JSON.parse(jsonData);
      } else {
        data = jsonData;
      }
      if (Array.isArray(data)) {
        const orderedData = data.sort((a, b) => b.name.localeCompare(a.name));
        setJsonData(orderedData);
      }
    } catch (error) {
      console.error('Error processing data:', error);
      setJsonData('Error processing data');
    } finally {
      setLoading(false);
    }
  };

  const clearFileData = () => {
    setJsonData('');
  };

  return (
    <div>
      <h1>Data Analyzer</h1>
      <div
        style={{
          border: '2px dashed #ccc',
          padding: '20px',
          marginBottom: '20px',
          cursor: 'pointer',
        }}
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <p>Drag and drop files here</p>
      </div>
      {Array.isArray(jsonData[0]) ? (
        <table>
          <thead>
            <tr>
              {jsonData[0].map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jsonData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : typeof jsonData === 'object' ? (
        <pre>{JSON.stringify(jsonData, null, 2)}</pre>
      ) : (
        <textarea
          style={{ width: '100%', minHeight: '200px', color: 'blue' }}
          value={jsonData}
          readOnly
        />
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginTop: '10px' }}>
        {jsonData.length>=0 ? jsonData.length : 0}
        <button onClick={removeDuplicates}>Remove Duplicates</button>
        <button onClick={cleanMissingValues}>Clean Missing Values</button>
        <button onClick={createOrderedListAZ}>Sort A-Z</button>
        <button onClick={createOrderedListZA}>Sort Z-A</button>
        <button onClick={clearFileData}>Clear File Data</button>
        {/* Add more buttons for other data cleaning functions */}
      </div>
      {loading && <p>Loading...</p>}
    </div>
  );
}
