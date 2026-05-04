import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

/* ═══════════════════════════════════════════
   FONTS
═══════════════════════════════════════════ */
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Bebas+Neue&family=JetBrains+Mono:wght@300;400;500&display=swap');
`;

/* ═══════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════ */
const CSS = `
${FONTS}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#08080c;
  --ink2:#0f0f15;
  --ink3:#17171f;
  --ink4:#1f1f2a;
  --glass:rgba(255,255,255,0.032);
  --glass2:rgba(255,255,255,0.055);
  --wire:rgba(255,255,255,0.07);
  --wire2:rgba(255,255,255,0.12);
  --text:#f2ede3;
  --soft:rgba(242,237,227,0.5);
  --dim:rgba(242,237,227,0.2);
  --ghost:rgba(242,237,227,0.08);
  --volt:#d4ff47;
  --volt2:rgba(212,255,71,0.12);
  --volt3:rgba(212,255,71,0.06);
  --cyan:#47e5ff;
  --cyan2:rgba(71,229,255,0.1);
  --red:#ff4757;
  --orange:#ffa040;
  --fh:'Bebas Neue',sans-serif;
  --fb:'Space Grotesk',sans-serif;
  --fm:'JetBrains Mono',monospace;
}
html{scroll-behavior:smooth}
body{
  background:var(--ink);
  color:var(--text);
  font-family:var(--fb);
  min-height:100vh;
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
  cursor:default;
}

/* ── SCROLLBAR ── */
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--wire2);border-radius:4px}

/* ── NOISE OVERLAY ── */
.noise{
  position:fixed;inset:0;z-index:1000;pointer-events:none;opacity:0.018;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:128px;
}

/* ── CANVAS ── */
#bg-canvas{position:fixed;inset:0;z-index:0;opacity:0.7;pointer-events:none}

/* ── SHELL ── */
.shell{
  position:relative;z-index:1;
  min-height:100vh;display:flex;
}

/* ═══════════════════
   SIDEBAR
═══════════════════ */
.sidebar{
  width:64px;
  flex-shrink:0;
  border-right:1px solid var(--wire);
  display:flex;flex-direction:column;
  align-items:center;
  padding:20px 0;
  gap:8px;
  background:rgba(8,8,12,0.6);
  backdrop-filter:blur(20px);
  position:sticky;top:0;height:100vh;
}
.sb-logo{
  width:36px;height:36px;border-radius:10px;
  overflow:hidden;
  display:flex;align-items:center;justify-content:center;
  margin-bottom:16px;flex-shrink:0;
}
.sb-logo svg{width:36px;height:36px;display:block}
.sb-divider{width:24px;height:1px;background:var(--wire);margin:8px 0}
.sb-icon{
  width:36px;height:36px;border-radius:9px;
  display:flex;align-items:center;justify-content:center;
  color:var(--dim);cursor:pointer;font-size:15px;
  transition:all 0.15s;position:relative;
}
.sb-icon:hover{background:var(--glass);color:var(--text)}
.sb-icon.active{background:var(--volt2);color:var(--volt)}
.sb-icon-tip{
  position:absolute;left:calc(100% + 10px);
  background:var(--ink3);border:1px solid var(--wire2);
  border-radius:6px;padding:4px 9px;
  font-size:11px;color:var(--text);white-space:nowrap;
  opacity:0;pointer-events:none;transition:opacity 0.15s;
  font-family:var(--fb);
}
.sb-icon:hover .sb-icon-tip{opacity:1}

/* ═══════════════════
   MAIN
═══════════════════ */
.main{flex:1;display:flex;flex-direction:column;overflow-x:hidden}

/* ── TOP BAR ── */
.topbar{
  height:52px;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 32px;
  border-bottom:1px solid var(--wire);
  background:rgba(8,8,12,0.5);
  backdrop-filter:blur(20px);
  position:sticky;top:0;z-index:100;
  flex-shrink:0;
}
.tb-left{display:flex;align-items:center;gap:16px}
.tb-breadcrumb{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--dim)}
.tb-breadcrumb span{color:var(--soft)}
.tb-sep{opacity:0.3}
.tb-right{display:flex;align-items:center;gap:10px}
.tb-chip{
  display:flex;align-items:center;gap:5px;
  font-size:11px;font-family:var(--fm);
  color:var(--dim);
  padding:4px 9px;border-radius:6px;
  border:1px solid var(--wire);
  background:var(--ghost);
  cursor:pointer;transition:all 0.15s;
}
.tb-chip:hover{border-color:var(--wire2);color:var(--soft)}
.tb-chip.volt{color:var(--volt);border-color:rgba(212,255,71,0.2);background:var(--volt3)}
.chip-dot{width:5px;height:5px;border-radius:50%;background:#22c55e;animation:cpulse 2s infinite}
@keyframes cpulse{0%,100%{opacity:1}50%{opacity:0.3}}

/* ── HERO STRIP ── */
.hero-strip{
  padding:52px 32px 36px;
  border-bottom:1px solid var(--wire);
  position:relative;overflow:hidden;
}
.hero-strip::before{
  content:'';position:absolute;top:-60px;right:-80px;
  width:400px;height:400px;border-radius:50%;
  background:radial-gradient(circle,rgba(212,255,71,0.055) 0%,transparent 65%);
  pointer-events:none;
}
.hero-strip::after{
  content:'';position:absolute;bottom:-40px;left:200px;
  width:300px;height:300px;border-radius:50%;
  background:radial-gradient(circle,rgba(71,229,255,0.03) 0%,transparent 70%);
  pointer-events:none;
}
.hs-inner{max-width:1040px;margin:0 auto;display:grid;grid-template-columns:1fr auto;gap:40px;align-items:flex-start}
.hs-left{}
.hs-tag{
  display:inline-flex;align-items:center;gap:7px;
  font-family:var(--fm);font-size:10px;letter-spacing:0.15em;
  color:var(--volt);text-transform:uppercase;margin-bottom:18px;
}
.hs-tag-bar{width:20px;height:1px;background:var(--volt);opacity:0.5}
.hs-title{
  font-family:var(--fh);
  font-size:clamp(52px,7vw,96px);
  line-height:0.92;letter-spacing:0.01em;
  margin-bottom:6px;
}
.hs-title .outline{
  -webkit-text-stroke:1px rgba(242,237,227,0.2);
  color:transparent;
}
.hs-title .volt{color:var(--volt)}
.hs-sub{
  font-size:14px;color:var(--soft);line-height:1.65;
  max-width:460px;font-weight:300;margin-top:14px;
}

/* Right stat cluster */
.hs-stats{display:flex;flex-direction:column;gap:2px;padding-top:8px}
.hs-stat{
  display:flex;align-items:center;justify-content:space-between;
  gap:32px;padding:10px 14px;border-radius:10px;
  border:1px solid var(--wire);
  background:var(--glass);
  min-width:180px;
}
.hs-stat-l{font-size:10px;color:var(--dim);font-family:var(--fm);text-transform:uppercase;letter-spacing:0.08em}
.hs-stat-r{font-family:var(--fh);font-size:22px;color:var(--text);letter-spacing:0.02em}

/* ── INPUT COMMAND ── */
.cmd-section{padding:28px 32px;border-bottom:1px solid var(--wire);background:rgba(8,8,12,0.2)}
.cmd-inner{max-width:1040px;margin:0 auto}
.cmd-label{
  font-family:var(--fm);font-size:10px;letter-spacing:0.12em;
  color:var(--dim);text-transform:uppercase;margin-bottom:10px;
  display:flex;align-items:center;gap:8px;
}
.cmd-label::after{content:'Press Enter to run';font-size:10px;color:var(--ghost);margin-left:auto}
.cmd-bar{
  display:flex;align-items:center;
  background:var(--ink2);
  border:1px solid var(--wire2);
  border-radius:12px;
  overflow:hidden;
  transition:border-color 0.2s,box-shadow 0.2s;
  position:relative;
}
.cmd-bar:focus-within{
  border-color:rgba(212,255,71,0.35);
  box-shadow:0 0 0 3px rgba(212,255,71,0.05),0 0 60px rgba(212,255,71,0.04);
}
.cmd-prompt{
  padding:0 16px;
  font-family:var(--fm);font-size:13px;color:var(--volt);
  display:flex;align-items:center;gap:6px;flex-shrink:0;
  border-right:1px solid var(--wire);height:52px;
}
.cmd-inp{
  flex:1;background:transparent;border:none;outline:none;
  padding:0 18px;height:52px;
  font-size:15px;font-family:var(--fb);color:var(--text);
  font-weight:400;min-width:0;
}
.cmd-inp::placeholder{color:var(--dim)}
.cmd-actions{display:flex;align-items:center;gap:6px;padding-right:8px;flex-shrink:0}
.cmd-kbd{
  font-family:var(--fm);font-size:10px;color:var(--dim);
  padding:3px 7px;border-radius:4px;
  border:1px solid var(--wire);background:var(--ghost);
}
.cmd-btn{
  background:var(--volt);color:var(--ink);
  border:none;border-radius:8px;
  padding:10px 22px;
  font-size:13px;font-weight:700;font-family:var(--fb);
  cursor:pointer;white-space:nowrap;
  transition:all 0.15s;
  display:flex;align-items:center;gap:7px;
  position:relative;overflow:hidden;letter-spacing:0.01em;
}
.cmd-btn::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,255,255,0.2) 0%,transparent 60%);
}
.cmd-btn:hover{background:#e2ff6a;transform:translateY(-1px);box-shadow:0 6px 24px rgba(212,255,71,0.3)}
.cmd-btn:active{transform:scale(0.97)}
.cmd-btn:disabled{opacity:0.35;cursor:not-allowed;transform:none;box-shadow:none}

/* suggestions */
.cmd-suggestions{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
.cmd-sug{
  font-family:var(--fm);font-size:11px;color:var(--dim);
  padding:4px 10px;border-radius:6px;border:1px solid var(--wire);
  background:var(--ghost);cursor:pointer;
  transition:all 0.15s;
}
.cmd-sug:hover{border-color:var(--wire2);color:var(--soft);background:var(--glass)}

/* ── CONTENT AREA ── */
.content{flex:1;padding:28px 32px 60px;max-width:1040px;margin:0 auto;width:100%}

/* ── SCAN LOADER ── */
.scan-wrap{
  background:var(--ink2);
  border:1px solid var(--wire2);
  border-radius:14px;
  overflow:hidden;
  position:relative;
}
.scan-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 20px;border-bottom:1px solid var(--wire);
}
.scan-title{font-family:var(--fm);font-size:12px;color:var(--volt);letter-spacing:0.08em}
.scan-timer{font-family:var(--fm);font-size:12px;color:var(--dim)}
.scan-beam{
  position:absolute;top:0;left:-100%;width:40%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(212,255,71,0.035),transparent);
  animation:sbeam 1.8s ease-in-out infinite;
}
@keyframes sbeam{to{left:130%}}
.scan-body{padding:20px}
.scan-steps{display:flex;flex-direction:column;gap:12px}
.sstep{display:flex;align-items:center;gap:14px}
.sstep-num{
  width:24px;height:24px;border-radius:6px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--fm);font-size:10px;
}
.sstep-num.done{background:var(--volt2);color:var(--volt);border:1px solid rgba(212,255,71,0.25)}
.sstep-num.active{background:var(--glass);border:1px solid var(--wire2);color:var(--text);animation:spin 1.4s linear infinite}
.sstep-num.wait{background:var(--ghost);border:1px solid var(--wire);color:var(--dim);opacity:0.5}
@keyframes spin{to{transform:rotate(360deg)}}
.sstep-info{flex:1}
.sstep-name{font-size:13px;font-weight:500}
.sstep-sub{font-size:11px;color:var(--dim);font-family:var(--fm);margin-top:1px}
.sstep-tag{font-family:var(--fm);font-size:11px}
.sstep-tag.done{color:var(--volt)}
.sstep-tag.active{color:var(--dim);animation:flik 1s infinite}
@keyframes flik{0%,100%{opacity:1}50%{opacity:0.2}}
.scan-progress-bar{height:2px;background:var(--wire);margin-top:20px;border-radius:2px;overflow:hidden}
.scan-progress-fill{height:100%;background:linear-gradient(90deg,var(--volt),var(--cyan));border-radius:2px;transition:width 0.6s ease}

/* ── RESULTS ── */
.results-anim{animation:slideUp 0.5s cubic-bezier(0.22,1,0.36,1)}
@keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}

/* Score hero row */
.score-row{display:grid;grid-template-columns:220px 1fr 200px;gap:12px;margin-bottom:12px}

/* Score card */
.sc-card{
  background:var(--ink2);border:1px solid var(--wire2);
  border-radius:14px;padding:24px 20px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  position:relative;overflow:hidden;
}
.sc-card::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(circle at 50% 100%,rgba(212,255,71,0.07) 0%,transparent 60%);
}
.sc-ring{position:relative;width:120px;height:120px;margin-bottom:10px;flex-shrink:0}
.sc-ring svg{transform:rotate(-90deg)}
.sc-ring-num{
  position:absolute;inset:0;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
}
.sc-num{font-family:var(--fh);font-size:38px;line-height:1;letter-spacing:0.02em}
.sc-denom{font-family:var(--fm);font-size:10px;color:var(--dim);margin-top:1px}
.sc-label{font-family:var(--fm);font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:var(--dim)}
.sc-badge{
  font-family:var(--fm);font-size:10px;font-weight:500;
  padding:3px 10px;border-radius:100px;margin-top:6px;
  text-transform:uppercase;letter-spacing:0.08em;
}

/* Radar card */
.radar-card{
  background:var(--ink2);border:1px solid var(--wire2);
  border-radius:14px;padding:20px;
  display:flex;flex-direction:column;
  position:relative;
}
.card-ttl{font-family:var(--fm);font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:var(--dim);margin-bottom:14px}
.radar-wrap{flex:1;display:flex;align-items:center;justify-content:center}

/* Trend card */
.trend-card{
  background:var(--ink2);border:1px solid var(--wire2);
  border-radius:14px;padding:20px;
  display:flex;flex-direction:column;gap:10px;
}
.trend-metrics{display:flex;flex-direction:column;gap:6px}
.tmet{display:flex;align-items:center;justify-content:space-between;font-size:12px}
.tmet-l{color:var(--dim);font-family:var(--fm)}
.tmet-r{font-weight:600}
.mini-spark{height:32px;margin-top:4px}
.mini-spark svg{width:100%;height:100%}

/* Tabs */
.tabs{display:flex;gap:2px;background:var(--ink2);border:1px solid var(--wire2);border-radius:10px;padding:3px;margin-bottom:12px}
.tab{
  flex:1;padding:8px 12px;border-radius:7px;
  background:transparent;border:none;cursor:pointer;
  font-size:12px;font-family:var(--fb);font-weight:500;
  color:var(--dim);transition:all 0.18s;
  display:flex;align-items:center;justify-content:center;gap:6px;
  white-space:nowrap;
}
.tab:hover{color:var(--soft);background:var(--glass)}
.tab.on{background:var(--ink4);color:var(--text);box-shadow:0 1px 4px rgba(0,0,0,0.5)}
.tab.on .tdot{opacity:1}
.tdot{width:5px;height:5px;border-radius:50%;background:var(--volt);opacity:0;transition:opacity 0.18s;flex-shrink:0}
.tpanel{animation:slideUp 0.3s ease}

/* SEO table */
.panel-card{background:var(--ink2);border:1px solid var(--wire2);border-radius:14px;overflow:hidden}
.panel-head{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--wire)}
.panel-ht{font-family:var(--fm);font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:var(--dim)}
.panel-hbadge{font-family:var(--fm);font-size:10px;color:var(--dim);padding:2px 8px;border-radius:4px;border:1px solid var(--wire);background:var(--ghost)}
.seo-table{width:100%;border-collapse:collapse}
.seo-th{font-family:var(--fm);font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:var(--dim);padding:10px 20px;text-align:left;border-bottom:1px solid var(--wire)}
.seo-tr{transition:background 0.1s}
.seo-tr:hover{background:var(--glass)}
.seo-tr:last-child td{border-bottom:none}
.seo-td{padding:11px 20px;border-bottom:1px solid var(--wire);font-size:13px}
.seo-key-cell{display:flex;align-items:center;gap:8px;color:var(--soft);text-transform:capitalize}
.seo-indicator{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.seo-val{font-weight:500;text-align:right;color:var(--text)}
.seo-bar-cell{width:80px}
.seo-mini-bar{height:3px;border-radius:2px;background:var(--wire);overflow:hidden}
.seo-mini-fill{height:100%;border-radius:2px}

/* Insight cards */
.ins-grid{display:flex;flex-direction:column;gap:10px}
.ins-sec{background:var(--ink2);border:1px solid var(--wire2);border-radius:14px;overflow:hidden}
.ins-sec-head{
  display:flex;align-items:center;gap:10px;
  padding:13px 18px;border-bottom:1px solid var(--wire);
}
.ins-sec-icon{
  width:26px;height:26px;border-radius:7px;
  display:flex;align-items:center;justify-content:center;
  font-size:13px;flex-shrink:0;
  background:var(--volt2);
}
.ins-sec-title{font-family:var(--fm);font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:var(--volt);flex:1}
.ins-sec-ct{font-family:var(--fm);font-size:10px;color:var(--dim);padding:2px 7px;border-radius:4px;border:1px solid var(--wire)}
.ins-items{padding:12px 18px 16px;display:flex;flex-direction:column;gap:7px}
.ins-item{display:flex;gap:11px;align-items:flex-start}
.ins-n{
  width:19px;height:19px;border-radius:5px;
  background:var(--ink4);border:1px solid var(--wire2);
  display:flex;align-items:center;justify-content:center;
  font-family:var(--fm);font-size:9px;color:var(--dim);
  flex-shrink:0;margin-top:1px;
}
.ins-body{flex:1}
.ins-l{font-size:13px;font-weight:500;color:var(--text);line-height:1.35}
.ins-d{font-size:12px;color:var(--soft);line-height:1.6;margin-top:2px;font-weight:300}

/* History panel */
.hist-list{display:flex;flex-direction:column;gap:8px}
.hist-item{
  display:flex;align-items:center;gap:12px;
  padding:11px 14px;border-radius:10px;
  background:var(--glass);border:1px solid var(--wire);
  cursor:pointer;transition:all 0.15s;
}
.hist-item:hover{border-color:var(--wire2);background:var(--glass2)}
.hist-score{
  font-family:var(--fh);font-size:22px;letter-spacing:0.02em;
  flex-shrink:0;width:42px;text-align:center;
}
.hist-info{flex:1;min-width:0}
.hist-url{font-size:12px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hist-time{font-family:var(--fm);font-size:10px;color:var(--dim);margin-top:1px}
.hist-arrow{color:var(--dim);font-size:14px}
.hist-empty{
  font-family:var(--fm);font-size:12px;color:var(--dim);
  text-align:center;padding:40px 20px;
  border:1px dashed var(--wire);border-radius:10px;
}

/* Export button */
.export-btn{
  display:flex;align-items:center;gap:6px;
  padding:6px 13px;border-radius:7px;
  background:transparent;border:1px solid var(--wire2);
  font-size:11px;font-family:var(--fm);color:var(--dim);
  cursor:pointer;transition:all 0.15s;
  text-transform:uppercase;letter-spacing:0.08em;
}
.export-btn:hover{border-color:var(--volt);color:var(--volt);background:var(--volt3)}

/* Toast */
.toast{
  position:fixed;bottom:28px;right:28px;z-index:9000;
  background:var(--ink3);border:1px solid var(--wire2);
  border-radius:10px;padding:12px 18px;
  display:flex;align-items:center;gap:10px;
  font-size:13px;font-family:var(--fb);
  box-shadow:0 12px 40px rgba(0,0,0,0.5);
  animation:toastIn 0.3s cubic-bezier(0.22,1,0.36,1);
}
@keyframes toastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.toast-icon{font-size:16px}

/* Kbd shortcut hint */
.kbd-bar{
  display:flex;align-items:center;gap:16px;
  padding:8px 0;margin-top:4px;
}
.kbd-hint{display:flex;align-items:center;gap:5px;font-family:var(--fm);font-size:10px;color:var(--dim)}
.kbd{
  padding:2px 6px;border-radius:4px;border:1px solid var(--wire);
  background:var(--ghost);font-size:10px;color:var(--soft);
}

/* Animated counter */
.counter{display:inline-block;min-width:2ch;text-align:right}

/* ── FOOTER ── */
.footer{
  border-top:1px solid var(--wire);
  padding:14px 32px;
  display:flex;align-items:center;justify-content:space-between;
  font-family:var(--fm);font-size:10px;color:var(--dim);
  flex-shrink:0;
  letter-spacing:0.04em;
}

/* ── RESPONSIVE ── */
@media(max-width:900px){
  .sidebar{display:none}
  .score-row{grid-template-columns:1fr 1fr;grid-template-rows:auto auto}
  .radar-card{grid-column:1/-1}
  .hs-inner{grid-template-columns:1fr}
  .hs-stats{flex-direction:row;flex-wrap:wrap}
  .hs-stat{min-width:140px}
  .content{padding:20px 20px 40px}
  .topbar,.cmd-section,.hero-strip{padding-left:20px;padding-right:20px}
  .footer{padding:14px 20px}
}
@media(max-width:600px){
  .score-row{grid-template-columns:1fr}
  .tabs{overflow-x:auto}
  .tab{font-size:11px;padding:7px 10px}
}
`;

/* ═══════════════════════════════════════════
   PARTICLE / GRID CANVAS
═══════════════════════════════════════════ */
function BgCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d');
    let raf, t = 0;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const COLS = 22, ROWS = 14;
    const nodes = Array.from({ length: COLS * ROWS }, (_, i) => ({
      bx: ((i % COLS) / (COLS - 1)) * c.width,
      by: (Math.floor(i / COLS) / (ROWS - 1)) * (c.height * 0.65),
      ph: Math.random() * Math.PI * 2,
      sp: 0.25 + Math.random() * 0.4,
      am: 1.5 + Math.random() * 3,
    }));
    const draw = () => {
      c.width = c.width; // clear
      t += 0.006;
      const pos = nodes.map(n => ({
        x: n.bx + Math.sin(t * n.sp + n.ph) * n.am,
        y: n.by + Math.cos(t * n.sp * 0.7 + n.ph) * n.am,
      }));
      // Lines
      for (let i = 0; i < nodes.length; i++) {
        const { x, y } = pos[i];
        if ((i + 1) % COLS !== 0) {
          const n = pos[i + 1];
          ctx.strokeStyle = 'rgba(212,255,71,0.038)';
          ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(n.x, n.y); ctx.stroke();
        }
        if (i + COLS < nodes.length) {
          const n = pos[i + COLS];
          ctx.strokeStyle = 'rgba(212,255,71,0.025)';
          ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(n.x, n.y); ctx.stroke();
        }
      }
      // Dots
      pos.forEach((p, i) => {
        const pulse = (Math.sin(t * nodes[i].sp + nodes[i].ph) + 1) / 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.7 + pulse * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,255,71,${0.07 + pulse * 0.13})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas id="bg-canvas" ref={ref} />;
}

/* ═══════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════ */
const WORDS = ['GROWTH', 'TRAFFIC', 'RANKINGS', 'REVENUE'];
function Typewriter() {
  const [idx, setIdx] = useState(0);
  const [s, setS] = useState('');
  const [d, setD] = useState(false);
  useEffect(() => {
    const w = WORDS[idx];
    let t;
    if (!d && s.length < w.length) t = setTimeout(() => setS(w.slice(0, s.length + 1)), 90);
    else if (!d) t = setTimeout(() => setD(true), 2000);
    else if (d && s.length > 0) t = setTimeout(() => setS(s.slice(0, -1)), 50);
    else { setD(false); setIdx((idx + 1) % WORDS.length); }
    return () => clearTimeout(t);
  }, [s, d, idx]);
  return (
    <span className="volt" style={{ borderRight: '3px solid var(--volt)', paddingRight: 2, animation: 'blink 1s step-end infinite' }}>
      {s || '\u00a0'}
    </span>
  );
}

/* ═══════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════ */
function AnimCounter({ target, duration = 1200 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return <span className="counter">{val}</span>;
}

/* ═══════════════════════════════════════════
   RADAR CHART  (SVG)
═══════════════════════════════════════════ */
const RADAR_LABELS = ['SEO', 'Speed', 'Content', 'Mobile', 'Links', 'UX'];
function RadarChart({ score }) {
  const cx = 90, cy = 90, r = 68;
  const vals = score > 0
    ? [score, score * 0.85, score * 0.92, score * 0.78, score * 0.65, score * 0.88].map(v => Math.min(v / 100, 1))
    : RADAR_LABELS.map(() => 0);
  const pts = RADAR_LABELS.map((_, i) => {
    const angle = (i / RADAR_LABELS.length) * Math.PI * 2 - Math.PI / 2;
    return {
      gx: cx + Math.cos(angle) * r,
      gy: cy + Math.sin(angle) * r,
      vx: cx + Math.cos(angle) * r * vals[i],
      vy: cy + Math.sin(angle) * r * vals[i],
    };
  });
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const polyPts = pts.map(p => `${p.vx},${p.vy}`).join(' ');
  return (
    <svg viewBox="0 0 180 180" width="160" height="160">
      {/* Grid */}
      {gridLevels.map(lv => (
        <polygon key={lv}
          points={RADAR_LABELS.map((_, i) => {
            const a = (i / RADAR_LABELS.length) * Math.PI * 2 - Math.PI / 2;
            return `${cx + Math.cos(a) * r * lv},${cy + Math.sin(a) * r * lv}`;
          }).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"
        />
      ))}
      {/* Axes */}
      {pts.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.gx} y2={p.gy} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}
      {/* Data fill */}
      <polygon points={polyPts} fill="rgba(212,255,71,0.1)" stroke="rgba(212,255,71,0.6)" strokeWidth="1.5" strokeLinejoin="round" style={{ transition: 'all 1s ease' }} />
      {/* Dots */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.vx} cy={p.vy} r="3" fill="var(--volt)" opacity="0.8" style={{ transition: 'all 1s ease' }} />
      ))}
      {/* Labels */}
      {RADAR_LABELS.map((lb, i) => {
        const a = (i / RADAR_LABELS.length) * Math.PI * 2 - Math.PI / 2;
        const lx = cx + Math.cos(a) * (r + 14);
        const ly = cy + Math.sin(a) * (r + 14);
        return (
          <text key={lb} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fill: 'rgba(242,237,227,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {lb}
          </text>
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════════════════
   SPARKLINE
═══════════════════════════════════════════ */
function Spark({ color = 'var(--volt)', vals }) {
  const W = 200, H = 40;
  const mn = Math.min(...vals), mx = Math.max(...vals), range = mx - mn || 1;
  const sx = i => (i / (vals.length - 1)) * W;
  const sy = v => H - ((v - mn) / range) * (H - 4) - 2;
  const d = vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${sx(i)},${sy(v)}`).join(' ');
  const f = d + ` L${W},${H} L0,${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="spkfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={f} fill="url(#spkfill)" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={sx(vals.length - 1)} cy={sy(vals[vals.length - 1])} r="2.5" fill={color} />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   LOADER
═══════════════════════════════════════════ */
const SCAN_STEPS = [
  { icon: '◎', name: 'Crawling page', sub: 'Fetching HTML, headers & resources' },
  { icon: '◈', name: 'Scoring SEO signals', sub: 'Analyzing 40+ technical factors' },
  { icon: '◆', name: 'Running AI analysis', sub: 'Generating strategic growth insights' },
];
function ScanLoader({ step }) {
  const pct = Math.round(((step + 0.5) / SCAN_STEPS.length) * 100);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setElapsed(e => e + 0.1), 100);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="scan-wrap">
      <div className="scan-header">
        <span className="scan-title">◎ SCANNING</span>
        <span className="scan-timer">{elapsed.toFixed(1)}s</span>
      </div>
      <div className="scan-beam" />
      <div className="scan-body">
        <div className="scan-steps">
          {SCAN_STEPS.map((s, i) => {
            const st = i < step ? 'done' : i === step ? 'active' : 'wait';
            return (
              <div className="sstep" key={i}>
                <div className={`sstep-num ${st}`}>{st === 'done' ? '✓' : s.icon}</div>
                <div className="sstep-info">
                  <div className="sstep-name" style={{ color: st === 'wait' ? 'var(--dim)' : 'var(--text)' }}>{s.name}</div>
                  <div className="sstep-sub">{s.sub}</div>
                </div>
                <div className={`sstep-tag ${st}`}>{st === 'done' ? 'DONE' : st === 'active' ? 'RUNNING' : '—'}</div>
              </div>
            );
          })}
        </div>
        <div className="scan-progress-bar">
          <div className="scan-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PARSE INSIGHTS
═══════════════════════════════════════════ */
function parseInsights(text) {
  if (!text) return [];
  const sections = []; let cur = null;
  const ICONS = ['📈', '✍️', '⚡', '🔗', '📱', '🎯', '💡', '🚀'];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const isH = (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) || /^#{1,3}\s/.test(line);
    if (isH) {
      const title = line.replace(/^\*{2}|\*{2}$/g, '').replace(/^#{1,3}\s+/, '').trim();
      cur = { title, icon: ICONS[sections.length % ICONS.length], items: [] };
      sections.push(cur);
    } else if (cur && /^(\d+\.|[-*+])\s+/.test(line)) {
      const full = line.replace(/^(\d+\.|[-*+])\s+/, '');
      let label = full, desc = '';
      const bci = full.indexOf('**:');
      if (bci > -1 && full.startsWith('**')) { label = full.slice(2, bci); desc = full.slice(bci + 4).trim(); }
      else label = full.replace(/\*{2}/g, '').trim();
      cur.items.push({ label, desc });
    } else if (cur && /^\t+[-*+]\s+/.test(raw)) {
      const last = cur.items[cur.items.length - 1];
      if (last) last.desc += (last.desc ? ' · ' : '') + raw.replace(/^\t+[-*+]\s+/, '').replace(/\*{2}/g, '').trim();
    }
  }
  return sections.filter(s => s.items.length > 0);
}

/* ═══════════════════════════════════════════
   TOAST
═══════════════════════════════════════════ */
function Toast({ msg, icon = '✓', onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, []);
  return (
    <div className="toast">
      <span className="toast-icon">{icon}</span>
      <span style={{ fontSize: 13 }}>{msg}</span>
    </div>
  );
}

const SUGGESTIONS = ['apple.com', 'shopify.com', 'notion.so', 'stripe.com', 'linear.app'];

/* ═══════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════ */
export default function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [tab, setTab] = useState(0);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);
  const [sideTab, setSideTab] = useState(0); // 0=audit, 1=history
  const inputRef = useRef(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (url && !loading) analyze();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [url, loading]);

  const analyze = async (overrideUrl) => {
    const target = overrideUrl || url;
    if (!target) return;
    setUrl(target);
    setLoading(true); setResult(null); setScanStep(0); setTab(0);
    const t1 = setTimeout(() => setScanStep(1), 1000);
    const t2 = setTimeout(() => setScanStep(2), 2100);
    try {
      const res = await axios.post('https://growthlens-ai-backend.onrender.com/analyze', { url: target });
      clearTimeout(t1); clearTimeout(t2);
      setResult(res.data);
      setHistory(h => [{ url: target, score: res.data.seo_score, time: new Date() }, ...h.slice(0, 9)]);
      setToast({ msg: 'Audit complete', icon: '✓' });
    } catch {
      setToast({ msg: 'Connection error — is your server running?', icon: '⚠' });
    }
    setLoading(false);
  };

  const exportReport = () => {
    if (!result) return;
    const txt = `GrowthLens AI Report\nURL: ${url}\nSEO Score: ${result.seo_score}/100\n\n${JSON.stringify(result.seo_details, null, 2)}\n\n${result.ai_insights}`;
    const blob = new Blob([txt], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `growthlens-${url.replace(/[^a-z0-9]/gi, '-')}.txt`; a.click();
    setToast({ msg: 'Report exported', icon: '↓' });
  };

  const scoreColor = (s) => s > 70 ? 'var(--volt)' : s > 40 ? 'var(--orange)' : 'var(--red)';
  const score = result?.seo_score ?? 0;
  const sections = result ? parseInsights(result.ai_insights) : [];
  const half = Math.ceil(sections.length / 2);
  const sparkVals = [22, 38, 30, 52, 44, 60, 55, 68, 62, 74, 70, score || 0];

  return (
    <>
      <style>{CSS}</style>
      <BgCanvas />
      <div className="noise" />

      <div className="shell">
        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sb-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
              <rect width="64" height="64" rx="14" fill="#C8FB4A"/>
              <path d="M18 42 L30 28 L38 34 L48 20" stroke="#111" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="42,20 48,20 48,26" fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="sb-divider" />
          {[
            { icon: '◎', tip: 'Audit' },
            { icon: '◷', tip: 'History' },
            { icon: '◈', tip: 'Compare' },
            { icon: '◉', tip: 'Settings' },
          ].map((s, i) => (
            <div key={i} className={`sb-icon ${sideTab === i ? 'active' : ''}`} onClick={() => setSideTab(i)}>
              {s.icon}
              <span className="sb-icon-tip">{s.tip}</span>
            </div>
          ))}
        </aside>

        {/* ── MAIN ── */}
        <main className="main">
          {/* TOP BAR */}
          <div className="topbar">
            <div className="tb-left">
              <div className="tb-breadcrumb">
                <span>GrowthLens</span>
                <span className="tb-sep">/</span>
                <span>{sideTab === 0 ? 'Audit' : sideTab === 1 ? 'History' : 'Compare'}</span>
              </div>
            </div>
            <div className="tb-right">
              <div className="tb-chip"><span className="chip-dot" />Live</div>
              {result && (
                <button className="export-btn" onClick={exportReport}>↓ Export</button>
              )}
              <div className="tb-chip volt">⌘K to focus</div>
            </div>
          </div>

          {/* HERO STRIP */}
          <div className="hero-strip">
            <div className="hs-inner">
              <div className="hs-left">
                <div className="hs-tag"><span className="hs-tag-bar" />SEO + AI Growth Engine</div>
                <div className="hs-title">
                  UNLOCK<br />
                  <Typewriter /><br />
                  <span className="outline">WITH DATA</span>
                </div>
                <p className="hs-sub">Drop any URL. Get your full SEO audit, technical breakdown, and AI growth strategy in under 5 seconds.</p>
              </div>
              <div className="hs-stats">
                {[
                  ['40+', 'SEO factors'],
                  ['< 5s', 'Scan time'],
                  [history.length.toString(), 'Audits run'],
                ].map(([n, l]) => (
                  <div className="hs-stat" key={l}>
                    <span className="hs-stat-l">{l}</span>
                    <span className="hs-stat-r">{n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COMMAND INPUT */}
          <div className="cmd-section">
            <div className="cmd-inner">
              <div className="cmd-label">Target URL</div>
              <div className="cmd-bar">
                <div className="cmd-prompt">
                  <span style={{ opacity: 0.5 }}>$</span>
                  <span>audit</span>
                </div>
                <input ref={inputRef} className="cmd-inp" type="text"
                  placeholder="https://yourwebsite.com"
                  value={url} onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && analyze()} />
                <div className="cmd-actions">
                  <span className="cmd-kbd">↵</span>
                  <button className="cmd-btn" onClick={() => analyze()} disabled={loading || !url}>
                    {loading ? '◎ Running...' : '↗ Run Audit'}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="cmd-suggestions">
                  {SUGGESTIONS.map(s => (
                    <div key={s} className="cmd-sug" onClick={() => { setUrl(`https://${s}`); analyze(`https://${s}`); }}>
                      {s}
                    </div>
                  ))}
                </div>
                <div className="kbd-bar">
                  <div className="kbd-hint"><span className="kbd">⌘</span><span className="kbd">K</span><span>Focus</span></div>
                  <div className="kbd-hint"><span className="kbd">⌘</span><span className="kbd">↵</span><span>Run</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="content">
            {/* HISTORY VIEW */}
            {sideTab === 1 && (
              <div className="tpanel">
                <div style={{ fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                  Audit History ({history.length})
                </div>
                {history.length === 0
                  ? <div className="hist-empty">No audits yet — run your first scan above</div>
                  : (
                    <div className="hist-list">
                      {history.map((h, i) => (
                        <div className="hist-item" key={i} onClick={() => { setUrl(h.url); setSideTab(0); analyze(h.url); }}>
                          <div className="hist-score" style={{ color: scoreColor(h.score) }}>{h.score}</div>
                          <div className="hist-info">
                            <div className="hist-url">{h.url}</div>
                            <div className="hist-time">{h.time.toLocaleTimeString()}</div>
                          </div>
                          <div className="hist-arrow">↗</div>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>
            )}

            {/* AUDIT VIEW */}
            {sideTab === 0 && (
              <>
                {loading && <ScanLoader step={scanStep} />}

                {result && (
                  <div className="results-anim">
                    {/* TOP ROW */}
                    <div className="score-row">
                      {/* Score ring */}
                      <div className="sc-card">
                        <div className="sc-ring">
                          <svg width="120" height="120" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                            <circle cx="60" cy="60" r="52" fill="none"
                              stroke={scoreColor(score)} strokeWidth="7"
                              strokeDasharray={2 * Math.PI * 52}
                              strokeDashoffset={2 * Math.PI * 52 * (1 - score / 100)}
                              strokeLinecap="round"
                              transform="rotate(-90 60 60)"
                              style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)' }} />
                          </svg>
                          <div className="sc-ring-num">
                            <div className="sc-num" style={{ color: scoreColor(score) }}>
                              <AnimCounter target={score} />
                            </div>
                            <div className="sc-denom">/100</div>
                          </div>
                        </div>
                        <div className="sc-label">SEO Score</div>
                        <div className="sc-badge" style={{
                          background: score > 70 ? 'rgba(212,255,71,0.1)' : score > 40 ? 'rgba(255,160,64,0.1)' : 'rgba(255,71,87,0.1)',
                          color: scoreColor(score)
                        }}>
                          {score > 70 ? 'Excellent' : score > 40 ? 'Moderate' : 'Needs Work'}
                        </div>
                      </div>

                      {/* Radar */}
                      <div className="radar-card">
                        <div className="card-ttl">Performance Radar</div>
                        <div className="radar-wrap">
                          <RadarChart score={score} />
                        </div>
                      </div>

                      {/* Trend */}
                      <div className="trend-card">
                        <div className="card-ttl">Signal Trend</div>
                        <div className="trend-metrics">
                          {[
                            ['Score', score, scoreColor(score)],
                            ['Signals', Object.keys(result.seo_details).length, 'var(--cyan)'],
                          ].map(([l, v, c]) => (
                            <div className="tmet" key={l}>
                              <span className="tmet-l">{l}</span>
                              <span className="tmet-r" style={{ color: c }}>{v}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mini-spark">
                          <Spark color={scoreColor(score)} vals={sparkVals} />
                        </div>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--dim)', marginTop: 6, textAlign: 'right' }}>
                          ↑ SIMULATED TREND
                        </div>
                      </div>
                    </div>

                    {/* TABS */}
                    <div className="tabs">
                      {['SEO Breakdown', 'AI Insights', 'Growth Plan', 'Quick Wins'].map((t, i) => (
                        <button key={t} className={`tab ${tab === i ? 'on' : ''}`} onClick={() => setTab(i)}>
                          <span className="tdot" />{t}
                        </button>
                      ))}
                    </div>

                    {/* TAB: SEO */}
                    {tab === 0 && (
                      <div className="tpanel panel-card">
                        <div className="panel-head">
                          <span className="panel-ht">Technical SEO Signals</span>
                          <span className="panel-hbadge">{Object.keys(result.seo_details).length} factors</span>
                        </div>
                        <table className="seo-table">
                          <thead>
                            <tr>
                              <th className="seo-th">Signal</th>
                              <th className="seo-th" style={{ textAlign: 'right' }}>Value</th>
                              <th className="seo-th" style={{ width: 90 }}>Rating</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(result.seo_details).map(([k, v]) => {
                              const vs = String(v).toLowerCase();
                              const good = vs.includes('yes') || vs.includes('found') || vs.includes('pass') || vs.includes('present');
                              const bad = vs.includes('no') || vs.includes('missing') || vs.includes('fail') || vs.includes('absent');
                              const c = good ? 'var(--volt)' : bad ? 'var(--red)' : 'var(--cyan)';
                              const fillPct = good ? 90 : bad ? 20 : 55;
                              return (
                                <tr key={k} className="seo-tr">
                                  <td className="seo-td">
                                    <div className="seo-key-cell">
                                      <span className="seo-indicator" style={{ background: c }} />
                                      {k.replace(/_/g, ' ')}
                                    </div>
                                  </td>
                                  <td className="seo-td seo-val">{v}</td>
                                  <td className="seo-td seo-bar-cell">
                                    <div className="seo-mini-bar">
                                      <div className="seo-mini-fill" style={{ width: `${fillPct}%`, background: c }} />
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* TAB: AI INSIGHTS */}
                    {tab === 1 && (
                      <div className="tpanel ins-grid">
                        {sections.slice(0, half).length > 0
                          ? sections.slice(0, half).map((s, i) => (
                            <div key={i} className="ins-sec">
                              <div className="ins-sec-head">
                                <div className="ins-sec-icon">{s.icon}</div>
                                <div className="ins-sec-title">{s.title}</div>
                                <div className="ins-sec-ct">{s.items.length}</div>
                              </div>
                              <div className="ins-items">
                                {s.items.map((item, j) => (
                                  <div key={j} className="ins-item">
                                    <div className="ins-n">{j + 1}</div>
                                    <div className="ins-body">
                                      <div className="ins-l">{item.label}</div>
                                      {item.desc && <div className="ins-d">{item.desc}</div>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                          : <div className="panel-card" style={{ padding: 24 }}>
                            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--soft)', fontWeight: 300 }}>{result.ai_insights}</p>
                          </div>
                        }
                      </div>
                    )}

                    {/* TAB: GROWTH PLAN */}
                    {tab === 2 && (
                      <div className="tpanel ins-grid">
                        {sections.slice(half).map((s, i) => (
                          <div key={i} className="ins-sec">
                            <div className="ins-sec-head">
                              <div className="ins-sec-icon">{s.icon}</div>
                              <div className="ins-sec-title">{s.title}</div>
                              <div className="ins-sec-ct">{s.items.length}</div>
                            </div>
                            <div className="ins-items">
                              {s.items.map((item, j) => (
                                <div key={j} className="ins-item">
                                  <div className="ins-n">{j + 1}</div>
                                  <div className="ins-body">
                                    <div className="ins-l">{item.label}</div>
                                    {item.desc && <div className="ins-d">{item.desc}</div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        {sections.slice(half).length === 0 && (
                          <div className="hist-empty">Run an audit to see your growth plan</div>
                        )}
                      </div>
                    )}

                    {/* TAB: QUICK WINS */}
                    {tab === 3 && (
                      <div className="tpanel">
                        <div className="ins-grid">
                          {[
                            { icon: '⚡', title: 'High Impact, Low Effort', color: 'var(--volt)', items: sections.flatMap(s => s.items).slice(0, 3) },
                            { icon: '🎯', title: 'Top Priority Actions', color: 'var(--cyan)', items: sections.flatMap(s => s.items).slice(3, 6) },
                          ].map((g, gi) => (
                            g.items.length > 0 && (
                              <div key={gi} className="ins-sec">
                                <div className="ins-sec-head">
                                  <div className="ins-sec-icon" style={{ background: `${g.color}20` }}>{g.icon}</div>
                                  <div className="ins-sec-title" style={{ color: g.color }}>{g.title}</div>
                                  <div className="ins-sec-ct">{g.items.length}</div>
                                </div>
                                <div className="ins-items">
                                  {g.items.map((item, j) => (
                                    <div key={j} className="ins-item">
                                      <div className="ins-n">{j + 1}</div>
                                      <div className="ins-body">
                                        <div className="ins-l">{item.label}</div>
                                        {item.desc && <div className="ins-d">{item.desc}</div>}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          ))}
                          {sections.length === 0 && <div className="hist-empty">Run an audit to see quick wins</div>}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!result && !loading && (
                  <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'var(--fm)', color: 'var(--dim)', fontSize: 12 }}>
                    <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>◎</div>
                    Enter a URL above to run your first audit
                  </div>
                )}
              </>
            )}
          </div>

          {/* FOOTER */}
          <footer className="footer">
            <span>GROWTHLENS AI © 2026</span>
            <span>BUILT BY SHUBHAM MARWADE · {history.length} AUDITS THIS SESSION</span>
          </footer>
        </main>
      </div>

      {toast && <Toast msg={toast.msg} icon={toast.icon} onDone={() => setToast(null)} />}
    </>
  );
}