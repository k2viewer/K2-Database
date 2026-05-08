import { sql } from '@vercel/postgres';

export default async function K2DatabasePage({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const searchTerm = searchParams?.query || '';
  
  // Optimierte Abfrage: Lädt bis zu 200 Einträge, passend zur Suche
  const { rows } = await sql`
    SELECT * FROM datenbank_calculations_20_4_26_dots_2 
    WHERE "Food items" ILIKE ${'%' + searchTerm + '%'}
    OR "Category main A" ILIKE ${'%' + searchTerm + '%'}
    ORDER BY "Summe Vitamin K" DESC
    LIMIT 200
  `;

  return (
    <div style={{ 
      padding: '40px 20px', 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      maxWidth: '900px', 
      margin: '0 auto',
      color: '#333',
      lineHeight: '1.6'
    }}>
      {/* Header-Bereich mit Logos */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px',
        borderBottom: '1px solid #eee',
        paddingBottom: '20px'
      }}>
        <img src="/K2viewer.jpg" alt="K2 Viewer Logo" style={{ height: '60px', objectFit: 'contain' }} />
        <img src="/SFB-Logo.jpg" alt="SFB Logo" style={{ height: '60px', objectFit: 'contain' }} />
      </div>

      {/* Haupt-Überschrift und Intro-Bild */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#111' }}>Vitamin K2 Datenbank</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Suchen und vergleichen Sie den Vitamin K2-Gehalt verschiedener Lebensmittel.</p>
        
        {/* Zweites Bild (K2L.jpg) als dekoratives Banner */}
        <div style={{ marginTop: '20px' }}>
          <img src="/K2L.jpg" alt="Vitamin K2 Übersicht" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }} />
        </div>
      </div>
      
      {/* Suchformular */}
      <form method="GET" style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '30px',
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #eee'
      }}>
        <input 
          name="query" 
          defaultValue={searchTerm} 
          placeholder="z. B. Käse, Butter, Ei..." 
          style={{ 
            flex: 1, 
            padding: '12px', 
            borderRadius: '6px', 
            border: '1px solid #ccc',
            fontSize: '1rem'
          }} 
        />
        <button type="submit" style={{ 
          padding: '12px 24px', 
          backgroundColor: '#0070f3', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px', 
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '1rem'
        }}>
          Suchen
        </button>
      </form>

      {/* Tabelle */}
      <div style={{ overflowX: 'auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '8px', border: '1px solid #eee' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ background: '#f4f4f4' }}>
              <th style={{ textAlign: 'left', padding: '16px', borderBottom: '2px solid #ddd', fontWeight: '600' }}>Lebensmittel (Food Item)</th>
              <th style={{ textAlign: 'left', padding: '16px', borderBottom: '2px solid #ddd', fontWeight: '600' }}>Kategorie</th>
              <th style={{ textAlign: 'right', padding: '16px', borderBottom: '2px solid #ddd', fontWeight: '600' }}>K2 (µg/100g)</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{row['Food items']}</td>
                  <td style={{ padding: '16px', color: '#666' }}>{row['Category main A']}</td>
                  <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: '#0070f3' }}>
                    {row['Summe Vitamin K'] ? Number(row['Summe Vitamin K']).toFixed(2) : '0.00'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ padding: '30px', textAlign: 'center', color: '#999' }}>
                  Keine Ergebnisse für "{searchTerm}" gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Impressum & Datenschutz Footer */}
      <footer style={{ 
        marginTop: '60px', 
        paddingTop: '20px', 
        borderTop: '1px solid #eee', 
        fontSize: '0.85rem', 
        color: '#666',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <strong>Impressum</strong>
          <p style={{ margin: '5px 0' }}>
            Verantwortlich für den Inhalt:<br />
            Dr. troph Nadine Kaesler
            University Hospital RWTH Aachen 
           E-mail: nkaesler@ukaachen.de
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
