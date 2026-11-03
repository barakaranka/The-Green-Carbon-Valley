/**
 * Green Carbon Valley Content & Scientific Reference Constants
 * Used across the frontend and server assistant to maintain single source of truth.
 */

export const PERMANENCE = 0.74; // Fraction of organic carbon remaining after 100 years in soil (IPCC 2019 default)
export const HYACINTH_WATER = 0.92; // Fresh water hyacinth is ~92% water by fresh weight

export interface FeedstockItem {
  id: string;
  label: { en: string; sw: string };
  yield: number; // kg biochar per kg dry leftovers
  carbon: number; // organic carbon fraction of produced biochar
  assumption?: boolean;
}

export function co2PerKgBiochar(carbonFraction: number): number {
  // Biochar kg * carbon content * permanence factor * (molecular weight 44 CO2 / 12 C)
  return carbonFraction * PERMANENCE * (44 / 12);
}

export const feedstocks: FeedstockItem[] = [
  {
    id: 'hyacinth',
    label: { en: 'Water Hyacinth (Lake Victoria)', sw: 'Magugu Maji (Ziwa Victoria)' },
    yield: 0.28,
    carbon: 0.72,
    assumption: false
  },
  {
    id: 'maize',
    label: { en: 'Maize Stalks & Cobs', sw: 'Mabua na Vigunzi vya Mahindi' },
    yield: 0.33,
    carbon: 0.78,
    assumption: false
  },
  {
    id: 'bagasse',
    label: { en: 'Sugarcane Bagasse', sw: 'Makapi ya Miwa (Bagasse)' },
    yield: 0.30,
    carbon: 0.75,
    assumption: false
  },
  {
    id: 'coffee_husk',
    label: { en: 'Coffee Husks & Pulp', sw: 'Maganda ya Kahawa' },
    yield: 0.31,
    carbon: 0.74,
    assumption: true
  }
];

export const kiln = {
  specs: [
    {
      label: { en: 'Kiln Architecture', sw: 'Muundo wa Tanuri' },
      value: { en: 'Decentralized Double-Drum Retort Kiln (Skid-Mounted)', sw: 'Tanuri ya Pipa Mbili ya Rununu (Skid-Mounted)' }
    },
    {
      label: { en: 'Operating Temperature', sw: 'Joto la Uchomaji' },
      value: { en: '450°C – 600°C (Slow Pyrolysis)', sw: '450°C – 600°C (Pirolesi ya Taratibu)' }
    },
    {
      label: { en: 'Batch Biomass Capacity', sw: 'Uwezo wa Mzigo' },
      value: { en: '250 kg dry biomass per run (4–6 hr cycle)', sw: 'Kilo 250 za masalia makavu kwa awamu (saa 4–6)' }
    },
    {
      label: { en: 'Biochar Quality Standard', sw: 'Ubora wa Biochar' },
      value: { en: 'High porous surface area (>350 m²/g), Fixed Carbon >70%', sw: 'Eneo la matundu (>350 m²/g), Hewa ya Ukaa Imara >70%' }
    },
    {
      label: { en: 'Emissions System', sw: 'Udhibiti wa Moshi' },
      value: { en: 'Syngas recirculation re-combustion chamber (near-zero smoke)', sw: 'Kuchoma tena gesi ya pirolesi (bila moshi)' }
    }
  ]
};

export const how = {
  steps: [
    {
      title: { en: 'Harvest & Sun-Drying', sw: 'Uvunaji na Kukausha Jua' },
      body: { en: 'Collect invasive water hyacinth or crop residue. Air-dry to <15% moisture content.', sw: 'Kusanya magugu maji au masalia ya mimea. Kausha jua hadi unyevu uwe chini ya 15%.' }
    },
    {
      title: { en: 'Decentralized Retort Loading', sw: 'Kupakia kwenye Tanuri' },
      body: { en: 'Tightly pack the inner cylinder of the skid-mounted retort and seal airtight.', sw: 'Jaza pipa la ndani la tanuri na ufunge vizuri kuzuia hewa ya oksijeni.' }
    },
    {
      title: { en: 'Pyrolysis with Syngas Loop', sw: 'Pirolesi na Urejeshaji wa Gesi' },
      body: { en: 'Ignite outer jacket. When 350°C is reached, syngas fuels the reaction with zero smoke.', sw: 'Washa moto nje. Ukifikia 350°C, gesi inayotoka inajichoma yenyewe bila moshi.' }
    },
    {
      title: { en: 'Quenching & Nutrient Charging', sw: 'Kuzima na Kuchanganya Virutubisho' },
      body: { en: 'Quench with water or compost tea. Co-compost 1:4 with livestock manure for soil inoculation.', sw: 'Zima na maji au maji ya mboji. Changanya 1:4 na samadi ya wanyama ili kuamsha viumbe hai.' }
    }
  ],
  safety: {
    items: [
      { en: 'Always wear heat-resistant gloves and eye protection when handling hot kilns.', sw: 'Vaa glavu zinazostahimili joto na miwani ya usalama unapotumia tanuri.' },
      { en: 'Never open an airtight retort until it has cooled below 80°C to prevent spontaneous combustion.', sw: 'Kamwe usifungue tanuri hadi ipoe chini ya 80°C ili kuzuia moto kuwaka ghafla.' },
      { en: 'Keep quenching water accessible nearby at all times during operation.', sw: 'Daima uwe na maji ya kutosha ya kuzimia moto karibu na eneo la kazi.' },
      { en: 'Operate kilns in open, well-ventilated farm spaces away from dry thatch or brush.', sw: 'Fanyia kazi kwenye eneo wazi lenye hewa ya kutosha, mbali na nyasi kavu au makazi.' }
    ]
  }
};
