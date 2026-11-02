# मेरो संसार, मेरी उनी ❤️

A private, mobile-first birthday surprise website. Plain HTML/CSS/JavaScript: no framework, no build step, no backend, no analytics and no third-party requests (fonts are self-hosted).

## The experience

1. **Opening.** A dark burgundy screen with a glowing heart, falling rose petals and golden dust. Three lines appear in turn, then the button **"मेरो माया, यहाँ थिच न ❤️"**. Tapping anywhere shows everything at once, so she never has to wait.
2. **Hero.** Her portrait in an arched golden frame, with the birthday greeting and **जन्ममिति: २०६० कार्तिक १६**.
3. **सात तस्बिर · सात भावना.** Seven photographs in seven different layouts that reveal as she scrolls. Tapping a photo opens a full-screen viewer with swipe, arrow keys, Esc and close buttons.
4. **The letter.** An envelope with a wax-seal heart. It opens, then the letter unfolds. It can be folded back and opened again.
5. **The cake.** A rose-and-gold SVG cake with three flickering candles. The button blows them out, with smoke, a confetti burst, a soft chime and the wish message. It can be replayed (relight the candles).
6. **Finale.** Her photo glows while the lines appear with a pause between them, then the closing message and **"फेरि एकपटक हेरौँ ❤️"**, which replays everything from the start.

## Folder structure

```
birthday-surprise/
├── index.html
├── css/
│   ├── fonts.css           self-hosted @font-face rules
│   └── style.css           design system, layouts, motion
├── js/
│   ├── config.js           ← EDIT THIS: all text, names, photos, music
│   └── script.js           behaviour (no need to edit)
├── assets/
│   ├── images/
│   │   ├── photo-1.jpg … photo-7.jpg   originals, byte-for-byte untouched
│   │   └── web/photo-N.jpg             lighter 1080px copies for phones
│   ├── fonts/              Noto Serif Devanagari + Mukta (SIL Open Font License)
│   └── audio/              optional music (empty)
└── README.md
```

`config.js` is a separate file so that you can personalise everything without touching the code.

## Preview locally

Run a tiny local server from inside the folder:

```bash
cd birthday-surprise
python3 -m http.server 8000
# open http://localhost:8000
```

To test on your phone, connect it to the same Wi-Fi and open `http://<your-computer-IP>:8000`.

Double-clicking `index.html` also mostly works. However, browsers block font preloading on `file://` URLs, so use the server for an accurate preview.

## Customise (all in `js/config.js`)

### Her name and your name

```js
wifeName: "",     // e.g. "सीता"  → shows "प्रिय सीता," above the main greeting
senderName: "",   // e.g. "सुरज" → shows "— सुरज" under the letter signature and in the footer
```

Both fields are empty on purpose, and nothing is shown while they stay empty.

### Change any sentence

Every visible sentence lives in `config.js` under `intro`, `hero`, `gallery`, `letter`, `cake` and `finale`. `\n` starts a new line. In the letter, a blank line starts a new paragraph.

### Replace or reorder photos

1. Put the new photo in `assets/images/` (any `.jpg`, `.png` or `.webp`).
2. In `config.js → photos`, update that entry:
   - `file` must point to the new file.
   - `width` and `height` must match its real pixel size. This prevents layout jumps and keeps the frame's shape right.
   - Set `web: ""`, unless you also make a smaller copy. Otherwise the old 1080px copy would still show.
   - Update `alt` to describe the new photo.
3. To reorder the gallery or change captions, edit `gallery.items`. Each item names a `photo` number and a `layout`: `wide`, `split`, `split-reverse`, `tilt`, `tilt-reverse`, `tall` or `feature`.
4. `hero.photo` and `finale.photo` choose the portraits for the hero and finale sections.

Check the pixel size on macOS with `sips -g pixelWidth -g pixelHeight photo.jpg`, or on Linux with `identify photo.jpg`.

If a photo file is missing, its frame shows a soft heart instead of a broken image.

### Background music (optional)

1. Copy a song **you have the right to use** to `assets/audio/music.mp3`.
2. In `config.js`, set `music.src: "assets/audio/music.mp3"`.
3. Optionally set `music.startOnOpen: true` to start the music when she taps the opening button.

Music is off by default and never autoplays before a tap, which mobile browsers forbid anyway. Once the file loads, a "संगीत बजाऊ / संगीत रोक" button appears in the bottom-right corner. Without a file, the button never appears. Music pauses when she switches apps and resumes when she comes back.

The candle chime is synthesised in the browser, so there's no file and no copyright issue. Set `sound.celebrationChime: false` to turn it off. It also stays silent if she has pressed the music "off" button.

## Privacy and deployment — please read

These are private photographs. Treat the site accordingly.

- **Any normal static host (GitHub Pages, Netlify, Vercel, etc.) makes the site public.** Anyone with the URL can open it and download every photo. A long or secret URL is not access control: links leak through chat previews, browser history and forwarding.
- The page includes `noindex` tags so search engines are asked not to list it. This is a request, not protection.
- **Do not commit the photos to a public Git repository.** This folder currently sits inside the `RoomBooking` repo. If that repo is public, keep `birthday-surprise/` out of it (add it to `.gitignore`) or move it elsewhere.

Safer options, from most to least private:

1. **Show it from your own device.** Run the local server above, or zip the folder and open it on your laptop or phone. Nothing leaves your hands.
2. **Netlify with password protection.** Site-wide password protection is a paid-plan feature: drag the folder into Netlify Drop, then enable "Visitor access → Password protection".
3. **Cloudflare Pages + Cloudflare Access (free tier).** Deploy the folder to Pages, then add an Access policy that allows only your two email addresses. She logs in with a one-time email code.
4. **Vercel.** Has password protection on paid plans. Its free tier offers Vercel-account-based protection, which is less convenient for her.

After the birthday, consider deleting the deployment.

## Accessibility and motion

- Semantic sections and headings, Nepali alt text on every photo, labelled buttons, keyboard support (Tab, Enter, Esc, ← →) and visible focus rings.
- The photo viewer is a native `<dialog>`, so focus is managed by the browser and returns to the photo afterwards.
- Visitors who set "Reduce motion" on their phone get no petals, particles, confetti or slide-ins. Content fades in quietly, and the finale still keeps its pause.
- Touch targets are at least 46–52px, the layout respects safe areas (notch and home bar), and there is no horizontal scrolling from 320px upwards.

## Notes

- The birth date is shown exactly as written in Bikram Sambat. It is deliberately not converted to AD, and no age is calculated.
- Fonts: Noto Serif Devanagari and Mukta, from Google Fonts, under the SIL Open Font License. They are bundled locally (Devanagari and Latin subsets only).
