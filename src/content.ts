/**
 * All site wording and facts live here, so the team can update the site
 * without touching layout code.
 *
 * Rules:
 * - Every line has English (en) and Kiswahili (sw). The Kiswahili is a draft:
 *   have a native speaker from Makongi check it before launch.
 * - A fact set to null is NOT shown on the site. Fill it in with a real,
 *   checked number and it appears automatically. Never type a guess.
 */

export type Lang = 'en' | 'sw';
export type T = { en: string; sw: string };

// ---------------------------------------------------------------------------
// Contact (kept from the previous site)
// ---------------------------------------------------------------------------
export const contact = {
  phoneDisplay: '+254 797 129 778',
  phoneTel: '+254797129778',
  whatsapp: 'https://wa.me/254797129778',
  email: 'kevinbaraka52@gmail.com',
  linkedinName: 'Baraka Kevin',
  linkedin: 'https://www.linkedin.com/in/baraka-kevin-9375371a4',
  formspree: 'https://formspree.io/f/mdalwyla',
};

// ---------------------------------------------------------------------------
// Media (kept from the previous site)
// ---------------------------------------------------------------------------
export const photos = {
  production: {
    src: 'https://barakaranka.github.io/green-carbon-valley/farmer_1.png',
    caption: { en: 'Making biochar', sw: 'Kutengeneza biochar' },
    alt: { en: 'Farmers preparing a biochar batch', sw: 'Wakulima wakiandaa awamu ya biochar' },
  },
  application: {
    src: 'https://barakaranka.github.io/green-carbon-valley/farmer_2.png',
    caption: { en: 'Putting it into the soil', sw: 'Kuiweka udongoni' },
    alt: { en: 'Biochar being applied to a field', sw: 'Biochar ikiwekwa shambani' },
  },
  crops: {
    src: 'https://barakaranka.github.io/green-carbon-valley/farmer_3.png',
    caption: { en: 'The crop that follows', sw: 'Mazao yanayofuata' },
    alt: { en: 'Healthy crops on a biochar plot', sw: 'Mazao yenye afya kwenye shamba lenye biochar' },
  },
};

export const video = {
  youtubeId: '33CBOYVyb6g',
  title: { en: 'Biochar on a farm', sw: 'Biochar shambani' },
};

// ---------------------------------------------------------------------------
// Our numbers. null = hidden until we have a real figure.
// ---------------------------------------------------------------------------
export const stats: { value: number | null; unit?: T; label: T }[] = [
  { value: null, label: { en: 'farmers have made their first batch', sw: 'wakulima wametengeneza awamu yao ya kwanza' } },
  { value: null, label: { en: 'batches fired in our kiln', sw: 'awamu zilizochomwa kwenye tanuri letu' } },
  { value: null, unit: { en: 'kg', sw: 'kg' }, label: { en: 'of biochar made so far', sw: 'za biochar zimetengenezwa hadi sasa' } },
];
/** e.g. 'July 2026'. Shown as "since …" next to the numbers. null = hidden. */
export const statsSince: T | null = null;

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
export type RouteKey = 'home' | 'how' | 'kiln' | 'results' | 'investors' | 'join' | 'privacy';

export const routes: { key: RouteKey; path: string; label: T; inNav: boolean }[] = [
  { key: 'home', path: '#/', label: { en: 'Biochar', sw: 'Biochar' }, inNav: true },
  { key: 'how', path: '#/how', label: { en: 'How we make it', sw: 'Jinsi tunavyoitengeneza' }, inNav: true },
  { key: 'kiln', path: '#/kiln', label: { en: 'Our kiln', sw: 'Tanuri letu' }, inNav: true },
  { key: 'results', path: '#/results', label: { en: 'Results', sw: 'Matokeo' }, inNav: true },
  { key: 'investors', path: '#/investors', label: { en: 'For investors', sw: 'Kwa wawekezaji' }, inNav: true },
  { key: 'join', path: '#/get-involved', label: { en: 'Get involved', sw: 'Jiunge nasi' }, inNav: true },
  { key: 'privacy', path: '#/privacy', label: { en: 'Privacy', sw: 'Faragha' }, inNav: false },
];

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------
export const common = {
  siteName: 'Green Carbon Valley',
  tagline: { en: 'Biochar from Makongi, made by farmers, for farmers.', sw: 'Biochar kutoka Makongi, imetengenezwa na wakulima, kwa ajili ya wakulima.' },
  whatsappCta: { en: 'Message us on WhatsApp', sw: 'Tuandikie WhatsApp' },
  askCta: { en: 'Have a question?', sw: 'Una swali?' },
  menu: { en: 'Menu', sw: 'Menyu' },
  close: { en: 'Close', sw: 'Funga' },
  langLabel: { en: 'Language', sw: 'Lugha' },
  photoMissing: { en: 'Photo coming soon', sw: 'Picha inakuja hivi karibuni' },
  playVideo: { en: 'Play video', sw: 'Cheza video' },
  since: { en: 'since', sw: 'tangu' },
  rights: { en: 'All rights reserved.', sw: 'Haki zote zimehifadhiwa.' },
};

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------
export const home = {
  hero: {
    eyebrow: { en: 'Makongi, Kenya', sw: 'Makongi, Kenya' },
    title: { en: 'Your maize stalks are worth more than smoke.', sw: 'Mabua yako ya mahindi yana thamani kuliko moshi.' },
    body: {
      en: 'We turn crop leftovers and water hyacinth into biochar: a charcoal that helps your soil hold water and nutrients for years. Here is how we make it, and how you can too.',
      sw: 'Tunageuza mabaki ya mazao na magugu maji kuwa biochar: mkaa unaosaidia udongo wako kushika maji na virutubisho kwa miaka mingi. Hivi ndivyo tunavyoitengeneza, na jinsi unavyoweza kufanya hivyo pia.',
    },
    primary: { en: 'See how it’s made', sw: 'Ona jinsi inavyotengenezwa' },
  },
  what: {
    title: { en: 'Charcoal for your soil, not your jiko', sw: 'Mkaa wa udongo, si wa jiko' },
    body: {
      en: 'We heat farm leftovers inside a closed drum with very little air, so they turn to char instead of ash. Mixed with manure or compost and dug into the soil, biochar holds on to water and nutrients that would otherwise wash away.',
      sw: 'Tunapasha moto mabaki ya shamba ndani ya pipa lililofungwa lenye hewa kidogo sana, ili yawe mkaa badala ya majivu. Ikichanganywa na samadi au mboji na kuchimbiwa udongoni, biochar hushika maji na virutubisho ambavyo vingesombwa na mvua.',
    },
    points: [
      {
        title: { en: 'Holds water and fertiliser', sw: 'Hushika maji na mbolea' },
        body: {
          en: 'Its tiny pores soak up water and nutrients and release them slowly to the roots, which helps in dry spells.',
          sw: 'Vitundu vyake vidogo hufyonza maji na virutubisho na kuviachilia taratibu kwa mizizi, jambo linalosaidia wakati wa ukame.',
        },
      },
      {
        title: { en: 'Eases acidic soils', sw: 'Hupunguza tindikali ya udongo' },
        body: {
          en: 'Biochar is naturally alkaline, so it can help lift the pH of the acidic red soils found on many Kenyan farms.',
          sw: 'Biochar kwa asili ina alkali, hivyo inaweza kusaidia kupandisha pH ya udongo mwekundu wenye tindikali unaopatikana katika mashamba mengi ya Kenya.',
        },
      },
      {
        title: { en: 'Keeps carbon in the ground', sw: 'Huhifadhi kaboni ardhini' },
        body: {
          en: 'Carbon that would have gone up as smoke stays in the soil. About 80% of it is still there after 100 years.',
          sw: 'Kaboni ambayo ingepanda angani kama moshi hubaki udongoni. Takriban asilimia 80 yake bado ipo baada ya miaka 100.',
        },
        source: { label: 'IPCC 2019', href: 'https://www.ipcc-nggip.iges.or.jp/public/2019rf/pdf/4_Volume4/19R_V4_Ch02_Ap4_Biochar.pdf' },
      },
    ],
  },
  feedstock: {
    title: { en: 'Made from what’s already on the farm', sw: 'Hutengenezwa kwa kilichopo shambani tayari' },
    items: [
      { en: 'Maize stover and cobs', sw: 'Mabua na vigunzi vya mahindi' },
      { en: 'Coffee and rice husks', sw: 'Maganda ya kahawa na mpunga' },
      { en: 'Tree prunings', sw: 'Matawi ya miti yaliyopogolewa' },
      { en: 'Water hyacinth from the lake', sw: 'Magugu maji kutoka ziwani' },
    ],
    ruleOfThumb: {
      en: '100 kg of dry maize stover gives about 25 kg of biochar.',
      sw: 'Kilo 100 za mabua makavu ya mahindi hutoa takriban kilo 25 za biochar.',
    },
    numbersTitle: { en: 'So far', sw: 'Hadi sasa' },
  },
  photosTitle: { en: 'From the field', sw: 'Kutoka shambani' },
  videoTitle: { en: 'See it on a farm', sw: 'Ione shambani' },
  videoBody: {
    en: 'A short look at biochar being made and used.',
    sw: 'Mtazamo mfupi wa jinsi biochar inavyotengenezwa na kutumika.',
  },
  steps: {
    title: { en: 'Five steps from leftovers to soil', sw: 'Hatua tano kutoka mabaki hadi udongoni' },
    link: { en: 'The full guide', sw: 'Mwongozo kamili' },
    items: [
      { en: 'Collect and dry your leftovers', sw: 'Kusanya na kausha mabaki' },
      { en: 'Pack the inner drum', sw: 'Jaza pipa la ndani' },
      { en: 'Fire the kiln', sw: 'Washa tanuri' },
      { en: 'Cool the char with water', sw: 'Poza mkaa kwa maji' },
      { en: 'Mix with manure and apply', sw: 'Changanya na samadi kisha weka shambani' },
    ],
  },
  paths: {
    farmers: {
      title: { en: 'If you farm', sw: 'Kama wewe ni mkulima' },
      body: {
        en: 'Come to a kiln day, learn to make your own, or ask about buying biochar.',
        sw: 'Hudhuria siku ya tanuri, jifunze kutengeneza yako, au uliza kuhusu kununua biochar.',
      },
      cta: { en: 'Get involved', sw: 'Jiunge nasi' },
    },
    investors: {
      title: { en: 'If you want to back this', sw: 'Kama ungependa kuunga mkono' },
      body: {
        en: 'We’re building a kiln a farmer group can share, and selling biochar to farmers who’d rather buy it. Here’s where we are.',
        sw: 'Tunajenga tanuri ambalo kikundi cha wakulima kinaweza kutumia pamoja, na kuuza biochar kwa wakulima wanaopendelea kununua. Hapa ndipo tulipofika.',
      },
      cta: { en: 'For investors', sw: 'Kwa wawekezaji' },
    },
  },
};

// ---------------------------------------------------------------------------
// Feedstock figures (agreed in the design brief, 3 Nov 2026)
// yield  = kg biochar per kg dry feedstock
// carbon = organic carbon share of the biochar (IPCC 2019 defaults)
// CO2 per kg biochar = carbon × 0.80 (share left after 100 years) × 44/12
// Replace a row with your own lab result once you have it.
// ---------------------------------------------------------------------------
export const PERMANENCE = 0.8;
export const CO2_PER_C = 44 / 12;
export const RANGE = 0.3; // results are shown as ±30%

export type FeedstockId = 'crop' | 'wood' | 'nutshell' | 'rice' | 'hyacinth';

export const feedstocks: {
  id: FeedstockId;
  label: T;
  yield: number;
  carbon: number;
  basis: string;
  assumption?: boolean;
}[] = [
  {
    id: 'crop',
    label: { en: 'Maize stover and cobs, bagasse, coffee husk, bean haulms', sw: 'Mabua na vigunzi vya mahindi, makapi ya miwa, maganda ya kahawa, mabua ya maharagwe' },
    yield: 0.25,
    carbon: 0.65,
    basis: 'Yield: Lee et al. 2013. Carbon: IPCC 2019 (herbaceous)',
  },
  {
    id: 'wood',
    label: { en: 'Wood, prunings, sawdust', sw: 'Mbao, matawi yaliyopogolewa, unga wa mbao' },
    yield: 0.25,
    carbon: 0.77,
    basis: 'Yield: Lee et al. 2013. Carbon: IPCC 2019 (wood)',
  },
  {
    id: 'nutshell',
    label: { en: 'Nut shells (macadamia, coconut)', sw: 'Maganda ya karanga (makadamia, nazi)' },
    yield: 0.3,
    carbon: 0.74,
    basis: 'Carbon: IPCC 2019 (nut shells). Yield: our estimate',
    assumption: true,
  },
  {
    id: 'rice',
    label: { en: 'Rice husk and straw', sw: 'Maganda na majani ya mpunga' },
    yield: 0.33,
    carbon: 0.49,
    basis: 'Yield: Zhang et al. 2015. Carbon: IPCC 2019 (rice)',
  },
  {
    id: 'hyacinth',
    label: { en: 'Water hyacinth', sw: 'Magugu maji' },
    yield: 0.28,
    carbon: 0.35,
    basis: 'Yield: Tshikovhi et al. 2025. Carbon: our cautious assumption until lab tested',
    assumption: true,
  },
];

/** Fresh water hyacinth is roughly 90% water. */
export const HYACINTH_WATER = 0.9;

export const co2PerKgBiochar = (carbon: number) => carbon * PERMANENCE * CO2_PER_C;

// ---------------------------------------------------------------------------
// How we make it
// ---------------------------------------------------------------------------
export const how = {
  title: { en: 'How we make biochar', sw: 'Jinsi tunavyotengeneza biochar' },
  intro: {
    en: 'This is how we do it in Makongi with our retort kiln. The same ideas work with a simpler drum kiln. If anything here is unclear, message us and we’ll talk you through it.',
    sw: 'Hivi ndivyo tunavyofanya Makongi kwa tanuri letu la pipa mbili. Mawazo hayo hayo yanafanya kazi kwa tanuri rahisi la pipa moja. Kama kuna jambo lisiloeleweka, tuandikie na tutakuelekeza.',
  },
  steps: [
    {
      title: { en: 'Collect and dry', sw: 'Kusanya na kausha' },
      body: {
        en: 'Use leftovers nobody needs: stover, cobs, husks, prunings. Dry them until they snap instead of bending. Water hyacinth is mostly water, so spread it thin in the sun for several days first.',
        sw: 'Tumia mabaki yasiyohitajika: mabua, vigunzi, maganda, matawi. Yakaushe hadi yavunjike badala ya kupinda. Magugu maji yana maji mengi, kwa hiyo yatandaze kwa safu nyembamba juani kwa siku kadhaa kwanza.',
      },
    },
    {
      title: { en: 'Cut and pack', sw: 'Kata na jaza' },
      body: {
        en: 'Cut long stalks to about the length of your hand so they pack tightly. Fill the inner drum to the top and close the lid.',
        sw: 'Kata mabua marefu yawe karibu urefu wa kiganja chako ili yajae vizuri. Jaza pipa la ndani hadi juu kisha funga mfuniko.',
      },
    },
    {
      title: { en: 'Light the fire', sw: 'Washa moto' },
      body: {
        en: 'Start a fire in the space between the two drums with dry wood or stalks. As the inner drum heats up, gases come out of the leftovers. A pipe carries them back into the fire, so they burn instead of leaving as smoke.',
        sw: 'Washa moto katika nafasi kati ya mapipa mawili kwa kuni kavu au mabua. Pipa la ndani linapopata joto, gesi hutoka kwenye mabaki. Bomba huzirudisha motoni, hivyo huungua badala ya kutoka kama moshi.',
      },
    },
    {
      title: { en: 'Wait and watch', sw: 'Subiri na chunguza' },
      body: {
        en: 'A batch takes a few hours. When the flame from the gas pipe dies down, the leftovers have turned to char. Let the outer fire burn out.',
        sw: 'Awamu moja huchukua saa kadhaa. Moto unaotoka kwenye bomba la gesi ukipungua, mabaki yamekuwa mkaa. Acha moto wa nje uzime wenyewe.',
      },
    },
    {
      title: { en: 'Cool it down', sw: 'Ipoze' },
      body: {
        en: 'Let the drum cool before you open it. If you have to empty it while hot, spread the char out and soak it with plenty of water straight away. Hot char catches fire again in open air.',
        sw: 'Acha pipa lipoe kabla ya kulifungua. Ukilazimika kulimwaga likiwa la moto, tandaza mkaa na uumwagie maji mengi mara moja. Mkaa wa moto hushika moto tena ukipata hewa.',
      },
    },
    {
      title: { en: 'Charge it, then use it', sw: 'Ichaji, kisha itumie' },
      body: {
        // Team: add your own mix and resting time here once agreed.
        en: 'Fresh biochar is hungry: on its own it can soak up nutrients your crop needs. Crush it small, mix it well with manure or compost, and leave it damp in the shade for a while so it fills up with nutrients. Then put it in planting holes or furrows.',
        sw: 'Biochar mpya ina “njaa”: peke yake inaweza kufyonza virutubisho ambavyo zao lako linahitaji. Iponde iwe vipande vidogo, ichanganye vizuri na samadi au mboji, na iache ikiwa na unyevu kivulini kwa muda ili ijae virutubisho. Kisha iweke kwenye mashimo ya kupandia au mifereji.',
      },
    },
  ],
  safety: {
    title: { en: 'Stay safe', sw: 'Kuwa salama' },
    items: [
      { en: 'Fire the kiln away from houses, stores and dry grass.', sw: 'Washa tanuri mbali na nyumba, stoo na nyasi kavu.' },
      { en: 'Keep children and animals well back.', sw: 'Weka watoto na mifugo mbali.' },
      { en: 'Wear closed shoes and gloves, and keep water close by.', sw: 'Vaa viatu vilivyofungwa na glovu, na weka maji karibu.' },
      { en: 'Never block the gas pipe while the drum is hot.', sw: 'Usiwahi kuziba bomba la gesi pipa likiwa la moto.' },
    ],
  },
  yieldsTitle: { en: 'What to expect from 100 kg of dry leftovers', sw: 'Unachotarajia kutoka kilo 100 za mabaki makavu' },
  yieldsNote: {
    en: 'Starting estimates. Your kiln and your leftovers will differ, so weigh what goes in and what comes out.',
    sw: 'Makadirio ya mwanzo. Tanuri lako na mabaki yako yatatofautiana, kwa hiyo pima kinachoingia na kinachotoka.',
  },
  assumptionNote: {
    en: '* Our own estimate until we have lab or field results.',
    sw: '* Makisio yetu hadi tupate matokeo ya maabara au shambani.',
  },
  askTitle: { en: 'Want to try it on your farm?', sw: 'Ungependa kujaribu shambani kwako?' },
  askBody: {
    en: 'Ask us for the printed guide, or come to the next kiln day in Makongi.',
    sw: 'Tuombe mwongozo uliochapishwa, au hudhuria siku ijayo ya tanuri Makongi.',
  },
};

// ---------------------------------------------------------------------------
// Our kiln
// ---------------------------------------------------------------------------
export const kiln = {
  title: { en: 'Look inside our kiln', sw: 'Tazama ndani ya tanuri letu' },
  intro: {
    en: 'A double-drum retort on a steel skid, so it can be moved between farms. Leftovers char in the inner drum while the fire burns around it, and the gases they give off are burned instead of released as smoke.',
    sw: 'Tanuri la mapipa mawili juu ya fremu ya chuma, ili liweze kuhamishwa kati ya mashamba. Mabaki huwa mkaa ndani ya pipa la ndani moto ukiwaka kulizunguka, na gesi zinazotoka huchomwa badala ya kuachiliwa kama moshi.',
  },
  /** Web 3D model (.glb) exported from Inventor. null = 3D button hidden. */
  glbUrl: null as string | null,
  /** Numbered points shown on the 3D model. Positions come from the model (x y z in metres). */
  hotspots: [] as { position: string; normal: string; label: T }[],
  view3d: { en: 'Turn it around in 3D', sw: 'Lizungushe kwa 3D' },
  view3dHint: { en: 'Drag to turn. Pinch to zoom.', sw: 'Buruta kuzungusha. Bana kukuza.' },
  loading3d: { en: 'Loading the 3D model…', sw: 'Inapakia muundo wa 3D…' },
  stagesTitle: { en: 'What happens inside', sw: 'Kinachotokea ndani' },
  stages: [
    {
      name: { en: 'Drying', sw: 'Kukauka' },
      body: { en: 'Leftover water boils off. The drum gives off steam.', sw: 'Maji yaliyobaki hutoka kama mvuke.' },
    },
    {
      name: { en: 'Charring', sw: 'Kuwa mkaa' },
      body: {
        en: 'With almost no air inside, the leftovers break down into char and gas. The gas is piped back into the fire.',
        sw: 'Bila hewa ndani, mabaki hugawanyika kuwa mkaa na gesi. Gesi hurudishwa motoni kwa bomba.',
      },
    },
    {
      name: { en: 'Cooling', sw: 'Kupoa' },
      body: { en: 'The drum is closed off and left to cool so the char doesn’t burn to ash.', sw: 'Pipa hufungwa na kuachwa lipoe ili mkaa usiungue kuwa majivu.' },
    },
  ],
  specsTitle: { en: 'Design figures', sw: 'Vipimo vya muundo' },
  specsNote: {
    en: 'These are the figures the kiln was designed for. We are measuring them in the field, and real averages will replace them.',
    sw: 'Hivi ni vipimo ambavyo tanuri liliundwa kufikia. Tunavipima shambani, na wastani halisi utachukua nafasi yake.',
  },
  specs: [
    { label: { en: 'Load per batch', sw: 'Mzigo kwa awamu' }, value: { en: 'About 100 kg of dry leftovers', sw: 'Takriban kilo 100 za mabaki makavu' } },
    { label: { en: 'Charring temperature', sw: 'Joto la kuwa mkaa' }, value: { en: '450–550 °C', sw: '450–550 °C' } },
    { label: { en: 'Time per batch', sw: 'Muda kwa awamu' }, value: { en: '2–4 hours', sw: 'Saa 2–4' } },
    { label: { en: 'Inner drum', sw: 'Pipa la ndani' }, value: { en: 'Ø 800 mm × 1,500 mm, 5–6 mm steel', sw: 'Ø 800 mm × 1,500 mm, chuma cha mm 5–6' } },
    { label: { en: 'Outer furnace', sw: 'Tanuri la nje' }, value: { en: '6–8 mm mild steel', sw: 'Chuma laini cha mm 6–8' } },
    { label: { en: 'Moving it', sw: 'Kulihamisha' }, value: { en: 'Steel skid, towed between farms', sw: 'Fremu ya chuma, huvutwa kati ya mashamba' } },
  ],
  /** Safety parts actually fitted to the kiln. Empty = section hidden. */
  safetyFeatures: [] as T[],
  safetyTitle: { en: 'Safety parts fitted', sw: 'Vifaa vya usalama vilivyowekwa' },
  /** Replace photos.production with a real kiln photo when you have one, and update this caption. */
  photoCaption: { en: 'Making biochar', sw: 'Kutengeneza biochar' },
};

// ---------------------------------------------------------------------------
// Results: numbers, batch log, calculator
// ---------------------------------------------------------------------------
export const results = {
  title: { en: 'What we’ve measured so far', sw: 'Tulichopima hadi sasa' },
  intro: {
    en: 'Every time a group fires the kiln, they weigh what went in and what came out and log it here. We only show numbers we have actually recorded.',
    sw: 'Kila mara kikundi kinapowasha tanuri, hupima kilichoingia na kilichotoka na kukiandika hapa. Tunaonyesha tu namba ambazo tumezirekodi kweli.',
  },
  totals: {
    batches: { en: 'batches logged', sw: 'awamu zilizorekodiwa' },
    biochar: { en: 'kg of biochar made', sw: 'kg za biochar zilizotengenezwa' },
    co2: { en: 'kg of CO₂ kept out of the air (estimate)', sw: 'kg za CO₂ zilizozuiwa angani (makadirio)' },
  },
  log: {
    title: { en: 'Batch log', sw: 'Daftari la awamu' },
    empty: {
      en: 'No batches logged yet. The first entries will appear here as soon as they are recorded.',
      sw: 'Bado hakuna awamu iliyorekodiwa. Za kwanza zitaonekana hapa mara tu zitakaporekodiwa.',
    },
    loadError: {
      en: 'We couldn’t load the batch log just now. Please try again later.',
      sw: 'Hatukuweza kupakia daftari la awamu sasa hivi. Tafadhali jaribu tena baadaye.',
    },
    cols: {
      date: { en: 'Date', sw: 'Tarehe' },
      who: { en: 'Group / farmer', sw: 'Kikundi / mkulima' },
      where: { en: 'Where', sw: 'Wapi' },
      feedstock: { en: 'Made from', sw: 'Imetengenezwa kwa' },
      input: { en: 'In (kg)', sw: 'Ndani (kg)' },
      output: { en: 'Biochar (kg)', sw: 'Biochar (kg)' },
      co2: { en: 'CO₂ est. (kg)', sw: 'CO₂ makadirio (kg)' },
    },
    note: {
      en: 'Logged by our farmer groups. Not yet checked by an outside verifier. CO₂ is estimated from the biochar weight using the figures below.',
      sw: 'Imerekodiwa na vikundi vyetu vya wakulima. Bado haijakaguliwa na mkaguzi wa nje. CO₂ imekadiriwa kutokana na uzito wa biochar kwa kutumia takwimu zilizo hapa chini.',
    },
  },
  form: {
    open: { en: 'Log a batch', sw: 'Rekodi awamu' },
    signInFirst: {
      en: 'Group leaders sign in with Google to log a batch.',
      sw: 'Viongozi wa vikundi huingia kwa Google ili kurekodi awamu.',
    },
    signIn: { en: 'Sign in with Google', sw: 'Ingia kwa Google' },
    signOut: { en: 'Sign out', sw: 'Toka' },
    signedInAs: { en: 'Signed in as', sw: 'Umeingia kama' },
    name: { en: 'Group or first name', sw: 'Kikundi au jina la kwanza' },
    place: { en: 'Village or ward', sw: 'Kijiji au wadi' },
    date: { en: 'Date fired', sw: 'Tarehe ya kuwasha' },
    feedstock: { en: 'Made from', sw: 'Imetengenezwa kwa' },
    input: { en: 'Dry leftovers in (kg)', sw: 'Mabaki makavu yaliyoingia (kg)' },
    output: { en: 'Biochar out (kg, weighed)', sw: 'Biochar iliyotoka (kg, iliyopimwa)' },
    kiln: { en: 'Kiln', sw: 'Tanuri' },
    kilnOptions: [
      { en: 'Our retort kiln', sw: 'Tanuri letu la pipa mbili' },
      { en: 'Drum kiln', sw: 'Tanuri la pipa moja' },
      { en: 'Pit or other', sw: 'Shimo au jingine' },
    ],
    notes: { en: 'Notes (optional)', sw: 'Maelezo (si lazima)' },
    consent: {
      en: 'I agree that the name and place above can be shown publicly on this page.',
      sw: 'Nakubali jina na mahali hapo juu vionyeshwe hadharani kwenye ukurasa huu.',
    },
    save: { en: 'Save batch', sw: 'Hifadhi awamu' },
    saving: { en: 'Saving…', sw: 'Inahifadhi…' },
    cancel: { en: 'Cancel', sw: 'Ghairi' },
    saved: { en: 'Saved. Thank you.', sw: 'Imehifadhiwa. Asante.' },
    failed: {
      en: 'That didn’t save. Check your connection and try again.',
      sw: 'Haikuhifadhiwa. Angalia mtandao wako kisha ujaribu tena.',
    },
    outputTooHigh: {
      en: 'Biochar out can’t be more than leftovers in. Please check the weights.',
      sw: 'Biochar iliyotoka haiwezi kuzidi mabaki yaliyoingia. Tafadhali kagua uzito.',
    },
  },
  calc: {
    title: { en: 'Work it out for your farm', sw: 'Hesabu kwa shamba lako' },
    intro: {
      en: 'Pick what you have and how much. You’ll get a rough range, not an exact figure.',
      sw: 'Chagua ulicho nacho na kiasi chake. Utapata makadirio ya jumla, si namba kamili.',
    },
    feedstock: { en: 'What do you have?', sw: 'Una nini?' },
    amount: { en: 'How much (kg)?', sw: 'Kiasi gani (kg)?' },
    freshHyacinth: { en: 'Weighed fresh from the lake (about 90% water)', sw: 'Imepimwa ikiwa mbichi kutoka ziwani (takriban asilimia 90 ni maji)' },
    dryNote: { en: 'Weigh it once it’s dry enough to snap.', sw: 'Ipime ikishakauka kiasi cha kuvunjika.' },
    biochar: { en: 'Biochar you could make', sw: 'Biochar unayoweza kutengeneza' },
    co2: { en: 'CO₂ kept in the soil for 100+ years', sw: 'CO₂ itakayobaki udongoni kwa zaidi ya miaka 100' },
    bags: { en: 'about {n} bags of 50 kg', sw: 'takriban magunia {n} ya kilo 50' },
    caveat: {
      en: 'Estimates only. Kiln emissions and transport are not subtracted, and this is not a carbon credit.',
      sw: 'Haya ni makadirio tu. Uzalishaji wa hewa kutoka tanuri na usafiri haujatolewa, na hii si mkopo wa kaboni.',
    },
  },
  method: {
    title: { en: 'How we work this out', sw: 'Jinsi tunavyohesabu' },
    body: {
      en: 'CO₂ = biochar × carbon share × 0.80 × 44/12. The carbon share and the 0.80 (the part still in the soil after 100 years) are IPCC defaults for kilns running at 450–600 °C. Rows marked * use our own assumption until lab tests are done.',
      sw: 'CO₂ = biochar × sehemu ya kaboni × 0.80 × 44/12. Sehemu ya kaboni na 0.80 (sehemu inayobaki udongoni baada ya miaka 100) ni viwango vya kawaida vya IPCC kwa tanuri zinazofanya kazi kwa 450–600 °C. Safu zenye alama * zinatumia makisio yetu hadi vipimo vya maabara vifanyike.',
    },
    cols: {
      feedstock: { en: 'Made from', sw: 'Imetengenezwa kwa' },
      yield: { en: 'Biochar per 100 kg dry', sw: 'Biochar kwa kilo 100 kavu' },
      carbon: { en: 'Carbon share', sw: 'Sehemu ya kaboni' },
      co2: { en: 'CO₂ per kg biochar', sw: 'CO₂ kwa kilo 1 ya biochar' },
      basis: { en: 'Source', sw: 'Chanzo' },
    },
  },
  sources: [
    { label: 'IPCC 2019 Refinement, Vol. 4, Ch. 2, Appendix 4', href: 'https://www.ipcc-nggip.iges.or.jp/public/2019rf/pdf/4_Volume4/19R_V4_Ch02_Ap4_Biochar.pdf' },
    { label: 'Lee et al. 2013, Bioresource Technology 148', href: 'https://doi.org/10.1016/j.biortech.2013.08.135' },
    { label: 'Zhang et al. 2015, BioResources 10(2)', href: 'https://doi.org/10.15376/biores.10.2.3017-3026' },
    { label: 'Tshikovhi et al. 2025, Desalination and Water Treatment 324', href: 'https://doi.org/10.1016/j.dwt.2025.101527' },
  ],
  sourcesTitle: { en: 'Sources', sw: 'Vyanzo' },
};

// ---------------------------------------------------------------------------
// For investors
// ---------------------------------------------------------------------------
export const investors = {
  title: { en: 'For investors and partners', sw: 'Kwa wawekezaji na washirika' },
  lead: {
    en: 'We turn farm leftovers and water hyacinth into biochar for Kenyan smallholder farms. We are at pilot stage, and we would rather show you what we have measured than promise what we haven’t.',
    sw: 'Tunageuza mabaki ya shamba na magugu maji kuwa biochar kwa mashamba madogo ya Kenya. Tuko katika hatua ya majaribio, na tungependa kukuonyesha tulichopima kuliko kuahidi tusichokipima.',
  },
  problemTitle: { en: 'The problem', sw: 'Tatizo' },
  problems: [
    {
      en: 'After harvest, stalks and husks are often burned in the field or left to rot.',
      sw: 'Baada ya mavuno, mabua na maganda mara nyingi huchomwa shambani au huachwa kuoza.',
    },
    {
      en: 'Water hyacinth chokes the shores of Lake Victoria, and clearing it creates piles of wet waste.',
      sw: 'Magugu maji husonga fukwe za Ziwa Victoria, na kuyaondoa huacha marundo ya taka mbichi.',
    },
    {
      en: 'Many smallholder soils are acidic and lose fertiliser to the rain, so farmers pay for inputs their crops never use.',
      sw: 'Udongo mwingi wa wakulima wadogo una tindikali na hupoteza mbolea kwa mvua, hivyo wakulima hulipia pembejeo ambazo mazao hayazitumii.',
    },
  ],
  modelTitle: { en: 'How we plan to make it pay', sw: 'Jinsi tunavyopanga kujiendesha' },
  model: [
    {
      title: { en: 'A kiln a group can share', sw: 'Tanuri la kikundi' },
      body: {
        en: 'One skid-mounted retort serves a farmer group, moving between farms. Groups make biochar from their own leftovers.',
        sw: 'Tanuri moja la pipa mbili huhudumia kikundi cha wakulima, likihamishwa kati ya mashamba. Vikundi hutengeneza biochar kwa mabaki yao wenyewe.',
      },
    },
    {
      title: { en: 'Biochar for farmers who would rather buy', sw: 'Biochar kwa wanaopendelea kununua' },
      body: {
        en: 'Not every farmer has time to run a kiln. We plan to sell ready, charged biochar by the bag at a price tested with farmers.',
        sw: 'Si kila mkulima ana muda wa kuendesha tanuri. Tunapanga kuuza biochar iliyo tayari kwa gunia kwa bei tutakayojaribu na wakulima.',
      },
    },
    {
      title: { en: 'Hands-on training', sw: 'Mafunzo ya vitendo' },
      body: {
        en: 'Kiln days on partner farms, where farmers learn by firing a batch themselves.',
        sw: 'Siku za tanuri kwenye mashamba ya washirika, ambapo wakulima hujifunza kwa kuwasha awamu wenyewe.',
      },
    },
  ],
  carbonNote: {
    en: 'Carbon credits may come later. Our plan does not depend on them, and we make no carbon-income claims today.',
    sw: 'Mikopo ya kaboni inaweza kuja baadaye. Mpango wetu hautegemei mikopo hiyo, na leo hatudai mapato yoyote ya kaboni.',
  },
  stageTitle: { en: 'Where we are', sw: 'Tulipofika' },
  /** Facts about progress. Keep to things that are true today. Empty = hidden. */
  stage: [
    { en: 'Farmer-led trials with banana stems, wood and maize stalks', sw: 'Majaribio yanayoongozwa na wakulima kwa mashina ya migomba, kuni na mabua ya mahindi' },
    { en: 'Double-drum retort being designed in 3D CAD', sw: 'Tanuri la pipa mbili linaundwa kwa CAD ya 3D' },
    { en: 'Every batch weighed and logged on this site', sw: 'Kila awamu hupimwa na kurekodiwa kwenye tovuti hii' },
    { en: 'Price and cost per bag being tested with farmers this season', sw: 'Bei na gharama kwa gunia zinajaribiwa na wakulima msimu huu' },
  ] as T[],
  targetsTitle: { en: 'Our targets to March 2027', sw: 'Malengo yetu hadi Machi 2027' },
  targetsNote: { en: 'These are goals, not results.', sw: 'Haya ni malengo, si matokeo.' },
  /** Goals, clearly labelled as such. Empty = hidden. */
  targets: [
    { value: '150', label: { en: 'farmers trained to make biochar', sw: 'wakulima kufundishwa kutengeneza biochar' } },
    { value: '15 t', label: { en: 'of farm leftovers turned into biochar', sw: 'za mabaki ya shamba kugeuzwa kuwa biochar' } },
  ] as { value: string; label: T }[],
  backingTitle: { en: 'Support so far', sw: 'Msaada hadi sasa' },
  /** Programmes or partners that have backed the project. Empty = hidden. */
  backing: [
    { en: 'beVisioneers: The Mercedes-Benz Fellowship (Catalyst stage)', sw: 'beVisioneers: The Mercedes-Benz Fellowship (hatua ya Catalyst)' },
  ] as T[],
  /** What you are looking for from investors. null = hidden. */
  ask: null as T | null,
  askTitle: { en: 'What we’re looking for', sw: 'Tunachotafuta' },
  contactTitle: { en: 'Talk to us', sw: 'Zungumza nasi' },
  contactBody: {
    en: 'We are happy to share our batch records, kiln design and budget in more detail.',
    sw: 'Tuko tayari kushiriki kumbukumbu za awamu, muundo wa tanuri na bajeti kwa undani zaidi.',
  },
  seeResults: { en: 'See the batch log', sw: 'Ona daftari la awamu' },
};

// ---------------------------------------------------------------------------
// Get involved
// ---------------------------------------------------------------------------
export const join = {
  title: { en: 'Get involved', sw: 'Jiunge nasi' },
  lead: {
    en: 'Whether you farm, run a group, or just want to know more, start with a message. We reply in English or Kiswahili.',
    sw: 'Kama wewe ni mkulima, unaongoza kikundi, au unataka tu kujua zaidi, anza kwa ujumbe. Tunajibu kwa Kiingereza au Kiswahili.',
  },
  ways: [
    {
      title: { en: 'Come to a kiln day', sw: 'Hudhuria siku ya tanuri' },
      body: { en: 'Watch a batch being made, then fire one yourself.', sw: 'Tazama awamu ikitengenezwa, kisha uwashe yako mwenyewe.' },
    },
    {
      title: { en: 'Make it with your group', sw: 'Tengenezeni na kikundi chenu' },
      body: { en: 'We help farmer groups set up and log their batches.', sw: 'Tunasaidia vikundi vya wakulima kuanza na kurekodi awamu zao.' },
    },
    {
      title: { en: 'Buy biochar', sw: 'Nunua biochar' },
      body: { en: 'Tell us how much you need and where you farm.', sw: 'Tuambie unahitaji kiasi gani na unalima wapi.' },
    },
    {
      title: { en: 'Share your results', sw: 'Shiriki matokeo yako' },
      body: { en: 'Send us photos of your biochar and your crop on WhatsApp.', sw: 'Tutumie picha za biochar yako na mazao yako kwa WhatsApp.' },
    },
  ],
  formTitle: { en: 'Send us a message', sw: 'Tutumie ujumbe' },
  name: { en: 'Your name', sw: 'Jina lako' },
  phoneOrEmail: { en: 'Phone or email', sw: 'Simu au barua pepe' },
  place: { en: 'Where you farm (optional)', sw: 'Unapolima (si lazima)' },
  message: { en: 'Message', sw: 'Ujumbe' },
  send: { en: 'Send', sw: 'Tuma' },
  sending: { en: 'Sending…', sw: 'Inatuma…' },
  sent: { en: 'Thank you. We’ll get back to you soon.', sw: 'Asante. Tutawasiliana nawe hivi karibuni.' },
  failed: {
    en: 'That didn’t send. Please try again, or message us on WhatsApp.',
    sw: 'Haukutumwa. Tafadhali jaribu tena, au tuandikie WhatsApp.',
  },
  privacyNote: {
    en: 'We only use your details to reply to you.',
    sw: 'Tunatumia taarifa zako kukujibu tu.',
  },
  directTitle: { en: 'Or reach us directly', sw: 'Au tufikie moja kwa moja' },
};

// ---------------------------------------------------------------------------
// Privacy notice (plain-language draft; have it reviewed before launch)
// ---------------------------------------------------------------------------
export const privacy = {
  title: { en: 'Privacy', sw: 'Faragha' },
  updated: { en: 'Last updated: November 2026', sw: 'Ilisasishwa: Novemba 2026' },
  sections: [
    {
      title: { en: 'What we collect', sw: 'Tunachokusanya' },
      body: {
        en: 'If you send a message: your name, phone or email, and what you write. If you log a batch: the name and place you enter, the batch weights, and the Google account you sign in with. If you use the AI assistant: the questions you type.',
        sw: 'Ukituma ujumbe: jina lako, simu au barua pepe, na unachoandika. Ukirekodi awamu: jina na mahali unapoingiza, uzito wa awamu, na akaunti ya Google unayoingia nayo. Ukitumia msaidizi wa AI: maswali unayoandika.',
      },
    },
    {
      title: { en: 'Why', sw: 'Kwa nini' },
      body: {
        en: 'To reply to you, to keep an honest public record of the biochar made, and to answer your questions. We do not sell your details or use them for advertising.',
        sw: 'Kukujibu, kuweka kumbukumbu ya wazi na ya kweli ya biochar iliyotengenezwa, na kujibu maswali yako. Hatuuzi taarifa zako wala kuzitumia kwa matangazo.',
      },
    },
    {
      title: { en: 'What is public', sw: 'Kinachoonekana hadharani' },
      body: {
        en: 'Batch entries show the group or first name and place you typed, but only if you ticked the consent box. Your email and Google account are never shown.',
        sw: 'Awamu zilizorekodiwa huonyesha jina la kikundi au jina la kwanza na mahali ulipoandika, lakini tu kama ulikubali kwenye kisanduku cha ridhaa. Barua pepe yako na akaunti ya Google haionyeshwi kamwe.',
      },
    },
    {
      title: { en: 'Who handles it', sw: 'Nani anashughulikia' },
      body: {
        en: 'Messages go through Formspree. Batch records are stored with Google Firebase. AI questions are answered by Google’s Gemini service. Videos are shown through YouTube only when you press play.',
        sw: 'Ujumbe hupitia Formspree. Kumbukumbu za awamu huhifadhiwa kwenye Google Firebase. Maswali ya AI hujibiwa na huduma ya Gemini ya Google. Video huonyeshwa kupitia YouTube tu unapobonyeza kucheza.',
      },
    },
    {
      title: { en: 'Your rights', sw: 'Haki zako' },
      body: {
        en: 'Under Kenya’s Data Protection Act, 2019, you can ask to see, correct or delete your details. Message us on WhatsApp or email us and we will do it.',
        sw: 'Chini ya Sheria ya Ulinzi wa Data ya Kenya, 2019, unaweza kuomba kuona, kusahihisha au kufuta taarifa zako. Tuandikie WhatsApp au barua pepe na tutafanya hivyo.',
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// AI assistant
// ---------------------------------------------------------------------------
export const assistant = {
  title: { en: 'Ask a question', sw: 'Uliza swali' },
  label: {
    en: 'Answers by AI. Check with our team before you act on them.',
    sw: 'Majibu yametolewa na AI. Wasiliana na timu yetu kabla ya kuyafanyia kazi.',
  },
  welcome: {
    en: 'Hi. Ask me anything about making or using biochar, our kiln, or the numbers on this site. For anything important, our team is on WhatsApp too.',
    sw: 'Habari. Niulize chochote kuhusu kutengeneza au kutumia biochar, tanuri letu, au namba zilizo kwenye tovuti hii. Kwa jambo muhimu, timu yetu pia iko WhatsApp.',
  },
  suggestions: [
    { en: 'How dry should my maize stover be?', sw: 'Mabua yangu ya mahindi yanapaswa kukauka kiasi gani?' },
    { en: 'How do I use biochar on my farm?', sw: 'Ninatumiaje biochar shambani kwangu?' },
    { en: 'How much biochar will 200 kg of rice husk make?', sw: 'Kilo 200 za maganda ya mpunga zitatoa biochar kiasi gani?' },
  ],
  placeholder: { en: 'Type your question…', sw: 'Andika swali lako…' },
  send: { en: 'Send', sw: 'Tuma' },
  thinking: { en: 'Thinking…', sw: 'Inafikiri…' },
  unavailable: {
    en: 'Sorry, the assistant isn’t available right now. Please message our team on WhatsApp instead.',
    sw: 'Samahani, msaidizi haupatikani sasa hivi. Tafadhali tuandikie WhatsApp badala yake.',
  },
  restart: { en: 'Start again', sw: 'Anza upya' },
};
