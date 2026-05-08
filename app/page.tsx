import { sql } from '@vercel/postgres';
import K2Table from './K2Table';

export default async function K2DatabasePage() {
  const table = 'datenbank_calculations_20_4_26_dots_2';

  // 1. Spaltennamen dynamisch aus Postgres abfragen (ersetzt SHOW COLUMNS)
  const columnsResult = await sql`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = ${table}
    ORDER BY ordinal_position;
  `;
  const columns = columnsResult.rows.map((r) => r.column_name);

  // 2. Alle Zeilen abfragen
  const rowsResult = await sql`
    SELECT * FROM datenbank_calculations_20_4_26_dots_2
  `;
  const rows = rowsResult.rows;

  return (
    <div className="container">
      {/* Eingebettetes CSS (exakt dein altes Design!) */}
      <style dangerouslySetInnerHTML={{ __html: `
        body { font-family: system-ui, Arial, sans-serif; margin: 25px; color: #333; }
        header { text-align: center; margin-bottom: 15px; }
        header img { max-width: 200px; height: auto; }
        
        .caption { text-align: center; font-size: 0.9em; margin-top: 5px; color: #666; }
        
        .header-section { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 40px; 
          align-items: center; 
          margin-bottom: 20px; 
        }
        @media (max-width: 768px) {
          .header-section { grid-template-columns: 1fr; gap: 20px; }
        }
        
        .header-text { line-height: 1.5; }
        .side-image { text-align: center; }
        .side-image img { max-width: 100%; height: auto; max-height: 320px; border-radius: 8px; }
        
        table { border-collapse: collapse; width: 100%; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; font-size: 14px; }
        th { background: #f2f2f2; cursor: pointer; user-select: none; }
        tr:nth-child(even){ background: #fafafa; }
        th:hover { background: #e6e6e6; }
        
        .controls { display: flex; gap: 12px; align-items: center; margin-bottom: 15px; flex-wrap: wrap; margin-top: 25px; }
        .controls input, .controls select { padding: 8px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px; }
        .small-muted { color: #666; font-size: 13px; margin-left: auto; }
        .sort-icon { margin-left: 6px; color: #666; }
        
        footer {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 0.85rem;
          color: #666;
          text-align: center;
        }
      `}} />

      {/* Header mit K2viewer Logo */}
      <header>
        <img src="/K2viewer.jpg" alt="K2viewer Logo" />
      </header>

      {/* Zweispaltiger Header-Bereich */}
      <div className="header-section">
        <div className="header-text">
          <h1>The K2 Database</h1>
          <p>
            The K2viewer database helps you identify vitamin K2–rich foods and highlights which subforms
            (menaquinone 4–10 and phylloquinone (K1)) are present.<br />
            Unlisted food items have not been analyzed so far and vitamin K2 content is rather unlikely.
          </p>

          <div style={{ marginBottom: '18px' }}>
            <strong>The database can be searched and filtered with the following functions:</strong>
            <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
              <li>Use the global search to search across all columns.</li>
              <li>Use the dropdown filters below each column to filter specific values.</li>
              <li>Click on a column header to sort ascending or descending.</li>
              <li>Select how many entries should be displayed.</li>
            </ul>
          </div>
        </div>

        {/* Bild-Sektion */}
        <div className="side-image">
          <img src="/K2L.jpg" alt="Vitamin K illustration" />
          <div className="caption">
            Vitamin K2 rich groceries (Image generated with AI).
          </div>
        </div>
      </div>

      {/* Interaktive Tabelle (Client-Komponente) */}
      <K2Table columns={columns} initialRows={rows} />

      {/* Integriertes Impressum & Datenschutz Footer */}
      <footer>
        <div style={{ marginBottom: '15px' }}>
          <strong>Impressum</strong>
          <p style={{ margin: '5px 0' }}>
            Verantwortlich für den Inhalt:<br />
            [Dein Name / Name der Organisation]<br />
            [Deine Straße und Hausnummer]<br />
            [Deine PLZ und Ort]<br />
            Kontakt: [Deine E-Mail-Adresse]
          </p>
        </div>
        <div>
          <p style={{ margin: '5px 0', fontSize: '0.75rem' }}>
            Haftungsausschluss: Die Inhalte dieser Datenbank dienen ausschließlich der Information und ersetzen keine medizinische Beratung.
          </p>
        </div>
      </footer>
    </div>
  );
}
