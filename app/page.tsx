import { sql } from '@vercel/postgres';

export default async function Page({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const searchTerm = searchParams?.query || '';
  const { rows } = await sql`
    SELECT * FROM datenbank_calculations_20_4_26_dots_2 
    WHERE "Food items" ILIKE ${'%' + searchTerm + '%'}
    OR "Category main A" ILIKE ${'%' + searchTerm + '%'}
    ORDER BY "Summe Vitamin K" DESC
  `;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <img src="/K2viewer.jpg" alt="Logo" style={{ width: '150px' }} />
      <h1>K2 Database</h1>
      <form method="GET"><input name="query" defaultValue={searchTerm} placeholder="Search..." style={{ padding: '8px' }} /><button type="submit">Search</button></form>
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead><tr style={{ background: '#eee' }}><th style={{ textAlign: 'left', padding: '10px' }}>Food</th><th style={{ textAlign: 'left', padding: '10px' }}>K2 (µg)</th></tr></thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{row['Food items']}</td>
              <td style={{ padding: '10px' }}>{row['Summe Vitamin K']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
