import React, { useState } from 'react';

export default function Home() {
  const [jsonData, setJsonData] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    await readFile(file);
  };

  const readFile = async (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      setJsonData(reader.result); // Set the data directly to the textarea
    };
    reader.readAsText(file);
  };

  const removeDuplicates = () => {
    setLoading(true);
    const data = JSON.parse(jsonData);
    const uniqueData = [...new Set(data.map(JSON.stringify))].map(JSON.parse);
    setJsonData(JSON.stringify(uniqueData, null, 2));
    setLoading(false);
  };

  const cleanMissingValues = () => {
    setLoading(true);
    const data = JSON.parse(jsonData);
    const cleanedData = data.filter((item) => Object.values(item).every((value) => value !== ''));
    setJsonData(JSON.stringify(cleanedData, null, 2));
    setLoading(false);
  };

  const createOrderedListAZ = () => {
    try {
      setLoading(true);
      const uniqueData = JSON.parse(jsonData);
      const orderedData = uniqueData.sort((a, b) => a.name.localeCompare(b.name));
      setJsonData(JSON.stringify(orderedData, null, 2));
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const createOrderedListZA = () => {
    try {
      setLoading(true);
      const uniqueData = JSON.parse(jsonData);
      const orderedData = uniqueData.sort((a, b) => b.name.localeCompare(a.name));
      setJsonData(JSON.stringify(orderedData, null, 2));
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Add more data cleaning functions here

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
      <textarea
        style={{ width: '100%', minHeight: '200px', color: 'blue' }}
        value={jsonData}
        readOnly
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={removeDuplicates}>Remove Duplicates</button>
        <button onClick={cleanMissingValues}>Clean Missing Values</button>
        <button onClick={createOrderedListAZ}>Sort A-Z</button>
        <button onClick={createOrderedListZA}>Sort Z-A</button>
        {/* Add more buttons for other data cleaning functions */}
      </div>
      {loading && <p>Loading...</p>}
    </div>
  );
}
