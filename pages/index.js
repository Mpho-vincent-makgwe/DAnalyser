import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests

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
    </div>
  );
}
