// App.js
import React, { useState } from "react";
import * as XLSX from "xlsx";
import OrderButton from "./OrderButton";
import "./App.css"; // Import your CSS file for styling

function App() {
  const [data, setData] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: "A" });
        setData(sheetData);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleOrderButtonClick = (list) => {
    const shuffledList = [...list];

    // Fisher-Yates shuffle algorithm
    for (let i = shuffledList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
    }

    setData(shuffledList);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Plaka Sıralayıcı</h1>
      </header>
      <section className="file-input">
        <label htmlFor="file">Plaka Listesini Yükleyin: </label>
        <input type="file" id="file" onChange={handleFileChange} />
      </section>
      {data.length > 0 && (
        <section className="result-container">
          <OrderButton
            data={data}
            onOrderButtonClick={handleOrderButtonClick}
          />
          <ul>
            {data.map((item, index) => (
              <li key={index}>
                <strong>{index + 1}</strong> -> <strong>{item.A}</strong>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default App;
