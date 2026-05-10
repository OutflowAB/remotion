import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, Mic, Search } from "lucide-react";

const BG = "#ffffff";
const SURFACE = "#f1f3f4";
const TEXT = "#202124";
const MUTED = "#5f6368";
const LINK = "#1a0dab";
const BORDER = "#dadce0";

type ResultRowProps = {
  /** Composition scale for horizontal inset (matches HanellGoogleVideo `k`). */
  k: number;
  title: string;
  urlPath: string;
  /** Extra breadcrumb-style line under `urlPath` (common in live Google SERPs). */
  urlSubline?: string;
  source: string;
  snippet: string;
  iconSeed: number;
  /** Om satt: skriv ut radens texter tecken för tecken från `startFrame`. */
  typewriter?: {
    startFrame: number;
    durationFrames: number;
    /** Efter fullständig text: skala upp + flytta uppåt (närmare kameran). */
    liftAfter?: { durationFrames: number };
  };
};

function sliceTypewriterSegments(segments: string[], progress: number): string[] {
  const totalLen = segments.reduce((a, s) => a + s.length, 0);
  if (totalLen === 0) {
    return segments.map(() => "");
  }
  let budget = Math.floor(progress * totalLen);
  return segments.map((s) => {
    const take = Math.min(budget, s.length);
    budget -= take;
    return s.slice(0, take);
  });
}

const CARET_BLINK_PERIOD = 12;

const TypingCaret: React.FC<{ u: number; color: string; frame: number }> = ({ u, color, frame }) => (
  <span
    aria-hidden
    style={{
      display: "inline-block",
      marginLeft: 1 * u,
      width: 2 * u,
      height: 16 * u,
      background: color,
      opacity: frame % CARET_BLINK_PERIOD < CARET_BLINK_PERIOD / 2 ? 1 : 0.25,
      verticalAlign: "text-bottom",
    }}
  />
);

const ResultRow: React.FC<ResultRowProps> = ({
  k,
  title,
  urlPath,
  urlSubline,
  source,
  snippet,
  iconSeed,
  typewriter,
}) => {
  const frame = useCurrentFrame();
  const u = GOOGLE_RESULT_ROW_SCALE;
  const padX = 128 * k;
  const iconPalettes = [
    ["#fbbc04", "#ea4335"],
    ["#34a853", "#4285f4"],
    ["#7e57c2", "#42a5f5"],
    ["#ff7043", "#26a69a"],
    ["#66bb6a", "#ffee58"],
    ["#5c6bc0", "#29b6f6"],
    ["#ef5350", "#ab47bc"],
    ["#26c6da", "#9ccc65"],
  ] as const;
  const [c1, c2] = iconPalettes[iconSeed % iconPalettes.length];
  const sourceLetter = source.slice(0, 1).toUpperCase();

  const segments = typewriter
    ? [source, urlPath, urlSubline ?? "", title, snippet]
    : null;
  let ds = source;
  let dUrl = urlPath;
  let dSub = urlSubline ?? "";
  let dTitle = title;
  let dSnippet = snippet;
  let caretSeg: number | null = null;

  if (typewriter && segments) {
    const t = Math.max(0, frame - typewriter.startFrame);
    const progress =
      typewriter.durationFrames <= 0 ? 1 : Math.min(1, t / typewriter.durationFrames);
    const slices = sliceTypewriterSegments(segments, progress);
    ds = slices[0];
    dUrl = slices[1];
    dSub = slices[2];
    dTitle = slices[3];
    dSnippet = slices[4];
    if (progress < 1) {
      for (let i = 0; i < segments.length; i++) {
        if (slices[i].length < segments[i].length) {
          caretSeg = i;
          break;
        }
      }
      if (caretSeg === null) {
        caretSeg = segments.length - 1;
      }
    }
  }

  const liftCfg = typewriter?.liftAfter;
  const typeEndFrame =
    typewriter && liftCfg ? typewriter.startFrame + typewriter.durationFrames : null;
  let liftProgress = 0;
  if (typeEndFrame !== null && liftCfg) {
    const lf = frame - typeEndFrame;
    liftProgress =
      liftCfg.durationFrames <= 0 ? 1 : Math.min(1, Math.max(0, lf / liftCfg.durationFrames));
  }
  const liftScale =
    liftCfg !== undefined
      ? interpolate(liftProgress, [0, 1], [1, 1.06], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })
      : 1;
  const liftTy =
    liftCfg !== undefined
      ? interpolate(liftProgress, [0, 1], [0, -34 * k], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })
      : 0;
  const liftShadowAlpha = interpolate(liftProgress, [0, 1], [0, 0.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const rowPadX = liftCfg ? 18 * k : padX;
  const rowPadY = liftCfg ? 4 * k : 0;

  return (
    <div
      style={{
        marginBottom: 22 * u,
        paddingLeft: rowPadX,
        paddingRight: rowPadX,
        paddingTop: rowPadY,
        paddingBottom: rowPadY,
        boxSizing: "border-box",
        ...(liftCfg
          ? {
              maxWidth: 1720 * k,
              marginLeft: "auto",
              marginRight: "auto",
              position: "relative",
              zIndex: liftProgress > 0 ? 8 : 1,
              transform: `scale(${liftScale}) translateY(${liftTy}px)`,
              transformOrigin: "50% 12%",
              boxShadow:
                liftShadowAlpha > 0.001
                  ? `0 ${10 * liftProgress}px ${34 * liftProgress}px rgba(32,33,36,${liftShadowAlpha})`
                  : undefined,
              borderRadius: 10 * k * liftProgress,
            }
          : {}),
      }}
    >
      <div
        style={{
          fontSize: 14 * u,
          color: MUTED,
          marginBottom: 6 * u,
          display: "flex",
          alignItems: "center",
          gap: 10 * u,
        }}
      >
        <div
          style={{
            width: 26 * u,
            height: 26 * u,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${c1}, ${c2})`,
            border: `${1 * u}px solid ${BORDER}`,
            flexShrink: 0,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13 * u,
            fontWeight: 700,
            overflow: "hidden",
          }}
        >
          {sourceLetter}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ color: TEXT, fontSize: 14 * u, lineHeight: `${20 * u}px` }}>
            {typewriter ? ds : source}
            {typewriter && caretSeg === 0 ? (
              <TypingCaret u={u} color={TEXT} frame={frame} />
            ) : null}
          </div>
          <div
            style={{
              fontSize: 12 * u,
              color: MUTED,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {typewriter ? dUrl : urlPath}
            {typewriter && caretSeg === 1 ? (
              <TypingCaret u={u} color={MUTED} frame={frame} />
            ) : null}
          </div>
          {urlSubline ? (
            <div
              style={{
                fontSize: 12 * u,
                color: MUTED,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginTop: 2 * u,
              }}
            >
              {typewriter ? dSub : urlSubline}
              {typewriter && caretSeg === 2 ? (
                <TypingCaret u={u} color={MUTED} frame={frame} />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <a
        href="#"
        style={{
          fontSize: 20 * u,
          fontWeight: 400,
          color: LINK,
          textDecoration: "none",
          display: "block",
          marginBottom: 8 * u,
          lineHeight: `${26 * u}px`,
        }}
      >
        {typewriter ? dTitle : title}
        {typewriter && caretSeg === 3 ? (
          <TypingCaret u={u} color={LINK} frame={frame} />
        ) : null}
      </a>
      <div
        style={{
          fontSize: 14 * u,
          lineHeight: `${22 * u}px`,
          color: MUTED,
          maxWidth: "100%",
        }}
      >
        {typewriter ? dSnippet : snippet}
        {typewriter && caretSeg === 4 ? (
          <TypingCaret u={u} color={MUTED} frame={frame} />
        ) : null}
      </div>
    </div>
  );
};

/** Wordmark paths derived from the original outline; fills match Google brand palette (red / blue / yellow / green). */
const GoogleMark: React.FC<{ size?: number }> = ({ size = 92 }) => (
  <svg width={size} height={size * 0.33} viewBox="0 0 92 30" aria-hidden style={{ display: "block" }}>
    <path
      fill="#EA4335"
      d="M 38.9,15.51 c 0,4.26 -3.32,7.39 -7.4,7.39 s -7.4,-3.14 -7.4,-7.39 c 0,-4.28 3.32,-7.39 7.4,-7.39 s 7.4,3.1 7.4,7.39 z m -3.24,0 c 0,-2.66 -1.93,-4.48 -4.16,-4.48 c -2.23,0 -4.16,1.82 -4.16,4.48 c 0,2.63 1.93,4.48 4.16,4.48 c 2.23,0 4.16,-1.85 4.16,-4.48 z"
    />
    <path
      fill="#4285F4"
      d="m 11.96,22.98 C 5.63,22.98 0.31,17.83 0.31,11.5 S 5.63,0.02 11.96,0.02 c 3.5,0 5.99,1.37 7.87,3.16 L 17.62,5.4 c -1.34,-1.26 -3.16,-2.24 -5.66,-2.24 c -4.62,0 -8.23,3.72 -8.23,8.34 c 0,4.62 3.61,8.34 8.23,8.34 c 3,0 4.7,-1.2 5.79,-2.3 c 0.9,-0.9 1.49,-2.2 1.74,-4.17 H 12 v -3.14 h 10.52 c 0.11,0.56 0.17,1.23 0.17,1.96 c 0,2.35 -0.64,5.49 -2.72,7.56 c -2.02,2.11 -4.59,3.23 -8.01,3.23 z"
    />
    <path
      fill="#FBBC04"
      d="m 54.9,15.51 c 0,4.26 -3.32,7.39 -7.4,7.39 s -7.4,-3.14 -7.4,-7.39 c 0,-4.28 3.32,-7.39 7.4,-7.39 s 7.4,3.1 7.4,7.39 z m -3.24,0 c 0,-2.66 -1.93,-4.48 -4.16,-4.48 c -2.23,0 -4.16,1.82 -4.16,4.48 c 0,2.63 1.93,4.48 4.16,4.48 c 2.23,0 4.16,-1.85 4.16,-4.48 z"
    />
    <path
      fill="#4285F4"
      d="M 70,8.56 v 13.27 c 0,5.46 -3.05,7.7 -6.86,7.7 c -3.58,0 -5.74,-2.41 -6.55,-4.37 l 2.83,-1.18 c 0.5,1.2 1.74,2.63 3.72,2.63 c 2.44,0 3.78,-1.51 3.78,-4.34 v -1.06 h -0.11 c -0.73,0.9 -2.04,1.68 -3.81,1.68 c -3.7,0 -7,-3.22 -7,-7.36 c 0,-4.17 3.3,-7.42 7,-7.42 c 1.76,0 3.08,0.78 3.81,1.65 h 0.11 v -1.2 H 70 z m -2.86,6.97 c 0,-2.6 -1.74,-4.51 -3.95,-4.51 c -2.24,0 -3.95,1.9 -3.95,4.51 c 0,2.58 1.71,4.45 3.95,4.45 c 2.22,0.01 3.95,-1.87 3.95,-4.45 z"
    />
    <path fill="#34A853" d="M 75,1.17 V 22.9 h -3 V 1.17 h 3 z" />
    <path
      fill="#EA4335"
      d="m 87.5,17.94 l 2.48,1.68 c -0.8,1.2 -2.73,3.28 -6.06,3.28 c -4.13,0 -7.22,-3.25 -7.22,-7.39 c 0,-4.4 3.11,-7.39 6.86,-7.39 c 3.78,0 5.62,3.05 6.23,4.7 l 0.31,0.85 l -9.71,4.08 c 0.74,1.48 1.9,2.24 3.53,2.24 s 2.76,-0.82 3.58,-2.05 z m -7.63,-2.66 l 6.5,-2.74 c -0.36,-0.92 -1.43,-1.57 -2.7,-1.57 c -1.62,0 -3.88,1.46 -3.8,4.31 z"
    />
  </svg>
);

/** Proportional size increase for each result block (same layout ratios). */
const GOOGLE_RESULT_ROW_SCALE = 1.12;

const RESULTS: Omit<ResultRowProps, "iconSeed" | "k">[] = [
  {
    title: "Hanell Vvs Konsult – org.nr och branschdata | Allabolag",
    urlPath: "https://www.allabolag.se › nyköping › ... › hanell-vvs-konsult",
    urlSubline: "… › bokslut › anställda",
    source: "Allabolag",
    snippet:
      "Se säte, omsättning, verksamhetsbeskrivning och styrelse. Utförlig rapport med jämförbara bolag och historik från senaste årsredovisningar.",
  },
  {
    title: "Anders Rune Hanell",
    urlPath: "https://krafman.se › engagemang",
    urlSubline: "… › personregister › styrelseuppdrag",
    source: "Krafman",
    snippet:
      "Hanell, Anders Rune är en man född den 24 februari 1963. Han är verksam i de företag och/eller föreningar som anges nedan.",
  },
  {
    title: "Anbud",
    urlPath: "https://app.pabliq.se › procurements › ...",
    urlSubline: "… › anbud › upphandling",
    source: "Pabliq",
    snippet:
      "EVK – Energi & VVS Konsult AB. Tekniska konsulter inom bygg. Sigma … amanda.hanell@ecenea.se. Dunderbergsgatan 2, 382 80 Nybro. Bransch. Region …",
  },
  {
    title: "Hanell Consulting AB - Org.nr 559318-8898 - Sköndal",
    urlPath: "https://www.allabolag.se › sköndal › ...",
    urlSubline: "… › bokslut › nyckeltal",
    source: "Allabolag",
    snippet:
      "Företaget erbjuder konsultstöd och expertis inom utveckling av individ, grupp, ledarskap och företagskultur med syfte att utveckla kundens effektivitet …",
  },
  {
    title: "Hanell Entreprenad – Hanell Entreprenad AB",
    urlPath: "https://www.hanelle.se",
    urlSubline: "/om-oss › järnväg › säkerhetskrav",
    source: "Hanell Entreprenad",
    snippet:
      "Vi är ett nytänkande företag som utför byggnationer och underhåll inom järnvägssektorn. Säkerhet är grundläggande i verksamheten.",
  },
  {
    title: "Bästa Tillväxt 2025 - Gävle kommun",
    urlPath: "https://upplysningar.syna.se › gavle-kommun-2180",
    urlSubline: "… › rankning › snabbväxande",
    source: "AB Syna",
    snippet:
      "Hanell Entreprenad i Gävle AB finns med i listan tillsammans med andra lokala bolag. Offentliga uppgifter och bolagsdata.",
  },
  {
    title: "Hanell Consulting AB - Katalanvägen 4 i Stockholm",
    urlPath: "https://www.hitta.se › verksamhet",
    urlSubline: "… › orgnr › befattningshavare",
    source: "Hitta.se",
    snippet:
      "Hanell Consulting AB är verksam inom konsultverksamhet avseende företagsorganisation och hade 1 anställd under senaste redovisade året.",
  },
  {
    title: "Hanell VVS & Konsult | Nyköping – ledningar, värme, sanitet",
    urlPath: "https://www.google.com › maps › place",
    urlSubline: "… › omdömen › öppettider",
    source: "Google Maps",
    snippet:
      "Öppettider, omdömen och vägbeskrivning. Kontrollera telefon och adress innan du bokar. Uppdaterade uppgifter om rörmokare och VVS i Nyköping.",
  },
  {
    title: "Rune Hanell – roller och uppdrag | LinkedIn",
    urlPath: "https://www.linkedin.com › in › ...",
    urlSubline: "… › aktivitet › kontakter",
    source: "LinkedIn",
    snippet:
      "Erfarenhet inom teknik, projekt och rådgivning. Se kontakter, kurser och tidigare arbetsgivare i profilen som matchar din sökning.",
  },
  {
    title: "Hanell Entreprenad AB | Företagsinfo & nyckeltal",
    urlPath: "https://www.proff.se › företag › hanell-entreprenad-ab",
    urlSubline: "… › styrelse › anställda",
    source: "Proff.se",
    snippet:
      "Omsättning, resultat och styrelse. Jämför liknande bolag i Gävleborgs län. Hämta årsredovisningar och officiella poster.",
  },
  {
    title: "Rörinstallation & VVS – offert och prisjämförelse",
    urlPath: "https://www.servicefinder.se › vvs › närke",
    urlSubline: "… › jämför › offert",
    source: "Servicefinder",
    snippet:
      "Få offerter från certifierade rörmokare. Ange postort och typ av jobb – badrum, värmepump, stambyte. Gratis och utan köpkrav.",
  },
  {
    title: "Anders Rune Hanell – adress, telefon, ålder",
    urlPath: "https://www.merinfo.se › person › ...",
    urlSubline: "… › företagsengagemang › historik",
    source: "Merinfo",
    snippet:
      "Allmänna uppgifter från offentliga källor. Se företagsengagemang och historik där sådana uppgifter finns tillgängliga.",
  },
  {
    title: "Hanell Consulting AB | Bolagsordning och firmateckning",
    urlPath: "https://bolagsverket.se › ... › verksamt",
    urlSubline: "… › firmateckning › styrelse",
    source: "Bolagsverket / Verksamt",
    snippet:
      "Registreringsdatum, säte och bolagsform. Styrelse och revisorer enligt senaste inlämnade handlingar.",
  },
  {
    title: "VVS-installatörer nära dig – kvalitetssäkrade hantverkare",
    urlPath: "https://www.vvsforum.se › artikel › ...",
    urlSubline: "… › checklista › certifikat",
    source: "VVS Forum",
    snippet:
      "Branschguide med checklista för beställaren: certifikat, ROT-avdrag, säker arbetsmiljö och garanti på täta stamnät och rörinstallation.",
  },
  {
    title: "Recension: jour mot läckage i kylar/skölj - VVS Nyköping",
    urlPath: "https://www.reco.se › rörmokare › nyköping",
    urlSubline: "… › omdömen › jämför",
    source: "Reco.se",
    snippet:
      "Verifierade kundomdömen. Snittbetyg, svarstid på akutjour och prisnivå. Jämför upp till fem företag i samma kategori.",
  },
  {
    title: "Bolagsstämma och ägarstruktur – aktiebolag Stockholm",
    urlPath: "https://www.uc.se › bolagsinformation › ...",
    urlSubline: "… › ägare › koncern",
    source: "UC",
    snippet:
      "Kreditrating, betalningsanmärkningar och nyckeltal. Översikt över koncern och närstående bolag när sådana finns registrerade.",
  },
  {
    title: "Installatörsföretagen – auktoriserade VVS-företag",
    urlPath: "https://www.if.se › sök › auktoriserad",
    urlSubline: "… › legitimation › garanti",
    source: "Installatörsföretagen",
    snippet:
      "Hitta auktoriserat företag med yrkeslegitimation. Säker VVS-installation enligt branschregler och Elsäkerhetsverkets råd.",
  },
  {
    title: "Nyköpings-Tidningen – lokala företag i fokus",
    urlPath: "https://www.nt.se › näringsliv › ...",
    urlSubline: "… › företag › reportage",
    source: "NT.se",
    snippet:
      "Reportage om regionala satsningar och entreprenörer. Intervjuer med branschprofiler och listor över nystartade bolag.",
  },
  {
    title: "Hanell – träffar på efternamn och adress",
    urlPath: "https://www.ratsit.se › person › ...",
    urlSubline: "… › register › allmän handling",
    source: "Ratsit",
    snippet:
      "Personinfo och eventuella företagskopplingar. Uppgifterna hämtas från allmänt tillgängliga register enligt gällande lag.",
  },
  {
    title: "Bolagsinformation och ekonomi – Hanell nära din sökning",
    urlPath: "https://www.fortnox.se › foretag › sok › ...",
    urlSubline: "… › registret › nyckeltal",
    source: "Fortnox",
    snippet:
      "Sök bland svenska företag med uppdaterade uppgifter från officiella register. Se omsättning, bolagsform, adress och bokslutsöversikt för liknande namn och org.nr.",
  },
  {
    title: "Hanell Vvs Konsult - Rörmokare i nykoping",
    urlPath: "https://www.hantverkskollen.se › ... › hanell-vvs-konsult",
    urlSubline: "… › katalog › verksam › nyköping",
    source: "Hantverkskollen",
    snippet:
      "Hanell Vvs Konsult utför uppdrag i Nyköping och närliggande områden. Från vår bas på 611 22 Nyköping når vi dig snabbt. En professionell hantverkare med …",
  },
];

/** Halverar inte marginal under sista raden i scroll-mått (padding i kolumnen räknas inte som innehåll). */
const ROW_MARGIN = 22;
const HEADER_BLOCK_PX = 56;
const SNIPPET_PX = 44;

/** ~720px bred titel, 20px — färre rader i modellen = lägre scrollMax = aldrig “genom” slutet. */
function estimateRowScrollHeight(title: string): number {
  const charsPerLine = 92;
  const lines = Math.max(1, Math.ceil(title.length / charsPerLine));
  const titleBlock = 8 + lines * 26;
  return ROW_MARGIN + HEADER_BLOCK_PX + titleBlock + SNIPPET_PX;
}

const RESULTS_SCROLL_HEIGHT_PX =
  RESULTS.reduce((sum, r) => sum + estimateRowScrollHeight(r.title), 0) * GOOGLE_RESULT_ROW_SCALE;

/** Längd på scroll-rörelsen i bildrutor — lägre värde = snabbare (tidigare 250). */
const GOOGLE_SCROLL_ANIMATION_FRAMES = 150;

/** Hantverkskollen-rad: skrivmaskin, sedan lyft — scroll startar efter båda (+ kort paus). */
const GOOGLE_HANTVERKSKOLLEN_TYPEWRITER_SEC = 2.25;
const GOOGLE_HANTVERKSKOLLEN_LIFT_SEC = 0.85;
const GOOGLE_SCROLL_AFTER_INTRO_PAUSE_SEC = 0.12;

const TABS = ["All", "Images", "Videos", "News", "Short videos", "Web", "More"];

const GOOGLE_PAGINATION_HEIGHT_PX = 460;

const GoogleResultPagination: React.FC<{ k: number }> = ({ k }) => {
  const s = k * GOOGLE_RESULT_ROW_SCALE * 2.1;
  const googleLetterStyle: React.CSSProperties = {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 34 * s,
    fontWeight: 500,
    lineHeight: `${36 * s}px`,
    letterSpacing: -1.5 * s,
  };
  const pageNumberStyle: React.CSSProperties = {
    fontSize: 13 * s,
    lineHeight: `${16 * s}px`,
    fontFamily: "Arial, Helvetica, sans-serif",
  };
  const pageCellStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: 18 * s,
  };

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: `${18 * s}px ${128 * k}px ${36 * s}px`,
        marginBottom: 222 * s,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.2 * s,
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <span style={{ ...googleLetterStyle, color: "#4285f4" }}>G</span>
        <div style={pageCellStyle}>
          <span style={{ ...googleLetterStyle, color: "#ea4335" }}>o</span>
          <span style={{ ...pageNumberStyle, color: TEXT }}>1</span>
        </div>
        {Array.from({ length: 9 }, (_, index) => {
          const page = index + 2;
          return (
            <div key={page} style={pageCellStyle}>
              <span style={{ ...googleLetterStyle, color: "#fbbc04" }}>o</span>
              <span style={{ ...pageNumberStyle, color: LINK }}>{page}</span>
            </div>
          );
        })}
        <a
          href="#"
          aria-label="Next page"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: LINK,
            textDecoration: "none",
            marginLeft: 0,
          }}
        >
          <span aria-hidden style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ ...googleLetterStyle, color: "#4285f4" }}>g</span>
            <span style={{ ...googleLetterStyle, color: "#34a853" }}>l</span>
            <span style={{ ...googleLetterStyle, color: "#ea4335" }}>e</span>
            <span
              style={{
                color: LINK,
                fontSize: 22 * s,
                lineHeight: `${26 * s}px`,
                marginLeft: 7 * s,
              }}
            >
              ›
            </span>
          </span>
          <span style={{ ...pageNumberStyle, marginLeft: 30 * s }}>Next</span>
        </a>
      </div>
    </div>
  );
};

type HanellGoogleVideoProps = {
  /** When embedded in a smaller panel, pass the design size so layout matches (defaults to composition size). */
  layoutWidth?: number;
  layoutHeight?: number;
};

export const HanellGoogleVideo: React.FC<HanellGoogleVideoProps> = ({
  layoutWidth,
  layoutHeight,
}) => {
  const frame = useCurrentFrame();
  const { width: cw, height: ch, fps } = useVideoConfig();
  /** Vänta tills Hantverkskollen-raden skrivits klart och lyfts, sedan kort paus innan scroll. */
  const googleScrollDelayFrames = Math.round(
    fps *
      (GOOGLE_HANTVERKSKOLLEN_TYPEWRITER_SEC +
        GOOGLE_HANTVERKSKOLLEN_LIFT_SEC +
        GOOGLE_SCROLL_AFTER_INTRO_PAUSE_SEC),
  );
  const scrollFrame = frame - googleScrollDelayFrames;
  const width = layoutWidth ?? cw;
  const height = layoutHeight ?? ch;
  const k = width / 1920;
  /** Sticky Google-chrome (sökfält + flikar) — större än övriga layouten i smala embeds (t.ex. 960-design). */
  const GOOGLE_CHROME_SCALE = 1.85;
  const ck = k * GOOGLE_CHROME_SCALE;

  const contentTop = 188 * ck;
  const mainColumnHeader =
    20 * k + (14 * k + 12 * k) + 20 * k + 18 * k;
  const paginationHeight = GOOGLE_PAGINATION_HEIGHT_PX * k * GOOGLE_RESULT_ROW_SCALE;

  /** Search chrome is sticky; result rows and pagination scroll underneath it. */
  const totalScrollHeight =
    mainColumnHeader +
    RESULTS_SCROLL_HEIGHT_PX +
    paginationHeight;

  const rawMax = totalScrollHeight - (height - contentTop);
  // Liten marginal så vi aldrig överskattar höjden (undvik vit ruta under sista träff).
  const scrollMax = Math.max(0, Math.floor(rawMax * 0.985));

  // Börjar längst ned i listan, animerar uppåt mot sökfältet (translateY går mot 0).
  const moveY = interpolate(scrollFrame, [0, GOOGLE_SCROLL_ANIMATION_FRAMES], [-scrollMax, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.33, 0, 0.2, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: BG,
        fontFamily: "Arial, Helvetica, sans-serif",
        color: TEXT,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          background: BG,
        }}
      >
        {/* Top search row */}
        <div
          style={{
            padding: `${18 * ck}px ${28 * ck}px ${12 * ck}px ${28 * ck}px`,
            display: "flex",
            alignItems: "center",
            gap: 24 * ck,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <GoogleMark size={Math.round(88 * ck)} />
          <div style={{ flex: 1, maxWidth: 860 * ck, display: "flex", alignItems: "center" }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                minHeight: 48 * ck,
                borderRadius: 999,
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                padding: `0 ${14 * ck}px`,
                boxShadow: "0 1px 6px rgba(32,33,36,0.16)",
              }}
            >
              <Search size={20 * ck} color={LINK} strokeWidth={2} style={{ flexShrink: 0 }} />
              <div
                style={{
                  flex: 1,
                  marginLeft: 12 * ck,
                  fontSize: 16 * ck,
                  color: TEXT,
                  padding: `0 ${8 * ck}px`,
                }}
              >
                Hanell Vvs Konsult
              </div>
              <Mic size={20 * ck} color={MUTED} strokeWidth={2} style={{ marginRight: 16 * ck }} />
              <Camera size={20 * ck} color={MUTED} strokeWidth={2} />
            </div>
          </div>
          <div
            style={{
              width: 36 * ck,
              height: 36 * ck,
              borderRadius: "50%",
              background: `linear-gradient(135deg, #5b8cff, #2dd4bf)`,
              marginLeft: "auto",
              flexShrink: 0,
            }}
          />
        </div>

        {/* Tabs */}
        <div
          style={{
            padding: `${4 * ck}px ${28 * ck}px 0`,
            display: "flex",
            alignItems: "flex-end",
            gap: 4 * ck,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          {TABS.map((label, i) => {
            const selected = i === 0;
            return (
              <div
                key={label}
                style={{
                  padding: `${10 * ck}px ${10 * ck}px ${10 * ck}px`,
                  marginRight: 8 * ck,
                  fontSize: 14 * ck,
                  color: selected ? TEXT : MUTED,
                  borderBottom: selected ? `3px solid ${TEXT}` : "3px solid transparent",
                  fontWeight: selected ? 500 : 400,
                  cursor: "default",
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: contentTop,
          left: 0,
          right: 0,
          transform: `translateY(${moveY}px)`,
          zIndex: 1,
        }}
      >
        {/* Main column — narrow side inset so rows reach almost to the frame edge */}
        <div
          style={{
            padding: `${22 * k}px ${14 * k}px ${12 * k}px`,
          }}
        >
          <div
            style={{
              fontSize: 14 * k * GOOGLE_RESULT_ROW_SCALE,
              color: MUTED,
              marginBottom: 12 * k,
            }}
          >
            About 169 results (0.24s)
          </div>
          <h1
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
            }}
          >
            Search Results
          </h1>
          <h2
            style={{
              fontSize: 20 * k * GOOGLE_RESULT_ROW_SCALE,
              fontWeight: 400,
              color: TEXT,
              margin: `0 0 ${18 * k * GOOGLE_RESULT_ROW_SCALE}px`,
            }}
          >
            Webbresultat
          </h2>

          {RESULTS.map((r, index) => (
            <ResultRow
              key={`${index}-${r.urlPath}`}
              k={k}
              {...r}
              iconSeed={Math.floor((index * 17 + 11) % 97)}
              typewriter={
                index === RESULTS.length - 1
                  ? {
                      startFrame: 0,
                      durationFrames: Math.round(fps * GOOGLE_HANTVERKSKOLLEN_TYPEWRITER_SEC),
                      liftAfter: {
                        durationFrames: Math.round(fps * GOOGLE_HANTVERKSKOLLEN_LIFT_SEC),
                      },
                    }
                  : undefined
              }
            />
          ))}
          <GoogleResultPagination k={k} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
