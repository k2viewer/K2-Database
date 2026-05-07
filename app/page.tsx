import { sql } from '@vercel/postgres';

export default async function K2DatabasePage({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const searchTerm = searchParams?.query || '';

  // Datenbank-Abfrage
  const { rows } = await sql`
    SELECT * FROM datenbank_calculations_20_4_26_dots_2 
    WHERE "Food items" ILIKE ${'%' + searchTerm + '%'}
    OR "Category main A" ILIKE ${'%' + searchTerm + '%'}
    ORDER BY "Summe Vitamin K" DESC
  `;

  return (
    <main style={{ padding: '25px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '15px' }}>
        <img src="/K2viewer.jpg" alt="Logo" style={{ maxWidth: '200px' }} />
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1>The K2 Database</h1>
          <p>Identify vitamin K2–rich foods and their subforms.</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <img src="/K2L.jpg" alt="Vitamin K" style={{ maxWidth: '100%', borderRadius: '8px' }} />
        </div>
      </div>

      <form method="GET" style={{ marginBottom: '20px' }}>
        <input 
          name="query"
          type="text" 
          defaultValue={searchTerm}
          placeholder="Search food or category..." 
          style={{ padding: '10px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer' }}>Search</button>
      </form>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Food Item</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Category</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Total K2 (µg)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{row['Food items']}</td>
                <td style={{ padding: '10px' }}>{row['Category main A']}</td>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{row['Summe Vitamin K']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
