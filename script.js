(function () {
  "use strict";

  // Elements
  const dobEl = document.getElementById("dob");
  const tobEl = document.getElementById("tob");
  const liveModeEl = document.getElementById("liveMode");
  const useBirthTimeForNextEl = document.getElementById("useBirthTimeForNext");
  const formEl = document.getElementById("ageForm");
  const resetBtn = document.getElementById("resetBtn");
  const formErrorEl = document.getElementById("formError");

  const ageYMD = document.getElementById("ageYMD");
  const bornWeekday = document.getElementById("bornWeekday");
  const zodiacWestern = document.getElementById("zodiacWestern");
  const zodiacChinese = document.getElementById("zodiacChinese");

  const totalMonths = document.getElementById("totalMonths");
  const totalWeeks = document.getElementById("totalWeeks");
  const totalDays = document.getElementById("totalDays");
  const totalHours = document.getElementById("totalHours");
  const totalMinutes = document.getElementById("totalMinutes");
  const totalSeconds = document.getElementById("totalSeconds");

  const nbDays = document.getElementById("nbDays");
  const nbHours = document.getElementById("nbHours");
  const nbMinutes = document.getElementById("nbMinutes");
  const nbSeconds = document.getElementById("nbSeconds");
  const nbProgress = document.getElementById("nbProgress");
  const nextBirthdayDate = document.getElementById("nextBirthdayDate");
  const birthdayMessage = document.getElementById("birthdayMessage");

  const m10k = document.getElementById("m10k");
  const m1bSec = document.getElementById("m1bSec");
  const mHalf = document.getElementById("mHalf");

  const shareBtn = document.getElementById("shareBtn");
  const themeToggle = document.getElementById("themeToggle");

  let liveTimer = null;

  // Helpers
  const ONE = {
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000
  };

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function parseDateTime(dobStr, tobStr) {
    if (!dobStr) return null;
    const [y, m, d] = dobStr.split("-").map(Number);
    let h = 0, min = 0;
    if (tobStr && /^\d{2}:\d{2}$/.test(tobStr)) {
      [h, min] = tobStr.split(":").map(Number);
    }
    return new Date(y, (m - 1), d, h, min, 0, 0);
  }

  function isValidDOB(d) {
    if (!(d instanceof Date) || isNaN(d)) return false;
    const now = new Date();
    return d <= now && d.getFullYear() >= 1900; // practical bounds
  }

  function addMonths(date, months) {
    const d = new Date(date);
    const targetMonth = d.getMonth() + months;
    const year = d.getFullYear() + Math.floor(targetMonth / 12);
    const month = ((targetMonth % 12) + 12) % 12;

    const result = new Date(year, month, Math.min(d.getDate(), daysInMonth(year, month)), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    return result;
  }

  function daysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  function diffCalendar(dob, now) {
    // Years
    let years = now.getFullYear() - dob.getFullYear();
    const beforeBirthdayThisYear =
      now.getMonth() < dob.getMonth() ||
      (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate()) ||
      (now.getMonth() === dob.getMonth() && now.getDate() === dob.getDate() && now.getHours() < dob.getHours()) ||
      (now.getMonth() === dob.getMonth() && now.getDate() === dob.getDate() && now.getHours() === dob.getHours() && now.getMinutes() < dob.getMinutes());

    if (beforeBirthdayThisYear) years--;

    // Months
    let months = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
    const beforeDayInMonth = now.getDate() < dob.getDate() ||
      (now.getDate() === dob.getDate() && (now.getHours() < dob.getHours() ||
        (now.getHours() === dob.getHours() && now.getMinutes() < dob.getMinutes())));
    if (beforeDayInMonth) months--;

    // Days: difference after removing full months
    const monthStart = addMonths(dob, months);
    const dayMs = now - monthStart;
    const days = Math.floor(dayMs / ONE.day);

    // Hours/minutes/seconds remainder after days
    const dayRemainderMs = dayMs - days * ONE.day;
    const hours = Math.floor(dayRemainderMs / ONE.hour);
    const minutes = Math.floor((dayRemainderMs - hours * ONE.hour) / ONE.minute);
    const seconds = Math.floor((dayRemainderMs - hours * ONE.hour - minutes * ONE.minute) / ONE.second);

    return { years, months: months % 12, days, hours, minutes, seconds };
  }

  function getNextBirthday(dob, from, useBirthTime) {
    const base = new Date(from);
    let target = new Date(from.getFullYear(), dob.getMonth(), dob.getDate(), useBirthTime ? dob.getHours() : 0, useBirthTime ? dob.getMinutes() : 0, 0, 0);

    if (isNaN(target)) {
      // handle Feb 29 on non-leap year: set to Feb 28
      const month = dob.getMonth();
      const day = dob.getDate();
      if (month === 1 && day === 29) {
        target = new Date(from.getFullYear(), 1, 28, useBirthTime ? dob.getHours() : 0, useBirthTime ? dob.getMinutes() : 0);
      }
    }

    if (target <= base) {
      const nextYear = from.getFullYear() + 1;
      target = new Date(nextYear, dob.getMonth(), dob.getDate(), useBirthTime ? dob.getHours() : 0, useBirthTime ? dob.getMinutes() : 0, 0, 0);
      if (dob.getMonth() === 1 && dob.getDate() === 29 && isNaN(target)) {
        target = new Date(nextYear, 1, 28, useBirthTime ? dob.getHours() : 0, useBirthTime ? dob.getMinutes() : 0);
      }
    }

    const msTotalYear = target - new Date(target.getFullYear() - 1, target.getMonth(), target.getDate(), target.getHours(), target.getMinutes());
    const msFromPrevBirthday = base - new Date(target.getFullYear() - 1, target.getMonth(), target.getDate(), target.getHours(), target.getMinutes());

    return { target, diffMs: target - base, progress: Math.max(0, Math.min(1, msFromPrevBirthday / msTotalYear)) };
  }

  function formatCountdown(ms) {
    const days = Math.floor(ms / ONE.day);
    ms -= days * ONE.day;
    const hours = Math.floor(ms / ONE.hour);
    ms -= hours * ONE.hour;
    const minutes = Math.floor(ms / ONE.minute);
    ms -= minutes * ONE.minute;
    const seconds = Math.floor(ms / ONE.second);
    return { days, hours, minutes, seconds };
  }

  function weekdayStr(d) {
    try {
      return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    } catch {
      const w = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()];
      return `${w} ${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    }
  }

  function getWesternZodiac(d) {
    const m = d.getMonth() + 1;
    const day = d.getDate();
    // Format: [startMonth, startDay, endMonth, endDay, name, emoji]
    const signs = [
      [1, 20, 2, 18, "Aquarius", "♒"],
      [2, 19, 3, 20, "Pisces", "♓"],
      [3, 21, 4, 19, "Aries", "♈"],
      [4, 20, 5, 20, "Taurus", "♉"],
      [5, 21, 6, 20, "Gemini", "♊"],
      [6, 21, 7, 22, "Cancer", "♋"],
      [7, 23, 8, 22, "Leo", "♌"],
      [8, 23, 9, 22, "Virgo", "♍"],
      [9, 23, 10, 22, "Libra", "♎"],
      [10, 23, 11, 21, "Scorpio", "♏"],
      [11, 22, 12, 21, "Sagittarius", "♐"],
      [12, 22, 1, 19, "Capricorn", "♑"]
    ];
    for (const [sm, sd, em, ed, name, emoji] of signs) {
      if ((m === sm && day >= sd) || (m === em && day <= ed) || (sm < em && m > sm && m < em) || (sm > em && (m > sm || m < em))) {
        return `${emoji} ${name}`;
      }
    }
    return "—";
  }

  function getChineseZodiac(d) {
    const animals = [
      ["Rat","🐀"], ["Ox","🐂"], ["Tiger","🐯"], ["Rabbit","🐰"],
      ["Dragon","🐲"], ["Snake","🐍"], ["Horse","🐎"], ["Goat","🐐"],
      ["Monkey","🐒"], ["Rooster","🐓"], ["Dog","🐕"], ["Pig","🐖"]
    ];
    const idx = (d.getFullYear() - 4) % 12;
    const [name, emoji] = animals[(idx + 12) % 12];
    return `${emoji} ${name}`;
  }

  function formatNumber(n) {
    return new Intl.NumberFormat().format(n);
  }

  function computeMilestones(dob) {
    const tenKDays = new Date(dob.getTime() + 10000 * ONE.day);
    const oneBillionSec = new Date(dob.getTime() + 1_000_000_000 * ONE.second);
    const halfBirthday = addMonths(dob, 6);
    return {
      tenKDays,
      oneBillionSec,
      halfBirthday
    };
  }

  function setMaxDate() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    dobEl.setAttribute("max", `${yyyy}-${mm}-${dd}`);
  }

  function saveToLocal(dobStr, tobStr) {
    try {
      localStorage.setItem("agecalc:dob", dobStr || "");
      localStorage.setItem("agecalc:tob", tobStr || "");
      localStorage.setItem("agecalc:live", liveModeEl.checked ? "1" : "0");
      localStorage.setItem("agecalc:useBirthTime", useBirthTimeForNextEl.checked ? "1" : "0");
    } catch {}
  }

  function restoreFromLocal() {
    try {
      const dobStr = localStorage.getItem("agecalc:dob");
      const tobStr = localStorage.getItem("agecalc:tob");
      const live = localStorage.getItem("agecalc:live");
      const useBirthTime = localStorage.getItem("agecalc:useBirthTime");

      if (dobStr) dobEl.value = dobStr;
      if (tobStr) tobEl.value = tobStr;
      if (live === "1") liveModeEl.checked = true;
      if (useBirthTime === "0") useBirthTimeForNextEl.checked = false;
    } catch {}
  }

  function readFromURL() {
    const params = new URLSearchParams(window.location.search);
    const dob = params.get("dob");   // YYYY-MM-DD
    const t = params.get("t");       // HH:mm
    const live = params.get("live");
    const usebt = params.get("usebt");
    if (dob && /^\d{4}-\d{2}-\d{2}$/.test(dob)) dobEl.value = dob;
    if (t && /^\d{2}:\d{2}$/.test(t)) tobEl.value = t;
    if (live === "1") liveModeEl.checked = true;
    if (usebt === "0") useBirthTimeForNextEl.checked = false;
  }

  function writeURL(dobStr, tobStr) {
    const params = new URLSearchParams();
    if (dobStr) params.set("dob", dobStr);
    if (tobStr) params.set("t", tobStr);
    if (liveModeEl.checked) params.set("live", "1");
    if (!useBirthTimeForNextEl.checked) params.set("usebt", "0");
    const newUrl = `${location.pathname}?${params.toString()}`;
    history.replaceState({}, "", newUrl);
  }

  function copyShareLink() {
    const dobStr = dobEl.value || "";
    const tobStr = tobEl.value || "";
    const params = new URLSearchParams();
    if (dobStr) params.set("dob", dobStr);
    if (tobStr) params.set("t", tobStr);
    if (liveModeEl.checked) params.set("live", "1");
    if (!useBirthTimeForNextEl.checked) params.set("usebt", "0");
    const url = `${location.origin}${location.pathname}?${params.toString()}`;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(() => {
        shareBtn.textContent = "✅ Copied!";
        setTimeout(() => shareBtn.textContent = "🔗 Share", 1200);
      }).catch(() => {
        fallbackCopy(url);
      });
    } else {
      fallbackCopy(url);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch {}
    document.body.removeChild(ta);
    shareBtn.textContent = "✅ Copied!";
    setTimeout(() => shareBtn.textContent = "🔗 Share", 1200);
  }

  function setTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      themeToggle.textContent = "☀️";
      localStorage.setItem("agecalc:theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      themeToggle.textContent = "🌙";
      localStorage.setItem("agecalc:theme", "light");
    }
  }

  function autoThemeInit() {
    const stored = localStorage.getItem("agecalc:theme");
    if (stored) return setTheme(stored);
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  function calculateAndRender() {
    const dobStr = dobEl.value;
    const tobStr = tobEl.value;
    const now = new Date();
    const dob = parseDateTime(dobStr, tobStr);

    // Validate
    if (!dob || !isValidDOB(dob)) {
      formErrorEl.textContent = "Please enter a valid birth date (not in the future).";
      setOutputsEmpty();
      return false;
    } else {
      formErrorEl.textContent = "";
    }

    // Save and URL sync
    saveToLocal(dobStr, tobStr);
    writeURL(dobStr, tobStr);

    // Calendar age
    const cal = diffCalendar(dob, now);
    ageYMD.textContent = `${cal.years}y ${cal.months}m ${cal.days}d ${pad(cal.hours)}:${pad(cal.minutes)}:${pad(cal.seconds)}`;

    // Born weekday
    bornWeekday.textContent = weekdayStr(dob);

    // Zodiacs
    zodiacWestern.textContent = getWesternZodiac(dob);
    zodiacChinese.textContent = getChineseZodiac(dob);

    // Totals
    const diffMs = now - dob;
    const days = diffMs / ONE.day;
    const weeks = Math.floor(days / 7);
    const months = Math.floor(((now.getFullYear() - dob.getFullYear()) * 12) + (now.getMonth() - dob.getMonth()) - (now.getDate() < dob.getDate() ? 1 : 0));
    totalSeconds.textContent = formatNumber(Math.floor(diffMs / ONE.second));
    totalMinutes.textContent = formatNumber(Math.floor(diffMs / ONE.minute));
    totalHours.textContent = formatNumber(Math.floor(diffMs / ONE.hour));
    totalDays.textContent = formatNumber(Math.floor(days));
    totalWeeks.textContent = formatNumber(weeks);
    totalMonths.textContent = formatNumber(Math.max(0, months));

    // Next birthday
    const { target, diffMs: nbMs, progress } = getNextBirthday(dob, now, useBirthTimeForNextEl.checked);
    const cd = formatCountdown(nbMs);
    nbDays.textContent = String(cd.days);
    nbHours.textContent = pad(cd.hours);
    nbMinutes.textContent = pad(cd.minutes);
    nbSeconds.textContent = pad(cd.seconds);
    nbProgress.style.width = `${Math.floor(progress * 100)}%`;
    nextBirthdayDate.textContent = weekdayStr(target);

    if (cd.days === 0 && cd.hours === 0 && cd.minutes === 0 && cd.seconds === 0) {
      birthdayMessage.textContent = "🎉 Happy Birthday!";
      birthdayMessage.style.display = "inline-block";
    } else {
      birthdayMessage.textContent = "";
      birthdayMessage.style.display = "inline-block";
    }

    // Milestones
    const ms = computeMilestones(dob);
    m10k.textContent = weekdayStr(ms.tenKDays) + labelPastFuture(ms.tenKDays);
    m1bSec.textContent = weekdayStr(ms.oneBillionSec) + labelPastFuture(ms.oneBillionSec);
    mHalf.textContent = weekdayStr(ms.halfBirthday) + labelPastFuture(ms.halfBirthday);

    return true;
  }

  function labelPastFuture(d) {
    const now = new Date();
    if (d < now) return " (✅ passed)";
    return " (📅 upcoming)";
    }

  function setOutputsEmpty() {
    const placeholders = ["—","—","—","—"];
    ageYMD.textContent = "—";
    bornWeekday.textContent = "—";
    zodiacWestern.textContent = "—";
    zodiacChinese.textContent = "—";
    totalMonths.textContent = "—";
    totalWeeks.textContent = "—";
    totalDays.textContent = "—";
    totalHours.textContent = "—";
    totalMinutes.textContent = "—";
    totalSeconds.textContent = "—";
    nbDays.textContent = "—";
    nbHours.textContent = "—";
    nbMinutes.textContent = "—";
    nbSeconds.textContent = "—";
    nbProgress.style.width = "0%";
    nextBirthdayDate.textContent = "—";
    birthdayMessage.textContent = "";
    m10k.textContent = "—";
    m1bSec.textContent = "—";
    mHalf.textContent = "—";
  }

  function startLive() {
    if (liveTimer) return;
    liveTimer = setInterval(() => {
      calculateAndRender();
    }, 1000);
  }

  function stopLive() {
    if (!liveTimer) return;
    clearInterval(liveTimer);
    liveTimer = null;
  }

  // Events
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = calculateAndRender();
    if (ok && liveModeEl.checked) startLive();
    if (ok && !liveModeEl.checked) stopLive();
  });

  liveModeEl.addEventListener("change", () => {
    if (liveModeEl.checked) {
      const ok = calculateAndRender();
      if (ok) startLive();
    } else {
      stopLive();
    }
  });

  useBirthTimeForNextEl.addEventListener("change", () => {
    calculateAndRender();
  });

  resetBtn.addEventListener("click", () => {
    stopLive();
    formEl.reset();
    setOutputsEmpty();
    formErrorEl.textContent = "";
    writeURL("", "");
    try {
      localStorage.removeItem("agecalc:dob");
      localStorage.removeItem("agecalc:tob");
    } catch {}
  });

  shareBtn.addEventListener("click", copyShareLink);

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    setTheme(isDark ? "light" : "dark");
  });

  // Init
  autoThemeInit();
  setMaxDate();
  readFromURL();
  restoreFromLocal();

  // If we have values on load, render immediately (and start live if enabled)
  if (dobEl.value) {
    const ok = calculateAndRender();
    if (ok && liveModeEl.checked) startLive();
  }
})();