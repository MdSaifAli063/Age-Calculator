# 🎂 Age Calculator

A modern, responsive, and delightful Age Calculator with live updates, zodiac signs, next-birthday countdown, milestones, shareable links, and beautiful themes. Built with plain HTML, CSS, and JavaScript — no dependencies.

- 🧭 Live and precise age calculation
- 🗓️ Western + Chinese zodiac
- ⏳ Total time lived (months → seconds)
- 🎉 Next birthday countdown with progress bar
- 🌟 Milestones (10,000 days, 1B seconds, half-birthday)
- 🌓 Light/Dark mode + 🎨 Accent themes
- 🔗 Shareable URL + 💾 Local storage
- ♿ Accessible labels, focus states, and reduced-motion support

---

## ✨ Demo

- Open `index.html` directly in your browser, or
- Serve with a static server and navigate to `http://localhost:PORT`

Optionally add a screenshot in `docs/images/` and link it here:
![image](https://github.com/MdSaifAli063/Age-Calculator/blob/465c65b589343b4e3e87e814a0a6d0beb3d081db/Screenshot%202025-09-05%20021048.png)

---

## 📦 Project Structure

. ├─ index.html # App markup ├─ style.css # Beautiful, responsive UI styles ├─ script.js # All calculation and UI logic └─ README.md # This file

---

## 🚀 Getting Started

1) Download or clone this repository.

2) Open the app:
- Double-click `index.html`, or
- Serve locally for best experience (copy/share links work great):
  - Python: `python -m http.server 8080`
  - Node: `npx serve .`
  - VS Code: Live Server extension

3) Use the form:
- Select your date of birth (and optional time of birth).
- Enable “Live mode” to update every second.
- Click “Calculate”.

---

## 🧠 Features

- Your Details
  - 🗓️ Date and ⏰ time inputs (time optional)
  - ⏳ Live mode checkbox
  - 🎉 “Use birth time for next birthday” option

- Your Age
  - ⏱️ Calendar age in years, months, days, hh:mm:ss
  - 📅 The weekday and full date you were born
  - ♒ Western zodiac and 🐲 Chinese zodiac

- Totals
  - Total months, weeks, days, hours, minutes, seconds

- Next Birthday
  - 🎯 Countdown (days, hours, minutes, seconds)
  - 📈 Progress bar showing progress through the year
  - 🗓️ Exact next-birthday date (handles Feb 29 gracefully)

- Milestones
  - 🌟 10,000 days old
  - 🌟 1,000,000,000 seconds old
  - 🌟 Half-birthday

- Quality-of-life
  - 🔗 Shareable link with query params
  - 💾 Remembers your last input (localStorage)
  - 🌓 Theme toggle and 🎨 accent themes
  - ♿ Accessibility improvements

---

## 🎨 Theming

This project supports:
- Light/Dark mode toggle via the “🌙/☀️” button
- Accent color themes via an attribute on `<html>`

- Supported accents: `rose`, `amber`, `emerald`, `sky`, `violet`, `fuchsia`

- Set the accent in your HTML tag:

  <html lang="en" data-accent="violet">

- You can also set dark mode by default:

 <html lang="en" data-accent="emerald" data-theme="dark">


Tip: You can wire a dropdown to change document.documentElement.dataset.accent at runtime for a theme picker.

---

## 🔗 Shareable Links

- The app syncs your input to the URL:

- dob=YYYY-MM-DD
- t=HH:MM
- live=1 to enable live mode
- usebt=0 to disable “use birth time”
- Example:

https://your-domain.tld/?dob=1998-04-20&t=06:30&live=1

Use the “🔗 Share” button to copy the current link.

---

## 🛠️ How It Works

Time math
- Uses native Date with careful calendar math for years/months/days
- Leap years and Feb 29 birthdays are handled (next birthday shifts to Feb 28 on non-leap years)
- Next birthday progress
- Calculates time since last birthday vs the current birthday interval for a smooth progress indicator
- Performance
- Live mode updates once per second with minimal DOM work

---

## ♿ Accessibility

- Proper labels and descriptions for inputs
Keyboard-friendly focus styles
Reduced motion honored (prefers-reduced-motion)
Clear error messages via ARIA live regions

---

## 🌍 Browser Support

- Modern evergreen browsers (Chrome, Edge, Firefox, Safari)
Mobile-first responsive layout
No external dependencies required

---

## 📦 Deploy

- GitHub Pages
- Push the repo
- Enable Pages for the main branch and root
- Visit the published URL
- Netlify / Vercel
- Import your repo and deploy as a static site
- Any static hosting
- Upload index.html, style.css, and script.js

---

## 🧪 Testing Ideas (optional)

- Unit test date math and leap-year logic with your preferred framework
E2E test countdown ticks and next-birthday progress with Playwright
If you’d like, I can add a small test suite to script.js logic (extracted into modules) and a CI workflow.

## 📝 License

- MIT — feel free to use, modify, and distribute.

## 🙌 Credits

- Built with ❤️, JS, and a sprinkle of CSS sorcery (glassmorphism, gradients, orbs, and emojis).
Icons/emoji: native emoji set.

## 💡 Tips

- Want a different vibe? Try:
- <html data-accent="rose"> for a rose/coral look
- <html data-accent="fuchsia"> for neon magenta
- <html data-accent="emerald"> for a calm green-cyan blend
- Prefer minimal motion? Your OS reduced-motion preference is respected automatically.

Enjoy your new, beautiful Age Calculator! 🎂✨
