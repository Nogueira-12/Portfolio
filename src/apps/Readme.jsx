import { useSystem } from '../os/system.jsx';
import { AppIcon } from '../os/icons.jsx';

export default function Readme() {
  const sys = useSystem();
  const r = sys.t.os.readme;
  return (
    <div className="app readme">
      <h1>{r.title}</h1>
      <p>{r.intro}</p>
      <h2>{r.howTitle}</h2>
      <ul>{r.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
      <h2>{r.startTitle}</h2>
      <div className="readme-start">
        {r.start.map(([id, what]) => (
          <button key={id} onClick={() => sys.open(id)}>
            <AppIcon id={id} size={30} />
            <span><strong>{sys.t.os.apps[id]}</strong>{what}</span>
          </button>
        ))}
      </div>
      <p className="readme-sign">{r.sign}</p>
    </div>
  );
}
