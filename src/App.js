// App.js
import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./App.css"; // Import your CSS file for styling

function App() {
  const [routeData, setRouteData] = useState([]);
  const [plateData, setPlateData] = useState([]);
  const [groupData, setGroupData] = useState([]);

  const routeFileLoad = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        console.log("sheet:", sheetData);
        setRouteData(sheetData);
      };
      reader.readAsBinaryString(file);
    }
  };

  const plateFileLoad = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        console.log("sheet:", sheetData);
        setPlateData(sheetData);
      };
      reader.readAsBinaryString(file);
    }
  };

  const mixandmatch = () => {
    const shuffledList = plateData;

    // Fisher-Yates shuffle algorithm
    for (let i = shuffledList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
    }

    // Split the shuffled list into four groups
    const groupedLists = [];
    routeData.forEach((i, j) => {
      let listData = { plate: shuffledList[j][1], route: i[0], group: i[1] };
      groupedLists.push(listData);
    });

    setGroupData(groupedLists);
  };

  const printdiv = () => {
    window.print();
  };

  return (
    <div className="app-container">
      <header className="no-printme">
        <h1>Rota Dağıt</h1>
      </header>
      <section className="file-input no-printme">
        <label htmlFor="file">Rota Listesini Yükleyin: </label>
        <input type="file" id="file" onChange={routeFileLoad} />
      </section>
      {routeData.length > 0 && (
        <section className="file-input no-printme">
          <label htmlFor="file">Plaka Listesini Yükleyin: </label>
          <input type="file" id="file" onChange={plateFileLoad} />
        </section>
      )}
      {plateData.length > 0 && (
        <section className="file-input no-printme">
          <button onClick={mixandmatch}>Dağıt</button>
        </section>
      )}
      {groupData.length > 0 && (
        <section className="result-container printme">
          <table>
            <thead>
              <tr>
                <th align="left">Grup</th>
                <th>Rota</th>
                <th align="right">Plaka</th>
              </tr>
            </thead>
            <tbody>
              {groupData.map((item, index) => (
                <tr key={index}>
                  <td align="left">{item.group}</td>
                  <td>{item.route}</td>
                  <td align="right">{item.plate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      {groupData.length > 0 && (
        <section className="no-printme mt">
          <button onClick={printdiv}>Yazdır</button>
        </section>
      )}
    </div>
  );
}

export default App;
