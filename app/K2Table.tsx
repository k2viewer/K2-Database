'use client';

import React, { useState, useMemo } from 'react';

interface K2TableProps {
  columns: string[];
  initialRows: Record<string, any>[];
}

export default function K2Table({ columns, initialRows }: K2TableProps) {
  // State-Verwaltung für Filter, Suche und Sortierung
  const [globalQuery, setGlobalQuery] = useState('');
  const [pageSize, setPageSize] = useState<number | 'all'>(10);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [sortState, setSortState] = useState<{ colName: string | null; asc: boolean }>({
    colName: null,
    asc: true,
  });

  // Hilfsfunktion zur Normalisierung von Zahlen (kompatibel mit deutschem Komma)
  const normalizeNumber = (val: any): number | null => {
    if (val === null || val === undefined) return null;
    const s = String(val).trim();
    const n = parseFloat(s.replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  };

  // 1. Optionen für die Dropdown-Filter generieren (einmalig basierend auf allen Daten)
  const filterOptions = useMemo(() => {
    const options: Record<string, string[]> = {};
    columns.forEach((col) => {
      const values = new Set<string>();
      initialRows.forEach((row) => {
        const val = String(row[col] ?? '').trim();
        if (val !== '') values.add(val);
      });
      options[col] = Array.from(values).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
      );
    });
    return options;
  }, [columns, initialRows]);

  // 2. Filter-Pipeline (Globale Suche + Spalten-Filter)
  const filteredRows = useMemo(() => {
    return initialRows.filter((row) => {
      // Globale Suche
      if (globalQuery) {
        const query = globalQuery.toLowerCase();
        const matchesGlobal = columns.some((col) =>
          String(row[col] ?? '').toLowerCase().includes(query)
        );
        if (!matchesGlobal) return false;
      }

      // Spalten-Filter
      for (const col of columns) {
        const filterVal = columnFilters[col];
        if (filterVal) {
          const cellVal = String(row[col] ?? '').toLowerCase().trim();
          if (cellVal !== filterVal.toLowerCase().trim()) return false;
        }
      }

      return true;
    });
  }, [initialRows, globalQuery, columnFilters, columns]);

  // 3. Sortierung anwenden
  const sortedRows = useMemo(() => {
    if (!sortState.colName) return filteredRows;
    const { colName, asc } = sortState;

    return [...filteredRows].sort((a, b) => {
      const Araw = String(a[colName] ?? '').trim();
      const Braw = String(b[colName] ?? '').trim();

      const An = normalizeNumber(Araw);
      const Bn = normalizeNumber(Braw);

      if (An !== null && Bn !== null) {
        return asc ? An - Bn : Bn - An;
      }

      return asc
        ? Araw.localeCompare(Braw, undefined, { numeric: true, sensitivity: 'base' })
        : Braw.localeCompare(Araw, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [filteredRows, sortState]);

  // 4. Paginierung / Limitierung
  const displayedRows = useMemo(() => {
    if (pageSize === 'all') return sortedRows;
    return sortedRows.slice(0, pageSize);
  }, [sortedRows, pageSize]);

  // Sortier-Klick Handler
  const handleSort = (colName: string) => {
    setSortState((prev) => {
      if (prev.colName === colName) {
        return { colName, asc: !prev.asc };
      }
      return { colName, asc: true };
    });
  };

  return (
    <div>
      {/* Such- und Kontrollleiste */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search in all columns (e.g. for Drinks)"
          value={globalQuery}
          onChange={(e) => setGlobalQuery(e.target.value)}
          style={{ width: '300px' }}
        />

        <label>
          Show{' '}
          <select
            value={pageSize}
            onChange={(e) => {
              const val = e.target.value;
              setPageSize(val === 'all' ? 'all' : parseInt(val, 10));
            }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="all">All</option>
          </select>{' '}
          entries
        </label>

        <span className="small-muted">
          {filteredRows.length === initialRows.length
            ? `Showing ${displayedRows.length} of ${initialRows.length}`
            : `Showing ${displayedRows.length} of ${filteredRows.length} (filtered from ${initialRows.length})`}
        </span>
      </div>

      <div style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
        All contents are displayed in µg/100g | PK: Phylloquinone | MK: Menaquinone
      </div>

      {/* Die Tabelle */}
      <div style={{ overflowX: 'auto' }}>
        <table id="dbTable">
          <thead>
            {/* Sortierbare Header-Zeile */}
            <tr className="sortRow">
              {columns.map((col) => {
                const isSorted = sortState.colName === col;
                return (
                  <th key={col} onClick={() => handleSort(col)}>
                    <span className="th-text">{col}</span>
                    <span className="sort-icon">
                      {isSorted ? (sortState.asc ? ' ▲' : ' ▼') : ' ⇅'}
                    </span>
                  </th>
                );
              })}
            </tr>

            {/* Filter-Dropdowns Zeile */}
            <tr className="filterRow">
              {columns.map((col) => (
                <th key={`filter-${col}`}>
                  <select
                    className="columnFilter"
                    value={columnFilters[col] || ''}
                    onChange={(e) =>
                      setColumnFilters((prev) => ({ ...prev, [col]: e.target.value }))
                    }
                  >
                    <option value="">All</option>
                    {filterOptions[col]?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
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
                  <td key={`${rowIndex}-${col}`}>{row[col] !== null ? String(row[col]) : ''}</td>
                ))}
              </tr>
            ))}
            {displayedRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
        NA - Not analyzed<br />
        ND - Not detectable
        1 Dunlop E, Food Chemistry, 2022 
        2 Elder SJ, J Agric Food Chem, 2006;           
        3 Ferreira DW,Journal of Food Science, 2006
        4 Fu X, Curr Dev Nutr, 2017
        5 Jensen MB, Food Chemistry, 2022           
        6 own analysis                       
        7 Kamao M, J Nutr Sci Vitaminol, 2007      
        8 Palmer CR, Frontiers Nutrition, 2021
        9 Schurgers LJ, Haemostasis, 2019              
        10 Tarvainen M, Food Chemistry, 2019        
        11 Vermeer C, Nutrients, 2018                                                                   
        12 Reksten AM, Br J Nutr, 2025
        13 Ostermeyer U, Eur Food Res Technol, 2001

      </div>
    </div>
  );
}
