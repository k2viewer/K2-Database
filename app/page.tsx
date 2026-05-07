import { sql } from '@vercel/postgres';

export default async function K2DatabasePage({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const searchTerm = searchParams?.query || '';
  
  // Hier rufen wir die Daten ab
  const { rows } = await sql`
    SELECT * FROM datenbank_calculations_20_4_26_dots_2 
    WHERE "Food items" ILIKE ${'%' + searchTerm + '%'}
    OR "Category main A" ILIKE ${'%' + searchTerm + '%'}
    ORDER BY "Summe Vitamin K" DESC
  `;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <img src="/K2viewer.jpg" alt="Logo" style={{ width: '150px', marginBottom: '20px' }} />
      <h1>Vitamin K2 Datenbank</h1>
      
      <form method="GET" style={{ marginBottom: '20px' }}>
        <input 
          name="query" 
          defaultValue={searchTerm} 
          placeholder="Lebensmittel suchen..." 
          style={{ padding: '10px', width: '70%', borderRadius: '4px', border: '1px solid #ccc' }} 
        />
        <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer' }}>Suchen</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #ddd' }}>Lebensmittel</th>
            <th style={{ textAlign: 'right', padding: '12px', borderBottom: '2px solid #ddd' }}>K2 (µg/100g)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{row['Food items']}</td>
              <td style={{ padding: '12px', textAlign: 'right' }}>{row['Summe Vitamin K']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
