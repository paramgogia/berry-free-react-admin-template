import React, { useState } from "react";
import initSqlJs from "sql.js";
import Papa from "papaparse";
import axios from "axios";

const SalesForecast= () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [db, setDb] = useState(null);

  // Load CSV and initialize SQL.js database on component mount
  React.useEffect(() => {
    const loadCSV = async () => {
      const csvResponse = await fetch("./df.csv");
      const csvData = await csvResponse.text();

      // Parse CSV data
      Papa.parse(csvData, {
        header: true,
        complete: async (results) => {const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}` // Confirm this version matches your setup
          });
          
          const dbInstance = new SQL.Database();
          
          // Create table structure from CSV columns
          const columnNames = Object.keys(results.data[0]);
          const createTableSQL = `
            CREATE TABLE city_stats (${columnNames.map(col => `${col} TEXT`).join(", ")});
          `;
          dbInstance.run(createTableSQL);

          // Insert CSV data into table
          const insertStmt = dbInstance.prepare(`
            INSERT INTO city_stats (${columnNames.join(", ")}) VALUES (${columnNames.map(() => "?").join(", ")});
          `);
          results.data.forEach(row => insertStmt.run(Object.values(row)));

          setDb(dbInstance); // Store DB instance for querying
        },
      });
    };

    loadCSV();
  }, []);

  // Handle query submission
  const handleQuery = async () => {
    // Step 1: Call LLM API to convert natural language to SQL
    const llmApiResponse = await axios.post("https://api.example.com/nlp-to-sql", {
      query,  // Natural language query
    });
    const sqlQuery = llmApiResponse.data.sql; // Assuming the API returns SQL as `sql`

    // Step 2: Execute SQL query on in-memory database
    try {
      const res = db.exec(sqlQuery);
      if (res.length > 0) {
        const columns = res[0].columns;
        const values = res[0].values;
        const formattedResponse = values.map(valueArray => 
          columns.reduce((acc, col, i) => ({ ...acc, [col]: valueArray[i] }), {})
        );
        setResponse(JSON.stringify(formattedResponse, null, 2));
      } else {
        setResponse("No results found.");
      }
    } catch (error) {
      setResponse("Error executing query.");
    }
  };

  return (
    <div>
      <h2>Ask a Question</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your question here..."
      />
      <button onClick={handleQuery}>Submit</button>
      <div>
        <h3>Response:</h3>
        <pre>{response}</pre>
      </div>
    </div>
  );
};

export default  SalesForecast;
