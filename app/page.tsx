iimport { sql } from '@vercel/postgres';

export default async function K2DatabasePage({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  // 1. Suchbegriff aus der URL holen
  const searchTerm = searchParams?.query || '';

  // 2. Datenbank-Abfrage (Sucht in allen relevanten Spalten)
  const { rows } = await sql`
    SELECT * FROM datenbank_calculations_20_4_26_dots_2 
    WHERE "Food items" ILIKE ${'%' + searchTerm + '%'}
    OR "Category main A" ILIKE ${'%' + searchTerm + '%'}
    ORDER BY "Summe Vitamin K" DESC
  `;

  return (
    <main style={{ 
      padding: '25px', 
      fontFamily: 'system-ui, Arial, sans-serif', 
      maxWidth: '1200px', 
      margin: '0 auto',
      color: '#333' 
    }}>
      
      {/* HEADER LOGO */}
      <header style={{ textAlign: 'center', marginBottom: '15px' }}>
        <img src="/K2viewer.jpg" alt="K2viewer Logo" style={{ maxWidth: '200px', height: 'auto' }} />
      </header>

      {/* HEADER SECTION (LAYOUT 50/50) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '40px', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        
        <div className="header-text">
          <h1 style={{ fontSize: '2rem', marginBottom: '15px' }}>The K2 Database</h1>
          <p style={{ lineHeight: '1.5', marginBottom: '15px' }}>
            The K2viewer database helps you identify vitamin K2–rich foods and highlights which subforms
            (menaquinone 4–10 and phylloquinone (K1)) are present.<br />
            Unlisted food items have not been analyzed so far and vitamin K2 content is rather unlikely.
          </p>

          <div style={{ marginBottom: '18px' }}>
            <strong>The database can be searched and filtered with the following functions:</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '10px', lineHeight: '1.6' }}>
              <li>Use the global search to search across all columns.</li>
              <li>The search updates the list below immediately.</li>
              <li>Results are sorted by total Vitamin K2 content by default.</li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <img 
            src="/K2L.jpg" 
            alt="Vitamin K illustration" 
            style={{ maxWidth: '100%', height: 'auto', maxHeight: '320px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} 
          />
          <div style={{ fontSize: '0.9em', marginTop: '8px', color: '#666' }}>
            Vitamin K2 rich groceries (Image generated with AI).
          </div>
        </div>
      </div>

      <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '30px 0' }} />

      {/* SEARCH CONTROLS */}
      <div style={{ marginBottom: '20px' }}>
        <form method="GET" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            name="query"
            type="text" 
            defaultValue={searchTerm}
            placeholder="Search in all columns (e.g. for Drinks or Cheese)..." 
            style={{ 
              width: '100%', 
              maxWidth: '400px',
              padding: '10px', 
              borderRadius: '6px', 
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
          <button type="submit" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#2d3748', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer' 
          }}>
            Search
          </button>
        </form>
        <div style={{ marginTop: '10px', color: '#666', fontSize: '13px' }}>
          Showing {rows.length} entries | All contents in µg/100g | PK: Phylloquinone | MK: Menaquinone
        </div>
      </div>

      {/* TABLE */}
      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #ddd' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Food Item</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Category</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Total K2 (µg)</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px 12px' }}>{row['Food items']}</td>
                  <td style={{ padding: '10px 12px', color: '#666' }}>{row['Category main A']}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 'bold' }}>{row['Summe Vitamin K']}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  No results found for "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <footer style={{ marginTop: '30px', color: '#666', fontSize: '14px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        NA - Not available values.<br />
        ND - Not detected values.
      </footer>
      
    </main>
  );
}
