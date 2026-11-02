/* =====================================================================
   मेरो संसार, मेरी उनी ❤️ — CONFIGURATION
   ---------------------------------------------------------------------
   Everything personal or editable lives in this one file.
   You never need to touch index.html, style.css or script.js to:
     • add her name / your name
     • change any sentence on the page
     • swap, reorder or re-caption photographs
     • turn background music on/off

   Rules for editing:
     • Keep text inside the quotes / backticks.
     • "\n" (or a real line break inside `backticks`) = new line.
     • An empty string "" means "not used" — the page hides it gracefully.
   ===================================================================== */

window.BIRTHDAY_CONFIG = {

  /* ---------------------------------------------------------------
     1. NAMES (optional)
     Left empty on purpose — the page never invents a name.
     wifeName   → shown as a small gold line above the main greeting,
                  e.g. "प्रिय सीता,"   (leave "" to hide)
     senderName → shown under the letter signature and in the footer,
                  e.g. "सुरज"           (leave "" to hide)
     --------------------------------------------------------------- */
  wifeName: "",
  senderName: "",

  /* Bikram Sambat birth date — displayed exactly as written.
     Deliberately NOT converted to AD and no age is calculated. */
  birthDateBS: "२०६० कार्तिक १६",

  /* Browser-tab title */
  pageTitle: "मेरो संसार, मेरी उनी ❤️",

  /* ---------------------------------------------------------------
     2. PHOTOGRAPHS
     file   → original, full quality (used in the enlarged viewer)
     web    → lighter 1080px copy for fast mobile loading ("" = none)
     width / height → the ORIGINAL pixel size (prevents layout jumps)
     focus  → which part of the photo matters most (CSS object-position);
              only used if a frame ever has to crop.
     alt    → description read aloud by screen readers.
     --------------------------------------------------------------- */
  photos: {
    1: { file: "assets/images/photo-1.jpg", web: "assets/images/web/photo-1.jpg", width: 2016, height: 1512, focus: "47% 45%",
         alt: "चिडियाखानाको रंगीन फोटो फ्रेमभित्र हात फैलाएर मुस्कुराइरहेकी तिमी" },
    2: { file: "assets/images/photo-2.jpg", web: "assets/images/web/photo-2.jpg", width: 1932, height: 2576, focus: "50% 40%",
         alt: "निलो आकाशमुनि ओठ बटारेर खिचेको हामी दुईको रमाइलो सेल्फी" },
    3: { file: "assets/images/photo-3.jpg", web: "assets/images/web/photo-3.jpg", width: 1512, height: 2016, focus: "50% 33%",
         alt: "ऐनामा खिचिएको तस्बिर, जहाँ म तिम्रो गालामा माया गर्दैछु र तिमी आँखा चिम्लेर मुस्कुराइरहेकी छौ" },
    4: { file: "assets/images/photo-4.jpg", web: "", width: 900, height: 1600, focus: "47% 45%",
         alt: "सुन्तला र रातो साडीमा घाममा घाँसमाथि बसेकी तिमी" },
    5: { file: "assets/images/photo-5.jpg", web: "assets/images/web/photo-5.jpg", width: 1717, height: 2576, focus: "45% 22%",
         alt: "कपालमा सेतो फूल सिउरेर रुखको छेउमा मुस्कुराउँदै उभिएकी तिमी" },
    6: { file: "assets/images/photo-6.jpg", web: "assets/images/web/photo-6.jpg", width: 1512, height: 2016, focus: "58% 25%",
         alt: "रातो टप र जिन्समा बगैँचाका बुट्यानलाई छुँदै हिँडिरहेकी तिमी" },
    7: { file: "assets/images/photo-7.jpg", web: "", width: 960, height: 1280, focus: "42% 45%",
         alt: "तालको किनारको पाटीमुनि सँगै बसेका हामी दुई" }
  },

  /* ---------------------------------------------------------------
     3. CINEMATIC OPENING
     --------------------------------------------------------------- */
  intro: {
    line1: "आजको दिन…",
    line2: "मेरो जीवनको सबैभन्दा प्यारो मान्छेका लागि ❤️",
    surprise: "मेरो माया,\nतिम्रो लागि एउटा सानो सरप्राइज छ…",
    button: "मेरो माया, यहाँ थिच न ❤️"
  },

  /* ---------------------------------------------------------------
     4. GRAND BIRTHDAY HERO
     photo → which photo number is the main portrait
     --------------------------------------------------------------- */
  hero: {
    photo: 5,
    eyebrow: "मेरो संसार, मेरी उनी",
    nameLine: "प्रिय {name},",          /* used only if wifeName is filled */
    headline: "जन्मदिनको धेरै धेरै शुभकामना,\nमेरी प्यारी जीवनसाथी! ❤️",
    message: "तिमी मेरो जीवनमा आएको दिनदेखि\nहरेक खुसी अझ सुन्दर लाग्न थालेको छ।\nतिमी मेरो मुस्कानको कारण हौ,\nमेरो मनको शान्ति हौ,\nर मेरो जीवनको सबैभन्दा प्यारो साथ हौ।",
    dateLabel: "जन्ममिति:",
    scrollHint: "तल हेर न, तिम्रा लागि अझै धेरै कुरा छन्…"
  },

  /* ---------------------------------------------------------------
     5. SEVEN PHOTOGRAPHS — SEVEN EMOTIONS
     photo  → photo number from section 2 (reorder freely)
     layout → "wide" | "split" | "split-reverse" | "tilt" | "tilt-reverse"
              | "tall" | "feature"
     --------------------------------------------------------------- */
  gallery: {
    kicker: "सात तस्बिर · सात भावना",
    title: "मेरा आँखामा तिमी",
    hint: "कुनै पनि तस्बिरमा थिचेर ठूलो बनाएर हेर।",
    items: [
      { photo: 1, layout: "wide",          title: "मेरो संसार",    text: "तिमी छौ, त्यसैले मेरो संसार यति सुन्दर छ।" },
      { photo: 2, layout: "split",         title: "तिम्रो मुस्कान", text: "तिम्रो एउटा मुस्कानले मेरो दिनभरिका थकान हराइदिन्छ।" },
      { photo: 3, layout: "tilt",          title: "मेरो खुसी",     text: "तिमीसँग बिताएका साना पलहरू नै मेरा ठूला खुसी हुन्।" },
      { photo: 4, layout: "tall",          title: "मेरो साथ",      text: "जीवनका हरेक मोडमा तिम्रो हात समाएर हिँडिरहन चाहन्छु।" },
      { photo: 5, layout: "split-reverse", title: "मेरो विश्वास",   text: "तिमी मेरो माया मात्र होइन, मेरो सबैभन्दा नजिकको साथी पनि हौ।" },
      { photo: 6, layout: "tilt-reverse",  title: "मेरो सपना",     text: "हाम्रा आउने दिनहरू अझ धेरै माया र सुन्दर सम्झनाले भरिऊन्।" },
      { photo: 7, layout: "feature",       title: "सधैँ तिमी",      text: "आज, भोलि र आउने हरेक दिन, म तिमीलाई यसरी नै माया गरिरहनेछु।" }
    ]
  },

  /* ---------------------------------------------------------------
     6. LOVE LETTER
     A blank line between lines = a new paragraph.
     --------------------------------------------------------------- */
  letter: {
    kicker: "मनका कुरा",
    title: "एउटा चिठी, तिम्रै लागि",
    button: "तिम्रो लागि मेरो मनको चिठी 💌",
    closeButton: "चिठी फेरि खाममा राख",
    envelopeLabel: "चिठी खोल्न खाममा थिच",
    body: `मेरी प्यारी माया,

आज तिम्रो जन्मदिन हो।
यो दिन तिम्रो लागि जति विशेष छ,
मेरो लागि पनि त्यत्तिकै अमूल्य छ।

किनकि यही दिन यो संसारले तिमीलाई पाएको थियो,
र आज म आफूलाई भाग्यमानी ठान्छु,
किनकि तिमी मेरो जीवनको हिस्सा बनेकी छौ।

मलाई थाहा छ,
हरेक दिन सबै कुरा सोचेजस्तो हुँदैन।
कहिलेकाहीँ खुसी हुन्छ, कहिलेकाहीँ थकान,
कहिलेकाहीँ साना मनमुटाव पनि हुन्छन्।

तर यी सबै कुराभन्दा माथि
एउटा कुरा सधैँ सत्य रहनेछ —
म तिमीलाई धेरै माया गर्छु।

तिम्रो मुस्कान सधैँ यसरी नै चम्किरहोस्।
तिम्रा सपनाहरू एकएक गर्दै पूरा हुँदै जाऊन्।
तिम्रो मनले सधैँ शान्ति पाओस्।
र तिमीले कहिल्यै आफू एक्लो भएको महसुस गर्न नपरोस्।

म तिमीलाई हरेक खुसी दिन सक्छु भनेर
ठूलो वाचा गर्दिनँ।
तर सुखमा सँगै हाँस्ने,
दुःखमा तिम्रो हात समाउने,
र हरेक परिस्थितिमा तिम्रो साथ निभाउने
प्रयास सधैँ गरिरहनेछु।

जन्मदिनको धेरै धेरै शुभकामना,
मेरी प्यारी जीवनसाथी।

तिमी मेरो आजको खुसी,
भोलिको आशा,
र जीवनभरको माया हौ।

धेरै धेरै माया। ❤️`,
    signOff: "सधैँ तिम्रै,",
    signature: "तिम्रो जीवनसाथी"   /* senderName (if filled) appears below this */
  },

  /* ---------------------------------------------------------------
     7. BIRTHDAY CAKE
     --------------------------------------------------------------- */
  cake: {
    kicker: "जन्मदिनको उत्सव",
    title: "एउटा इच्छा माग न, मेरी माया… ❤️",
    hint: "आँखा चिम्ल, मनमनै इच्छा माग, अनि बटन थिच।",
    button: "मैनबत्ती निभाऊ 🎂",
    relightButton: "मैनबत्ती फेरि बालौँ 🕯️",
    wishTitle: "तिम्रो इच्छा पूरा होस्, मेरी माया! ✨",
    wishText: "जन्मदिनको धेरै धेरै शुभकामना ❤️",
    cakeLabel: "गुलाफी र सुनौलो रङको दुई तले जन्मदिनको केक, तीनवटा मैनबत्तीसहित"
  },

  /* ---------------------------------------------------------------
     8. FINAL GRAND REVEAL
     --------------------------------------------------------------- */
  finale: {
    photo: 4,
    line1: "यदि जीवनले मलाई\nफेरि एकपटक रोज्ने मौका दियो भने…",
    line2: "म फेरि पनि तिमीलाई नै रोज्नेछु। ❤️",
    headline: "जन्मदिनको धेरै धेरै शुभकामना,\nमेरी माया! ❤️",
    message: "तिम्रो हरेक सपना पूरा होस्,\nतिम्रो हरेक दिन मुस्कानले भरियोस्,\nर हाम्रो माया यसरी नै झन् गहिरिँदै जाओस्।\n\nम तिमीलाई धेरै माया गर्छु। ❤️",
    replayButton: "फेरि एकपटक हेरौँ ❤️",
    footer: "सधैँ तिम्रै ❤️"
  },

  /* ---------------------------------------------------------------
     9. PHOTO VIEWER LABELS
     --------------------------------------------------------------- */
  viewer: {
    open: "तस्बिर ठूलो बनाएर हेर:",
    close: "बन्द गर",
    prev: "अघिल्लो तस्बिर",
    next: "अर्को तस्बिर"
  },

  /* ---------------------------------------------------------------
     10. SOUND
     Background music: copy a song YOU have the right to use to
     assets/audio/music.mp3, then set  src: "assets/audio/music.mp3".
     Empty src or a missing file = the music button never appears.
     Music is OFF by default. With startOnOpen: true it begins only
     when she taps the opening button (a real user interaction,
     so mobile browsers allow it).

     celebrationChime: a soft bell chime generated in the browser
     (no file, no copyright) when the candles are blown out.
     It stays silent if she has pressed the music "off" button.
     --------------------------------------------------------------- */
  music: {
    src: "",                 /* e.g. "assets/audio/music.mp3" — empty = no music button */
    startOnOpen: false,
    volume: 0.5,
    playLabel: "संगीत बजाऊ",
    pauseLabel: "संगीत रोक"
  },
  sound: {
    celebrationChime: true
  }
};
