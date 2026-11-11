import { useSystem } from '../os/system.jsx';
import { PROFILE } from '../data.js';
import { AppIcon } from '../os/icons.jsx';
import { Btn } from './ui.jsx';

/* PDF viewer for the CV (phones get buttons instead — most mobile browsers can't show PDFs in a frame) */
export default function Resume() {
  const { t, mobile } = useSystem();
  const c = t.os.cv;
  return (
    <div className="app resume">
      <div className="toolbar">
        <strong className="toolbar-t">{c.page}</strong>
        <Btn href={PROFILE.cv} external icon="external" className="btn-sm">{c.open}</Btn>
        <Btn href={PROFILE.cv} download icon="download" variant="primary" className="btn-sm">{c.download}</Btn>
      </div>
      {mobile ? (
        <div className="resume-fallback">
          <AppIcon id="cv" size={84} />
          <p>{c.fallback}</p>
          <Btn href={PROFILE.cv} external variant="primary" icon="external">{c.open}</Btn>
        </div>
      ) : (
        <object className="resume-frame" data={`${PROFILE.cv}#view=FitH&toolbar=0`} type="application/pdf" aria-label={c.page}>
          <div className="resume-fallback">
            <AppIcon id="cv" size={84} />
            <p>{c.fallback}</p>
            <Btn href={PROFILE.cv} external variant="primary" icon="external">{c.open}</Btn>
          </div>
        </object>
      )}
    </div>
  );
}
