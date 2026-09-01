// ==UserScript==
// @name         リスナビ 着信自動応答
// @namespace    lisnavi-auto-answer
// @version      0.1.0
// @description  リスナビ(lisnavi.com)にログイン中、着信があったら自動で応答ボタンを押す
// @match        https://lisnavi.com/*
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
  'use strict';

  // ---------------------------------------------------------------
  // 設定
  // ---------------------------------------------------------------

  // 「応答」ボタンとして扱うテキストの候補。
  // 実際の着信中DOMを確認したら、ここを実物のテキスト/クラス名に合わせて調整する。
  const ANSWER_BUTTON_TEXT_PATTERNS = [/^応答$/, /^出る$/, /^応答する$/, /^通話開始$/];

  // 誤クリック防止: 直近でクリックしてから何ms は再クリックしない
  const CLICK_COOLDOWN_MS = 3000;

  // 有効/無効の状態はブラウザに保存し、Tampermonkeyメニューから切り替えられるようにする
  const STORAGE_KEY = 'lisnavi-auto-answer-enabled';

  let enabled = GM_getValue(STORAGE_KEY, true);
  let lastClickAt = 0;

  function log(...args) {
    console.log('[リスナビ自動応答]', ...args);
  }

  function setEnabled(next) {
    enabled = next;
    GM_setValue(STORAGE_KEY, enabled);
    log(enabled ? '有効化しました' : '無効化しました');
  }

  GM_registerMenuCommand('自動応答のON/OFFを切り替え', () => setEnabled(!enabled));

  // ---------------------------------------------------------------
  // 「応答」ボタンを探してクリックする
  // ---------------------------------------------------------------

  function findAnswerButton() {
    const candidates = document.querySelectorAll('button, [role="button"]');
    for (const el of candidates) {
      const text = (el.innerText || el.textContent || '').trim();
      if (!text) continue;
      if (ANSWER_BUTTON_TEXT_PATTERNS.some((re) => re.test(text))) {
        // 非表示(disabled/画面外)のボタンは無視
        if (el.disabled) continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) continue;
        return el;
      }
    }
    return null;
  }

  function tryAutoAnswer(trigger) {
    if (!enabled) return;

    const now = Date.now();
    if (now - lastClickAt < CLICK_COOLDOWN_MS) return;

    const btn = findAnswerButton();
    if (!btn) return;

    lastClickAt = now;
    log(`着信を検知(${trigger})。応答ボタンをクリックします。`, btn);
    btn.click();
  }

  // ---------------------------------------------------------------
  // 検知方法1: 着信音(audio要素)の再生を検知する
  // ---------------------------------------------------------------

  const origPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function (...args) {
    try {
      tryAutoAnswer('audio-play:' + (this.currentSrc || this.src || 'unknown'));
    } catch (e) {
      log('audio hook error', e);
    }
    return origPlay.apply(this, args);
  };

  // ページ内に既にある/後から追加される audio 要素にも念のためイベントを張る
  function hookAudioElement(el) {
    el.addEventListener('play', () => tryAutoAnswer('audio-event'));
  }
  document.querySelectorAll('audio').forEach(hookAudioElement);

  // ---------------------------------------------------------------
  // 検知方法2: DOMの変化を監視して「応答」ボタンの出現を検知する
  // ---------------------------------------------------------------

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type !== 'childList' || m.addedNodes.length === 0) continue;
      for (const node of m.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        if (node.tagName === 'AUDIO') hookAudioElement(node);
        node.querySelectorAll && node.querySelectorAll('audio').forEach(hookAudioElement);
      }
      tryAutoAnswer('dom-mutation');
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  log('起動しました。状態:', enabled ? '有効' : '無効');
})();
