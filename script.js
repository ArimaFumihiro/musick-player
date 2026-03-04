'use strict';

const $ = (e) => document.getElementById(e);

const $hamburger = $('hamburger')
const $nav = $('navigation')
const $theme = $('theme');
const $selectTheme = $('selectTheme');
const $random = $('random');
const $drum = $('drum');
const $drumSelect = $('drum-select');
const $musicTitle = $('music-title');
const $standByNext = $('next-standBy-bgm');
const $admissionNext = $('next-admission-bgm');
const $closingNext = $('next-closing-bgm');
const $btnStandBy = $('standBy');
const $btnAdmission = $('admission');
const $btnClosing = $('closing');
const $standByText = $('standBy-text');
const $admissionText = $('admission-text');
const $closingText = $('closing-text');
const $standByShapes = $('standBy-shapes');
const $admissionShapes = $('admission-shapes');
const $closingShapes = $('closing-shapes');
const $thisBgm = $('this-bgm');
const $bgm = $('bgm-audio');

const bgm = {
  standBy: [
    { id: 'sb01', title: '待機曲 01', path: 'standBy_title_01' },
    { id: 'sb02', title: '待機曲 02', path: 'standBy_title_02' },
    { id: 'sb03', title: '待機曲 03', path: 'standBy_title_03' },
    { id: 'sb04', title: '待機曲 04', path: 'standBy_title_04' },
    { id: 'sb05', title: '待機曲 05', path: 'standBy_title_05' },
    { id: 'sb06', title: '待機曲 06', path: 'standBy_title_06' },
    { id: 'sb07', title: '待機曲 07', path: 'standBy_title_07' },
  ],

  admission: [
    { id: 'ad01', title: '入場曲 01', path: 'admission_title_01' },
    { id: 'ad02', title: '入場曲 02', path: 'admission_title_02' },
    { id: 'ad03', title: '入場曲 03', path: 'admission_title_03' },
    { id: 'ad04', title: '入場曲 04', path: 'admission_title_04' },
    { id: 'ad05', title: '入場曲 05', path: 'admission_title_05' },
    { id: 'ad06', title: '入場曲 06', path: 'admission_title_06' },
  ],

  closing: [
    { id: 'cl01', title: '閉会曲 01', path: 'closing_title_01' },
    { id: 'cl02', title: '閉会曲 02', path: 'closing_title_02' },
    { id: 'cl03', title: '閉会曲 03', path: 'closing_title_03' },
    { id: 'cl04', title: '閉会曲 04', path: 'closing_title_04' },
  ],

  drumRoll: [
    { id: 'dr01', title: 'Short', path: 'drumRoll_title_01' },
    { id: 'dr02', title: 'Medium', path: 'drumRoll_title_02' },
    { id: 'dr03', title: 'Long', path: 'drumRoll_title_03' },
  ],
};

const settings = {
  theme: false,
  random: false,
  drum: 'Medium',

  standByNext: '待機曲 01',
  admissionNext: '入場曲 01',
  closingNext: '閉会曲 01',
  drumRollNext: 'Medium',

  playing: null,
  thisBgm: '',

  standByBtnText: '待機',
  admissionBtnText: '入場',
  closingBtnText: '閉会',
  stopText: '停止',

  btnStandBy: '待機',
  btnAdmission: '入場',
  btnClosing: '閉会',

  drumRollState: true,
  standByState: true,
  admissionState: true,
  closingState: true,
};

// 予約曲順リスト
const playListManager = {
  standBy: {
    queue: [
      { id: 'sb01', title: '待機曲 01', path: 'standBy_title_01' },
      { id: 'sb02', title: '待機曲 02', path: 'standBy_title_02' },
      { id: 'sb03', title: '待機曲 03', path: 'standBy_title_03' },
      { id: 'sb04', title: '待機曲 04', path: 'standBy_title_04' },
      { id: 'sb05', title: '待機曲 05', path: 'standBy_title_05' },
      { id: 'sb06', title: '待機曲 06', path: 'standBy_title_06' },
      { id: 'sb07', title: '待機曲 07', path: 'standBy_title_07' }
    ], index: 0
  },
  admission: {
    queue: [
      { id: 'ad01', title: '入場曲 01', path: 'admission_title_01' },
      { id: 'ad02', title: '入場曲 02', path: 'admission_title_02' },
      { id: 'ad03', title: '入場曲 03', path: 'admission_title_03' },
      { id: 'ad04', title: '入場曲 04', path: 'admission_title_04' },
      { id: 'ad05', title: '入場曲 05', path: 'admission_title_05' },
      { id: 'ad06', title: '入場曲 06', path: 'admission_title_06' }
    ], index: 0
  },
  closing: {
    queue: [
      { id: 'cl01', title: '閉会曲 01', path: 'closing_title_01' },
      { id: 'cl02', title: '閉会曲 02', path: 'closing_title_02' },
      { id: 'cl03', title: '閉会曲 03', path: 'closing_title_03' },
      { id: 'cl04', title: '閉会曲 04', path: 'closing_title_04' }
    ], index: 0
  }
};

// ----------------------------------------
// UI反映
// ----------------------------------------
function applySettingsToUI() {
  $selectTheme.checked = settings.theme;
  $theme.className = settings.theme ? 'theme-dark' : 'theme';
  $random.checked = settings.random;
  $standByNext.textContent = settings.standByNext;
  $admissionNext.textContent = settings.admissionNext;
  $closingNext.textContent = settings.closingNext;
  $drum.value = settings.drumRollNext;
  $thisBgm.textContent = settings.thisBgm;
  $standByText.textContent = settings.btnStandBy;
  $standByShapes.className = settings.standByState ? 'icon-play' : 'icon-stop';
  $admissionText.textContent = settings.btnAdmission;
  $admissionShapes.className = settings.admissionState ? 'icon-play' : 'icon-stop';
  $closingText.textContent = settings.btnClosing;
  $closingShapes.className = settings.closingState ? 'icon-play' : 'icon-stop';
}

function updateSetting(key, value) {
  settings[key] = value;
  applySettingsToUI();
}

// ----------------------------------------
// 再生
// ----------------------------------------
function playSound() {
  const s = settings.playing;
  s?.play().catch(err => {
    console.log("再生エラー", err);
  });
}

function whatNow(category, next) {
  const targetTitle = settings[next];
  const foundTrack = bgm[category].find(track => track.title === targetTitle);
  if (!foundTrack) return;

  settings.playing = new Audio(`./bgm/${category}/${foundTrack.path}.mp3`);
  settings.thisBgm = foundTrack.title;

  settings.playing.onended = () => {
    if (category === 'drumRoll') {
      settings.drumRollState = true;
      settings.thisBgm = '';
      buttonChange(true, 'drumRollBtnText', 'btnDrumRoll'); // drumRollはbuttonChangeの対象外なので直接更新
      applySettingsToUI();
      setButtonsState(false);
    } else {
      getNextTrack(category);
      whatNow(category, next);
      playSound();
    }
  };
}

// ----------------------------------------
// 停止（iOS対応）
// ----------------------------------------
function stopAudio(audioRef) {
  const s = audioRef;
  if (!s) return;

  s.onended = null; // 自動連続再生を止める

  const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent);

  if (isIOS) {
    // iOSはvolumeプロパティが読み取り専用なのでフェードなしで即停止
    s.pause();
    s.currentTime = 0;
  } else {
    const FADE_OUT_DURATION = 1500;
    const interval = 100;
    const currentVol = s.volume; // ← 修正：s.volumeから取得
    const step = Math.max(0.001, currentVol / (FADE_OUT_DURATION / interval));

    const fadeOutInterval = setInterval(() => {
      if (s.volume > step) {
        s.volume -= step;
      } else {
        s.volume = 0;
        s.pause();
        clearInterval(fadeOutInterval);
      }
    }, interval);
  }
}

// ----------------------------------------
// ボタン表示切り替え
// ----------------------------------------
function buttonChange(bool, textKey, btnKey) {
  const result = !bool ? settings[textKey] : settings.stopText;
  settings[btnKey] = result;
  applySettingsToUI();
}

// ----------------------------------------
// ボタン有効・無効
// ----------------------------------------
const allButtons = [$btnStandBy, $btnAdmission, $btnClosing, $drum];

function setButtonsState(bool, currentBtnId) {
  allButtons.forEach(btn => {
    if (btn !== currentBtnId) {
      btn.disabled = bool;
      btn.style.opacity = bool ? "0.5" : "1.0";
      btn.style.cursor = bool ? "not-allowed" : "pointer";
    }
  });
}

// ----------------------------------------
// 次の曲を取得
// ----------------------------------------
function getNextTrack(category) {
  const manager = playListManager[category];
  manager.index++;

  if (manager.index >= manager.queue.length) {
    manager.queue = settings.random ? shuffle(bgm[category]) : [...bgm[category]];
    manager.index = 0;
  }

  settings[`${category}Next`] = manager.queue[manager.index].title;
  applySettingsToUI();
}

// ----------------------------------------
// シャッフル
// ----------------------------------------
function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// ----------------------------------------
// イベントリスナー
// ----------------------------------------
$hamburger.addEventListener('click', () => {
  $hamburger.classList.toggle('is-active');
  $nav.classList.toggle('is-active');
});

$selectTheme.addEventListener('change', () => {
  updateSetting('theme', $selectTheme.checked);
});

// $random は1つだけ
$random.addEventListener('change', (e) => {
  const isRandom = e.target.checked;
  settings.random = isRandom;

  const categories = ['standBy', 'admission', 'closing'];
  categories.forEach(cat => {
    playListManager[cat].queue = isRandom ? shuffle(bgm[cat]) : [...bgm[cat]];
    playListManager[cat].index = 0;
    settings[`${cat}Next`] = playListManager[cat].queue[0].title;
  });

  applySettingsToUI();
});

$drumSelect.addEventListener('change', (e) => {
  const selectedTitle = e.target.value;
  const foundTrack = bgm.drumRoll.find(track => track.title === selectedTitle);
  if (foundTrack) {
    settings.drumRollNext = foundTrack.title;
  }
});

$btnStandBy.addEventListener('click', () => {
  let bool = settings.standByState;

  if (bool) {
    setButtonsState(true, $btnStandBy);
    whatNow('standBy', 'standByNext');
    playSound();
    getNextTrack('standBy');
  } else {
    const audioToStop = settings.playing;
    settings.playing = null;
    settings.thisBgm = '';
    stopAudio(audioToStop);
    setButtonsState(false);
  }

  settings.standByState = !bool;
  buttonChange(bool, 'standByBtnText', 'btnStandBy');
});

$btnAdmission.addEventListener('click', () => {
  let bool = settings.admissionState;

  if (bool) {
    setButtonsState(true, $btnAdmission);
    whatNow('admission', 'admissionNext');
    getNextTrack('admission');
    playSound();
  } else {
    const audioToStop = settings.playing;
    settings.playing = null;
    settings.thisBgm = '';
    stopAudio(audioToStop);
    setButtonsState(false);
  }

  settings.admissionState = !bool;
  buttonChange(bool, 'admissionBtnText', 'btnAdmission');
});

$btnClosing.addEventListener('click', () => {
  let bool = settings.closingState;

  if (bool) {
    setButtonsState(true, $btnClosing);
    whatNow('closing', 'closingNext');
    getNextTrack('closing');
    playSound();
  } else {
    const audioToStop = settings.playing;
    settings.playing = null;
    settings.thisBgm = '';
    stopAudio(audioToStop);
    setButtonsState(false);
  }

  settings.closingState = !bool;
  buttonChange(bool, 'closingBtnText', 'btnClosing');
});

$drum.addEventListener('click', () => {
  let bool = settings.drumRollState;

  if (bool) {
    setButtonsState(true, $drum);
    whatNow('drumRoll', 'drumRollNext');
    playSound();
  } else {
    const audioToStop = settings.playing;
    settings.playing = null;
    settings.thisBgm = '';
    stopAudio(audioToStop);
    setButtonsState(false);
  }

  settings.drumRollState = !bool;
});
