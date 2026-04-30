const BOT_NODES = [
  { num: 1, name: 'Jupiter', lang: 'Java / Discord4J',           color: '#d97706' },
  { num: 2, name: 'Saturn',  lang: 'TypeScript / discord.js',    color: '#a78bfa' },
  { num: 3, name: 'Uranus',  lang: 'Rust / Serenity',            color: '#67e8f9' },
  { num: 4, name: 'Neptune', lang: 'Haskell / discord-haskell',  color: '#34d399' },
] as const;

const card: React.CSSProperties = {
  border: '1px solid #30363d',
  borderRadius: '0.75rem',
  padding: '1.25rem',
};

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0d1117',
        color: '#e6edf3',
        padding: '2.5rem',
      }}
    >
      <h1 style={{ fontSize: '1.8rem', margin: '0 0 0.25rem' }}>🪐 Exora Series</h1>
      <p style={{ color: '#8b949e', margin: '0 0 2rem' }}>
        Bot Status Dashboard
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '1rem',
        }}
      >
        {BOT_NODES.map((bot) => (
          <div key={bot.name} style={card}>
            <p style={{ color: '#8b949e', fontSize: '0.75rem', margin: '0 0 0.25rem' }}>
              Unit {bot.num} · {bot.lang}
            </p>
            <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.2rem', color: bot.color }}>
              {bot.name}
            </h2>
            <span
              style={{
                fontSize: '0.7rem',
                background: '#1a4731',
                color: '#3fb950',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
              }}
            >
              ready
            </span>
          </div>
        ))}
      </div>

      <p style={{ marginTop: '2.5rem', fontSize: '0.72rem', color: '#484f58' }}>
        Galileo DB (PostgreSQL) · Redis
      </p>
    </main>
  );
}
