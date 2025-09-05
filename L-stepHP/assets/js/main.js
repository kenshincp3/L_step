document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Smooth scroll for in-page links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Simple mailto handler for contact form
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailTo = (window.CONTACT_EMAIL || 'info@example.com').trim();
      if (emailTo === 'info@example.com') {
        alert('CONTACT_EMAIL を貴社の受信メールに変更してください（index.html の <script> 設定）。');
        return;
      }

      const hotel = (document.getElementById('hotel').value || '').trim();
      const name = (document.getElementById('name').value || '').trim();
      const addr = (document.getElementById('email').value || '').trim();
      const phone = (document.getElementById('phone').value || '').trim();
      const role = (document.getElementById('role')?.value || '').trim();
      const rooms = (document.getElementById('rooms')?.value || '').trim();
      const pain = (document.getElementById('pain')?.value || '').trim();
      const need = (document.getElementById('need')?.value || '').trim();
      const msg = (document.getElementById('message').value || '').trim();

      const subject = `無料相談: ${hotel || '旅館/ホテル名未入力'}`;
      const body = [
        `施設名: ${hotel}`,
        `ご担当者: ${name}`,
        `メール: ${addr}`,
        `電話: ${phone}`,
        `役職: ${role}`,
        `客室数: ${rooms}`,
        `課題: ${pain}`,
        `希望支援: ${need}`,
        '',
        'ご相談内容:',
        msg
      ].join('\n');

      const mailto = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      try { window.dataLayer && window.dataLayer.push({event:'lead_submit'}); } catch(e){}
    });
  }

  // Events for CTAs
  const diag = document.getElementById('hero-diagnosis');
  if (diag) diag.addEventListener('click', () => { try { window.dataLayer && window.dataLayer.push({event:'free_diagnosis_click'}); } catch(e){} });

  // Consent banner
  const banner = document.getElementById('cookie-banner');
  const accept = document.getElementById('cookie-accept');
  const deny = document.getElementById('cookie-deny');
  const choice = localStorage.getItem('consentChoice');
  const hideBanner = () => { if (banner) banner.style.display = 'none'; };
  const showBanner = () => { if (banner) banner.style.display = 'block'; };
  if (!choice) showBanner(); else hideBanner();
  if (accept) accept.addEventListener('click', () => {
    try { gtag('consent','update',{analytics_storage:'granted'}); } catch(e){}
    localStorage.setItem('consentChoice','granted');
    hideBanner();
  });
  if (deny) deny.addEventListener('click', () => {
    try { gtag('consent','update',{analytics_storage:'denied'}); } catch(e){}
    localStorage.setItem('consentChoice','denied');
    hideBanner();
  });

  // Ripple on buttons
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('pointerdown', e => {
      if (prefersReduced) return;
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--rx', (e.clientX - rect.left) + 'px');
      btn.style.setProperty('--ry', (e.clientY - rect.top) + 'px');
      btn.classList.remove('is-rippling'); void btn.offsetWidth; btn.classList.add('is-rippling');
      setTimeout(() => btn.classList.remove('is-rippling'), 620);
    });
  });

  // Reveal on scroll
  const reveals = [];
  document.querySelectorAll('.section, .hero .container').forEach(el => { el.classList.add('reveal'); reveals.push(el); });
  // Stagger: add reveal to staggered cards and set delays
  document.querySelectorAll('.grid.stagger').forEach(grid => {
    const cards = grid.querySelectorAll('.card');
    cards.forEach((c, i) => {
      c.classList.add('reveal');
      c.style.transitionDelay = `${i * 40}ms`;
      reveals.push(c);
    });
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        ent.target.classList.add('is-in');
        io.unobserve(ent.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  reveals.forEach(el => io.observe(el));

  // KPI Count Up
  const counters = document.querySelectorAll('.metric[data-count]');
  const io2 = new IntersectionObserver(entries => {
    entries.forEach(ent => {
      if (!ent.isIntersecting) return;
      const el = ent.target; const t = el.getAttribute('data-count') || '';
      const isPct = /%$/.test(t); const isH = /h$/.test(t);
      const target = parseInt(t.replace(/\D/g, '')) || 0;
      const start = performance.now(); const dur = 600;
      function tick(now){
        const p = Math.min(1, (now - start) / dur);
        const val = Math.floor(target * (0.5 - Math.cos(p*Math.PI)/2));
        el.textContent = isPct ? val + '%' : (isH ? val + 'h' : val.toLocaleString('ja-JP'));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io2.unobserve(el);
    });
  }, { threshold: .4 });
  counters.forEach(el => io2.observe(el));

  // Seasonal accent by month
  const m = (new Date()).getMonth()+1;
  const season = m<=2||m===12 ? 'winter' : m<=5 ? 'spring' : m<=8 ? 'summer' : 'autumn';
  document.documentElement.dataset.season = season;

  // Parallax for mist layers (lightweight)
  const pxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  let ticking = false;
  function onScroll(){
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      pxEls.forEach(el => {
        const ratio = parseFloat(el.getAttribute('data-parallax')||'0');
        const ty = Math.round(y * ratio);
        el.style.transform = `translate3d(0, ${ty}px, 0)`;
      });
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  // Card 3D tilt (pointer devices only, respects reduced-motion)
  const prefersHover = window.matchMedia('(hover:hover)').matches;
  if (prefersHover && !prefersReduced) {
    const cards = Array.from(document.querySelectorAll('.grid .card'));
    cards.forEach(card => {
      card.classList.add('tilt');
      // add shadow layer
      const shadow = document.createElement('span');
      shadow.className = 'tilt-shadow';
      card.appendChild(shadow);
      let raf = 0;
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        const rx = Math.max(-8, Math.min(8, -y * 14));
        const ry = Math.max(-8, Math.min(8,  x * 16));
        shadow.style.setProperty('--mx', `${(x+0.5)*100}%`);
        shadow.style.setProperty('--my', `${(y+0.5)*100}%`);
        card.classList.add('is-tilting');
        if (!raf) raf = requestAnimationFrame(() => {
          raf = 0;
          card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
      };
      const onLeave = () => {
        card.classList.remove('is-tilting');
        card.style.transform = '';
      };
      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);
    });
  }

  // Bullet items staggered reveal
  const liObserver = new IntersectionObserver(entries => {
    entries.forEach(ent => {
      if (!ent.isIntersecting) return;
      const li = ent.target; li.classList.add('is-in');
      liObserver.unobserve(li);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  document.querySelectorAll('.bullets li').forEach((li, i) => {
    li.style.transitionDelay = `${(i%6) * 40}ms`;
    liObserver.observe(li);
  });

  // Yukemuri puffs (floating steam)
  const puffBox = document.getElementById('yukemuri');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function spawnPuff(){
    if (!puffBox || reduce) return;
    const p = document.createElement('span');
    p.className = 'puff';
    const size = 60 + Math.random()*120; // 60-180px
    const x = Math.random()*100; // % across width
    const dx = (Math.random()*2 - 1) * 24; // -24..24px sideways
    const dur = 3600 + Math.random()*2600; // 3.6-6.2s
    const delay = Math.random()*600;
    p.style.setProperty('--size', size.toFixed(0)+'px');
    p.style.setProperty('--dx', dx.toFixed(1)+'px');
    p.style.setProperty('--dur', dur.toFixed(0)+'ms');
    p.style.left = `calc(${x.toFixed(2)}% - var(--size)/2)`;
    p.style.animationDelay = `${delay.toFixed(0)}ms`;
    puffBox.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
  if (puffBox && !reduce) {
    for (let i=0;i<8;i++) setTimeout(spawnPuff, i*300);
    setInterval(spawnPuff, 900);
  }

  // Bokeh dots
  const bokeh = document.getElementById('bokeh');
  function makeDot(){
    if (!bokeh || reduce) return;
    const d = document.createElement('span'); d.className='dot';
    const s = 12 + Math.random()*26; // 12-38px
    const x = Math.random()*100; const y = 20 + Math.random()*60; // 20-80% height
    const tx = (Math.random()*2-1) * 28; const ty = - (10 + Math.random()*30);
    const dur = 6000 + Math.random()*6000; const delay = Math.random()*1200;
    d.style.setProperty('--s', s.toFixed(0)+'px');
    d.style.setProperty('--tx', tx.toFixed(1)+'px');
    d.style.setProperty('--ty', ty.toFixed(1)+'px');
    d.style.setProperty('--d', dur.toFixed(0)+'ms');
    d.style.left = `calc(${x.toFixed(2)}% - var(--s)/2)`;
    d.style.top = `${y.toFixed(2)}%`;
    d.style.animationDelay = `${delay.toFixed(0)}ms`;
    bokeh.appendChild(d);
    setTimeout(()=>d.remove(), dur + delay + 1000);
  }
  if (bokeh && !reduce) {
    for(let i=0;i<10;i++) setTimeout(makeDot, i*200);
    setInterval(makeDot, 1200);
  }

  // Pointer parallax for depth
  const hero = document.querySelector('.hero');
  if (hero && !reduce) {
    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      const nx = (e.clientX - rect.left)/rect.width - 0.5; // -0.5..0.5
      const ny = (e.clientY - rect.top)/rect.height - 0.5;
      const offX = Math.round(nx * 12);
      const offY = Math.round(ny * 8);
      document.querySelectorAll('.mist-layer, #yukemuri, #bokeh, #cloudBank').forEach(el=>{
        el.style.transform = `translate3d(${offX}px, ${offY}px, 0)`;
      });
    });
    hero.addEventListener('pointerleave', () => {
      document.querySelectorAll('.mist-layer, #yukemuri, #bokeh, #cloudBank').forEach(el=>{
        el.style.transform = '';
      });
    });
  }

  // Cloud bank creation (big drifting clouds)
  const bank = document.getElementById('cloudBank');
  function makeCloud(){
    if (!bank || reduce) return;
    const c = document.createElement('span'); c.className='cloud';
    const w = 380 + Math.random()*520; // 380-900px
    const h = 160 + Math.random()*260; // 160-420px
    const startY = (Math.random()*40 - 10).toFixed(1) + '%'; // -10%..30%
    const endY = (parseFloat(startY) - (4 + Math.random()*10)).toFixed(1) + '%';
    const dur = 26000 + Math.random()*18000; // 26-44s
    const delay = Math.random()*4000;
    const scale = (0.9 + Math.random()*0.5).toFixed(2);
    const blur = (18 + Math.random()*16).toFixed(0)+'px';
    const opacity = (0.12 + Math.random()*0.18).toFixed(2);
    c.style.setProperty('--w', w.toFixed(0)+'px');
    c.style.setProperty('--h', h.toFixed(0)+'px');
    c.style.setProperty('--startX','-22%');
    c.style.setProperty('--endX','122%');
    c.style.setProperty('--startY', startY);
    c.style.setProperty('--endY', endY);
    c.style.setProperty('--dur', dur.toFixed(0)+'ms');
    c.style.setProperty('--delay', delay.toFixed(0)+'ms');
    c.style.setProperty('--scale', scale);
    c.style.setProperty('--blur', blur);
    c.style.setProperty('--o', opacity);
    bank.appendChild(c);
    // Cleanup after two cycles
    setTimeout(()=> c.remove(), dur*2 + delay + 1000);
  }
  if (bank && !reduce) {
    for(let i=0;i<6;i++) setTimeout(makeCloud, i*1200);
    setInterval(makeCloud, 5000);
  }

  // Front clouds over text
  const front = document.getElementById('cloudFront');
  function makeFrontCloud(){
    if (!front || reduce) return;
    const c = document.createElement('span'); c.className='cloud';
    const w = 320 + Math.random()*480; // 320-800px
    const h = 160 + Math.random()*240; // 160-400px
    const startY = (10 + Math.random()*20).toFixed(1) + '%'; // 10-30%
    const endY = (parseFloat(startY) - (2 + Math.random()*6)).toFixed(1) + '%';
    const dur = 16000 + Math.random()*14000; // 16-30s (前景はやや速い)
    const delay = Math.random()*2000;
    const scale = (1.0 + Math.random()*0.4).toFixed(2);
    const blur = (18 + Math.random()*12).toFixed(0)+'px';
    const opacity = (0.12 + Math.random()*0.16).toFixed(2);
    c.style.setProperty('--w', w.toFixed(0)+'px');
    c.style.setProperty('--h', h.toFixed(0)+'px');
    c.style.setProperty('--startX','-26%');
    c.style.setProperty('--endX','126%');
    c.style.setProperty('--startY', startY);
    c.style.setProperty('--endY', endY);
    c.style.setProperty('--dur', dur.toFixed(0)+'ms');
    c.style.setProperty('--delay', delay.toFixed(0)+'ms');
    c.style.setProperty('--scale', scale);
    c.style.setProperty('--blur', blur);
    c.style.setProperty('--o', opacity);
    front.appendChild(c);
    setTimeout(()=> c.remove(), dur*2 + delay + 1000);
  }
  if (front && !reduce) {
    for(let i=0;i<4;i++) setTimeout(makeFrontCloud, i*1500);
    setInterval(makeFrontCloud, 4200);
  }
});
