"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import Image from "next/image";
import "./globals.css";

type Row = Record<string, string>;

export default function Page() {
  const [columns, setColumns] = useState<string[]>([]);
  const [allRows, setAllRows] = useState<Row[]>([]);
  const [globalQuery, setGlobalQuery] = useState("");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [pageSize, setPageSize] = useState("10");

  useEffect(() => {
    fetch("/data/k2_database.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const parsed = Papa.parse<Row>(csvText, {
  header: true,
  skipEmptyLines: true,
  delimiter: ";",
  transformHeader: (header) => header.trim(),
  transform: (value) => value.trim(),
});

        setColumns(parsed.meta.fields ?? []);
        setAllRows(parsed.data);
      });
  }, []);

  function normalizeNumber(value: string) {
    const number = parseFloat(String(value).replace(",", "."));
    return Number.isFinite(number) ? number : null;
  }

  function getFilteredRows() {
    return allRows.filter((row) => {
      const matchesGlobal =
        !globalQuery ||
        columns.some((col) =>
          String(row[col] ?? "")
            .toLowerCase()
            .includes(globalQuery.toLowerCase())
        );

      const matchesColumns = columns.every((col) => {
        const filter = columnFilters[col];
        if (!filter) return true;
        return String(row[col] ?? "").toLowerCase() === filter.toLowerCase();
      });

      return matchesGlobal && matchesColumns;
    });
  }

  function getSortedRows(rows: Row[]) {
    if (!sortColumn) return rows;
  
    return [...rows].sort((a, b) => {
      const aRaw = String(a[sortColumn] ?? "").trim();
      const bRaw = String(b[sortColumn] ?? "").trim();
  
      // Special values always at bottom
      const specialValues = ["NA", "ND", ""];
  
      const aSpecial = specialValues.includes(aRaw.toUpperCase());
      const bSpecial = specialValues.includes(bRaw.toUpperCase());
  
      if (aSpecial && !bSpecial) return 1;
      if (!aSpecial && bSpecial) return -1;
      if (aSpecial && bSpecial) return 0;
  
      // Numeric sorting
      const aNum = normalizeNumber(aRaw);
      const bNum = normalizeNumber(bRaw);
  
      if (aNum !== null && bNum !== null) {
        return sortAsc ? aNum - bNum : bNum - aNum;
      }
  
      // Text sorting
      const result = aRaw.localeCompare(bRaw, undefined, {
        numeric: true,
        sensitivity: "base",
      });
  
      return sortAsc ? result : -result;
    });
  }

  function getDisplayedRows(rows: Row[]) {
    if (pageSize === "all") return rows;
    return rows.slice(0, Number(pageSize));
  }

  function uniqueValues(column: string) {
    return Array.from(
      new Set(
        allRows
          .map((row) => String(row[column] ?? "").trim())
          .filter(Boolean)
      )
    ).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );
  }

  const filteredRows = getFilteredRows();
  const sortedRows = getSortedRows(filteredRows);
  const displayedRows = getDisplayedRows(sortedRows);

  return (
    <main>
      <header>
        <Image
          src="/images/K2viewer.jpg"
          alt="K2viewer Logo"
          width={150}
          height={150}
        />
      </header>

      <section className="header-section">
        <div className="header-text">
          <h1>The K2 Database</h1>

          <p>
            The K2viewer database helps you identify vitamin K2-rich foods and
            highlights which subforms, menaquinone 4–10 and phylloquinone K1,
            are present.
          </p>

          <strong>The database can be searched and filtered:</strong>
          <ul>
            <li>Use global search across all columns.</li>
            <li>Use dropdown filters below each column.</li>
            <li>Click a column header to sort.</li>
            <li>Select how many entries should be displayed.</li>
          </ul>
        </div>

        <div className="side-image">
          <Image
            src="/images/K2L.jpg"
            alt="Vitamin K illustration"
            width={500}
            height={320}
          />
          <div className="caption">
            Vitamin K2 rich groceries. Image generated with AI.
          </div>
        </div>
      </section>

      <div className="controls">
        <input
          type="text"
          placeholder="Search in all columns"
          value={globalQuery}
          onChange={(e) => setGlobalQuery(e.target.value)}
        />

        <label>
          Show{" "}
          <select value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="all">All</option>
          </select>{" "}
          entries
        </label>

        <span className="small-muted">
          Showing {displayedRows.length} of {filteredRows.length} filtered rows,
          from {allRows.length} total rows
        </span>
      </div>

      <div className="note">
        All contents are displayed in µg/100g | PK: Phylloquinone | MK:
        Menaquinone
      </div>

      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                onClick={() => {
                  if (sortColumn === col) {
                    setSortAsc(!sortAsc);
                  } else {
                    setSortColumn(col);
                    setSortAsc(true);
                  }
                }}
              >
                {col}{" "}
                <span className="sort-icon">
                  {sortColumn === col ? (sortAsc ? "▲" : "▼") : "⇅"}
                </span>
              </th>
            ))}
          </tr>

          <tr>
            {columns.map((col) => (
              <th key={col}>
                <select
                  value={columnFilters[col] ?? ""}
                  onChange={(e) =>
                    setColumnFilters({
                      ...columnFilters,
                      [col]: e.target.value,
                    })
                  }
                >
                  <option value="">All</option>
                  {uniqueValues(col).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {displayedRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="note">
        NA - Not analyzed.
        <br />
        ND - Not detectable.
      </div>

      <Footer />
    </main>
  );
}

function Footer() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <section className="footer-section">
        <div className="details-container">
          <button
            className="details-button"
            onClick={() => setOpen(open === "impressum" ? null : "impressum")}
          >
            Imprint
          </button>

          {open === "impressum" && (
            <div className="details-content">
              <p>
                Dr. troph Nadine Kaesler
                <br />
                RWTH Aachen University Hospital
                <br />
                E-Mail: nkaesler@ukaachen.de
              </p>
            </div>
          )}
        </div>

        <div className="details-container">
          <button
            className="details-button"
            onClick={() =>
              setOpen(open === "datenschutz" ? null : "datenschutz")
            }
          >
            Privacy Policy
          </button>

          {open === "datenschutz" && (
            <div className="details-content">
              <p>
              Datenschutzerklärung: Diese Website dient ausschließlich Informations- und Studienzwecken.<br></br>
              Beim Besuch der Website können durch den Hosting-Anbieter technische Zugriffsdaten
              (Server-Logfiles) erfasst werden. Dies umfasst beispielsweise IP-Adresse,
              Datum und Uhrzeit der Anfrage, Browsertyp sowie Betriebssystem.
              Die Verarbeitung dieser Daten erfolgt ausschließlich zur technischen Bereitstellung
              und Sicherheit der Website.<br></br>
              Es werden keine personenbezogenen Daten aktiv erhoben oder dauerhaft gespeichert.
              Es werden keine Cookies zu Analyse- oder Marketingzwecken verwendet.<br></br>
              Hosting: Die Website wird über Vercel Inc. bereitgestellt.
              </p>
            </div>
          )}
        </div>

        <div className="details-container">
          <button
            className="details-button"
            onClick={() => setOpen(open === "references" ? null : "references")}
          >
            Literature references
          </button>

          {open === "references" && (
            <div className="details-content">
              <ol>
                <li>
                  <a href="https://doi.org/10.1016/j.foodchem.2022.133772" target="_blank" rel="noopener noreferrer">
                    Dunlop E, Food Chemistry, 2022
                  </a>
                </li>

                <li>
                  <a href="https://doi.org/10.1021/jf052400h" target="_blank" rel="noopener noreferrer">
                    Elder SJ, J Agric Food Chem, 2006
                  </a>
                </li>

                <li>
                  <a href="https://doi.org/10.1111/j.1365-2621.2006.tb12408.x" target="_blank" rel="noopener noreferrer">
                    Ferreira DW, Journal of Food Science, 2006
                  </a>
                </li>

                <li>
                  <a href="https://doi.org/10.3945/cdn.117.000638" target="_blank" rel="noopener noreferrer">
                    Fu X, Curr Dev Nutr, 2017
                  </a>
                </li>

                <li>
                  <a href="https://doi.org/10.1016/j.foodchem.2022.132672" target="_blank" rel="noopener noreferrer">
                    Jensen MB, Food Chemistry, 2022
                  </a>
                </li>

                <li>Own analysis.</li>

                <li>
                  <a href="https://shibaura.elsevierpure.com/en/publications/vitamin-k-content-of-foods-and-dietary-vitamin-k-intake-in-japane/" target="_blank" rel="noopener noreferrer">
                    Kamao M, J Nutr Sci Vitaminol, 2007
                  </a>
                </li>

                <li>
                  <a href="https://doi.org/10.3389/fnut.2021.753059" target="_blank" rel="noopener noreferrer">
                    Palmer CR, Frontiers in Nutrition, 2021
                  </a>
                </li>

                <li>
                  <a href="https://karger.com/pht/article/30/6/298/155561/Determination-of-Phylloquinone-and-Menaquinones-in" target="_blank" rel="noopener noreferrer">
                    Schurgers LJ, Haemostasis, 2019
                  </a>
                </li>

                <li>
                  <a href="https://doi.org/10.1016/j.foodchem.2018.09.136" target="_blank" rel="noopener noreferrer">
                    Tarvainen M, Food Chemistry, 2019
                  </a>
                </li>

                <li>
                  <a href="https://doi.org/10.3390/nu10040446" target="_blank" rel="noopener noreferrer">
                    Vermeer C, Nutrients, 2018
                  </a>
                </li>

                <li>
                  <a href="https://doi.org/10.1017/S0007114525000261" target="_blank" rel="noopener noreferrer">
                    Reksten AM, Br J Nutr, 2025
                  </a>
                </li>

                <li>
                  <a href="https://doi.org/10.1007/s002170000262" target="_blank" rel="noopener noreferrer">
                    Ostermeyer U, Eur Food Res Technol, 2001
                  </a>
                </li>
              </ol>
            </div>
          )}
        </div>

        <div className="image-row">
          <Image
            src="/images/SFB-Logo.jpg"
            alt="SFB Logo"
            width={160}
            height={100}
          />
          <div className="caption">SFB TRR219</div>
        </div>
      </section>

      <p className="disclaimer">
        Haftungsausschluss: Die Inhalte dieser Datenbank dienen ausschliesslich
        der Information und ersetzen keine medizinische Beratung.
      </p>
    </>
  );
}
