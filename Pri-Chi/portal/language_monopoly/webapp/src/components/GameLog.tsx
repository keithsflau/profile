interface GameLogProps {
  entries: string[];
}

export const GameLog = ({ entries }: GameLogProps) => (
  <section className="panel game-log">
    <h3>事件記事</h3>
    <div className="log-list">
      {entries.slice(-12).map((item, index) => (
        <p key={`${item}-${index}`}>{item}</p>
      ))}
      {!entries.length && <p>遊戲開始後會在此顯示事件。</p>}
    </div>
  </section>
);

