import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, Mic, Search } from "lucide-react";

const BG = "#ffffff";
const SURFACE = "#f1f3f4";
const TEXT = "#202124";
const MUTED = "#5f6368";
const LINK = "#1a0dab";
const BORDER = "#dadce0";

type ResultRowProps = {
  title: string;
  urlPath: string;
  source: string;
  snippet: string;
  iconSeed: number;
};

const ResultRow: React.FC<ResultRowProps> = ({
  title,
  urlPath,
  source,
  snippet,
  iconSeed,
}) => {
  const u = GOOGLE_RESULT_ROW_SCALE;
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

  return (
    <div
      style={{
        marginBottom: 22 * u,
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
          <div style={{ color: TEXT, fontSize: 14 * u, lineHeight: `${20 * u}px` }}>{source}</div>
          <div
            style={{
              fontSize: 12 * u,
              color: MUTED,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {urlPath}
          </div>
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
        {title}
      </a>
      <div
        style={{
          fontSize: 14 * u,
          lineHeight: `${22 * u}px`,
          color: MUTED,
          maxWidth: "100%",
        }}
      >
        {snippet}
      </div>
    </div>
  );
};

const GoogleMark: React.FC<{ size?: number }> = ({ size = 92 }) => (
  <svg width={size} height={size * 0.33} viewBox="0 0 92 30" aria-hidden style={{ display: "block" }}>
    <path
      fill="#4285f4"
      d="M38.9 15.51c0 4.26-3.32 7.39-7.4 7.39s-7.4-3.14-7.4-7.39c0-4.28 3.32-7.39 7.4-7.39s7.4 3.1 7.4 7.39zm-3.24 0c0-2.66-1.93-4.48-4.16-4.48-2.23 0-4.16 1.82-4.16 4.48 0 2.63 1.93 4.48 4.16 4.48 2.23 0 4.16-1.85 4.16-4.48zm-23.7 7.47C5.63 22.98.31 17.83.31 11.5S5.63.02 11.96.02c3.5 0 5.99 1.37 7.87 3.16L17.62 5.4c-1.34-1.26-3.16-2.24-5.66-2.24-4.62 0-8.23 3.72-8.23 8.34 0 4.62 3.61 8.34 8.23 8.34 3 0 4.7-1.2 5.79-2.3.9-.9 1.49-2.2 1.74-4.17H12v-3.14h10.52c.11.56.17 1.23.17 1.96 0 2.35-.64 5.49-2.72 7.56-2.02 2.11-4.59 3.23-8.01 3.23zm42.94-7.47c0 4.26-3.32 7.39-7.4 7.39s-7.4-3.14-7.4-7.39c0-4.28 3.32-7.39 7.4-7.39s7.4 3.1 7.4 7.39zm-3.24 0c0-2.66-1.93-4.48-4.16-4.48-2.23 0-4.16 1.82-4.16 4.48 0 2.63 1.93 4.48 4.16 4.48 2.23 0 4.16-1.85 4.16-4.48zM70 8.56v13.27c0 5.46-3.05 7.7-6.86 7.7-3.58 0-5.74-2.41-6.55-4.37l2.83-1.18c.5 1.2 1.74 2.63 3.72 2.63 2.44 0 3.78-1.51 3.78-4.34v-1.06h-.11c-.73.9-2.04 1.68-3.81 1.68-3.7 0-7-3.22-7-7.36 0-4.17 3.3-7.42 7-7.42 1.76 0 3.08.78 3.81 1.65h.11v-1.2H70zm-2.86 6.97c0-2.6-1.74-4.51-3.95-4.51-2.24 0-3.95 1.9-3.95 4.51 0 2.58 1.71 4.45 3.95 4.45 2.22.01 3.95-1.87 3.95-4.45zM75 1.17V22.9h-3V1.17h3zm12.5 16.77l2.48 1.68c-.8 1.2-2.73 3.28-6.06 3.28-4.13 0-7.22-3.25-7.22-7.39 0-4.4 3.11-7.39 6.86-7.39 3.78 0 5.62 3.05 6.23 4.7l.31.85-9.71 4.08c.74 1.48 1.9 2.24 3.53 2.24s2.76-.82 3.58-2.05zm-7.63-2.66l6.5-2.74c-.36-.92-1.43-1.57-2.7-1.57-1.62 0-3.88 1.46-3.8 4.31z"
    />
  </svg>
);

/** Proportional size increase for each result block (same layout ratios). */
const GOOGLE_RESULT_ROW_SCALE = 1.12;

const RESULTS: Omit<ResultRowProps, "iconSeed">[] = [
  {
    title: "Hanell Vvs Konsult - Rörmokare i nykoping",
    urlPath: "https://www.hantverkskollen.se › ... › hanell-vvs-konsult",
    source: "Hantverkskollen",
    snippet:
      "Hanell Vvs Konsult utför uppdrag i Nyköping och närliggande områden. Från vår bas på 611 22 Nyköping når vi dig snabbt. En professionell hantverkare med …",
  },
  {
    title: "Anders Rune Hanell",
    urlPath: "https://krafman.se › engagemang",
    source: "Krafman",
    snippet:
      "Hanell, Anders Rune är en man född den 24 februari 1963. Han är verksam i de företag och/eller föreningar som anges nedan.",
  },
  {
    title: "Hitta företag som erbjuder de produkter eller tjänster du söker",
    urlPath: "https://www.industritorget.se › väg › ...",
    source: "Industritorget.se",
    snippet:
      "Företagsregister där du kan söka bland företag som säljer de produkter eller tillhandahåller de tjänster du efterfrågar.",
  },
  {
    title: "Anbud",
    urlPath: "https://app.pabliq.se › procurements › ...",
    source: "Pabliq",
    snippet:
      "EVK – Energi & VVS Konsult AB. Tekniska konsulter inom bygg. Sigma … amanda.hanell@ecenea.se. Dunderbergsgatan 2, 382 80 Nybro. Bransch. Region …",
  },
  {
    title: "Hanell Consulting AB - Org.nr 559318-8898 - Sköndal",
    urlPath: "https://www.allabolag.se › sköndal › ...",
    source: "Allabolag",
    snippet:
      "Företaget erbjuder konsultstöd och expertis inom utveckling av individ, grupp, ledarskap och företagskultur med syfte att utveckla kundens effektivitet …",
  },
  {
    title: "Partners",
    urlPath: "https://www.parter.se › sponsors",
    source: "Parter.se",
    snippet:
      "Partners hos Parter.se. Här hittar du samtliga partners som är aktiva hos oss och kan söka fram rätt leverantör direkt.",
  },
  {
    title: "Hanell Entreprenad – Hanell Entreprenad AB",
    urlPath: "https://www.hanelle.se",
    source: "Hanell Entreprenad",
    snippet:
      "Vi är ett nytänkande företag som utför byggnationer och underhåll inom järnvägssektorn. Säkerhet är grundläggande i verksamheten.",
  },
  {
    title: "Bästa Tillväxt 2025 - Gävle kommun",
    urlPath: "https://upplysningar.syna.se › gavle-kommun-2180",
    source: "AB Syna",
    snippet:
      "Hanell Entreprenad i Gävle AB finns med i listan tillsammans med andra lokala bolag. Offentliga uppgifter och bolagsdata.",
  },
  {
    title: "Hanell Consulting AB - Katalanvägen 4 i Stockholm",
    urlPath: "https://www.hitta.se › verksamhet",
    source: "Hitta.se",
    snippet:
      "Hanell Consulting AB är verksam inom konsultverksamhet avseende företagsorganisation och hade 1 anställd under senaste redovisade året.",
  },
  {
    title: "Hanell VVS & Konsult | Nyköping – ledningar, värme, sanitet",
    urlPath: "https://www.google.com › maps › place",
    source: "Google Maps",
    snippet:
      "Öppettider, omdömen och vägbeskrivning. Kontrollera telefon och adress innan du bokar. Uppdaterade uppgifter om rörmokare och VVS i Nyköping.",
  },
  {
    title: "Rune Hanell – roller och uppdrag | LinkedIn",
    urlPath: "https://www.linkedin.com › in › ...",
    source: "LinkedIn",
    snippet:
      "Erfarenhet inom teknik, projekt och rådgivning. Se kontakter, kurser och tidigare arbetsgivare i profilen som matchar din sökning.",
  },
  {
    title: "Hanell Entreprenad AB | Företagsinfo & nyckeltal",
    urlPath: "https://www.proff.se › företag › hanell-entreprenad-ab",
    source: "Proff.se",
    snippet:
      "Omsättning, resultat och styrelse. Jämför liknande bolag i Gävleborgs län. Hämta årsredovisningar och officiella poster.",
  },
  {
    title: "Rörinstallation & VVS – offert och prisjämförelse",
    urlPath: "https://www.servicefinder.se › vvs › närke",
    source: "Servicefinder",
    snippet:
      "Få offerter från certifierade rörmokare. Ange postort och typ av jobb – badrum, värmepump, stambyte. Gratis och utan köpkrav.",
  },
  {
    title: "Anders Rune Hanell – adress, telefon, ålder",
    urlPath: "https://www.merinfo.se › person › ...",
    source: "Merinfo",
    snippet:
      "Allmänna uppgifter från offentliga källor. Se företagsengagemang och historik där sådana uppgifter finns tillgängliga.",
  },
  {
    title: "Hanell Consulting AB | Bolagsordning och firmateckning",
    urlPath: "https://bolagsverket.se › ... › verksamt",
    source: "Bolagsverket / Verksamt",
    snippet:
      "Registreringsdatum, säte och bolagsform. Styrelse och revisorer enligt senaste inlämnade handlingar.",
  },
  {
    title: "VVS-installatörer nära dig – kvalitetssäkrade hantverkare",
    urlPath: "https://www.vvsforum.se › artikel › ...",
    source: "VVS Forum",
    snippet:
      "Branschguide med checklista för beställaren: certifikat, ROT-avdrag, säker arbetsmiljö och garanti på täta stamnät och rörinstallation.",
  },
  {
    title: "Gävle kommun – leverantörslista och avtal",
    urlPath: "https://www.gavle.se › kommun › affär › ...",
    source: "Gävle kommun",
    snippet:
      "Här publiceras ramavtal och entreprenörer som får utföra arbeten enligde kommunens upphandlingsvillkor. Sök leverantör eller bransch.",
  },
  {
    title: "Hanell Consulting AB – skatt och deklaration",
    urlPath: "https://www.skatteverket.se › företag › ...",
    source: "Skatteverket",
    snippet:
      "Generell information om F-skatt, moms och arbetsgivaravgifter för aktiebolag. Lokala blanketten hittas via Mina sidor.",
  },
  {
    title: "Konsulter inom infrastruktur och banunderhåll",
    urlPath: "https://www.trafikverket.se › anbud › ram-avtal",
    source: "Trafikverket",
    snippet:
      "Upphandlingar och tekniska krav för underhåll av järnväg. Säkerhetsklassning och projektörskrav för entreprenörer.",
  },
  {
    title: "Recension: jour mot läckage i kylar/skölj - VVS Nyköping",
    urlPath: "https://www.reco.se › rörmokare › nyköping",
    source: "Reco.se",
    snippet:
      "Verifierade kundomdömen. Snittbetyg, svarstid på akutjour och prisnivå. Jämför upp till fem företag i samma kategori.",
  },
  {
    title: "Bolagsstämma och ägarstruktur – aktiebolag Stockholm",
    urlPath: "https://www.uc.se › bolagsinformation › ...",
    source: "UC",
    snippet:
      "Kreditrating, betalningsanmärkningar och nyckeltal. Översikt över koncern och närstående bolag när sådana finns registrerade.",
  },
  {
    title: "Installatörsföretagen – auktoriserade VVS-företag",
    urlPath: "https://www.if.se › sök › auktoriserad",
    source: "Installatörsföretagen",
    snippet:
      "Hitta auktoriserat företag med yrkeslegitimation. Säker VVS-installation enligt branschregler och Elsäkerhetsverkets råd.",
  },
  {
    title: "Bygg och anläggning – underleverantörer och entreprenad",
    urlPath: "https://www.byggfakta.se › projekt › ...",
    source: "Byggfakta",
    snippet:
      "Projektregister med tidplan, huvudentreprenör och inblandade parter. Sök på ort eller projekttyp.",
  },
  {
    title: "Nyköpings-Tidningen – lokala företag i fokus",
    urlPath: "https://www.nt.se › näringsliv › ...",
    source: "NT.se",
    snippet:
      "Reportage om regionala satsningar och entreprenörer. Intervjuer med branschprofiler och listor över nystartade bolag.",
  },
  {
    title: "Hanell – träffar på efternamn och adress",
    urlPath: "https://www.ratsit.se › person › ...",
    source: "Ratsit",
    snippet:
      "Personinfo och eventuella företagskopplingar. Uppgifterna hämtas från allmänt tillgängliga register enligt gällande lag.",
  },
];

/** Halverar inte marginal under sista raden i scroll-mått (padding i kolumnen räknas inte som innehåll). */
const ROW_MARGIN = 22;
const HEADER_BLOCK_PX = 40;
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

const TABS = ["All", "Images", "Videos", "News", "Short videos", "Web", "More"];

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
  const { width: cw, height: ch } = useVideoConfig();
  const width = layoutWidth ?? cw;
  const height = layoutHeight ?? ch;
  const k = width / 1920;

  const contentTop = 72 * k + 58 * k + 58 * k;
  const mainColumnHeader =
    20 * k + (14 * k + 12 * k) + 20 * k + 18 * k;

  // Sluta där sista träffen slutar — räkna INTE `padding-bottom` på huvudkolumnen (skulle ge vitt under sista länken).
  const totalScrollHeight = contentTop + mainColumnHeader + RESULTS_SCROLL_HEIGHT_PX;
  const rawMax = totalScrollHeight - height;
  // Liten marginal så vi aldrig överskattar höjden (undvik vit ruta under sista träff).
  const scrollMax = Math.max(0, Math.floor(rawMax * 0.985));

  // Börjar längst ned i listan, animerar uppåt mot sökfältet (translateY går mot 0).
  const moveY = interpolate(frame, [0, 250], [-scrollMax, 0], {
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
          inset: 0,
          transform: `translateY(${moveY}px)`,
        }}
      >
        {/* Top search row */}
        <div
          style={{
            padding: `${18 * k}px ${28 * k}px ${12 * k}px`,
            display: "flex",
            alignItems: "center",
            gap: 24 * k,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <GoogleMark size={Math.round(88 * k)} />
          <div style={{ flex: 1, maxWidth: 860 * k, display: "flex", alignItems: "center" }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                minHeight: 48 * k,
                borderRadius: 999,
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                padding: `0 ${14 * k}px`,
                boxShadow: "0 1px 6px rgba(32,33,36,0.16)",
              }}
            >
              <Search size={20 * k} color={LINK} strokeWidth={2} style={{ flexShrink: 0 }} />
              <div
                style={{
                  flex: 1,
                  marginLeft: 12 * k,
                  fontSize: 16 * k,
                  color: TEXT,
                  padding: `${12 * k}px ${8 * k}px 0`,
                }}
              >
                Hanell Vvs Konsult
              </div>
              <Mic size={20 * k} color={MUTED} strokeWidth={2} style={{ marginRight: 16 * k }} />
              <Camera size={20 * k} color={MUTED} strokeWidth={2} />
            </div>
          </div>
          <div
            style={{
              width: 36 * k,
              height: 36 * k,
              borderRadius: "50%",
              background: `linear-gradient(135deg, #5b8cff, #2dd4bf)`,
              flexShrink: 0,
            }}
          />
        </div>

        {/* Tabs */}
        <div
          style={{
            padding: `${4 * k}px ${28 * k}px 0`,
            display: "flex",
            alignItems: "flex-end",
            gap: 4 * k,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          {TABS.map((label, i) => {
            const selected = i === 0;
            return (
              <div
                key={label}
                style={{
                  padding: `${10 * k}px ${10 * k}px ${10 * k}px`,
                  marginRight: 8 * k,
                  fontSize: 14 * k,
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

        {/* Main column — narrow side inset so rows reach almost to the frame edge */}
        <div
          style={{
            padding: `${22 * k}px ${14 * k}px ${52 * k}px`,
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
              {...r}
              iconSeed={Math.floor((index * 17 + 11) % 97)}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
