import { sql } from '@vercel/postgres';

export default async function K2DatabasePage({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  // 1. Suchbegriff aus der URL holen (falls vorhanden)
  const searchTerm = searchParams?.query || '';

  // 2. Daten aus der Datenbank abrufen
  // Wir filtern direkt in der SQL-Abfrage, das ist am schnellsten
  const { rows } = await sql`
    SELECT * FROM datenbank_calculations_20_4_26_dots_2 
    WHERE "Food items" ILIKE ${'%' + searchTerm + '%'}
    OR "Category main A" ILIKE ${'%' + searchTerm + '%'}
    ORDER BY "Summe Vitamin K" DESC
  `;

  return (
    <main style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#1a202c' }}>Vitamin K2 Datenbank</h1>
      <p style={{ color: '#4a5568' }}>Suche in über 130 Lebensmitteln nach ihrem Vitamin K2 Gehalt.</p>
     {/* Header mit Logo */}
<header style={{ textAlign: 'center', marginBottom: '15px' }}>
  <img src="/K2viewer.jpg" alt="K2viewer Logo" style={{ maxWidth: '200px', height: 'auto' }} />
</header>

{/* Zwei-Spalten Layout: Text links, Bild rechts */}
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', marginBottom: '20px' }}>
  
  <div className="header-text">
    <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>The K2 Database</h1>
    <p style={{ lineHeight: '1.5' }}>
      The K2viewer database helps you identify vitamin K2–rich foods and highlights which subforms
      (menaquinone 4–10 and phylloquinone (K1)) are present.<br />
      Unlisted food items have not been analyzed so far and vitamin K2 content is rather unlikely.
    </p>

    <div style={{ marginBottom: '18px' }}>
      <strong>The database can be searched and filtered with the following functions:</strong>
      <ul style={{ paddingLeft: '20px' }}>
        <li>Use the global search to search across all columns.</li>
        <li>Click on a column header to sort ascending or descending.</li>
      </ul>
    </div>
  </div>

  <div style={{ textAlign: 'center' }}>
    <img src="/K2L.jpg" alt="Vitamin K illustration" style={{ maxWidth: '100%', height: 'auto', maxHeight: '320px', borderRadius: '8px' }} />
    <div style={{ textAlign: 'center', fontSize: '0.9em', marginTop: '5px' }}>
      Vitamin K2 rich groceries (Image generated with AI).
    </div>
  </div>
</div>

<div style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
    All contents are displayed in µg/100g  |  PK: Phylloquinone  |  MK: Menaquinone
</div> 
      {/* Suchfeld */}
      <form method="GET" style={{ marginBottom: '30px' }}>
        <input 
          name="query"
          type="text" 
          defaultValue={searchTerm}
          placeholder="Nach Lebensmittel suchen (z.B. Gouda)..." 
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '8px', 
            border: '1px solid #cbd5e0',
            fontSize: '16px'
          }}
        />
        <button type="submit" style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}>Suchen</button>
      </form>

      {/* Tabelle */}
      <div style={{ overflowX: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#2d3748', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '15px' }}>Lebensmittel</th>
              <th style={{ padding: '15px' }}>Kategorie</th>
              <th style={{ padding: '15px' }}>K2 (µg/100g)</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '12px 15px', fontWeight: '500' }}>{item['Food items']}</td>
                  <td style={{ padding: '12px 15px', color: '#718096', fontSize: '14px' }}>{item['Category main A']}</td>
                  <td style={{ padding: '12px 15px', fontWeight: 'bold', color: '#2b6cb0' }}>
                    {item['Summe Vitamin K']}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ padding: '20px', textAlign: 'center' }}>Keine Ergebnisse gefunden.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
