import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { useSystem } from '../os/system.jsx';
import { CONTACT_KEYS as K, PROFILE, SOCIALS } from '../data.js';
import { Glyph, SocialIcon } from '../os/icons.jsx';

/* load Google reCAPTCHA only once someone starts using the form */
function loadRecaptcha() {
  if (window.grecaptcha?.render || document.querySelector('script[data-recaptcha]')) return;
  const s = document.createElement('script');
  s.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
  s.async = true;
  s.defer = true;
  s.dataset.recaptcha = '1';
  document.head.appendChild(s);
}

/* Mail: a "new message" window. Sends with EmailJS + invisible reCAPTCHA v2 (same flow as before). */
export default function Mail({ win, subject: presetSubject }) {
  const sys = useSystem();
  const { t } = sys;
  const c = t.contact;
  const m = t.os.mail;
  const formRef = useRef(null);
  const boxRef = useRef(null);
  const widget = useRef(null);
  const pending = useRef(null);
  const [status, setStatus] = useState({ state: 'idle', msg: '' });

  // opened from "Pitch me this" (Collaborate): fill the subject and jump to the message
  useEffect(() => {
    const f = formRef.current;
    if (!f || !presetSubject) return;
    f.subject.value = presetSubject;
    loadRecaptcha();
    const tm = setTimeout(() => f.message.focus({ preventScroll: true }), 350);
    return () => clearTimeout(tm);
  }, [presetSubject, win.propsKey]);

  const send = async (params) => {
    try {
      await emailjs.send(K.serviceId, K.templateToOwner, params);
      await emailjs.send(K.serviceId, K.templateAutoreply, params);
      setStatus({ state: 'ok', msg: c.msg.ok });
      formRef.current?.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus({ state: 'err', msg: `${c.msg.err} ${PROFILE.email}.` });
    } finally {
      if (widget.current !== null) window.grecaptcha?.reset(widget.current);
    }
  };
  const sendRef = useRef(send);
  sendRef.current = send;

  useEffect(() => {
    emailjs.init({ publicKey: K.publicKey });
    const render = () => {
      if (widget.current !== null || !window.grecaptcha?.render || !boxRef.current) return;
      try {
        widget.current = window.grecaptcha.render(boxRef.current, {
          sitekey: K.recaptchaSiteKey,
          size: 'invisible',
          badge: 'bottomright',
          callback: (token) => {
            const params = pending.current;
            pending.current = null;
            if (params) sendRef.current({ ...params, 'g-recaptcha-response': token });
          },
        });
        if (pending.current) window.grecaptcha.execute(widget.current);
      } catch (err) { console.error('reCAPTCHA render error:', err); }
    };
    window.onRecaptchaLoad = render;
    if (window.grecaptcha?.render) render();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const f = formRef.current;
    const name = f.from_name.value.trim();
    const email = f.from_email.value.trim();
    const subject = f.subject.value.trim() || c.msg.noSubject;
    const message = f.message.value.trim();
    if (!name || !email || !message) return setStatus({ state: 'err', msg: c.msg.missing });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setStatus({ state: 'err', msg: c.msg.badEmail });
    const params = { name, from_name: name, email, from_email: email, reply_to: email, subject, title: subject, message };
    setStatus({ state: 'sending', msg: '' });
    pending.current = params;
    if (widget.current !== null) window.grecaptcha.execute(widget.current);
    else if (!document.querySelector('script[data-recaptcha]')) { pending.current = null; send(params); }
  };

  const sending = status.state === 'sending';

  return (
    <div className="app mail">
      <form ref={formRef} className="mail-form" onSubmit={onSubmit} onFocus={loadRecaptcha} noValidate>
        <div className="toolbar">
          <strong className="toolbar-t">{m.newMessage}</strong>
          <button className="btn btn-primary btn-sm" type="submit" disabled={sending}>
            {sending ? <><span className="spinner" />{c.form.sending}</> : status.state === 'ok' ? c.form.sent : <><Glyph name="send" size={13} />{c.form.send}</>}
          </button>
        </div>
        <div className="mail-fields">
          <div className="mail-row">
            <span className="mail-k">{m.to}:</span>
            <span className="mail-to"><span className="mail-chip">{PROFILE.name}</span><span className="mail-addr">&lt;{PROFILE.email}&gt;</span></span>
            <button type="button" className="mail-copy" onClick={sys.copyEmail} title={m.copy} aria-label={m.copy}><Glyph name="copy" size={13} /></button>
          </div>
          <label className="mail-row"><span className="mail-k">{c.form.name}:</span><input name="from_name" autoComplete="name" required /></label>
          <label className="mail-row"><span className="mail-k">{c.form.email}:</span><input name="from_email" type="email" autoComplete="email" required /></label>
          <label className="mail-row"><span className="mail-k">{c.form.subject}:</span><input name="subject" /></label>
        </div>
        <textarea name="message" className="mail-body" placeholder={`${c.form.message}…`} aria-label={c.form.message} required />
        <div ref={boxRef} />
        {status.msg && <p className={`mail-status is-${status.state}`} role="status">{status.msg}</p>}
        <p className="mail-legal">
          {c.legal[0]} <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">{c.legal[1]}</a> {c.legal[2]}{' '}
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">{c.legal[3]}</a> {c.legal[4]}
        </p>
      </form>

      <aside className="mail-side">
        <p className="kicker">{c.eyebrow}</p>
        <h2 className="mail-h">{c.title.replace(/\*/g, '')}</h2>
        <span className="side-t">{m.direct}</span>
        <button className="contact-row" onClick={sys.copyEmail}><Glyph name="copy" size={14} /><span>{PROFILE.email}</span></button>
        <a className="contact-row" href={PROFILE.whatsappLink} target="_blank" rel="noopener noreferrer"><SocialIcon name="WhatsApp" size={14} /><span>{PROFILE.whatsapp}</span></a>
        <div className="contact-row is-static"><Glyph name="pin" size={14} /><span>{c.locationValue}</span></div>
        <div className="contact-row is-static ok"><i className="dot-live" /><span>{c.statusValue}</span></div>
        <div className="mail-socials">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}><SocialIcon name={s.label} size={16} /></a>
          ))}
        </div>
      </aside>
    </div>
  );
}
