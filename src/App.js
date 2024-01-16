// App.js
import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./App.css"; // Import your CSS file for styling

function App() {
  const [routeData, setRouteData] = useState([]);
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
        const nonEmptyRows = sheetData.filter((row) =>
          row.some((cell) => cell !== undefined && cell !== null)
        );

        console.log("sheet:", nonEmptyRows);
        setRouteData(nonEmptyRows.slice(1));
      };
      reader.readAsBinaryString(file);
    }
  };

  const mixandmatch = () => {
    // Create a dictionary to group data by city and company
    const groupedData = {};
    routeData.forEach((item) => {
      const key = `${item[2]}_${item[3]}`; // Using city_company as the key
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(item);
    });

    // Shuffle the routes within each city and company group
    Object.keys(groupedData).forEach((key) => {
      const group = groupedData[key];
      for (let i = group.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [group[i][0], group[j][0]] = [group[j][0], group[i][0]];
      }
    });

    // Flatten the grouped and shuffled data back into a single list
    const shuffledList = Object.values(groupedData).flat();

    // Update the state with the shuffled list
    setGroupData(shuffledList);
  };

  const printdiv = () => {
    window.print();
  };

  return (
    <div className="app-container">
      <header className="no-printme">
        <h1>Güzergah Dağıt</h1>
      </header>
      <section className="file-input no-printme">
        <label htmlFor="file">Kura Listesini Yükleyin: </label>
        <input type="file" id="file" onChange={routeFileLoad} />
      </section>
      {routeData.length > 0 && (
        <section className="file-input no-printme">
          <button onClick={mixandmatch}>Dağıt</button>
        </section>
      )}
      {groupData.length > 0 && (
        <section className="result-container printme">
          <table>
            <thead>
              <tr>
                <th align="left">Plaka</th>
                <th>Güzergah</th>
                <th align="right">Şehir</th>
                <th align="right">Zaman</th>
              </tr>
            </thead>
            <tbody>
              {groupData.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    pageBreakBefore:
                      index > 0 && item[3] !== groupData[index - 1][3]
                        ? "always"
                        : "auto",
                  }}
                >
                  <td align="left">{item[0]}</td>
                  <td>{item[1]}</td>
                  <td align="right">{item[2]}</td>
                  <td align="right">{item[3]}</td>
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
