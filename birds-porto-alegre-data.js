// Aves de Porto Alegre: data for birds-porto-alegre.html.
//
// The species are WikiAves's list for Porto Alegre (https://www.wikiaves.com.br/especies.php?&t=c&c=4314902,
// 286 species in October 2026), named as iNaturalist names them today and grouped in WikiAves's families (the CBRO's,
// which split some of iNaturalist's: the arapaçus, vira-folhas, patinhos, borboletinhas and papa-piri have their own).
// Birds without sounds have sounds: [].
// Birds are listed by family, in the order of BIRD_FAMILIES; within a family, the ones eBird checklists in
// Porto Alegre report most often come first. The page shows them all commonest first: by rarity, then eBird presence.
// Each sound is either:
//   { source: "inaturalist", audio: <file URL>, recordist: <the name in the sound's "(c)" attribution>,
//     license: <a Creative Commons code, e.g. "cc-by-nc"; never "all rights reserved">, observation: <observation id>,
//     location: <where it was recorded: "City, UF"> }
//   { source: "xenocanto", xc: <XC number>, audio: <the mp3 file linked from the recording page>, recordist,
//     license: <e.g. "cc-by-nc-sa">, licenseVersion: <"2.5", "3.0" or "4.0", from the recording's license link>,
//     location }; that file, unlike https://xeno-canto.org/<xc>/download, lets the player seek to start
// plus an optional type: "song" (Canto, the default) or "call" (Chamado),
// optional start/end (seconds) to play and draw only part of the recording (never for a "nd" license, which
// doesn't allow changes: those play whole), or duration (seconds) for a whole recording, so its card shows
// the length before it plays,
// and optional fmin/fmax (Hz, default 0 and 10000) to zoom the spectrogram in on the bird's pitch range.
//
// Birds on COA-POA's list (Aves de Porto Alegre, Bencke & Chiarani, 31 Aug 2020; https://coapoa.org/aves-de-porto-alegre-2/)
// have coa: { frequency, season }, its categories as written there. frequency is how easy the bird is to find on a
// normal outing: "Muito comum", "Comum", "Pouco comum", "Incomum", "Rara" or "Acidental" (the page joins these into
// four rarity levels). season is when it's in Porto Alegre: "Todo o ano", "Primavera/verão", "Outono/inverno",
// "Primavera", "Outono" or "Indeterminada". The 23 WikiAves species the COA list doesn't have (records since 2020, or
// vagrants) have no coa. The COA list names some birds as they were before a split: its Geothlypis aequinoctialis
// and Elaenia obscura are the Pia-cobra (G. velata) and Tucão (E. sordida) here.
// Birds on a red list have conservation: { status: "CR" | "EN" | "VU" | "NT", list: "IUCN" | "Brasil" | "RS" }.
// Checked in 2026 against Rio Grande do Sul's list (Decreto 51.797/2014, including its near-threatened annex) and
// globally (IUCN, via iNaturalist); a bird on both would show the RS status, but none is. Brazil's national list
// (MMA) wasn't checked.
// Species the COA list marks as introduced in Porto Alegre (its "*") have introduced: true.
//
// Spectrograms live in images/birds-porto-alegre/ (<iNat sound id>.webp or xc<XC number>.webp).
// After adding sounds, run: python3 scripts/bird-spectrograms.py

// Portuguese names for each bird's family (from iNaturalist, or the COA list for the CBRO's own families),
// A-Z by name, the order of the page's family filter.
const BIRD_FAMILIES = {
  Pandionidae: "Águias-pescadoras",
  Tityridae: "Anambés e caneleiros",
  Hirundinidae: "Andorinhas",
  Apodidae: "Andorinhões",
  Anhimidae: "Anhumas e tachãs",
  Dendrocolaptidae: "Arapaçus",
  Cardinalidae: "Azulões e afins", // iNaturalist's name lists North American cardinals and grosbeaks
  Caprimulgidae: "Bacuraus e curiangos", // iNaturalist's name adds "noitibós", the European Portuguese name
  Polioptilidae: "Balança-rabos e bicos-assovelados",
  Charadriidae: "Batuíras, borrelhos, abibes e afins",
  Trochilidae: "Beija-flores",
  Estrildidae: "Bicos-de-lacre e afins", // iNaturalist's name lists many Old World waxbills and finches
  Anhingidae: "Biguatingas", // iNaturalist's "Anhingas" is the genus name
  Rhynchocyclidae: "Borboletinhas, ferreirinhos e bicos-chatos",
  Motacillidae: "Caminheiros", // iNaturalist's name is the European Portuguese "petinhas, alvéolas"
  Aramidae: "Carãos",
  Ciconiidae: "Cegonhas",
  Thamnophilidae: "Chocas, formigueiros e afins",
  Conopophagidae: "Chupa-dentes e afins",
  Anatidae: "Cisnes, gansos e patos",
  Threskiornithidae: "Colhereiros, íbises e afins",
  Cathartidae: "Condores e urubus",
  Phalacrocoracidae: "Cormorões e biguás",
  Troglodytidae: "Corruíras", // iNaturalist's "Carriças" is the European Portuguese name
  Strigidae: "Corujas típicas",
  Corvidae: "Corvídeos",
  Cotingidae: "Cotingas e arapongas",
  Cuculidae: "Cucos e afins",
  Falconidae: "Falcões",
  Phoenicopteridae: "Flamingos",
  Fregatidae: "Fragatas",
  Laridae: "Gaivotas, trinta-réis, talha-mares e afins",
  Rallidae: "Galinhas-d'água e afins",
  Ardeidae: "Garças e socós",
  Fringillidae: "Gaturamos, pintassilgos e afins", // iNaturalist's name lists European finches (tentilhões)
  Accipitridae: "Gaviões, águias e afins", // iNaturalist's "Milhafres" is the European Portuguese name
  Mimidae: "Imitadores",
  Tinamidae: "Inhambus e afins",
  Icteridae: "Iraúnas, graúnas, chupins e afins",
  Jacanidae: "Jaçanãs",
  Furnariidae: "Joãos-de-barro e afins",
  Scolopacidae: "Maçaricos, narcejas e afins",
  Parulidae: "Mariquitas e pula-pulas",
  Alcedinidae: "Martins-pescadores",
  Podicipedidae: "Mergulhões",
  Cracidae: "Mutuns, jacus e aracuãs",
  Tachurisidae: "Papa-piris",
  Psittacidae: "Papagaios e periquitos",
  Passeridae: "Pardais",
  Platyrinchidae: "Patinhos",
  Recurvirostridae: "Pernilongos e afins", // iNaturalist's name adds "alfaiates", the European Portuguese name for avocets
  Picidae: "Pica-paus",
  Formicariidae: "Pintos-do-mato e afins",
  Columbidae: "Pombos, rolas e rolinhas",
  Tytonidae: "Suindaras", // iNaturalist's "corujas-cardioides" isn't used in Brazil
  Trogonidae: "Surucuás e quetzais",
  Passerellidae: "Tico-ticos",
  Thraupidae: "Tiês",
  Tyrannidae: "Tiranídeos",
  Turdidae: "Tordos, sabiás e afins",
  Ramphastidae: "Tucanos e araçaris",
  Pipridae: "Uirapurus e afins",
  Nyctibiidae: "Urutaus",
  Scleruridae: "Vira-folhas",
  Vireonidae: "Vite-vites, juruviaras e afins",
};

const BIRDS_PORTO_ALEGRE = [
  {
    name: "Águia-pescadora",
    scientificName: "Pandion haliaetus",
    family: "Pandionidae",
    inatTaxonId: 116999,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/6903515/medium.jpg",
    photoCredit: "(c) Greg Lasley, some rights reserved (CC BY-NC), uploaded by Greg Lasley",
    coa: { frequency: "Rara", season: "Primavera/verão" },
    sounds: [
      {
        // Whistled 'kyew' calls and a long chirping call series, about 18s of the 33s recording
        source: "xenocanto",
        xc: 118482,
        audio:
          "https://xeno-canto.org/sounds/uploaded/TGBFXDVERJ/XC118482-Pandion%20halietus_Porto%20de%20Moz_1327.mp3",
        recordist: "Gabriel Leite",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Porto de Moz, PA",
        type: "call",
        start: 2.35,
        end: 19.9,
        fmin: 800,
      },
    ],
  },
  {
    name: "Caneleiro-verde",
    scientificName: "Pachyramphus viridis",
    family: "Tityridae",
    inatTaxonId: 8711,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/237484813/medium.jpg",
    photoCredit: "no rights reserved, uploaded by Paulo Mascaretti",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // A steady series of rising, nasal 'tuee' calls, about 13s of the 46s recording
        source: "xenocanto",
        xc: 181732,
        audio:
          "https://xeno-canto.org/sounds/uploaded/TLLUGZINYM/XC181732-Pachyramphus%20viridis%20%2828.05.14%29.mp3",
        recordist: "Roberto Buss Stringari",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Pedras Altas, RS",
        type: "call",
        start: 4.95,
        end: 18.3,
      },
    ],
  },
  {
    name: "Caneleiro-preto",
    scientificName: "Pachyramphus polychopterus",
    family: "Tityridae",
    inatTaxonId: 8716,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/84283/medium.jpg",
    photoCredit: "(c) Dominic Sherony, some rights reserved (CC BY-SA)",
    coa: { frequency: "Incomum", season: "Primavera/verão" },
    sounds: [
      {
        // Three phrases of mellow, falling 'tu-tu-tu-tu-tu' song with soft notes between them, about 18s of the 26s recording
        source: "xenocanto",
        xc: 176872,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC176872-Tityridae_Phachyramphus_polychopterus_02_11_2010_H09_13_Fazenda_Beira_Rio_Salete.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Salete, SC",
        type: "song",
        start: 0,
        end: 17.9,
      },
    ],
  },
  {
    name: "Andorinha-pequena-de-casa",
    scientificName: "Pygochelidon cyanoleuca",
    family: "Hirundinidae",
    inatTaxonId: 68826,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/267351662/medium.jpg",
    photoCredit: "(c) Steve Foss, some rights reserved (CC BY-NC), uploaded by Steve Foss",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 13s recording: a run of buzzy, down-slurred song notes
        source: "xenocanto",
        xc: 407109,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC407109-Andorinha%20pequena%20de%20casa%20%28Pygochelidon%20cyanoleuca-OK%29.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Jaquirana, RS",
        type: "song",
        duration: 13.51,
      },
    ],
  },
  {
    name: "Andorinha-do-campo",
    scientificName: "Progne tapera",
    family: "Hirundinidae",
    inatTaxonId: 11870,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/1082378/medium.jpg",
    photoCredit: "(c) Cláudio Dias Timm, some rights reserved (CC BY-NC-SA)",
    coa: { frequency: "Comum", season: "Primavera/verão" },
    sounds: [
      {
        // The whole 41s recording: two bursts of gurgling song, then single calls
        source: "xenocanto",
        xc: 7784,
        audio: "https://xeno-canto.org/sounds/uploaded/IGDDGNGPAL/golopard.alvaricc.mp3",
        recordist: "Alvaro Riccetto",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Lavalleja, Uruguai",
        type: "song",
        duration: 40.54,
      },
    ],
  },
  {
    name: "Andorinha-grande",
    scientificName: "Progne chalybea",
    family: "Hirundinidae",
    inatTaxonId: 11872,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/172076738/medium.jpeg",
    photoCredit: "(c) Esteban Poveda, some rights reserved (CC BY), uploaded by Esteban Poveda",
    coa: { frequency: "Comum", season: "Primavera/verão" },
    sounds: [
      {
        // Gurgling chatter of a group, about 19s of the 34s recording
        source: "xenocanto",
        xc: 770683,
        audio:
          "https://xeno-canto.org/sounds/uploaded/VWCBCAIJUC/XC770683-MixPre-1411_Progne_chalybea.mp3",
        recordist: "Guilherme Melo Becher",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Barra do Quaraí, RS",
        type: "call",
        start: 0.25,
        end: 19.5,
      },
    ],
  },
  {
    name: "Andorinha-serradora",
    scientificName: "Stelgidopteryx ruficollis",
    family: "Hirundinidae",
    inatTaxonId: 11972,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/663372181/medium.jpg",
    photoCredit: "(c) Donald Davesne, some rights reserved (CC BY), uploaded by Donald Davesne",
    coa: { frequency: "Pouco comum", season: "Primavera/verão" },
    sounds: [
      {
        // The whole 8s recording: a run of rough 'brrt' notes
        source: "xenocanto",
        xc: 173725,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC173725-Hirundinidae_Stelgidopteryx_ruficollis_05_11_2012_H09_17_Salseiro_Vidal_Ramos.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Vidal Ramos, SC",
        type: "song",
        duration: 8.35,
      },
    ],
  },
  {
    name: "Andorinha-de-sobre-branco",
    scientificName: "Tachycineta leucorrhoa",
    family: "Hirundinidae",
    inatTaxonId: 11936,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/28096412/medium.jpeg",
    photoCredit: "(c) Diana Fuentes, some rights reserved (CC BY-SA), uploaded by Diana Fuentes",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 7s recording: buzzy and liquid calls of a small flock
        source: "xenocanto",
        xc: 230438,
        audio:
          "https://xeno-canto.org/sounds/uploaded/OOECIWCSWV/XC230438-White-rumped%20Swallow%20C%2011825.mp3",
        recordist: "Peter Boesman",
        license: "cc-by-nc-nd",
        licenseVersion: "4.0",
        location: "Mostardas, RS",
        type: "call",
        duration: 6.9,
      },
    ],
  },
  {
    name: "Andorinha-de-bando",
    scientificName: "Hirundo rustica",
    family: "Hirundinidae",
    inatTaxonId: 11901,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/122469139/medium.jpg",
    photoCredit: "(c) Ad Konings, some rights reserved (CC BY-NC), uploaded by Ad Konings",
    sounds: [
      {
        // Twittering of swallows, bursts of 'vit' notes, about 16s of the 36s recording
        source: "xenocanto",
        xc: 52060,
        audio:
          "https://xeno-canto.org/sounds/uploaded/BYLLSJRVDZ/SWALLOW%20Barn_06_Albufera%20Mar%20Chiquita_Buenos%20Aires_AR_28ENE06_Bernabe%20Lopez-Lanus.mp3",
        recordist: "Bernabe Lopez-Lanus",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Mar Chiquita, Argentina",
        type: "song",
        start: 0.15,
        end: 16.15,
      },
    ],
  },
  {
    name: "Andorinhão-do-temporal",
    scientificName: "Chaetura meridionalis",
    family: "Apodidae",
    inatTaxonId: 6581,
    // large: the medium size of this portrait photo is only 333px wide
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/31261952/large.jpg",
    photoCredit:
      "(c) marcelo_allende, some rights reserved (CC BY-NC), uploaded by marcelo_allende",
    coa: { frequency: "Muito comum", season: "Primavera/verão" },
    sounds: [
      {
        // A passing flock's twittering, about 19s of the 40s recording
        source: "xenocanto",
        xc: 294672,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC294672-Apodidae_Chaetura_meridionalis_20_12_2014_H17_59_Doutor_Pedrinho.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Doutor Pedrinho, SC",
        type: "call",
        start: 14.7,
        end: 33.85,
      },
    ],
  },
  {
    name: "Taperuçu-de-coleira-branca",
    scientificName: "Streptoprocne zonaris",
    family: "Apodidae",
    inatTaxonId: 6597,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/12179299/medium.jpg",
    photoCredit: "(c) Arnold Wijker, some rights reserved (CC BY-NC), uploaded by Arnold Wijker",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 12s recording: a flock screaming as it passes
        source: "xenocanto",
        xc: 978357,
        audio: "https://xeno-canto.org/sounds/uploaded/CFRYARSVHN/XC978357-2025-03-04-18_22tcb.mp3",
        recordist: "Ricardo José Mitidieri",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Bananal, SP",
        type: "call",
        duration: 11.57,
      },
    ],
  },
  {
    name: "Tachã",
    scientificName: "Chauna torquata",
    family: "Anhimidae",
    inatTaxonId: 6910,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/249989101/medium.jpg",
    photoCredit:
      "(c) Antonino Gonçalves Medina, some rights reserved (CC BY-NC), uploaded by Antonino Gonçalves Medina",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Five bouts of loud honking alarm calls, about 15s of the 31s recording
        source: "xenocanto",
        xc: 686646,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC686646-05-11-2021%2017e17%20Tacha%20DOM%20PEDRITO.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Dom Pedrito, RS",
        type: "call",
        start: 8.1,
        end: 23,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Arapaçu-verde",
    scientificName: "Sittasomus griseicapillus",
    family: "Dendrocolaptidae",
    inatTaxonId: 11511,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/245961193/medium.jpg",
    photoCredit:
      "(c) Tomaz Nascimento de Melo, some rights reserved (CC BY-NC-ND), uploaded by Tomaz Nascimento de Melo",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 9s recording: a steady series of rising 'fweep' notes
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1613661.mp3",
        recordist: "amandapmarcon",
        license: "cc-by-nc",
        observation: 308531696,
        location: "Getúlio Vargas, RS",
        type: "call",
        duration: 8.98,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Arapaçu-escamoso-do-sul",
    scientificName: "Lepidocolaptes falcinellus",
    family: "Dendrocolaptidae",
    inatTaxonId: 11579,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/253159/medium.jpg",
    photoCredit: "(c) Cláudio Dias Timm, some rights reserved (CC BY-NC-SA)",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Six loud down-slurred notes and a softer one, about 13s of the 24s recording
        source: "xenocanto",
        xc: 407112,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC407112-Arapacu%20escamado%20do%20sul%20%28Lepidocolaptes%20falcinellus-OK%29.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        start: 1.85,
        end: 15,
      },
    ],
  },
  {
    name: "Arapaçu-grande",
    scientificName: "Dendrocolaptes platyrostris",
    family: "Dendrocolaptidae",
    inatTaxonId: 11122,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/278377638/medium.jpg",
    photoCredit:
      "(c) Luciano Bernardes, some rights reserved (CC BY-NC), uploaded by Luciano Bernardes",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Two songs, long rattling series of notes, about 15s of the 39s recording
        source: "xenocanto",
        xc: 193222,
        audio:
          "https://xeno-canto.org/sounds/uploaded/FYHMASBKBC/XC193222-Dendrocolaptes%20platyrostris.mp3",
        recordist: "Cleberton D. Bianchini",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Lajeado, RS",
        type: "song",
        start: 1.8,
        end: 16.5,
      },
    ],
  },
  {
    name: "Azulinho",
    scientificName: "Cyanoloxia glaucocaerulea",
    family: "Cardinalidae",
    inatTaxonId: 10690,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/66731977/medium.jpg",
    photoCredit:
      "(c) Javier González, some rights reserved (CC BY-NC), uploaded by Javier González",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 17s recording: two warbled songs with call notes between
        source: "xenocanto",
        xc: 417013,
        audio: "https://xeno-canto.org/sounds/uploaded/TZWQJUGVHP/XC417013-azulinho_03.mp3",
        recordist: "Marco Cruz",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Uruguaiana, RS",
        type: "song",
        duration: 17.09,
      },
    ],
  },
  {
    name: "Tiê-de-bando",
    scientificName: "Habia rubica",
    family: "Cardinalidae",
    inatTaxonId: 9935,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/424905909/medium.jpg",
    photoCredit:
      "(c) Enéas V. Gouvêa Junior, some rights reserved (CC BY-SA), uploaded by Enéas V. Gouvêa Junior",
    sounds: [
      {
        // A slow series of clear, falling whistles with a natural pause, about 15s of the 28s recording
        source: "xenocanto",
        xc: 84543,
        audio: "https://xeno-canto.org/sounds/uploaded/DGVLLRYDXS/HABRUB23.mp3",
        recordist: "Jeremy Minns",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        start: 1.4,
        end: 16.1,
      },
    ],
  },
  {
    name: "Azulão",
    scientificName: "Cyanoloxia brissonii",
    family: "Cardinalidae",
    inatTaxonId: 558592,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/67327517/medium.jpg",
    photoCredit: "(c) Norton Santos, some rights reserved (CC BY-NC), uploaded by Norton Santos",
    sounds: [
      {
        // The whole 23s recording: four song phrases
        source: "xenocanto",
        xc: 121387,
        audio:
          "https://xeno-canto.org/sounds/uploaded/ODNEDFESFY/XC121387-Cyanoloxia%20brissonii%20%28Lichtenstein%2C%201823%293.mp3",
        recordist: "Alexandre Bianco",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Fagundes Varela, RS",
        type: "song",
        duration: 23.35,
      },
    ],
  },
  {
    name: "Sanhaço-de-fogo",
    scientificName: "Piranga flava",
    family: "Cardinalidae",
    inatTaxonId: 9924,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/396726768/medium.jpg",
    photoCredit:
      "(c) Manequinho Correia, some rights reserved (CC BY-NC), uploaded by Manequinho Correia",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // Repeated whistled 'chu-wee' song notes, about 12s of the 19s recording
        source: "xenocanto",
        xc: 795090,
        audio:
          "https://xeno-canto.org/sounds/uploaded/ZCFZMKSMPP/XC795090-Piranga-flava-14-Nov-2005-Mala-Cara-Arapey-Chico---Salto.mp3",
        recordist: "José Menéndez",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Salto, Uruguai",
        type: "song",
        start: 0.15,
        end: 12.15,
      },
    ],
  },
  {
    name: "Bacurau-da-telha",
    scientificName: "Systellura longirostris",
    family: "Caprimulgidae",
    inatTaxonId: 605123,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/28959565/medium.jpg",
    photoCredit:
      "(c) Josh van der Meulen, some rights reserved (CC BY-NC-ND), uploaded by Josh van der Meulen",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Eight thin, U-shaped song notes, about 16s of the 49s recording
        source: "xenocanto",
        xc: 724680,
        audio:
          "https://xeno-canto.org/sounds/uploaded/TGBFXDVERJ/XC724680-Hydropsalis%20longirostris_Urupema_MixPre-054.mp3",
        recordist: "Gabriel Leite",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Urupema, SC",
        type: "song",
        start: 28.3,
        end: 44.3,
        fmin: 1500,
        fmax: 9000,
      },
    ],
  },
  {
    name: "Bacurau-tesoura",
    scientificName: "Hydropsalis torquata",
    family: "Caprimulgidae",
    inatTaxonId: 19565,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/151522305/medium.jpg",
    photoCredit: "(c) eneaschr, some rights reserved (CC BY-NC)",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // A steady series of high 'tsip' notes, one per second, about 15s of the 2m43s recording
        source: "xenocanto",
        xc: 440802,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/XC440802-Hydropsalis%20torquata%20mp3%20-%20near%20Cerro%20das%20Almas%20-20181027-192536.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Capão do Leão, RS",
        type: "song",
        start: 0.55,
        end: 15.25,
        fmin: 2000,
      },
    ],
  },
  {
    name: "Corucão",
    scientificName: "Chordeiles nacunda",
    family: "Caprimulgidae",
    inatTaxonId: 19661,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/150819319/medium.jpg",
    photoCredit: "(c) Paul Donahue, some rights reserved (CC BY-NC), uploaded by Paul Donahue",
    coa: { frequency: "Rara", season: "Primavera/verão" },
    sounds: [
      {
        // Low, hollow paired 'pu-pu' notes, about 15s of the 1m17s recording
        source: "xenocanto",
        xc: 577514,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC577514-15-07-2020%205e49%20Corucao%20%28Podager%20nacundao-OK%29.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Santa Rita do Novo Destino, GO",
        type: "song",
        start: 0.17,
        end: 15.15,
        fmax: 2000,
      },
    ],
  },
  {
    name: "Tuju",
    scientificName: "Lurocalis semitorquatus",
    family: "Caprimulgidae",
    inatTaxonId: 19645,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/1418104/medium.jpg",
    photoCredit: "(c) barloventomagico, some rights reserved (CC BY-NC-ND)",
    sounds: [
      {
        // A regular series of short, low 'quirt' notes, about 15s of the 33s recording
        source: "xenocanto",
        xc: 450247,
        audio:
          "https://xeno-canto.org/sounds/uploaded/JQSYKZHEMB/XC450247-LurocalissemTape25PY%20%282%29.mp3",
        recordist: "Rosendo Manuel Fraga",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Itapúa, Paraguai",
        type: "song",
        start: 0.5,
        end: 15.9,
        fmax: 4000,
      },
    ],
  },
  {
    name: "Bacurau",
    scientificName: "Nyctidromus albicollis",
    family: "Caprimulgidae",
    inatTaxonId: 19627,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/209035/medium.jpg",
    photoCredit: "(c) Greg Lasley, some rights reserved (CC BY-NC), uploaded by Greg Lasley",
    sounds: [
      {
        // Four songs, about 13s of the 30s recording
        source: "xenocanto",
        xc: 217758,
        audio:
          "https://xeno-canto.org/sounds/uploaded/ODNEDFESFY/XC217758-Hydropsalis%20albicollis%20%28Gmelin%2C%201789%29.mp3",
        recordist: "Alexandre Bianco",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Urussanga, SC",
        type: "song",
        start: 0.33,
        end: 13.5,
        fmax: 5000,
      },
    ],
  },
  {
    name: "Bacurau-chintã",
    scientificName: "Setopagis parvula",
    family: "Caprimulgidae",
    inatTaxonId: 367507,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/182555778/medium.jpg",
    photoCredit:
      "(c) Lilian Tomazelli, some rights reserved (CC BY-NC), uploaded by Lilian Tomazelli",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // The whole 18s recording: four songs
        source: "xenocanto",
        xc: 121383,
        audio:
          "https://xeno-canto.org/sounds/uploaded/ODNEDFESFY/XC121383-Hydropsalis%20parvula%20%28Gould%2C%201837%29.mp3",
        recordist: "Alexandre Bianco",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Palhoça, SC",
        type: "song",
        duration: 17.59,
        fmax: 5000,
      },
    ],
  },
  {
    name: "Balança-rabo-de-máscara",
    scientificName: "Polioptila dumicola",
    family: "Polioptilidae",
    inatTaxonId: 7509,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/321464947/medium.jpeg",
    photoCredit:
      "(c) Gustavo Fernando Durán, some rights reserved (CC BY-NC-SA), uploaded by Gustavo Fernando Durán",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Five song phrases of arched 'tsee' notes, about 19s of the 3m01s recording
        source: "xenocanto",
        xc: 823944,
        audio:
          "https://xeno-canto.org/sounds/uploaded/BZVYBRUAAE/XC823944-230729_01_Masked-Gnatcatcher_Parque-Estadual-do-Espinilho,-RS,-Brazil_28-July-2023.mp3",
        recordist: "Guy Kirwan",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Barra do Quaraí, RS",
        type: "song",
        start: 38.8,
        end: 57.8,
      },
    ],
  },
  {
    name: "Quero-quero",
    scientificName: "Vanellus chilensis",
    family: "Charadriidae",
    inatTaxonId: 4867,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/366729434/medium.jpg",
    photoCredit: "(c) joakosbirdlife, some rights reserved (CC BY-NC)",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // A steady run of calls ending in four loud notes, about 6s of the 58s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1269554.mp3",
        recordist: "juliazelandia",
        license: "cc-by-nc",
        observation: 255533783,
        location: "Porto Alegre, RS",
        type: "song",
        start: 41.6,
        end: 47.7,
      },
    ],
  },
  {
    name: "Batuíra-de-coleira",
    scientificName: "Anarhynchus collaris",
    family: "Charadriidae",
    inatTaxonId: 1505645,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/37910349/medium.jpg",
    photoCredit: "(c) pedro vargas, some rights reserved (CC BY-NC), uploaded by pedro vargas",
    coa: { frequency: "Rara", season: "Todo o ano" },
    sounds: [
      {
        // A burst of excited 'kip' calls, then single sharp 'kip' calls, about 15s of the 57s recording
        source: "xenocanto",
        xc: 686879,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC686879-09-11-2021%2017e57%20Batuira%20de%20coleira%20BOA%20MOSTARDAS.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Mostardas, RS",
        type: "call",
        start: 13.45,
        end: 28.45,
      },
    ],
  },
  {
    name: "Beija-flor-dourado",
    scientificName: "Hylocharis chrysura",
    family: "Trochilidae",
    inatTaxonId: 5979,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/407947064/medium.jpg",
    photoCredit:
      "(c) Leonardo Quintana, some rights reserved (CC BY-NC), uploaded by Leonardo Quintana",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // Two long buzzy song trills with chip notes between, about 14s of the 28s recording
        source: "xenocanto",
        xc: 686667,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC686667-06-11-2021%206e15%20Beija%20flor%20dourado%20BOA%20BAGE.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Bagé, RS",
        type: "song",
        start: 9.5,
        end: 23.7,
      },
    ],
  },
  {
    name: "Besourinho-de-bico-vermelho",
    scientificName: "Chlorostilbon lucidus",
    family: "Trochilidae",
    inatTaxonId: 6085,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/32687025/medium.jpeg",
    photoCredit: "(c) Nicolas Olejnik, some rights reserved (CC BY), uploaded by Nicolas Olejnik",
    coa: { frequency: "Comum", season: "Primavera/verão" },
    sounds: [
      {
        // A run of dry chip calls, about 12s of the 32s recording
        source: "xenocanto",
        xc: 142783,
        audio:
          "https://xeno-canto.org/sounds/uploaded/ORPKXJRFDZ/XC142783-besourinho%20de%20bico%20verm.mp3",
        recordist: "Luiz C. Silva",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Campo Mourão, PR",
        type: "call",
        start: 19.45,
        end: 31.6,
      },
    ],
  },
  {
    name: "Beija-flor-preto",
    scientificName: "Florisuga fusca",
    family: "Trochilidae",
    inatTaxonId: 6420,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/178158642/medium.jpg",
    photoCredit:
      "(c) Claudio Martins de Souza, some rights reserved (CC BY-NC), uploaded by Claudio Martins de Souza",
    coa: { frequency: "Pouco comum", season: "Outono/inverno" },
    sounds: [
      {
        // A steady series of high 'tsip' calls, about 16s of the 17s recording
        source: "xenocanto",
        xc: 344850,
        audio:
          "https://xeno-canto.org/sounds/uploaded/ORPKXJRFDZ/XC344850-beija%20flor%20preto.mp3",
        recordist: "Luiz C. Silva",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Campo Mourão, PR",
        type: "call",
        start: 0.1,
        end: 16.1,
        fmin: 2000,
        fmax: 14000,
      },
    ],
  },
  {
    name: "Beija-flor-tesoura",
    scientificName: "Eupetomena macroura",
    family: "Trochilidae",
    inatTaxonId: 6065,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/586765879/medium.jpg",
    photoCredit:
      "(c) Mauricio Mercadante, some rights reserved (CC BY-NC-SA), uploaded by Mauricio Mercadante",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // The whole 6s recording: a steady series of sharp ticks
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1613484.mp3",
        recordist: "amandapmarcon",
        license: "cc-by-nc",
        observation: 308531263,
        location: "Getúlio Vargas, RS",
        type: "call",
        duration: 6.31,
      },
    ],
  },
  {
    name: "Beija-flor-de-papo-branco",
    scientificName: "Leucochloris albicollis",
    family: "Trochilidae",
    inatTaxonId: 6521,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/182457798/medium.jpeg",
    photoCredit: "(c) Peter Taylor, some rights reserved (CC BY-NC), uploaded by Peter Taylor",
    coa: { frequency: "Incomum", season: "Outono/inverno" },
    sounds: [
      {
        // The whole 21s recording: rhythmic song phrases
        source: "xenocanto",
        xc: 23764,
        audio: "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/Leucochloris%20albicollis2.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Capão do Leão, RS",
        type: "song",
        duration: 21.31,
      },
    ],
  },
  {
    name: "Beija-flor-de-fronte-violeta",
    scientificName: "Thalurania glaucopis",
    family: "Trochilidae",
    inatTaxonId: 5947,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/26314598/medium.jpeg",
    photoCredit: "(c) guyincognito, some rights reserved (CC BY-NC), uploaded by guyincognito",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 24s recording: a steady 'tsip' song series
        source: "xenocanto",
        xc: 176877,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC176877-Trochilidae_Thalurania_glaucopis_30_05_2011_H16_06_Fazenda_Beira_Rio_Salete.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Salete, SC",
        type: "song",
        duration: 24.5,
      },
    ],
  },
  {
    name: "Beija-flor-de-veste-preta",
    scientificName: "Anthracothorax nigricollis",
    family: "Trochilidae",
    inatTaxonId: 5807,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/219766479/medium.jpg",
    photoCredit: "(c) photokeen, some rights reserved (CC BY-NC-ND), uploaded by photokeen",
    coa: { frequency: "Rara", season: "Primavera/verão" },
    sounds: [
      {
        // A steady series of sharp 'tsick' notes, about 16s of the 23s recording
        source: "xenocanto",
        xc: 170424,
        audio:
          "https://xeno-canto.org/sounds/uploaded/ORPKXJRFDZ/XC170424-beija%20flor%20de%20veste%20preta.mp3",
        recordist: "Luiz C. Silva",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Campo Mourão, PR",
        type: "call",
        start: 0.2,
        end: 16.45,
        fmax: 14000,
      },
    ],
  },
  {
    name: "Beija-flor-de-topete-azul",
    scientificName: "Stephanoxis loddigesii",
    family: "Trochilidae",
    inatTaxonId: 513980,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/168812870/medium.jpg",
    photoCredit: "no rights reserved, uploaded by Frank Thomas Sautter",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 22s recording: the high squeaky song repeated
        source: "xenocanto",
        xc: 186793,
        audio:
          "https://xeno-canto.org/sounds/uploaded/CEKMJEZKSJ/XC186793-Stephanoxis_lalandi_07_11_2013_Campus_Embrapa.mp3",
        recordist: "João Gava",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Passo Fundo, RS",
        type: "song",
        duration: 22.23,
      },
    ],
  },
  {
    name: "Bico-reto-azul",
    scientificName: "Heliomaster furcifer",
    family: "Trochilidae",
    inatTaxonId: 5868,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/419072263/medium.jpg",
    photoCredit: "(c) Lindolfo Souto, some rights reserved (CC BY), uploaded by Lindolfo Souto",
    coa: { frequency: "Acidental", season: "Indeterminada" },
    sounds: [
      {
        // Eleven calls, about 13s of the 29s recording
        source: "xenocanto",
        xc: 803026,
        audio:
          "https://xeno-canto.org/sounds/uploaded/ORPKXJRFDZ/XC803026-bico-reto-azul-editado.mp3",
        recordist: "Luiz C. Silva",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Campo Mourão, PR",
        type: "call",
        start: 14.2,
        end: 26.95,
        fmin: 2000,
        fmax: 14000,
      },
    ],
  },
  {
    name: "Beija-flor-de-banda-branca",
    scientificName: "Chrysuronia versicolor",
    family: "Trochilidae",
    inatTaxonId: 1289647,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/244361576/medium.jpg",
    photoCredit:
      "(c) Tomaz Nascimento de Melo, some rights reserved (CC BY-NC-ND), uploaded by Tomaz Nascimento de Melo",
    coa: { frequency: "Rara", season: "Todo o ano" },
    sounds: [
      {
        // Song, a long series of high notes, about 11s of the 30s recording
        source: "xenocanto",
        xc: 173956,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC173956-Trochilidae_Amazilia_versicolor_06_10_2011_H17_23_Centro_Vidal_Ramos.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Vidal Ramos, SC",
        type: "song",
        start: 0.15,
        end: 11.4,
        fmin: 3000,
        fmax: 12000,
      },
    ],
  },
  {
    name: "Bico-de-lacre",
    scientificName: "Estrilda astrild",
    family: "Estrildidae",
    inatTaxonId: 13770,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/397446858/medium.jpg",
    photoCredit:
      "(c) David Barros Cardona, some rights reserved (CC BY-NC), uploaded by David Barros Cardona",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    introduced: true,
    sounds: [
      {
        // Flock chatter, about 9s of the 32s recording
        source: "xenocanto",
        xc: 318794,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/XC318794-Estrilda%20astrild%20-%2027-05-2016%20-%2016h28%20-%20passando%20galat%C3%A9ia%20estrada%20nova%20retiro.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Pelotas, RS",
        type: "call",
        start: 0.1,
        end: 9.5,
      },
    ],
  },
  {
    name: "Biguatinga",
    scientificName: "Anhinga anhinga",
    family: "Anhingidae",
    inatTaxonId: 5063,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/195512943/medium.jpg",
    photoCredit: "(c) Shiva Shenoy, some rights reserved (CC BY), uploaded by Shiva Shenoy",
    coa: { frequency: "Rara", season: "Todo o ano" },
    sounds: [
      {
        // Three rattling calls, about 11s of the 33s recording
        source: "xenocanto",
        xc: 657828,
        audio:
          "https://xeno-canto.org/sounds/uploaded/YOXWKYFZAP/XC657828-Anhinga%20anhinga%20DCB%20477-16.mp3",
        recordist: "Dante Buzzetti",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Poconé, MT",
        type: "call",
        start: 3.75,
        end: 14.85,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Tororó",
    scientificName: "Poecilotriccus plumbeiceps",
    family: "Rhynchocyclidae",
    inatTaxonId: 17050,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/118442274/medium.jpg",
    photoCredit:
      "(c) Luciano Bernardes, some rights reserved (CC BY-NC), uploaded by Luciano Bernardes",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 12s recording: three low dry trills
        source: "xenocanto",
        xc: 422205,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC422205-Tororo%20%28Poecilotriccus%20plumbeiceps-OK-OK%29.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Canela, RS",
        type: "song",
        duration: 12.01,
        fmax: 5000,
      },
    ],
  },
  {
    name: "Borboletinha-do-mato",
    scientificName: "Phylloscartes ventralis",
    family: "Rhynchocyclidae",
    inatTaxonId: 16948,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/11319747/medium.jpg",
    photoCredit: "(c) Arnold Wijker, some rights reserved (CC BY-NC), uploaded by Arnold Wijker",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // A long series of sharp song notes, about 14s of the 54s recording
        source: "xenocanto",
        xc: 409866,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC409866-Borboletinha%20do%20mato%20%28Phylloscartes%20ventralis-OK%29.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Canela, RS",
        type: "song",
        start: 0.15,
        end: 14.62,
      },
    ],
  },
  {
    name: "Bico-chato-de-orelha-preta",
    scientificName: "Tolmomyias sulphurescens",
    family: "Rhynchocyclidae",
    inatTaxonId: 16567,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/130260728/medium.jpg",
    photoCredit: "(c) Sergio R Porto, some rights reserved (CC BY-NC), uploaded by Sergio R Porto",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Four sharp, rising song notes, about 5s of the 25s recording
        source: "xenocanto",
        xc: 81742,
        audio: "https://xeno-canto.org/sounds/uploaded/DGVLLRYDXS/TOLSUL34.mp3",
        recordist: "Jeremy Minns",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        start: 18.05,
        end: 23.4,
      },
    ],
  },
  {
    name: "Ferreirinho-relógio",
    scientificName: "Todirostrum cinereum",
    family: "Rhynchocyclidae",
    inatTaxonId: 17148,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/369307358/medium.jpg",
    photoCredit: "(c) terence zahner, some rights reserved (CC BY-NC), uploaded by terence zahner",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // The whole 15s recording: the ticking song
        source: "xenocanto",
        xc: 173977,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC173977-Tyrannidae_Todirostrum_cinereum_03_12_2011_H08_53_Centro_Vidal_Ramos.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Vidal Ramos, SC",
        type: "song",
        duration: 14.83,
      },
    ],
  },
  {
    name: "Cabeçudo",
    scientificName: "Leptopogon amaurocephalus",
    family: "Rhynchocyclidae",
    inatTaxonId: 16371,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/77930/medium.jpg",
    photoCredit: "(c) Dario Sanches, some rights reserved (CC BY-SA)",
    coa: { frequency: "Rara", season: "Todo o ano" },
    sounds: [
      {
        // Four songs, about 14s of the 25s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1627246.mp3",
        recordist: "amandapmarcon",
        license: "cc-by-nc",
        observation: 311920186,
        location: "Mato Castelhano, RS",
        type: "song",
        start: 0.5,
        end: 14.4,
      },
    ],
  },
  {
    name: "Caminheiro-zumbidor",
    scientificName: "Anthus chii",
    family: "Motacillidae",
    inatTaxonId: 1506152,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/581440670/medium.jpg",
    photoCredit:
      "(c) Enéas V. Gouvêa Junior, some rights reserved (CC BY-SA), uploaded by Enéas V. Gouvêa Junior",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 19s recording: two flight songs
        source: "xenocanto",
        xc: 662524,
        audio:
          "https://xeno-canto.org/sounds/uploaded/CFRYARSVHN/XC662524-Caminheiro%20xc%20recording-20210710-122139.mp3",
        recordist: "Ricardo José Mitidieri",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Guapimirim, RJ",
        type: "song",
        duration: 19.2,
      },
    ],
  },
  {
    name: "Carão",
    scientificName: "Aramus guarauna",
    family: "Aramidae",
    inatTaxonId: 7,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/161521395/medium.jpg",
    photoCredit: "(c) David Monroy R, some rights reserved (CC BY-NC), uploaded by David Monroy R",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Nine wailing 'carrao' calls, about 11s of the 25s recording
        source: "xenocanto",
        xc: 200376,
        audio:
          "https://xeno-canto.org/sounds/uploaded/VKQHDAFQDZ/XC200376-Carau%20%28Aramus%20guarauna%29.mp3",
        recordist: "Pedro Rinaldi",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Salto, Uruguai",
        type: "call",
        start: 8.95,
        end: 19.8,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Cabeça-seca",
    scientificName: "Mycteria americana",
    family: "Ciconiidae",
    inatTaxonId: 4742,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/87252334/medium.jpg",
    photoCredit: "(c) chezasaurus, some rights reserved (CC BY-NC), uploaded by chezasaurus",
    coa: { frequency: "Incomum", season: "Primavera/verão" },
    sounds: [
      {
        // A young bird's begging calls at the nest, the first 6s of the 28s recording
        source: "xenocanto",
        xc: 197030,
        audio:
          "https://xeno-canto.org/sounds/uploaded/WOEAFQRMUD/XC197030-Mycteria%20americana140905_T1197.mp3",
        recordist: "Dan Lane",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Beni, Bolívia",
        type: "call",
        start: 0,
        end: 6.3,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Maguari",
    scientificName: "Ciconia maguari",
    family: "Ciconiidae",
    inatTaxonId: 4740,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/14171302/medium.jpg",
    photoCredit:
      "(c) João Vitor Andriola, some rights reserved (CC BY-NC), uploaded by João Vitor Andriola",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Hissing calls of young birds, the whole 11s recording (its license doesn't allow cutting it)
        source: "xenocanto",
        xc: 50307,
        audio:
          "https://xeno-canto.org/sounds/uploaded/FKVINBDVIO/STORK%20Maguari_02_Puente%20Barral_Saladillo_Buenos%20Aires_AR_27OCT85_young_Miguel%20Angel%20Roda.mp3",
        recordist: "Miguel Angel Roda",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Saladillo, Argentina",
        type: "call",
        duration: 10.85,
      },
    ],
  },
  {
    name: "Tuiuiú",
    scientificName: "Jabiru mycteria",
    family: "Ciconiidae",
    inatTaxonId: 4773,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/578900/medium.jpg",
    photoCredit: "(c) David Schenfeld (busy), some rights reserved (CC BY-NC-ND)",
    sounds: [],
  },
  {
    name: "Choca-da-mata",
    scientificName: "Thamnophilus caerulescens",
    family: "Thamnophilidae",
    inatTaxonId: 15757,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/210204427/medium.jpeg",
    photoCredit: "(c) joseluisblazquez, some rights reserved (CC BY-NC)",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 14s recording: repeated nasal 'nyah' calls
        source: "xenocanto",
        xc: 413861,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC413861-Choca%20da%20mata4%20%28Thamnophilus%20caerulescens-OK-OK%29.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Canela, RS",
        type: "call",
        duration: 14.04,
        fmax: 4000,
      },
    ],
  },
  {
    name: "Choca-de-chapéu-vermelho",
    scientificName: "Thamnophilus ruficapillus",
    family: "Thamnophilidae",
    inatTaxonId: 15758,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/11210811/medium.jpg",
    photoCredit:
      "(c) fabiomanfredini, some rights reserved (CC BY-NC), uploaded by fabiomanfredini",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Three accelerating songs, about 14s of the 28s recording
        source: "xenocanto",
        xc: 413867,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC413867-Choca%20de%20chapeu%20vermelho%20%28Thamnophilus%20ruficapillus-OK-OK%29.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        start: 8.2,
        end: 22.1,
        fmax: 4000,
      },
    ],
  },
  {
    name: "Borralhara-assobiadora",
    scientificName: "Mackenziaena leachii",
    family: "Thamnophilidae",
    inatTaxonId: 15857,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/66271126/medium.jpg",
    photoCredit:
      "(c) Hudson Martins Soares, some rights reserved (CC BY-NC), uploaded by Hudson Martins Soares",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 23s recording: two songs
        source: "xenocanto",
        xc: 181725,
        audio:
          "https://xeno-canto.org/sounds/uploaded/TLLUGZINYM/XC181725-Mackenziana%20leachii%20%28Candiota-RS%2C%2025.05.14%29.mp3",
        recordist: "Roberto Buss Stringari",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Pedras Altas, RS",
        type: "song",
        duration: 22.6,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Chupa-dente",
    scientificName: "Conopophaga lineata",
    family: "Conopophagidae",
    inatTaxonId: 578313,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/730663816/medium.jpg",
    photoCredit: "(c) Don Marsille, some rights reserved (CC BY-NC), uploaded by Don Marsille",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Nine sneezy 'chiff' calls, about 17s of the 44s recording
        source: "xenocanto",
        xc: 212147,
        audio:
          "https://xeno-canto.org/sounds/uploaded/CEKMJEZKSJ/XC212147-Conopophaga_lineata_11-01-2015_FLONA.mp3",
        recordist: "João Gava Just",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "São Francisco de Paula, RS",
        type: "call",
        start: 0.4,
        end: 17,
      },
    ],
  },
  {
    name: "Marreca-ananaí",
    scientificName: "Amazonetta brasiliensis",
    family: "Anatidae",
    inatTaxonId: 7182,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/247800710/medium.jpg",
    photoCredit: "(c) Dario Sanches, some rights reserved (CC BY-SA)",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 5s recording: two calls
        source: "xenocanto",
        xc: 218416,
        audio:
          "https://xeno-canto.org/sounds/uploaded/OOECIWCSWV/XC218416-Brazilian%20Teal%20B%20471.mp3",
        recordist: "Peter Boesman",
        license: "cc-by-nc-nd",
        licenseVersion: "4.0",
        location: "São Francisco de Paula, RS",
        type: "call",
        duration: 5.33,
      },
    ],
  },
  {
    name: "Marreca-de-coleira",
    scientificName: "Callonetta leucophrys",
    family: "Anatidae",
    inatTaxonId: 7188,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/329671116/medium.jpeg",
    photoCredit: "(c) Martin Arregui, some rights reserved (CC BY-NC), uploaded by Martin Arregui",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Three nasal calls, 4s of the 21s recording
        source: "xenocanto",
        xc: 44463,
        audio:
          "https://xeno-canto.org/sounds/uploaded/BYLLSJRVDZ/Callonetta%20leucophrys_Ringed%20Teal_Departamento%20Garay_Santa%20Fe_Argentina_MAR2009_Bernabe%20Lopez-Lanus.mp3",
        recordist: "Bernabe Lopez-Lanus",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Helvecia, Argentina",
        type: "call",
        start: 13.05,
        end: 17.4,
      },
    ],
  },
  {
    name: "Marreca-pardinha",
    scientificName: "Anas flavirostris",
    family: "Anatidae",
    inatTaxonId: 6947,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/452559360/medium.jpg",
    photoCredit:
      "(c) Gonzalo González Mora, some rights reserved (CC BY), uploaded by Gonzalo González Mora",
    coa: { frequency: "Rara", season: "Outono/inverno" },
    sounds: [
      {
        // A long series of harsh flight calls, about 13s of the 27s recording
        source: "xenocanto",
        xc: 741141,
        audio: "https://xeno-canto.org/sounds/uploaded/VLDFGFKOWN/XC741141-patobarcinooqueseyo.mp3",
        recordist: "Franco Vushurovich",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Soldini, Argentina",
        type: "call",
        start: 10,
        end: 23.4,
      },
    ],
  },
  {
    name: "Irerê",
    scientificName: "Dendrocygna viduata",
    family: "Anatidae",
    inatTaxonId: 6898,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/30515510/medium.jpeg",
    photoCredit: "(c) Bird Explorers, some rights reserved (CC BY-NC), uploaded by Bird Explorers",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 12s recording: a flock whistling
        source: "xenocanto",
        xc: 85076,
        audio: "https://xeno-canto.org/sounds/uploaded/DGVLLRYDXS/DENVID07.mp3",
        recordist: "Jeremy Minns",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Uruguaiana, RS",
        type: "call",
        duration: 11.74,
      },
    ],
  },
  {
    name: "Marreca-cricri",
    scientificName: "Spatula versicolor",
    family: "Anatidae",
    inatTaxonId: 558431,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/166959095/medium.jpeg",
    photoCredit:
      "(c) Bryan Caro San Martin, some rights reserved (CC BY-NC), uploaded by Bryan Caro San Martin",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // A run of nasal calls, most of the 4s recording
        source: "xenocanto",
        xc: 686845,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC686845-09-11-2021%207e39%20Marreca%20cricri%20MOSTARDAS.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Mostardas, RS",
        type: "call",
        start: 0.35,
        end: 3.8,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Marreca-cabocla",
    scientificName: "Dendrocygna autumnalis",
    family: "Anatidae",
    inatTaxonId: 6893,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/411123026/medium.jpg",
    photoCredit:
      "(c) cello caruso-turiello, some rights reserved (CC BY), uploaded by cello caruso-turiello",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // Three bouts of whistled calls, about 7s of the 13s recording
        source: "xenocanto",
        xc: 511711,
        audio:
          "https://xeno-canto.org/sounds/uploaded/VKQHDAFQDZ/XC511711-Sirir%C3%AD%20Vientre%20Negro%5B1%5D.mp3",
        recordist: "Pedro Rinaldi",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Salto, Uruguai",
        type: "call",
        start: 3.5,
        end: 10.8,
      },
    ],
  },
  {
    name: "Marreca-caneleira",
    scientificName: "Dendrocygna bicolor",
    family: "Anatidae",
    inatTaxonId: 6899,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/91528685/medium.jpg",
    photoCredit: "(c) Tom Benson, some rights reserved (CC BY-NC-ND)",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 20s recording: single whistled calls, then a flock calling together
        source: "xenocanto",
        xc: 20601,
        audio: "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/Dendrocygna%20bicolor.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Arroio Grande, RS",
        type: "call",
        duration: 20.04,
      },
    ],
  },
  {
    name: "Pato-do-mato",
    scientificName: "Cairina moschata",
    family: "Anatidae",
    inatTaxonId: 7120,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/54389963/medium.jpg",
    photoCredit: "(c) Bernard DUPONT, some rights reserved (CC BY-SA)",
    conservation: { status: "NT", list: "RS" },
    sounds: [],
  },
  {
    name: "Marreca-parda",
    scientificName: "Anas georgica",
    family: "Anatidae",
    inatTaxonId: 6988,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/177332894/medium.jpeg",
    photoCredit: "(c) markus lilje, some rights reserved (CC BY-NC-ND), uploaded by markus lilje",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // A series of seven rasping quacks, about 5s of the 9s recording
        source: "xenocanto",
        xc: 32169,
        audio: "https://xeno-canto.org/sounds/uploaded/XTVEPHMPPJ/Anas_georgica_2009_03_22b.mp3",
        recordist: "Niels Krabbe",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Puesto del Marqués, Argentina",
        type: "call",
        start: 1.2,
        end: 6.6,
      },
    ],
  },
  {
    name: "Capororoca",
    scientificName: "Coscoroba coscoroba",
    family: "Anatidae",
    inatTaxonId: 7166,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/160405251/medium.jpg",
    photoCredit: "(c) Ninosca Angel, some rights reserved (CC BY-NC), uploaded by Ninosca Angel",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // Six honking calls, about 7s of the 17s recording
        source: "xenocanto",
        xc: 510827,
        audio:
          "https://xeno-canto.org/sounds/uploaded/TGBFXDVERJ/XC510827-Coscoroba%20coscoroba_Tavares_1131.mp3",
        recordist: "Gabriel Leite",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Tavares, RS",
        type: "call",
        start: 0.95,
        end: 7.5,
      },
    ],
  },
  {
    name: "Marreca-toicinho",
    scientificName: "Anas bahamensis",
    family: "Anatidae",
    inatTaxonId: 6951,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/173806806/medium.jpg",
    photoCredit:
      "(c) Mariano Fernández Kloster, some rights reserved (CC BY-NC), uploaded by Mariano Fernández Kloster",
    sounds: [
      {
        // The whole 5s recording: a series of loud quacks
        source: "xenocanto",
        xc: 831012,
        audio:
          "https://xeno-canto.org/sounds/uploaded/XNCZRQNJCS/XC831012-230725_2233_230725_1412PM_White-cheeked-Pintail_FlightCall_Catamarca_EQuintanilla.mp3",
        recordist: "Eduardo Quintanilla",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Catamarca, Argentina",
        type: "call",
        duration: 4.98,
      },
    ],
  },
  {
    name: "Marreca-caucau",
    scientificName: "Nomonyx dominicus",
    family: "Anatidae",
    inatTaxonId: 7172,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/3010674/medium.jpg",
    photoCredit: "(c) Richard  Crook, some rights reserved (CC BY-NC-ND)",
    sounds: [],
  },
  {
    name: "Tapicuru",
    scientificName: "Phimosus infuscatus",
    family: "Threskiornithidae",
    inatTaxonId: 3736,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/417897827/medium.jpg",
    photoCredit: "(c) Bernard DUPONT, some rights reserved (CC BY-SA)",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 20s recording: four bursts of hoarse grunting calls
        source: "xenocanto",
        xc: 45296,
        audio:
          "https://xeno-canto.org/sounds/uploaded/SMJXFKLATM/Threskiornithidae._Phimosus_infuscatus_Itacorubi_Florianopolis_10.03.2010_ELXCW.mp3",
        recordist: "Evair Legal",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Florianópolis, SC",
        type: "call",
        duration: 19.56,
        fmax: 4000,
      },
    ],
  },
  {
    name: "Caraúna",
    scientificName: "Plegadis chihi",
    family: "Threskiornithidae",
    inatTaxonId: 3759,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/369174108/medium.jpg",
    photoCredit: "(c) Ad Konings, some rights reserved (CC BY-NC), uploaded by Ad Konings",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // A flock's nasal flight calls, about 11s of the 18s recording
        source: "xenocanto",
        xc: 510883,
        audio:
          "https://xeno-canto.org/sounds/uploaded/TGBFXDVERJ/XC510883-Plegaris%20chili_Mostardas_1077.mp3",
        recordist: "Gabriel Leite",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Mostardas, RS",
        type: "call",
        start: 1.9,
        end: 13.25,
      },
    ],
  },
  {
    name: "Colhereiro",
    scientificName: "Platalea ajaja",
    family: "Threskiornithidae",
    inatTaxonId: 62529,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/2069153/medium.jpg",
    photoCredit: "(c) Nigel Voaden, some rights reserved (CC BY)",
    coa: { frequency: "Rara", season: "Todo o ano" },
    sounds: [
      {
        // Four bouts of low grunting, about 16s of the 52s recording
        source: "xenocanto",
        xc: 657826,
        audio:
          "https://xeno-canto.org/sounds/uploaded/YOXWKYFZAP/XC657826-Platalea%20ajaja%20DCB%20477-13B.mp3",
        recordist: "Dante Buzzetti",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Poconé, MT",
        type: "call",
        start: 1.5,
        end: 17,
        fmax: 4000,
      },
    ],
  },
  {
    name: "Curicaca",
    scientificName: "Theristicus caudatus",
    family: "Threskiornithidae",
    inatTaxonId: 3766,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/9867600/medium.jpg",
    photoCredit: "(c) Greg Lasley, some rights reserved (CC BY-NC), uploaded by Greg Lasley",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // The whole 20s recording: a pair's loud honking duet, fading out
        source: "xenocanto",
        xc: 51392,
        audio:
          "https://xeno-canto.org/sounds/uploaded/BYLLSJRVDZ/IBIS%20Buff-necked_03_Sao%20Francisco%20de%20Paula_Rio%20Grande%20do%20Sul_BR_7JUL07_Bernabe%20Lopez-Lanus.mp3",
        recordist: "Bernabe Lopez-Lanus",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "São Francisco de Paula, RS",
        type: "call",
        duration: 20.4,
      },
    ],
  },
  {
    name: "Coró-coró",
    scientificName: "Mesembrinibis cayennensis",
    family: "Threskiornithidae",
    inatTaxonId: 3770,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/739170999/medium.jpg",
    photoCredit: "(c) Matt Blue, some rights reserved (CC BY-NC), uploaded by Matt Blue",
    coa: { frequency: "Acidental", season: "Indeterminada" },
    conservation: { status: "NT", list: "RS" },
    sounds: [
      {
        // A rolling klu-klu-klu call series, about 6s of the 8s recording
        source: "xenocanto",
        xc: 176864,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC176864-Threskiornithidae_Mesembrinibis_cayennensis_10_10_2010_H15_19_Fazenda_Beira_Rio_Salete.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Salete, SC",
        type: "call",
        start: 2.5,
        end: 8.36,
        fmax: 5000,
      },
    ],
  },
  {
    name: "Urubu-preto",
    scientificName: "Coragyps atratus",
    family: "Cathartidae",
    inatTaxonId: 4765,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/176419188/medium.jpg",
    photoCredit:
      "(c) eduardovieira17, some rights reserved (CC BY-NC), uploaded by eduardovieira17",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 13s recording: a run of huffing hisses, then one long hiss
        source: "xenocanto",
        xc: 422353,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC422353-Urubu%20de%20cabeca%20preta3%20%28Coragyps%20atratus-OK-OK%29.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Canela, RS",
        type: "call",
        duration: 13.05,
      },
    ],
  },
  {
    name: "Urubu-de-cabeça-vermelha",
    scientificName: "Cathartes aura",
    family: "Cathartidae",
    inatTaxonId: 4756,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/52277010/medium.jpg",
    photoCredit: "(c) Seig, some rights reserved (CC BY), uploaded by Seig",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Two long hisses, about 8s of the 1m54s recording
        source: "xenocanto",
        xc: 520288,
        audio:
          "https://xeno-canto.org/sounds/uploaded/SEVIQQAKWM/XC520288-ZOOM0004_Tr1%20-%20Jote%20Cabeza%20colorada.mp3",
        recordist: "Cristian Pinto",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "La Higuera, Chile",
        type: "call",
        start: 88.2,
        end: 96.3,
      },
    ],
  },
  {
    name: "Urubu-de-cabeça-amarela",
    scientificName: "Cathartes burrovianus",
    family: "Cathartidae",
    inatTaxonId: 4761,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/260941303/medium.jpg",
    photoCredit: "(c) Anthony Batista, some rights reserved (CC BY), uploaded by Anthony Batista",
    coa: { frequency: "Rara", season: "Todo o ano" },
    sounds: [],
  },
  {
    name: "Biguá",
    scientificName: "Nannopterum brasilianum",
    family: "Phalacrocoracidae",
    inatTaxonId: 1289601,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/23856507/medium.jpg",
    photoCredit:
      "(c) Kala Murphy King, some rights reserved (CC BY-NC-ND), uploaded by Kala Murphy King",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 6s recording: guttural grunting display
        source: "xenocanto",
        xc: 686946,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC686946-11-11-2021%209e15%20Bigua%20RIO%20GRANDE.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Rio Grande, RS",
        type: "song",
        duration: 6.4,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Corruíra",
    scientificName: "Troglodytes musculus",
    family: "Troglodytidae",
    inatTaxonId: 1578442,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/2074835/medium.jpg",
    photoCredit: "(c) elhoffa, some rights reserved (CC BY-NC)",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // One full song, about 4s of the 14s recording
        source: "xenocanto",
        xc: 153763,
        audio:
          "https://xeno-canto.org/sounds/uploaded/NBJQSQJRYH/XC153763-Troglodytes-musculus-PqMoinhosdeVentoPOA-BR-3-11-13-ASilveira.mp3",
        recordist: "Antonio Silveira",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Porto Alegre, RS",
        type: "song",
        start: 0.5,
        end: 4.3,
      },
    ],
  },
  {
    name: "Coruja-orelhuda",
    scientificName: "Asio clamator",
    family: "Strigidae",
    inatTaxonId: 558468,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/466424122/medium.jpg",
    photoCredit: "(c) poli782003, some rights reserved (CC BY-NC)",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // One whistled 'wheeyoo' call, 2s of the 34s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/2148329.wav",
        recordist: "Rafaela Vargas",
        license: "cc-by",
        observation: 397698488,
        location: "Taquara, RS",
        type: "call",
        start: 9.7,
        end: 11.5,
      },
    ],
  },
  {
    name: "Coruja-buraqueira",
    scientificName: "Athene cunicularia",
    family: "Strigidae",
    inatTaxonId: 19975,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/271464379/medium.jpg",
    photoCredit:
      "(c) Steven Mlodinow, some rights reserved (CC BY-NC), uploaded by Steven Mlodinow",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 23s recording: three alarm bouts, a screech then a chatter of 'kek' notes
        source: "xenocanto",
        xc: 16757,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/Coruja-buraqueira%20-%20Athene%20cunicularia-02.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Pelotas, RS",
        type: "call",
        duration: 22.56,
      },
    ],
  },
  {
    name: "Mocho-diabo",
    scientificName: "Asio stygius",
    family: "Strigidae",
    inatTaxonId: 20331,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/1119324/medium.jpg",
    photoCredit:
      "(c) Aldo Ortíz Reyes, some rights reserved (CC BY-NC), uploaded by Aldo Ortíz Reyes",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Five 'nyek' calls, about 11s of the 1m00s recording
        source: "xenocanto",
        xc: 965184,
        audio: "https://xeno-canto.org/sounds/uploaded/KJBWVXYZZU/XC965184-Asio_stygius.mp3",
        recordist: "Ademir Fick",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Mato Castelhano, RS",
        type: "call",
        start: 43.2,
        end: 54,
      },
    ],
  },
  {
    name: "Corujinha-do-mato",
    scientificName: "Megascops choliba",
    family: "Strigidae",
    inatTaxonId: 19788,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/460430074/medium.jpg",
    photoCredit: "(c) DavidLarson, some rights reserved (CC BY-NC), uploaded by DavidLarson",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Two trilled songs, about 9s of the 46s recording
        source: "xenocanto",
        xc: 500436,
        audio:
          "https://xeno-canto.org/sounds/uploaded/XJSWEWQCEC/XC500436-choliba_2_eclusa_01_oct_2019_19h.mp3",
        recordist: "Rafael Antunes Dias",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Capão do Leão, RS",
        type: "song",
        start: 19.6,
        end: 28.2,
        fmax: 4000,
      },
    ],
  },
  {
    name: "Jacurutu",
    scientificName: "Bubo virginianus",
    family: "Strigidae",
    inatTaxonId: 20044,
    // large: the medium size of this portrait photo is only 358px wide
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/14549085/large.jpg",
    photoCredit:
      "(c) Paul G. Johnson, some rights reserved (CC BY-NC-SA), uploaded by Paul G. Johnson",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Two bouts of deep hoots, about 7s of the 1m09s recording
        source: "xenocanto",
        xc: 510863,
        audio:
          "https://xeno-canto.org/sounds/uploaded/TGBFXDVERJ/XC510863-Bubo%20virginianus_Mostardas_1105.mp3",
        recordist: "Gabriel Leite",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Mostardas, RS",
        type: "song",
        start: 1.9,
        end: 8.8,
        fmax: 3000,
      },
    ],
  },
  {
    name: "Corujinha-do-sul",
    scientificName: "Megascops sanctaecatarinae",
    family: "Strigidae",
    inatTaxonId: 19784,
    // large: the medium size of this portrait photo is only 346px wide
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/117550780/large.jpg",
    photoCredit:
      "(c) Luciano Bernardes, some rights reserved (CC BY-NC), uploaded by Luciano Bernardes",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // One full song, a rising purring trill, about 5s of the 12s recording
        source: "xenocanto",
        xc: 22771,
        audio:
          "https://xeno-canto.org/sounds/uploaded/XRABICUARW/R09_2046-Long-tufted-Screech-Owl.mp3",
        recordist: "Nick Athanas",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        start: 0.4,
        end: 5.5,
        fmax: 4000,
      },
    ],
  },
  {
    name: "Coruja-do-mato",
    scientificName: "Strix virgata",
    family: "Strigidae",
    inatTaxonId: 72674,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/774636/medium.jpg",
    photoCredit: "(c) dominic sherony, some rights reserved (CC BY-SA)",
    coa: { frequency: "Acidental", season: "Indeterminada" },
    sounds: [
      {
        // Two songs with the natural pause between them, about 13s of the 56s recording
        source: "xenocanto",
        xc: 320324,
        audio:
          "https://xeno-canto.org/sounds/uploaded/ODNEDFESFY/XC320324-Strix%20virgata%20borelliana%20%28Bertoni%2C%201901%29-4.mp3",
        recordist: "Alexandre Bianco",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Urussanga, SC",
        type: "song",
        start: 4.5,
        end: 18,
        fmax: 3000,
      },
    ],
  },
  {
    name: "Gralha-picaça",
    scientificName: "Cyanocorax chrysops",
    family: "Corvidae",
    inatTaxonId: 8484,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/234531093/medium.jpg",
    photoCredit:
      "(c) abelardomendesjr, some rights reserved (CC BY-NC), uploaded by abelardomendesjr",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // Repeated 'chok' calls with flock chatter, about 14s of the 1m02s recording
        source: "xenocanto",
        xc: 153850,
        audio:
          "https://xeno-canto.org/sounds/uploaded/CEKMJEZKSJ/XC153850-Cyanocorax%20chrysops%20ERNESTINA.mp3",
        recordist: "João Gava",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Ernestina, RS",
        type: "call",
        start: 0.7,
        end: 14.3,
      },
    ],
  },
  {
    name: "Pavó",
    scientificName: "Pyroderus scutatus",
    family: "Cotingidae",
    inatTaxonId: 8884,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/2510145/medium.jpg",
    photoCredit: "(c) Francesco Veronesi, some rights reserved (CC BY-SA)",
    coa: { frequency: "Acidental", season: "Indeterminada" },
    conservation: { status: "VU", list: "RS" },
    sounds: [
      {
        // A long run of deep booming hoots, about 17s of the 1m01s recording
        source: "xenocanto",
        xc: 672193,
        audio:
          "https://xeno-canto.org/sounds/uploaded/TGBFXDVERJ/XC672193-Pyroderus%20scutatus_Horto_ML048.mp3",
        recordist: "Gabriel Leite",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "São José dos Campos, SP",
        type: "song",
        start: 40.3,
        end: 57.2,
        fmax: 800,
      },
    ],
  },
  {
    name: "Anu-branco",
    scientificName: "Guira guira",
    family: "Cuculidae",
    inatTaxonId: 1979,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/23659730/medium.jpg",
    photoCredit:
      "(c) Josh van der Meulen, some rights reserved (CC BY-NC-ND), uploaded by Josh van der Meulen",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 12s recording: a group's rattling calls
        source: "xenocanto",
        xc: 216155,
        audio: "https://xeno-canto.org/sounds/uploaded/BATAODEOST/XC216155-Som%20DSCN9304.mp3",
        recordist: "Amanda Perin Marcon",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Getúlio Vargas, RS",
        type: "call",
        duration: 11.87,
      },
    ],
  },
  {
    name: "Alma-de-gato",
    scientificName: "Piaya cayana",
    family: "Cuculidae",
    inatTaxonId: 1758,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/59994525/medium.jpg",
    photoCredit:
      "(c) Roberto González, some rights reserved (CC BY-NC), uploaded by Roberto González",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // A long run of rising 'kweep' notes, 15s of the 28s recording
        source: "xenocanto",
        xc: 858935,
        audio: "https://xeno-canto.org/sounds/uploaded/LBUERSNSGU/XC858935-230925_001.mp3",
        recordist: "Vinícius Soares Domingues",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Rio Grande, RS",
        type: "song",
        start: 9.4,
        end: 24.4,
      },
    ],
  },
  {
    name: "Anu-preto",
    scientificName: "Crotophaga ani",
    family: "Cuculidae",
    inatTaxonId: 1971,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/114342665/medium.jpeg",
    photoCredit: "(c) Esteban Poveda, some rights reserved (CC BY), uploaded by Esteban Poveda",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Four whining 'oo-leek' calls, about 7s of the 26s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1762687.wav",
        recordist: "Lucas Irion",
        license: "cc-by-nc",
        observation: 338010835,
        location: "Florianópolis, SC",
        type: "call",
        start: 1.1,
        end: 8.5,
      },
    ],
  },
  {
    name: "Saci",
    scientificName: "Tapera naevia",
    family: "Cuculidae",
    inatTaxonId: 1989,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/123443099/medium.jpeg",
    photoCredit: "(c) ggroitman, some rights reserved (CC BY-NC), uploaded by ggroitman",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 13s recording: three 'sa-ci' whistled songs
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1613543.mp3",
        recordist: "amandapmarcon",
        license: "cc-by-nc",
        observation: 308531363,
        location: "Eldorado do Sul, RS",
        type: "song",
        duration: 13.13,
        fmax: 5000,
      },
    ],
  },
  {
    name: "Papa-lagarta-acanelado",
    scientificName: "Coccyzus melacoryphus",
    family: "Cuculidae",
    inatTaxonId: 1966,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/17537/medium.jpg",
    photoCredit: "(c) Edwin Harvey, some rights reserved (CC BY-NC-SA)",
    coa: { frequency: "Rara", season: "Primavera/verão" },
    sounds: [
      {
        // Two song phrases, about 15s of the 30s recording
        source: "xenocanto",
        xc: 807695,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LBUERSNSGU/XC807695-Coccyzus-melacoryphus.mp3",
        recordist: "Vinícius Soares Domingues",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Tavares, RS",
        type: "song",
        start: 2.1,
        end: 17.4,
        fmax: 3000,
      },
    ],
  },
  {
    name: "Peixe-frito-pavonino",
    scientificName: "Dromococcyx pavoninus",
    family: "Cuculidae",
    inatTaxonId: 1981,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/65334465/medium.jpg",
    photoCredit:
      "(c) Hudson Martins Soares, some rights reserved (CC BY-NC), uploaded by Hudson Martins Soares",
    coa: { frequency: "Rara", season: "Indeterminada" },
    conservation: { status: "VU", list: "RS" },
    sounds: [
      {
        // Three song phrases, about 15s of the 2m12s recording
        source: "xenocanto",
        xc: 500505,
        audio:
          "https://xeno-canto.org/sounds/uploaded/ODNEDFESFY/XC500505-Dromococcyx%20pavoninus%20%C2%B7%20Pelzeln%2C%201870.mp3",
        recordist: "Alexandre Bianco",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Fagundes Varela, RS",
        type: "song",
        start: 19.8,
        end: 34.6,
        fmax: 5000,
      },
    ],
  },
  {
    name: "Carcará",
    scientificName: "Caracara plancus",
    family: "Falconidae",
    inatTaxonId: 4715,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/344678876/medium.jpeg",
    photoCredit:
      "(c) Juan Cruzado Cortés, some rights reserved (CC BY), uploaded by Juan Cruzado Cortés",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 6s recording: harsh 'krak' calls, mostly in pairs
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1498988.wav",
        recordist: "igor-santos",
        license: "cc-by-nc",
        observation: 285969571,
        location: "São Jerônimo, RS",
        type: "call",
        duration: 5.58,
      },
    ],
  },
  {
    name: "Quiriquiri",
    scientificName: "Falco sparverius",
    family: "Falconidae",
    inatTaxonId: 4665,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/23121348/medium.jpg",
    photoCredit:
      "(c) Josh van der Meulen, some rights reserved (CC BY-NC-ND), uploaded by Josh van der Meulen",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 16s recording: 'killy-killy' series, a whine and a loud 'klee-klee' run
        source: "xenocanto",
        xc: 1046261,
        audio:
          "https://xeno-canto.org/sounds/uploaded/VKQHDAFQDZ/XC1046261-Halconcito-Colorado.mp3",
        recordist: "Pedro Rinaldi",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Cerro Largo, Uruguai",
        type: "call",
        duration: 15.52,
      },
    ],
  },
  {
    name: "Falcão-peregrino",
    scientificName: "Falco peregrinus",
    family: "Falconidae",
    inatTaxonId: 4647,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/212499566/medium.jpg",
    photoCredit: "(c) nautiboy, some rights reserved (CC BY-NC)",
    coa: { frequency: "Rara", season: "Primavera/verão" },
    sounds: [
      {
        // Four harsh 'kak' calls, 2s of the 6s recording
        source: "xenocanto",
        xc: 510907,
        audio:
          "https://xeno-canto.org/sounds/uploaded/VKQHDAFQDZ/XC510907-Halc%C3%B3n%20Peregrino%202019%2011%2030%20at%20101530.mp3",
        recordist: "Pedro Rinaldi",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Salto, Uruguai",
        type: "call",
        start: 0.2,
        end: 2.4,
      },
    ],
  },
  {
    name: "Gavião-carrapateiro",
    scientificName: "Daptrius chimachima",
    family: "Falconidae",
    inatTaxonId: 1432779,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/677390581/medium.jpg",
    photoCredit: "(c) Manuel Raab, some rights reserved (CC BY-NC), uploaded by Manuel Raab",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Seven harsh screams, about 7.5s of the 15s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/54993.mp3",
        recordist: "Fernando Sessegolo",
        license: "cc0",
        observation: 37630324,
        location: "Charqueadas, RS",
        type: "call",
        start: 6.6,
        end: 14,
      },
    ],
  },
  {
    name: "Chimango",
    scientificName: "Daptrius chimango",
    family: "Falconidae",
    inatTaxonId: 1432781,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/240521909/medium.jpeg",
    photoCredit: "(c) graciela_gplp, some rights reserved (CC BY-NC)",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 5s recording: a short chatter, then one long scream
        source: "xenocanto",
        xc: 413853,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC413853-Chimango%20%28Milvago%20chimango-OK-OK%29.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "São Francisco de Paula, RS",
        type: "call",
        duration: 5.26,
      },
    ],
  },
  {
    name: "Falcão-relógio",
    scientificName: "Micrastur semitorquatus",
    family: "Falconidae",
    inatTaxonId: 4698,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/394112373/medium.jpg",
    photoCredit:
      "(c) Alvaro Monter Pozos, some rights reserved (CC BY-NC), uploaded by Alvaro Monter Pozos",
    coa: { frequency: "Rara", season: "Todo o ano" },
    sounds: [
      {
        // Three loud 'aow' calls, about 8s of the 24s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/508908.wav",
        recordist: "Guillermo Andreo",
        license: "cc-by-nc",
        observation: 128270393,
        location: "Maquiné, RS",
        type: "song",
        start: 5.85,
        end: 13.75,
      },
    ],
  },
  {
    name: "Acauã",
    scientificName: "Herpetotheres cachinnans",
    family: "Falconidae",
    inatTaxonId: 4719,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/121267586/medium.jpeg",
    photoCredit: "(c) Lina Crespo, some rights reserved (CC BY-NC), uploaded by Lina Crespo",
    sounds: [
      {
        // The pair's laughing 'gua-cão' duet, about 16s of the 1m14s recording
        source: "xenocanto",
        xc: 127355,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC127355-Falconidae_Herpetotheres_cachimans_08_03_2013_H07_16_Rio_Paloma_Barra_do_Rio_Azul.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Aratiba, RS",
        type: "song",
        start: 0.1,
        end: 16.3,
      },
    ],
  },
  {
    name: "Falcão-de-coleira",
    scientificName: "Falco femoralis",
    family: "Falconidae",
    inatTaxonId: 4645,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/448910145/medium.jpg",
    photoCredit:
      "(c) eduardovieira17, some rights reserved (CC BY-NC), uploaded by eduardovieira17",
    coa: { frequency: "Rara", season: "Todo o ano" },
    sounds: [
      {
        // The whole 6s recording: a chattering 'kek-kek-kek' call series
        source: "xenocanto",
        xc: 174392,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC174392-Falconidae_Falco_femoralis_05_11_2011_H15_32_Rio_Indai%C3%A1_Petrolandia.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Petrolândia, SC",
        type: "call",
        duration: 6.08,
      },
    ],
  },
  {
    name: "Flamingo-chileno",
    scientificName: "Phoenicopterus chilensis",
    family: "Phoenicopteridae",
    inatTaxonId: 4258,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/134157343/medium.jpg",
    photoCredit:
      "(c) Sebastián Lescano, some rights reserved (CC BY-NC), uploaded by Sebastián Lescano",
    coa: { frequency: "Acidental", season: "Indeterminada" },
    conservation: { status: "NT", list: "IUCN" },
    sounds: [
      {
        // The whole 24s recording: a flock honking in alarm
        source: "xenocanto",
        xc: 46345,
        audio:
          "https://xeno-canto.org/sounds/uploaded/BYLLSJRVDZ/Phoenicopterus%20chilensis_Chilean%20Flamingo_Albufera%20Mar%20Chiquita_Mar%20Chiquita_Buenos%20Aires_Argentina_17JUL2005_Bernabe%20Lopez-Lanus.mp3",
        recordist: "Bernabe Lopez-Lanus",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Mar Chiquita, Argentina",
        type: "call",
        duration: 24.13,
      },
    ],
  },
  {
    name: "Fragata",
    scientificName: "Fregata magnificens",
    family: "Fregatidae",
    inatTaxonId: 4631,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/176818863/medium.jpg",
    photoCredit:
      "(c) Kenneth Lorenzen, some rights reserved (CC BY-NC), uploaded by Kenneth Lorenzen",
    sounds: [],
  },
  {
    name: "Trinta-réis-grande",
    scientificName: "Phaetusa simplex",
    family: "Laridae",
    inatTaxonId: 4569,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/54870147/medium.jpeg",
    photoCredit: "(c) Eric Carpenter, some rights reserved (CC BY-NC), uploaded by Eric Carpenter",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Harsh honking calls of a group, about 9s of the 10s recording
        source: "xenocanto",
        xc: 714305,
        audio:
          "https://xeno-canto.org/sounds/uploaded/VKQHDAFQDZ/XC714305-At%C3%AD%20y%20Fdo%20ba%C3%B1ado.mp3",
        recordist: "Pedro Rinaldi",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Rocha, Uruguai",
        type: "call",
        start: 0.5,
        end: 9.85,
      },
    ],
  },
  {
    name: "Gaivota-maria-velha",
    scientificName: "Chroicocephalus maculipennis",
    family: "Laridae",
    inatTaxonId: 144504,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/2667918/medium.jpg",
    photoCredit: "(c) Cláudio Dias Timm, some rights reserved (CC BY-NC-SA)",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Harsh 'kraar' calls from a few gulls, about 10s of the 35s recording
        source: "xenocanto",
        xc: 686948,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC686948-11-11-2021%209e15%20Gaivota%20maria%20velha%20RIO%20GRANDE.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Rio Grande, RS",
        type: "call",
        start: 6.45,
        end: 16.1,
      },
    ],
  },
  {
    name: "Gaivota-de-cabeça-cinza",
    scientificName: "Chroicocephalus cirrocephalus",
    family: "Laridae",
    inatTaxonId: 144508,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/4183449/medium.jpg",
    photoCredit: "(c) John Beetham, some rights reserved (CC BY-NC-SA)",
    coa: { frequency: "Incomum", season: "Indeterminada" },
    sounds: [
      {
        // Three harsh 'kraa' calls over surf, about 10s of the 31s recording
        source: "xenocanto",
        xc: 686972,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC686972-12-11-2021%207e58%20Gaivota%20de%20cabeca%20cinza%20BOA%20RIO%20GRANDE.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Rio Grande, RS",
        type: "call",
        start: 5.85,
        end: 16.25,
      },
    ],
  },
  {
    name: "Gaivotão",
    scientificName: "Larus dominicanus",
    family: "Laridae",
    inatTaxonId: 4388,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/227539170/medium.jpg",
    photoCredit: "(c) Finn Davey, some rights reserved (CC BY-NC), uploaded by Finn Davey",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // About a dozen loud 'kyow' calls, about 13.5s of the 34s recording
        source: "xenocanto",
        xc: 510837,
        audio:
          "https://xeno-canto.org/sounds/uploaded/TGBFXDVERJ/XC510837-Larus%20dominicanus_Tavares_1146.mp3",
        recordist: "Gabriel Leite",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Tavares, RS",
        type: "call",
        start: 0.85,
        end: 14.4,
      },
    ],
  },
  {
    name: "Talha-mar",
    scientificName: "Rynchops niger",
    family: "Laridae",
    inatTaxonId: 4496,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/227666105/medium.jpg",
    photoCredit: "(c) Scott, some rights reserved (CC BY-NC), uploaded by Scott",
    coa: { frequency: "Incomum", season: "Primavera/verão" },
    sounds: [
      {
        // A colony's yapping barks, about 11s of the 45s recording
        source: "xenocanto",
        xc: 540248,
        audio:
          "https://xeno-canto.org/sounds/uploaded/UZCHJCUDEF/XC540248-Rynchops%20niger%20Varillal%202019.mp3",
        recordist: "Guillermo Treboux",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Paysandú, Uruguai",
        type: "call",
        start: 15.15,
        end: 25.95,
      },
    ],
  },
  {
    name: "Saracura-do-mato",
    scientificName: "Aramides saracura",
    family: "Rallidae",
    inatTaxonId: 458,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/8460677/medium.jpeg",
    photoCredit: "(c) Nelson Wisnik, some rights reserved (CC BY-NC), uploaded by Nelson Wisnik",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // The pair's rhythmic duet chorus, about 13s of the 31s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1009811.m4a",
        recordist: "inesavasconcelos",
        license: "cc-by-nc",
        observation: 212542897,
        location: "Porto Alegre, RS",
        type: "song",
        start: 14.5,
        end: 27.75,
      },
    ],
  },
  {
    name: "Galinha-d'água",
    scientificName: "Gallinula galeata",
    family: "Rallidae",
    inatTaxonId: 144479,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/30905992/medium.jpg",
    photoCredit: "(c) uzun, some rights reserved (CC BY-NC), uploaded by uzun",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 17s recording: two cackling 'kek-kek-kek' series
        source: "xenocanto",
        xc: 22561,
        audio: "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/Gallinula%20chloropus.01.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Arroio Grande, RS",
        type: "song",
        duration: 17,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Saracura-sanã",
    scientificName: "Pardirallus nigricans",
    family: "Rallidae",
    inatTaxonId: 297,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/532685404/medium.jpg",
    photoCredit:
      "(c) eduardovieira17, some rights reserved (CC BY-NC), uploaded by eduardovieira17",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Several loud song phrases from a pair, about 9s of the 1m02s recording
        source: "xenocanto",
        xc: 186816,
        audio:
          "https://xeno-canto.org/sounds/uploaded/FYHMASBKBC/XC186816-Pardirallus%20nigricans%20%28saracura%20san%C3%A3_gravador%29.mp3",
        recordist: "Cleberton D. Bianchini",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Lajeado, RS",
        type: "song",
        start: 15.25,
        end: 24.15,
      },
    ],
  },
  {
    name: "Sanã-parda",
    scientificName: "Laterallus melanophaius",
    family: "Rallidae",
    inatTaxonId: 329,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/922856/medium.jpg",
    photoCredit: "(c) Cláudio Dias Timm, some rights reserved (CC BY-NC-SA)",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Two long descending trills, about 12s of the 49s recording
        source: "xenocanto",
        xc: 181513,
        audio:
          "https://xeno-canto.org/sounds/uploaded/FYHMASBKBC/XC181513-Laterallus%20melanophaius%20%28san%C3%A3%20parda%29.mp3",
        recordist: "Cleberton D. Bianchini",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Cruzeiro do Sul, RS",
        type: "song",
        start: 23.45,
        end: 35.3,
      },
    ],
  },
  {
    name: "Saracura-três-potes",
    scientificName: "Aramides cajaneus",
    family: "Rallidae",
    inatTaxonId: 513889,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/455464195/medium.jpg",
    photoCredit:
      "(c) eduardovieira17, some rights reserved (CC BY-NC), uploaded by eduardovieira17",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // The pair's 'three-pots' duet, about 9s of the 50s recording
        source: "xenocanto",
        xc: 146828,
        audio:
          "https://xeno-canto.org/sounds/uploaded/XJSWEWQCEC/XC146828-aramides_cajanea_figueira_20_sep_11_17h_1.mp3",
        recordist: "Rafael Antunes Dias",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Tavares, RS",
        type: "song",
        start: 40.9,
        end: 49.68,
      },
    ],
  },
  {
    name: "Saracura-do-banhado",
    scientificName: "Pardirallus sanguinolentus",
    family: "Rallidae",
    inatTaxonId: 290,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/353619975/medium.jpeg",
    photoCredit: "(c) Ben Lyle Bedard, some rights reserved (CC BY), uploaded by Ben Lyle Bedard",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 22s recording: two bouts of squealing song
        source: "xenocanto",
        xc: 823950,
        audio:
          "https://xeno-canto.org/sounds/uploaded/BZVYBRUAAE/XC823950-230729_07_Plumbeous-Rail_Fazenda-S%C3%A3o-Pedro,-RS,-Brazil_28-July-2023.mp3",
        recordist: "Guy Kirwan",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Barra do Quaraí, RS",
        type: "song",
        duration: 22.15,
      },
    ],
  },
  {
    name: "Saracuruçu",
    scientificName: "Aramides ypecaha",
    family: "Rallidae",
    inatTaxonId: 460,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/35204644/medium.jpeg",
    photoCredit: "(c) Gonzalo Roget, some rights reserved (CC BY), uploaded by Gonzalo Roget",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // A loud chorus, about 8s of the 21s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/396178.mp3",
        recordist: "Luciano Bernardes",
        license: "cc-by-nc",
        observation: 111787249,
        location: "Rio Grande, RS",
        type: "song",
        start: 0.45,
        end: 8.75,
      },
    ],
  },
  {
    name: "Saracura-carijó",
    scientificName: "Pardirallus maculatus",
    family: "Rallidae",
    inatTaxonId: 300,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/409308281/medium.jpeg",
    photoCredit: "(c) Yve Morrell, some rights reserved (CC BY-NC), uploaded by Yve Morrell",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // The whole 8s recording: six rhythmic grunts
        source: "xenocanto",
        xc: 686982,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC686982-13-11-2021%206e41%20Saracura%20carijo%20PELOTAS.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Rio Grande, RS",
        type: "song",
        duration: 7.71,
      },
    ],
  },
  {
    name: "Galinha-d'água-carijó",
    scientificName: "Porphyriops melanops",
    family: "Rallidae",
    inatTaxonId: 507881,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/7582/medium.jpg",
    photoCredit: "(c) ClÃ¡udio Dias Timm, some rights reserved (CC BY-NC-SA)",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Three 'kek-kek-kek' call series, about 9s of the 47s recording
        source: "xenocanto",
        xc: 686960,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC686960-11-11-2021%2016e19%20Galinha%20dagua%20carijo%20RIO%20GRANDE.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Rio Grande, RS",
        type: "call",
        start: 0.6,
        end: 9.3,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Carqueja-de-bico-amarelo",
    scientificName: "Fulica leucoptera",
    family: "Rallidae",
    inatTaxonId: 486,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/2229680/medium.jpg",
    photoCredit:
      "(c) Jorge Schlemmer, some rights reserved (CC BY-NC), uploaded by Jorge Schlemmer",
    sounds: [
      {
        // A series of clucking calls, about 8s of the 37s recording
        source: "xenocanto",
        xc: 827894,
        audio: "https://xeno-canto.org/sounds/uploaded/THHNKSHUMO/XC827894-122-FoulquesSTE-065.mp3",
        recordist: "Bernard BOUSQUET",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "José de la Quintana, Argentina",
        type: "call",
        start: 0.7,
        end: 8.3,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Frango-d'água-azul",
    scientificName: "Porphyrio martinica",
    family: "Rallidae",
    inatTaxonId: 519,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/246710060/medium.jpg",
    photoCredit: "(c) Bert Filemyr, some rights reserved (CC BY-NC), uploaded by Bert Filemyr",
    coa: { frequency: "Rara", season: "Primavera/verão" },
    sounds: [
      {
        // The whole 7s recording: a cackling alarm call series
        source: "xenocanto",
        xc: 147540,
        audio:
          "https://xeno-canto.org/sounds/uploaded/WZSVLIHYQF/XC147540-Porphyrio_martinica_Piracicaba.mp3",
        recordist: "Robson Silva e Silva",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Piracicaba, SP",
        type: "call",
        duration: 7.44,
      },
    ],
  },
  {
    name: "Garça-branca-grande",
    scientificName: "Ardea alba",
    family: "Ardeidae",
    inatTaxonId: 144455,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/56653891/medium.jpg",
    photoCredit: "(c) daverowe, some rights reserved (CC BY-NC)",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 12s recording: a series of harsh alarm croaks
        source: "xenocanto",
        xc: 323526,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC323526-Ardeidae_Ardea_alba_20_04_2016_H18_20_Doutor_Pedrinho.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Doutor Pedrinho, SC",
        type: "call",
        duration: 12.41,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Socó-dorminhoco",
    scientificName: "Nycticorax nycticorax",
    family: "Ardeidae",
    inatTaxonId: 4981,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/49357930/medium.jpg",
    photoCredit: "no rights reserved, uploaded by Kyle Nessen",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 4s recording: two 'quok' barks
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/309026.wav",
        recordist: "laura-_-",
        license: "cc-by-nc",
        observation: 95996046,
        location: "Hudson, Argentina",
        type: "call",
        duration: 4.46,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Garça-branca-pequena",
    scientificName: "Egretta thula",
    family: "Ardeidae",
    inatTaxonId: 4940,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/2415351/medium.jpg",
    photoCredit: "(c) Greg Lasley, some rights reserved (CC BY-NC), uploaded by Greg Lasley",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 21s recording: three croaks, a long pause, then two more
        source: "xenocanto",
        xc: 14745,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/Garca-branca-pequena%20-%20Egretta%20thula.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Rio Grande, RS",
        type: "call",
        duration: 20.59,
      },
    ],
  },
  {
    name: "Maria-faceira",
    scientificName: "Syrigma sibilatrix",
    family: "Ardeidae",
    inatTaxonId: 5056,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/178484205/medium.jpg",
    photoCredit:
      "(c) Oswaldo Hernández, some rights reserved (CC BY-NC), uploaded by Oswaldo Hernández",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 5s recording: five flat piping whistles
        source: "xenocanto",
        xc: 43848,
        audio:
          "https://xeno-canto.org/sounds/uploaded/PHPDEYUDTQ/Syrigma_sibilatrix_sibilatrix-CDTimm.mp3",
        recordist: "Cláudio Dias Timm",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Rio Grande, RS",
        type: "call",
        duration: 4.6,
      },
    ],
  },
  {
    name: "Socozinho",
    scientificName: "Butorides striata",
    family: "Ardeidae",
    inatTaxonId: 62528,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/360776243/medium.jpeg",
    photoCredit: "(c) Bill Levine, some rights reserved (CC BY), uploaded by Bill Levine",
    coa: { frequency: "Comum", season: "Primavera/verão" },
    sounds: [
      {
        // The whole 12s recording: six sharp 'kek' calls
        source: "xenocanto",
        xc: 17943,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/Garcinha-azul%20-%20Butorides%20stratus.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Pelotas, RS",
        type: "call",
        duration: 12.15,
      },
    ],
  },
  {
    name: "Garça-moura",
    scientificName: "Ardea cocoi",
    family: "Ardeidae",
    inatTaxonId: 4952,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/150223557/medium.jpg",
    photoCredit: "(c) Paul Donahue, some rights reserved (CC BY-NC), uploaded by Paul Donahue",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 8s recording: four harsh croaks
        source: "xenocanto",
        xc: 22097,
        audio: "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/130202%20Ardea%20cocoi2.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Pelotas, RS",
        type: "call",
        duration: 8.25,
      },
    ],
  },
  {
    name: "Garça-vaqueira",
    scientificName: "Ardea ibis",
    family: "Ardeidae",
    inatTaxonId: 411086,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/278764160/medium.jpg",
    photoCredit: "(c) Алексей Сизов, some rights reserved (CC BY-NC), uploaded by Алексей Сизов",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 12s recording: chattering calls at a colony
        source: "xenocanto",
        xc: 174527,
        audio:
          "https://xeno-canto.org/sounds/uploaded/RIVNLYTULO/XC174527-GAR%C3%87A%20VAQUEIRA%20-%20SALVADOR%20DO%20SUL%20-%2028-03-13.mp3",
        recordist: "João Antônio de B. Vitto",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Salvador do Sul, RS",
        type: "call",
        duration: 12.38,
      },
    ],
  },
  {
    name: "Garça-azul",
    scientificName: "Egretta caerulea",
    family: "Ardeidae",
    inatTaxonId: 4937,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/106796895/medium.jpg",
    photoCredit: "(c) MARMAR, some rights reserved (CC BY-NC), uploaded by MARMAR",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // A run of harsh, nasal croaks, about 10s of the 17s recording
        source: "xenocanto",
        xc: 707611,
        audio:
          "https://xeno-canto.org/sounds/uploaded/CHDHFSVVIN/XC707611-Egretta%20caerulea%28alarm%20song%29_Agril_LinharesES_090421_FIG.mp3",
        recordist: "Fernando Igor de Godoy",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Aracruz, ES",
        type: "call",
        start: 0.6,
        end: 10.85,
      },
    ],
  },
  {
    name: "Socó-boi",
    scientificName: "Tigrisoma lineatum",
    family: "Ardeidae",
    inatTaxonId: 5048,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/21359/medium.jpg",
    photoCredit: "(c) Cláudio Dias Timm, some rights reserved (CC BY-NC-SA)",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Flight calls, the first 3.5s of the 7s recording
        source: "xenocanto",
        xc: 176913,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC176913-Cracidae_Penelope_superciliaris_23_03_2012_H06_41_Macaco_Vidal_Ramos.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Vidal Ramos, SC",
        type: "call",
        start: 0,
        end: 3.4,
        fmax: 5000,
      },
    ],
  },
  {
    name: "Socoí-amarelo",
    scientificName: "Botaurus involucris",
    family: "Ardeidae",
    inatTaxonId: 1583067,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/170656458/medium.jpeg",
    photoCredit:
      "(c) Bryan Caro San Martin, some rights reserved (CC BY-NC), uploaded by Bryan Caro San Martin",
    coa: { frequency: "Acidental", season: "Indeterminada" },
    sounds: [
      {
        // The whole 9s recording: a series of six low, hoarse 'gwok' notes
        source: "xenocanto",
        xc: 45682,
        audio:
          "https://xeno-canto.org/sounds/uploaded/BYLLSJRVDZ/Ixobrychus%20involucris_Stripe-backed%20Bittern_Estancia%20La%20Verdosa_San%20Enrique_Tapalque_Buenos%20Aires_Argentina_Bernabe%20Lopez-Lanus.mp3",
        recordist: "Bernabe Lopez-Lanus",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "25 de Mayo, Argentina",
        type: "call",
        duration: 9.55,
        fmax: 3000,
      },
    ],
  },
  {
    name: "Fim-fim",
    scientificName: "Euphonia chlorotica",
    family: "Fringillidae",
    inatTaxonId: 9292,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/176773163/medium.jpg",
    photoCredit: "(c) Egon Fink, some rights reserved (CC BY)",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // Four groups of clear 'dee-dee-dee' calls, about 11s of the 36s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/829635.mp3",
        recordist: "Alan Hentz",
        license: "cc-by-nc",
        observation: 187315245,
        location: "São Domingos, SC",
        type: "call",
        start: 2,
        end: 13.15,
      },
    ],
  },
  {
    name: "Gaturamo-rei",
    scientificName: "Chlorophonia cyanocephala",
    family: "Fringillidae",
    inatTaxonId: 1289368,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/489966317/medium.jpg",
    photoCredit: "(c) Augusto Matheus dos Santos, some rights reserved (CC BY-NC)",
    coa: { frequency: "Comum", season: "Outono/inverno" },
    sounds: [
      {
        // Eight plaintive two-toned 'pee-u' calls, about 14s of the 38s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/989042.m4a",
        recordist: "inesavasconcelos",
        license: "cc-by-nc",
        observation: 210047474,
        location: "Porto Alegre, RS",
        type: "call",
        start: 4.4,
        end: 18.4,
        fmin: 1500,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Ferro-velho",
    scientificName: "Euphonia pectoralis",
    family: "Fringillidae",
    inatTaxonId: 9296,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/76825/medium.jpg",
    photoCredit: "(c) Dario Sanches, some rights reserved (CC BY-SA)",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Five buzzy 'dzee-dzee' call bursts, about 8.5s of the 23s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1613680.mp3",
        recordist: "amandapmarcon",
        license: "cc-by-nc",
        observation: 308531714,
        location: "Porto Alegre, RS",
        type: "call",
        start: 10.9,
        end: 19.4,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Gaturamo-bandeira",
    scientificName: "Chlorophonia cyanea",
    family: "Fringillidae",
    inatTaxonId: 10461,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/95545/medium.jpg",
    photoCredit: "(c) Dave Curtis, some rights reserved (CC BY-NC-ND)",
    sounds: [
      {
        // Plaintive 'peeu' whistles and nasal calls, about 13s of the 39s recording
        source: "xenocanto",
        xc: 426197,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/XC426197-Chlorophonia%20cyanea-20180714-123548.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Maquiné, RS",
        type: "call",
        start: 1.5,
        end: 14.3,
      },
    ],
  },
  {
    name: "Gavião-carijó",
    scientificName: "Rupornis magnirostris",
    family: "Accipitridae",
    inatTaxonId: 201041,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/395917812/medium.jpeg",
    photoCredit:
      "(c) floris_heemskerk, some rights reserved (CC BY-NC), uploaded by floris_heemskerk",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // A nasal scream, a series of 'kee-kee' calls and another scream, about 10s of the 45s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1392448.wav",
        recordist: "EDISON BORGES",
        license: "cc-by-nc",
        observation: 272606485,
        location: "Alvorada, RS",
        type: "call",
        start: 2.9,
        end: 12.8,
        fmin: 1000,
      },
    ],
  },
  {
    name: "Tauató-miúdo",
    scientificName: "Accipiter striatus",
    family: "Accipitridae",
    inatTaxonId: 5097,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/112860673/medium.jpeg",
    photoCredit: "(c) Troy B, some rights reserved (CC BY), uploaded by Troy B",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Five upslurred 'kweeh' calls, about 4.5s of the 7s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/56590.mp3",
        recordist: "Fernando Sessegolo",
        license: "cc0",
        observation: 38281248,
        location: "Mato Castelhano, RS",
        type: "call",
        start: 0,
        end: 4.6,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Gavião-caramujeiro",
    scientificName: "Rostrhamus sociabilis",
    family: "Accipitridae",
    inatTaxonId: 5349,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/361425135/medium.jpg",
    photoCredit: "(c) Victor, some rights reserved (CC BY-NC-ND)",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // One dry 'ka-ka-ka' rattle, about 2s of the 9s recording
        source: "xenocanto",
        xc: 773735,
        audio: "https://xeno-canto.org/sounds/uploaded/VKQHDAFQDZ/XC773735-Caracolero.mp3",
        recordist: "Pedro Rinaldi",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Maldonado, Uruguai",
        type: "call",
        start: 4.85,
        end: 6.85,
      },
    ],
  },
  {
    name: "Gavião-de-cauda-curta",
    scientificName: "Buteo brachyurus",
    family: "Accipitridae",
    inatTaxonId: 5186,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/102440509/medium.jpeg",
    photoCredit:
      "(c) Patricia Tiller, some rights reserved (CC BY-NC), uploaded by Patricia Tiller",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Two long, thin, descending screams 13s apart, about 15s of the 30s recording
        source: "xenocanto",
        xc: 146837,
        audio: "https://xeno-canto.org/sounds/uploaded/XCAOAKBXWH/XC146837-D0100301%20%281%29.mp3",
        recordist: "Sandro Salomon",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Blumenau, SC",
        type: "call",
        start: 0,
        end: 15.1,
      },
    ],
  },
  {
    name: "Gavião-do-banhado",
    scientificName: "Circus buffoni",
    family: "Accipitridae",
    inatTaxonId: 5177,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/210653314/medium.jpg",
    photoCredit: "(c) Hugo, some rights reserved (CC BY-NC), uploaded by Hugo",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 10s recording: two chattering 'ke-ke-ke' series
        source: "xenocanto",
        xc: 779843,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC779843-Accipitridae_Circus_buffoni_09_01_2023_H07_06_Vacaria_Rio_Grande_do_Sul.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Vacaria, RS",
        type: "call",
        duration: 10.08,
      },
    ],
  },
  {
    name: "Gavião-caboclo",
    scientificName: "Buteogallus meridionalis",
    family: "Accipitridae",
    inatTaxonId: 5235,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/12999578/medium.jpg",
    photoCredit: "(c) Francesco Veronesi, some rights reserved (CC BY-SA)",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // One long, drawn-out scream, about 2s of the 20s recording
        source: "xenocanto",
        xc: 216855,
        audio:
          "https://xeno-canto.org/sounds/uploaded/ODNEDFESFY/XC216855-Heterospizias%20meridionalis%20%28Latham%2C%201790%29.mp3",
        recordist: "Alexandre Bianco",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Candiota, RS",
        type: "call",
        start: 17.9,
        end: 20.05,
      },
    ],
  },
  {
    name: "Sovi",
    scientificName: "Ictinia plumbea",
    family: "Accipitridae",
    inatTaxonId: 5415,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/603366621/medium.jpg",
    photoCredit:
      "(c) Ana Laura Campioto, some rights reserved (CC BY-NC), uploaded by Ana Laura Campioto",
    coa: { frequency: "Rara", season: "Primavera/verão" },
    sounds: [
      {
        // Three thin, descending whistled calls, about 13s of the 34s recording
        source: "xenocanto",
        xc: 174454,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC174454-Accipitridae_Ictinea_plumbea_06_10_2012_H17_28_It%C3%A1.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Itá, SC",
        type: "call",
        start: 20.25,
        end: 33.75,
        fmin: 1500,
      },
    ],
  },
  {
    name: "Gavião-preto",
    scientificName: "Buteogallus urubitinga",
    family: "Accipitridae",
    inatTaxonId: 5238,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/56759119/medium.jpg",
    photoCredit: "(c) Allan Hopkins, some rights reserved (CC BY-NC-ND)",
    coa: { frequency: "Rara", season: "Todo o ano" },
    sounds: [
      {
        // The whole 5s recording: a series of about 11 whistled notes
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/503125.mp3",
        recordist: "marco-ferreira",
        license: "cc-by-nc",
        observation: 126997241,
        location: "Artigas, Uruguai",
        type: "call",
        duration: 5.09,
      },
    ],
  },
  {
    name: "Gavião-asa-de-telha",
    scientificName: "Parabuteo unicinctus",
    family: "Accipitridae",
    inatTaxonId: 5355,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/191470/medium.jpg",
    photoCredit: "(c) Greg Lasley, some rights reserved (CC BY-NC), uploaded by Greg Lasley",
    sounds: [
      {
        // The whole 28s recording: harsh kee-ah calls, then several birds chattering
        source: "xenocanto",
        xc: 9404,
        audio: "https://xeno-canto.org/sounds/uploaded/IGDDGNGPAL/gavimixto.alvaricc.mp3",
        recordist: "Alvaro Riccetto",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Lavalleja, Uruguai",
        type: "call",
        duration: 27.82,
      },
    ],
  },
  {
    name: "Gavião-pernilongo",
    scientificName: "Geranospiza caerulescens",
    family: "Accipitridae",
    inatTaxonId: 5411,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/93130641/medium.jpg",
    photoCredit: "(c) Geir Drange, some rights reserved (CC BY-NC), uploaded by Geir Drange",
    sounds: [
      {
        // The whole 20s recording: four whistled kyeew calls
        source: "xenocanto",
        xc: 463487,
        audio:
          "https://xeno-canto.org/sounds/uploaded/ORPKXJRFDZ/XC463487-gavi%C3%A3o-ernilongo%20%28online-audio-converter.com%29.mp3",
        recordist: "Luiz C. Silva",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Campo Mourão, PR",
        type: "call",
        duration: 20.41,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Gavião-de-rabo-branco",
    scientificName: "Geranoaetus albicaudatus",
    family: "Accipitridae",
    inatTaxonId: 201043,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/28307351/medium.jpg",
    photoCredit: "(c) Greg Lasley, some rights reserved (CC BY-NC), uploaded by Greg Lasley",
    sounds: [
      {
        // A short burst, then the full laughing ke-ke-ke series, about 8s of the 32s recording
        source: "xenocanto",
        xc: 1018671,
        audio:
          "https://xeno-canto.org/sounds/uploaded/WZSVLIHYQF/XC1018671-Buteo_albicaudatus_04092024_RSS.mp3",
        recordist: "Robson Silva e Silva",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Patrocínio, MG",
        type: "call",
        start: 23.75,
        end: 31.65,
      },
    ],
  },
  {
    name: "Gavião-gato",
    scientificName: "Leptodon cayanensis",
    family: "Accipitridae",
    inatTaxonId: 5283,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/93330234/medium.jpeg",
    photoCredit: "(c) andretostes, some rights reserved (CC BY-NC), uploaded by andretostes",
    conservation: { status: "NT", list: "RS" },
    sounds: [
      {
        // A cat-like mew and a short soft kek series, about 7s of the 39s recording
        source: "xenocanto",
        xc: 344859,
        audio:
          "https://xeno-canto.org/sounds/uploaded/ORPKXJRFDZ/XC344859-gavi%C3%A3o%20de%20cabe%C3%A7a%20cinza.mp3",
        recordist: "Luiz C. Silva",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Peabiru, PR",
        type: "call",
        start: 1.3,
        end: 8.2,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Gavião-tesoura",
    scientificName: "Elanoides forficatus",
    family: "Accipitridae",
    inatTaxonId: 5301,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/21518168/medium.jpg",
    photoCredit: "(c) Greg Lasley, some rights reserved (CC BY-NC), uploaded by Greg Lasley",
    coa: { frequency: "Rara", season: "Primavera/verão" },
    sounds: [
      {
        // The whole 18s recording: bursts of shrill klee-klee calls
        source: "xenocanto",
        xc: 85130,
        audio: "https://xeno-canto.org/sounds/uploaded/DGVLLRYDXS/ELAFOR06.mp3",
        recordist: "Jeremy Minns",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Iporanga, SP",
        type: "call",
        duration: 18.3,
      },
    ],
  },
  {
    name: "Sabiá-do-campo",
    scientificName: "Mimus saturninus",
    family: "Mimidae",
    inatTaxonId: 14878,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/197389027/medium.jpg",
    photoCredit:
      "(c) Quentin Vandemoortele, some rights reserved (CC BY-NC), uploaded by Quentin Vandemoortele",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Four song phrases, each a low whistle followed by harsh 'chek' notes, about 14s of the 33s recording
        source: "xenocanto",
        xc: 146977,
        audio:
          "https://xeno-canto.org/sounds/uploaded/XJSWEWQCEC/XC146977-mimus_figueira_20_sep_11_17h.mp3",
        recordist: "Rafael Antunes Dias",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Tavares, RS",
        type: "song",
        start: 4.6,
        end: 18.4,
      },
    ],
  },
  {
    name: "Calhandra-de-três-rabos",
    scientificName: "Mimus triurus",
    family: "Mimidae",
    inatTaxonId: 14885,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/1913375/medium.jpg",
    photoCredit:
      "(c) Jorge Schlemmer, some rights reserved (CC BY-NC), uploaded by Jorge Schlemmer",
    coa: { frequency: "Rara", season: "Outono/inverno" },
    sounds: [
      {
        // Two song phrases of repeated 'check-mark' notes, about 11s of the 44s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/396744.mp3",
        recordist: "Luciano Bernardes",
        license: "cc-by-nc",
        observation: 111845161,
        location: "Tavares, RS",
        type: "song",
        start: 7.6,
        end: 18.8,
        fmin: 1000,
      },
    ],
  },
  {
    name: "Inhambuguaçu",
    scientificName: "Crypturellus obsoletus",
    family: "Tinamidae",
    inatTaxonId: 20599,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/86359703/medium.jpg",
    photoCredit:
      "(c) Juan Diego Döke, some rights reserved (CC BY-NC), uploaded by Juan Diego Döke",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // The whole song, whistles speeding up into a continuous run, about 10s of the 14s recording
        source: "xenocanto",
        xc: 217866,
        audio: "https://xeno-canto.org/sounds/uploaded/DGVLLRYDXS/XC217866-CRYOBS15.mp3",
        recordist: "Jeremy Minns",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        start: 1.25,
        end: 11.1,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Codorna-amarela",
    scientificName: "Nothura maculosa",
    family: "Tinamidae",
    inatTaxonId: 20656,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/103997991/medium.jpeg",
    photoCredit:
      "(c) Diego Caballero, some rights reserved (CC BY-NC), uploaded by Diego Caballero",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // The end of a long series of high pip notes, about 14s of the 36s recording
        source: "xenocanto",
        xc: 51597,
        audio:
          "https://xeno-canto.org/sounds/uploaded/BYLLSJRVDZ/NOTHURA%20Spotted_10_Sao%20Francisco%20de%20Paula_Rio%20Grande%20do%20Sul_BR_4JUL07_Bernabe%20Lopez-Lanus.mp3",
        recordist: "Bernabe Lopez-Lanus",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        start: 15.7,
        end: 29.45,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Chupim",
    scientificName: "Molothrus bonariensis",
    family: "Icteridae",
    inatTaxonId: 10371,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/158695164/medium.jpg",
    photoCredit:
      "(c) eduardovieira17, some rights reserved (CC BY-NC), uploaded by eduardovieira17",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 5s recording: one song of gurgles and squeaky whistles
        source: "xenocanto",
        xc: 91488,
        audio:
          "https://xeno-canto.org/sounds/uploaded/XJSWEWQCEC/molothrus_bonariensis_07_dec_11_16h_6.mp3",
        recordist: "Rafael Antunes Dias",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Rio Grande, RS",
        type: "song",
        duration: 5.03,
      },
    ],
  },
  {
    name: "Asa-de-telha",
    scientificName: "Agelaioides badius",
    family: "Icteridae",
    inatTaxonId: 516244,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/9004519/medium.jpeg",
    photoCredit: "(c) markus lilje, some rights reserved (CC BY-NC-ND), uploaded by markus lilje",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Four descending two-toned whistles with soft clicks between, about 9s of the 1m48s recording
        source: "xenocanto",
        xc: 890940,
        audio:
          "https://xeno-canto.org/sounds/uploaded/YOXWKYFZAP/XC890940-Agelaioides-badius-DCB-164-1.mp3",
        recordist: "Dante Buzzetti",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Santo Antônio da Patrulha, RS",
        type: "call",
        start: 10.1,
        end: 18.8,
        fmin: 1500,
      },
    ],
  },
  {
    name: "Encontro",
    scientificName: "Icterus pyrrhopterus",
    family: "Icteridae",
    inatTaxonId: 72954,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/114288120/medium.jpeg",
    photoCredit: "(c) Tim Hirsch, some rights reserved (CC BY), uploaded by Tim Hirsch",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Two song phrases of clear whistles and buzzy notes, about 16s of the 32s recording
        source: "xenocanto",
        xc: 200402,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/XC200402-Icterus_pyrrhopterus-58857%2010-02-2009.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Arroio Grande, RS",
        type: "song",
        start: 14.6,
        end: 30.8,
      },
    ],
  },
  {
    name: "Garibaldi",
    scientificName: "Chrysomus ruficapillus",
    family: "Icteridae",
    inatTaxonId: 69696,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/28034/medium.jpg",
    photoCredit: "(c) Dario Sanches, some rights reserved (CC BY-SA)",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Colony chorus with a quick descending series of song notes, about 5s of the 26s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1624607.mp3",
        recordist: "amandapmarcon",
        license: "cc-by-nc",
        observation: 311303110,
        location: "Viamão, RS",
        type: "song",
        start: 20.8,
        end: 25.95,
        fmin: 1000,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Cardeal-do-banhado",
    scientificName: "Amblyramphus holosericeus",
    family: "Icteridae",
    inatTaxonId: 10694,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/59361562/medium.jpeg",
    photoCredit:
      "(c) Adrian Braidotti, some rights reserved (CC BY-NC), uploaded by Adrian Braidotti",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 5s recording: one song, a rolling trill and a whistled 'cleer'
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/396141.mp3",
        recordist: "Luciano Bernardes",
        license: "cc-by-nc",
        observation: 111784782,
        location: "Mostardas, RS",
        type: "song",
        duration: 5.41,
      },
    ],
  },
  {
    name: "Chupim-azeviche",
    scientificName: "Molothrus rufoaxillaris",
    family: "Icteridae",
    inatTaxonId: 10370,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/249037827/medium.jpg",
    photoCredit:
      "(c) Ariel Cabrera Foix, some rights reserved (CC BY-NC-SA), uploaded by Ariel Cabrera Foix",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Several songs of soft gurgles and explosive high notes, about 12s of the 2m22s recording
        source: "xenocanto",
        xc: 318796,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/XC318796-Molothrus%20rufoaxillaris%20-%202016-05-27-16h28%20-%20galateia%20estrada%20nova.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Pelotas, RS",
        type: "song",
        start: 27.2,
        end: 38.8,
      },
    ],
  },
  {
    name: "Polícia-inglesa-do-sul",
    scientificName: "Leistes superciliaris",
    family: "Icteridae",
    inatTaxonId: 793309,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/362293734/medium.jpg",
    photoCredit:
      "(c) eduardovieira17, some rights reserved (CC BY-NC), uploaded by eduardovieira17",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Two songs, short notes and then the long buzz, with call notes between; about 13s of the 24s recording
        source: "xenocanto",
        xc: 176472,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC176472-Icteridae_Sturnella_superciliaris_28_07_2012_H16_40_Santa_Maria_Benedito_Novo.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Benedito Novo, SC",
        type: "song",
        start: 0.25,
        end: 13.4,
      },
    ],
  },
  {
    name: "Chupim-do-brejo",
    scientificName: "Pseudoleistes guirahuro",
    family: "Icteridae",
    inatTaxonId: 10709,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/442402880/medium.jpg",
    photoCredit:
      "(c) Luciano Bernardes, some rights reserved (CC BY-NC), uploaded by Luciano Bernardes",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Three loud slurred whistles among gurgling 'chek' notes, about 10s of the 34s recording
        source: "xenocanto",
        xc: 51528,
        audio:
          "https://xeno-canto.org/sounds/uploaded/BYLLSJRVDZ/MARSHBIRD%20Yellow-rumped_25_SF%20de%20Paula_Rio%20Grande%20do%20Sul_BR_5JUL07_Bernabe%20Lopez-Lanus.mp3",
        recordist: "Bernabe Lopez-Lanus",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        start: 20.1,
        end: 30.3,
      },
    ],
  },
  {
    name: "Guaxe",
    scientificName: "Cacicus haemorrhous",
    family: "Icteridae",
    inatTaxonId: 10357,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/648143/medium.jpg",
    photoCredit: "(c) Cláudio Dias Timm, some rights reserved (CC BY-NC-SA)",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // Colony song: low gurgles and 'chack' notes with four rising whistles ending in a crash, nearly the whole 15s recording
        source: "xenocanto",
        xc: 176929,
        audio:
          "https://xeno-canto.org/sounds/uploaded/FYHMASBKBC/XC176929-Cacicus%20haemorrhous.MP3",
        recordist: "Cleberton D. Bianchini",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Lajeado, RS",
        type: "song",
        start: 0.15,
        end: 14.95,
        fmin: 800,
      },
    ],
  },
  {
    name: "Tecelão",
    scientificName: "Cacicus chrysopterus",
    family: "Icteridae",
    inatTaxonId: 10361,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/210327137/medium.jpg",
    photoCredit:
      "(c) Luciano Bernardes, some rights reserved (CC BY-NC), uploaded by Luciano Bernardes",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 18s recording: six song phrases of clucks and liquid whistles
        source: "xenocanto",
        xc: 84448,
        audio: "https://xeno-canto.org/sounds/uploaded/DGVLLRYDXS/CACCHR22.mp3",
        recordist: "Jeremy Minns",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        duration: 18.3,
      },
    ],
  },
  {
    name: "Jaçanã",
    scientificName: "Jacana jacana",
    family: "Jacanidae",
    inatTaxonId: 4580,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/9867610/medium.jpg",
    photoCredit: "(c) Greg Lasley, some rights reserved (CC BY-NC), uploaded by Greg Lasley",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 11s recording: a series of harsh 'kek' calls, then softer ones
        source: "xenocanto",
        xc: 686748,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC686748-07-11-2021%2010e12%20Jacana%20BAGE.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Bagé, RS",
        type: "call",
        duration: 11.02,
        fmax: 8000,
      },
    ],
  },
  {
    name: "João-de-Barro",
    scientificName: "Furnarius rufus",
    family: "Furnariidae",
    inatTaxonId: 11275,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/182076045/medium.jpg",
    photoCredit: "(c) Ron Knight, some rights reserved (CC BY)",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 6s recording: a pair's loud duet
        source: "xenocanto",
        xc: 686953,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC686953-11-11-2021%2013e8%20Joao%20de%20barro%20RIO%20GRANDE.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Rio Grande, RS",
        type: "song",
        duration: 6.09,
      },
    ],
  },
  {
    name: "Arredio-oliváceo",
    scientificName: "Cranioleuca obsoleta",
    family: "Furnariidae",
    inatTaxonId: 11254,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/221333003/medium.jpg",
    photoCredit: "no rights reserved, uploaded by Nina Wenóli",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // A steady run of short buzzy calls, about 12s of the 24s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1001351.m4a",
        recordist: "inesavasconcelos",
        license: "cc-by-nc",
        observation: 211444051,
        location: "Porto Alegre, RS",
        type: "call",
        start: 0,
        end: 11.7,
        fmin: 2000,
      },
    ],
  },
  {
    name: "João-teneném",
    scientificName: "Synallaxis spixi",
    family: "Furnariidae",
    inatTaxonId: 10915,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/274670794/medium.jpeg",
    photoCredit:
      "(c) Enéas V. Gouvêa Junior, some rights reserved (CC BY-SA), uploaded by Enéas V. Gouvêa Junior",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Five song phrases, about 8.5s of the 10s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1597511.wav",
        recordist: "igor-santos",
        license: "cc-by-nc",
        observation: 304547679,
        location: "São Jerônimo, RS",
        type: "song",
        start: 0.8,
        end: 9.47,
        fmin: 1500,
      },
    ],
  },
  {
    name: "Curutié",
    scientificName: "Certhiaxis cinnamomeus",
    family: "Furnariidae",
    inatTaxonId: 11364,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/565788/medium.jpg",
    photoCredit: "(c) Cláudio Dias Timm, some rights reserved (CC BY-NC-SA)",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 7s recording: one long rattling song
        source: "xenocanto",
        xc: 146678,
        audio:
          "https://xeno-canto.org/sounds/uploaded/XJSWEWQCEC/XC146678-certhiaxis_balneario_mostardense.mp3",
        recordist: "Rafael Antunes Dias",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Mostardas, RS",
        type: "song",
        duration: 7.01,
      },
    ],
  },
  {
    name: "Pi-puí",
    scientificName: "Synallaxis cinerascens",
    family: "Furnariidae",
    inatTaxonId: 10974,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/1718802/medium.jpg",
    photoCredit: "(c) Cláudio Dias Timm, some rights reserved (CC BY-NC-SA)",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Four songs (a rising note, then a short note), about 9.5s of the 1m35s recording
        source: "xenocanto",
        xc: 70816,
        audio:
          "https://xeno-canto.org/sounds/uploaded/WOEAFQRMUD/Synallaxis%20cinerescens0607-1.mp3",
        recordist: "Daniel Lane",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        start: 0.3,
        end: 9.9,
      },
    ],
  },
  {
    name: "Trepador-quiete",
    scientificName: "Syndactyla rufosuperciliata",
    family: "Furnariidae",
    inatTaxonId: 11472,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/225009370/medium.jpeg",
    photoCredit: "(c) silviolamothe, some rights reserved (CC BY-NC), uploaded by silviolamothe",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 7s recording: one full song between harsh calls
        source: "xenocanto",
        xc: 277310,
        audio: "https://xeno-canto.org/sounds/uploaded/DGVLLRYDXS/XC277310-PHIRUF24.mp3",
        recordist: "Jeremy Minns",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        duration: 7.22,
      },
    ],
  },
  {
    name: "Cochicho",
    scientificName: "Anumbius annumbi",
    family: "Furnariidae",
    inatTaxonId: 11850,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/31184030/medium.jpg",
    photoCredit:
      "(c) marcelo_allende, some rights reserved (CC BY-NC), uploaded by marcelo_allende",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 10s recording: accelerating song phrases one after another
        source: "xenocanto",
        xc: 50983,
        audio:
          "https://xeno-canto.org/sounds/uploaded/BYLLSJRVDZ/FIREWOOD-GATHERER_05_Sao%20Francisco%20de%20Paula_Rio%20Grande%20do%20Sul_BR_5JUL07_B%20Lopez-Lanus.mp3",
        recordist: "Bernabe Lopez-Lanus",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        duration: 9.93,
        fmin: 1000,
      },
    ],
  },
  {
    name: "Bichoita",
    scientificName: "Schoeniophylax phryganophilus",
    family: "Furnariidae",
    inatTaxonId: 11821,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/107004052/medium.jpg",
    photoCredit: "(c) Martín Ferrari, some rights reserved (CC BY-NC), uploaded by Martín Ferrari",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Three chattering songs, about 9s of the 12s recording
        source: "xenocanto",
        xc: 181730,
        audio:
          "https://xeno-canto.org/sounds/uploaded/TLLUGZINYM/XC181730-Schoeniophylax%20phryganophilus%20%28Candiota-RS%2C%2026.05.14%29.mp3",
        recordist: "Roberto Buss Stringari",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Pedras Altas, RS",
        type: "song",
        start: 2,
        end: 11.1,
        fmax: 8000,
      },
    ],
  },
  {
    name: "João-porca",
    scientificName: "Lochmias nematura",
    family: "Furnariidae",
    inatTaxonId: 11114,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/35800662/medium.jpg",
    photoCredit:
      "(c) Guillermo Menéndez, some rights reserved (CC BY-NC), uploaded by Guillermo Menéndez",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 39s recording: six rising trills
        source: "xenocanto",
        xc: 225186,
        audio:
          "https://xeno-canto.org/sounds/uploaded/OOECIWCSWV/XC225186-Sharp-tailed%20Streamcreeper%20B%206060.mp3",
        recordist: "Peter Boesman",
        license: "cc-by-nc-nd",
        licenseVersion: "4.0",
        location: "Gramado, RS",
        type: "song",
        duration: 39.05,
        fmin: 2000,
      },
    ],
  },
  {
    name: "Pichororé",
    scientificName: "Synallaxis ruficapilla",
    family: "Furnariidae",
    inatTaxonId: 10943,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/327548198/medium.jpg",
    photoCredit: "(c) Alan Hentz, some rights reserved (CC BY-NC), uploaded by Alan Hentz",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Repeated stuttering song phrases, possibly a pair, about 13s of the 32s recording
        source: "xenocanto",
        xc: 825934,
        audio:
          "https://xeno-canto.org/sounds/uploaded/AYMBPYCGJV/XC825934-ZOOM0048_Rufous-capped-Spinetail_Floresta-Nacional-de-Canela_01-08-2023_09-10AM_HNorambuena.mp3",
        recordist: "Heraldo V. Norambuena",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Canela, RS",
        type: "song",
        start: 3.36,
        end: 16.12,
      },
    ],
  },
  {
    name: "João-botina-do-brejo",
    scientificName: "Phacellodomus ferrugineigula",
    family: "Furnariidae",
    inatTaxonId: 73181,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/110395172/medium.jpg",
    photoCredit:
      "(c) mauriciofreitas, some rights reserved (CC BY-NC), uploaded by mauriciofreitas",
    coa: { frequency: "Rara", season: "Todo o ano" },
    sounds: [
      {
        // Soft lead-in notes building into the loud song, about 13s of the 17s recording
        source: "xenocanto",
        xc: 176859,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC176859-Furnariidae_Phacellodomus%20ferrugineigula_12_07_2012_H14_07_Salvador_do_Sul.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Salvador do Sul, RS",
        type: "song",
        start: 2.3,
        end: 15.5,
      },
    ],
  },
  {
    name: "Bate-bico",
    scientificName: "Phleocryptes melanops",
    family: "Furnariidae",
    inatTaxonId: 11812,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/59558992/medium.jpg",
    photoCredit:
      "(c) Adrian Braidotti, some rights reserved (CC BY-NC), uploaded by Adrian Braidotti",
    sounds: [
      {
        // The whole 15s recording: a long series of dry ticks, a pause, then a harsh note and paired ticks
        source: "xenocanto",
        xc: 510882,
        audio:
          "https://xeno-canto.org/sounds/uploaded/TGBFXDVERJ/XC510882-Phleocryptes%20melanops_Mostardas_1070.mp3",
        recordist: "Gabriel Leite",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Mostardas, RS",
        type: "song",
        duration: 14.89,
      },
    ],
  },
  {
    name: "Narceja",
    scientificName: "Gallinago paraguaiae",
    family: "Scolopacidae",
    inatTaxonId: 3927,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/23045173/medium.jpeg",
    photoCredit: "(c) Leonel Roget, some rights reserved (CC BY), uploaded by Leonel Roget",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 6s recording: a burst of pulsed notes slowing down
        source: "xenocanto",
        xc: 51992,
        audio:
          "https://xeno-canto.org/sounds/uploaded/BYLLSJRVDZ/SNIPE%20South%20American_11_SF%20de%20Paula_Rio%20Grande%20do%20Sul_BR_4JUL07_Bernabe%20Lopez-Lanus.mp3",
        recordist: "Bernabe Lopez-Lanus",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        duration: 5.93,
      },
    ],
  },
  {
    name: "Maçarico-pintado",
    scientificName: "Actitis macularius",
    family: "Scolopacidae",
    inatTaxonId: 72458,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/46532647/medium.jpg",
    photoCredit: "(c) Jason Headley, some rights reserved (CC BY-NC), uploaded by Jason Headley",
    coa: { frequency: "Rara", season: "Primavera/verão" },
    sounds: [
      {
        // A steady series of sharp 'weet' calls, about 13s of the 29s recording
        source: "xenocanto",
        xc: 690395,
        audio:
          "https://xeno-canto.org/sounds/uploaded/CFRYARSVHN/XC690395-recording-20211204-101208%20actitis%20nacularius%20xc.mp3",
        recordist: "Ricardo José Mitidieri",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Rio de Janeiro, RJ",
        type: "call",
        start: 0,
        end: 13.2,
      },
    ],
  },
  {
    name: "Maçarico-de-perna-amarela",
    scientificName: "Tringa flavipes",
    family: "Scolopacidae",
    inatTaxonId: 3893,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/260887463/medium.jpg",
    photoCredit: "(c) Jonathan Irons, some rights reserved (CC BY-NC), uploaded by Jonathan Irons",
    coa: { frequency: "Rara", season: "Primavera/verão" },
    conservation: { status: "VU", list: "IUCN" },
    sounds: [
      {
        // A steady series of tew calls, about 10s of the 25s recording
        source: "xenocanto",
        xc: 510859,
        audio:
          "https://xeno-canto.org/sounds/uploaded/TGBFXDVERJ/XC510859-Tringa%20flavipes_Tavares_1142.mp3",
        recordist: "Gabriel Leite",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Tavares, RS",
        type: "call",
        start: 13.15,
        end: 22.7,
      },
    ],
  },
  {
    name: "Maçarico-solitário",
    scientificName: "Tringa solitaria",
    family: "Scolopacidae",
    inatTaxonId: 3875,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/25135180/medium.jpg",
    photoCredit:
      "(c) Robin Gwen Agarwal, some rights reserved (CC BY-NC), uploaded by Robin Gwen Agarwal",
    coa: { frequency: "Incomum", season: "Primavera/verão" },
    sounds: [
      {
        // The whole 8s recording: four 'peet-weet-weet' flight calls
        source: "xenocanto",
        xc: 323490,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC323490-Scolopacidae_Tringa_solitaria_17_12_2015_H09_26_Doutor_Pedrinho.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Doutor Pedrinho, SC",
        type: "call",
        duration: 8.2,
        fmin: 2000,
      },
    ],
  },
  {
    name: "Mariquita",
    scientificName: "Setophaga pitiayumi",
    family: "Parulidae",
    inatTaxonId: 145234,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/115454163/medium.jpg",
    photoCredit:
      "(c) Oswaldo Hernández, some rights reserved (CC BY-NC), uploaded by Oswaldo Hernández",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 15s recording: two songs
        source: "xenocanto",
        xc: 415778,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC415778-Mariquita2%20%28Setophaga%20pitiayumi-OK-OK%29.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Canela, RS",
        type: "song",
        duration: 14.8,
        fmin: 3000,
        fmax: 10000,
      },
    ],
  },
  {
    name: "Pula-pula-assobiador",
    scientificName: "Myiothlypis leucoblephara",
    family: "Parulidae",
    inatTaxonId: 201224,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/179298338/medium.jpg",
    photoCredit:
      "(c) Luciano Bernardes, some rights reserved (CC BY-NC), uploaded by Luciano Bernardes",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // A few calls, then the long descending whistled song, about 9s of the 1m02s recording
        source: "xenocanto",
        xc: 419255,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC419255-Pula%20pula%20assobiador4%20%28Myiothlypis%20leucoblephara-OK-OK%29.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Canela, RS",
        type: "song",
        start: 8.1,
        end: 17,
        fmin: 2000,
        fmax: 10000,
      },
    ],
  },
  {
    name: "Pula-pula",
    scientificName: "Basileuterus culicivorus",
    family: "Parulidae",
    inatTaxonId: 10023,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/594042080/medium.jpg",
    photoCredit:
      "(c) Paulo Henrique da Silva, some rights reserved (CC BY-NC), uploaded by Paulo Henrique da Silva",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 23s recording: four songs with call notes between
        source: "xenocanto",
        xc: 8202,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/Pula-pula%20-%20Basileuterus%20culicivorus0.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Pelotas, RS",
        type: "song",
        duration: 23.46,
      },
    ],
  },
  {
    name: "Pia-cobra",
    scientificName: "Geothlypis velata",
    family: "Parulidae",
    inatTaxonId: 1437094,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/57668973/medium.jpg",
    photoCredit:
      "(c) Alexander Viduetsky, some rights reserved (CC BY-NC), uploaded by Alexander Viduetsky",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 15s recording: four songs
        source: "xenocanto",
        xc: 176922,
        audio:
          "https://xeno-canto.org/sounds/uploaded/FYHMASBKBC/XC176922-Geothlypis%20aequinoctialis%20%28pi%C3%A1%20cobra%29.mp3",
        recordist: "Cleberton D. Bianchini",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Lajeado, RS",
        type: "song",
        duration: 15.41,
      },
    ],
  },
  {
    name: "Martim-pescador-verde",
    scientificName: "Chloroceryle amazona",
    family: "Alcedinidae",
    inatTaxonId: 2679,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/170123283/medium.jpeg",
    photoCredit:
      "(c) Estación Biológica Las Guacamayas, some rights reserved (CC BY-NC), uploaded by Estación Biológica Las Guacamayas",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 6s recording: one long rattle
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1613523.mp3",
        recordist: "amandapmarcon",
        license: "cc-by-nc",
        observation: 308531326,
        location: "Getúlio Vargas, RS",
        type: "call",
        duration: 5.88,
        fmin: 2000,
        fmax: 12000,
      },
    ],
  },
  {
    name: "Martim-pescador-grande",
    scientificName: "Megaceryle torquata",
    family: "Alcedinidae",
    inatTaxonId: 2552,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/734984735/medium.jpg",
    photoCredit: "(c) Matt Blue, some rights reserved (CC BY-NC), uploaded by Matt Blue",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // A soft rattle, then one long harsh rattle, about 7.5s of the 13s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1613529.mp3",
        recordist: "amandapmarcon",
        license: "cc-by-nc",
        observation: 308531329,
        location: "Getúlio Vargas, RS",
        type: "call",
        start: 4,
        end: 11.4,
      },
    ],
  },
  {
    name: "Martim-pescador-pequeno",
    scientificName: "Chloroceryle americana",
    family: "Alcedinidae",
    inatTaxonId: 2669,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/30793136/medium.jpg",
    photoCredit:
      "(c) José Antonio Linage Espinosa, some rights reserved (CC BY-NC), uploaded by José Antonio Linage Espinosa",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // A long run of dry 'tick' calls, about 14s of the 49s recording
        source: "xenocanto",
        xc: 713412,
        audio:
          "https://xeno-canto.org/sounds/uploaded/QFNPSPRHCC/XC713412-Martim-pescador-pequeno.mp3",
        recordist: "Miguel Angelo Biz",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Pouso Redondo, SC",
        type: "call",
        start: 0.5,
        end: 14.15,
      },
    ],
  },
  {
    name: "Mergulhão-de-orelha-branca",
    scientificName: "Rollandia rolland",
    family: "Podicipedidae",
    inatTaxonId: 4251,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/103739937/medium.jpg",
    photoCredit: "(c) Luciano Massa, some rights reserved (CC BY), uploaded by Luciano Massa",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // The whole 11s recording: four trilled calls
        source: "xenocanto",
        xc: 45665,
        audio:
          "https://xeno-canto.org/sounds/uploaded/BYLLSJRVDZ/Rollandia%20rolland%20chilensis_White-tufted%20Grebe_Villa%20Pehuenia_Neuquen_Argentina_23ENE05_Bernabe%20Lopez-Lanus.mp3",
        recordist: "Bernabe Lopez-Lanus",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Villa Pehuenia, Argentina",
        type: "call",
        duration: 10.91,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Mergulhão-caçador",
    scientificName: "Podilymbus podiceps",
    family: "Podicipedidae",
    inatTaxonId: 4246,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/117828251/medium.jpg",
    photoCredit: "(c) Ad Konings, some rights reserved (CC BY-NC), uploaded by Ad Konings",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Accelerating 'kuk' notes running into the 'cow-cow-cowp' series, about 16s of the 58s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/835915.mp3",
        recordist: "Alan Hentz",
        license: "cc-by-nc",
        observation: 188705565,
        location: "São Lourenço do Oeste, SC",
        type: "song",
        start: 38.6,
        end: 54.7,
        fmax: 4000,
      },
    ],
  },
  {
    name: "Mergulhão-grande",
    scientificName: "Podiceps major",
    family: "Podicipedidae",
    inatTaxonId: 4229,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/4901168/medium.jpg",
    photoCredit: "(c) Daniele Colombo, some rights reserved (CC BY-NC-SA)",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // Nine 'kek' alarm calls, about 13s of the 29s recording
        source: "xenocanto",
        xc: 686950,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC686950-11-11-2021%209e37%20Mergulhao%20grande%20RIO%20GRANDE.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Rio Grande, RS",
        type: "call",
        start: 5.4,
        end: 18.5,
        fmax: 5000,
      },
    ],
  },
  {
    name: "Aracuã-escamoso",
    scientificName: "Ortalis squamata",
    family: "Cracidae",
    inatTaxonId: 339586,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/1718628/medium.jpg",
    photoCredit: "(c) Cláudio Dias Timm, some rights reserved (CC BY-NC-SA)",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Two bouts of the harsh group chorus, about 9s of the 45s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1633644.m4a",
        recordist: "Viviane",
        license: "cc-by-nc",
        observation: 313315752,
        location: "Porto Alegre, RS",
        type: "call",
        start: 23.2,
        end: 32,
      },
    ],
  },
  {
    name: "Papa-piri",
    scientificName: "Tachuris rubrigastra",
    family: "Tachurisidae",
    inatTaxonId: 17174,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/327391616/medium.jpg",
    photoCredit: "(c) By.Ulises, some rights reserved (CC BY-NC), uploaded by By.Ulises",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // The whole 29s recording: a steady series of 'tic' calls
        source: "xenocanto",
        xc: 22303,
        audio: "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/Tachuris%20rubrigastra5.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Pelotas, RS",
        type: "call",
        duration: 29.33,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Caturrita",
    scientificName: "Myiopsitta monachus",
    family: "Psittacidae",
    inatTaxonId: 19349,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/101224790/medium.jpg",
    photoCredit: "(c) Juan Emilio, some rights reserved (CC BY-SA)",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // A series of harsh 'kweek' calls, about 9s of the 11s recording
        source: "xenocanto",
        xc: 510923,
        audio:
          "https://xeno-canto.org/sounds/uploaded/TGBFXDVERJ/XC510923-Myiopsitta%20monachus_espinilho_1281.mp3",
        recordist: "Gabriel Leite",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Barra do Quaraí, RS",
        type: "call",
        start: 1.3,
        end: 10.1,
      },
    ],
  },
  {
    name: "Periquito-de-encontro-amarelo",
    scientificName: "Brotogeris chiriri",
    family: "Psittacidae",
    inatTaxonId: 19215,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/157600886/medium.jpg",
    photoCredit: "(c) Paulo Barradas, some rights reserved (CC BY)",
    coa: { frequency: "Comum", season: "Todo o ano" },
    introduced: true,
    sounds: [
      {
        // The whole 15s recording: seven bursts of shrill chattering calls
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1789779.mp3",
        recordist: "amandapmarcon",
        license: "cc-by-nc",
        observation: 341087730,
        location: "Porto Alegre, RS",
        type: "call",
        duration: 14.69,
      },
    ],
  },
  {
    name: "Papagaio-verdadeiro",
    scientificName: "Amazona aestiva",
    family: "Psittacidae",
    inatTaxonId: 18978,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/751910048/medium.jpg",
    photoCredit: "(c) Matt Blue, some rights reserved (CC BY-NC), uploaded by Matt Blue",
    conservation: { status: "NT", list: "IUCN" },
    coa: { frequency: "Comum", season: "Todo o ano" },
    introduced: true,
    sounds: [
      {
        // Raucous double squawks with pauses, about 12s of the 1m21s recording
        source: "xenocanto",
        xc: 488805,
        audio:
          "https://xeno-canto.org/sounds/uploaded/ORPKXJRFDZ/XC488805-papagaio%20verdadeiro%20%28online-audio-converter.com%29.mp3",
        recordist: "Luiz C. Silva",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Cruzeiro do Oeste, PR",
        type: "call",
        start: 15.2,
        end: 27.1,
      },
    ],
  },
  {
    name: "Tiriba-de-testa-vermelha",
    scientificName: "Pyrrhura frontalis",
    family: "Psittacidae",
    inatTaxonId: 19162,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/158992021/medium.jpg",
    photoCredit: "(c) Dario Sanches, some rights reserved (CC BY-SA)",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    introduced: true,
    sounds: [
      {
        // A flock's burst of screeches, then single harsh calls, about 10s of the 15s recording
        source: "xenocanto",
        xc: 70823,
        audio: "https://xeno-canto.org/sounds/uploaded/WOEAFQRMUD/Pyrrhura%20frontalis0607-0.mp3",
        recordist: "Daniel Lane",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "São Francisco de Paula, RS",
        type: "call",
        start: 1.35,
        end: 10.95,
      },
    ],
  },
  {
    name: "Pardal",
    scientificName: "Passer domesticus",
    family: "Passeridae",
    inatTaxonId: 13858,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/4608133/medium.jpg",
    photoCredit: "(c) Ximo Galarza, some rights reserved (CC BY-NC-SA)",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    introduced: true,
    sounds: [
      {
        // A flock's steady chirping, the whole 11s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/138328.m4a",
        recordist: "Eliara Solange Müller",
        license: "cc-by-nc",
        observation: 60711716,
        location: "Chapecó, SC",
        type: "song",
        duration: 11.1,
      },
    ],
  },
  {
    name: "Patinho",
    scientificName: "Platyrinchus mystaceus",
    family: "Platyrinchidae",
    inatTaxonId: 16230,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/77933/medium.jpg",
    photoCredit: "(c) Dario Sanches, some rights reserved (CC BY-SA)",
    coa: { frequency: "Rara", season: "Todo o ano" },
    sounds: [
      {
        // Seven songs, about 17s of the 34s recording
        source: "xenocanto",
        xc: 418164,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC418164-Patinho1%20%28Platyrinchus%20mystaceus-OK-OK%29.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        start: 6.3,
        end: 23.2,
      },
    ],
  },
  {
    name: "Pernilongo-de-costas-brancas",
    scientificName: "Himantopus mexicanus melanurus",
    family: "Recurvirostridae",
    inatTaxonId: 464940,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/12159782/medium.jpeg",
    photoCredit: "no rights reserved, uploaded by Kahio Tiberio Mazon",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 15s recording: two long runs of sharp 'kek' calls
        source: "xenocanto",
        xc: 16258,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/Pernalonga01%20-%20Himantopus%20mexicanus.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Pelotas, RS",
        type: "call",
        duration: 14.83,
      },
    ],
  },
  {
    name: "Pica-pau-verde-barrado",
    scientificName: "Colaptes melanochloros",
    family: "Picidae",
    inatTaxonId: 18250,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/171007754/medium.jpeg",
    photoCredit:
      "(c) Gustavo Fernando Durán, some rights reserved (CC BY-NC-SA), uploaded by Gustavo Fernando Durán",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 6s recording: one song, a run of loud notes
        source: "xenocanto",
        xc: 176926,
        audio:
          "https://xeno-canto.org/sounds/uploaded/FYHMASBKBC/XC176926-Colaptes%20melanochloros%20%28pica%20pau%20verde%20barrado%29.mp3",
        recordist: "Cleberton D. Bianchini",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Lajeado, RS",
        type: "song",
        duration: 6.37,
      },
    ],
  },
  {
    name: "Pica-pau-do-campo",
    scientificName: "Colaptes campestris",
    family: "Picidae",
    inatTaxonId: 18262,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/169149980/medium.jpg",
    photoCredit: "(c) Dave Curtis, some rights reserved (CC BY-NC-ND)",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 15s recording: bursts of loud 'kwik' notes
        source: "xenocanto",
        xc: 50994,
        audio:
          "https://xeno-canto.org/sounds/uploaded/BYLLSJRVDZ/FLICKER%20Campo_12_Sao%20Francisco%20de%20Paula_Rio%20Grande%20do%20Sul_BR_4JUL07_Bernabe%20Lopez-Lanus.mp3",
        recordist: "Bernabe Lopez-Lanus",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        duration: 15.57,
      },
    ],
  },
  {
    name: "Pica-pau-branco",
    scientificName: "Melanerpes candidus",
    family: "Picidae",
    inatTaxonId: 18183,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/3172895/medium.jpg",
    photoCredit: "(c) Kent Miller, some rights reserved (CC BY-ND), uploaded by Kent Miller",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 6s recording: two harsh, descending 'krreer' calls
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1742438.mp3",
        recordist: "amandapmarcon",
        license: "cc-by-nc",
        observation: 334948210,
        location: "Getúlio Vargas, RS",
        type: "call",
        duration: 5.78,
      },
    ],
  },
  {
    name: "Pica-pau-verde-carijó",
    scientificName: "Veniliornis spilogaster",
    family: "Picidae",
    inatTaxonId: 18014,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/14148819/medium.jpg",
    photoCredit:
      "(c) João Vitor Andriola, some rights reserved (CC BY-NC), uploaded by João Vitor Andriola",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Four sharp 'kik' calls at their natural pace, about 15s of the 3m28s recording
        source: "xenocanto",
        xc: 332741,
        audio: "https://xeno-canto.org/sounds/uploaded/DGVLLRYDXS/XC332741-VENSPI14.mp3",
        recordist: "Jeremy Minns",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "São Francisco de Paula, RS",
        type: "call",
        start: 140.15,
        end: 155.6,
      },
    ],
  },
  {
    name: "Pica-pau-de-cabeça-amarela",
    scientificName: "Celeus flavescens",
    family: "Picidae",
    inatTaxonId: 850897,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/24551368/medium.jpeg",
    photoCredit:
      "(c) visionsamazoniennes, some rights reserved (CC BY-NC), uploaded by visionsamazoniennes",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 6s recording: two loud phrases
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1742388.mp3",
        recordist: "amandapmarcon",
        license: "cc-by-nc",
        observation: 334944845,
        location: "Getúlio Vargas, RS",
        type: "song",
        duration: 5.88,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Pica-pau-dourado",
    scientificName: "Piculus aurulentus",
    family: "Picidae",
    inatTaxonId: 17733,
    // large: the medium size of this portrait photo is only 333px wide
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/12204993/large.jpg",
    photoCredit: "(c) Gustavo Lazarini Forreque, some rights reserved (CC BY)",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Two four-note series, about 8.5s of the 10s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1787556.mp3",
        recordist: "amandapmarcon",
        license: "cc-by-nc",
        observation: 340803060,
        location: "Água Santa, RS",
        type: "song",
        start: 1,
        end: 9.5,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Tovaca-campainha",
    scientificName: "Chamaeza campanisona",
    family: "Formicariidae",
    inatTaxonId: 9021,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/11210781/medium.jpg",
    photoCredit:
      "(c) fabiomanfredini, some rights reserved (CC BY-NC), uploaded by fabiomanfredini",
    coa: { frequency: "Rara", season: "Todo o ano" },
    sounds: [
      {
        // One full song: the long run of hollow notes and its loud ending, about 10s of the 37s recording
        source: "xenocanto",
        xc: 252808,
        audio:
          "https://xeno-canto.org/sounds/uploaded/ITWDKVLIZJ/XC252808-Chamaeza%20campanisona%20-%2031-05-2015%20p%20XC%20-%208hs%20-%20n%C3%A3o%20vi.mp3",
        recordist: "Romulo Vitoria",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        start: 1.1,
        end: 10.75,
        fmax: 2500,
      },
    ],
  },
  {
    name: "Avoante",
    scientificName: "Zenaida auriculata",
    family: "Columbidae",
    inatTaxonId: 3439,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/85633474/medium.jpeg",
    photoCredit:
      "(c) Diego Caballero, some rights reserved (CC BY-NC), uploaded by Diego Caballero",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 18s recording: two coo phrases
        source: "xenocanto",
        xc: 807696,
        audio: "https://xeno-canto.org/sounds/uploaded/LBUERSNSGU/XC807696-Zenaida-auriculata.mp3",
        recordist: "Vinícius Soares Domingues",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Rio Grande, RS",
        type: "song",
        duration: 18.44,
        fmax: 1500,
      },
    ],
  },
  {
    name: "Pombo-doméstico",
    scientificName: "Columba livia",
    family: "Columbidae",
    inatTaxonId: 3017,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/466776975/medium.jpg",
    photoCredit: "(c) Birds of Gilgit-Baltistan, some rights reserved (CC BY-SA)",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    introduced: true,
    sounds: [
      {
        // A steady series of nine soft coos, about 11s of the 27s recording
        source: "xenocanto",
        xc: 689835,
        audio:
          "https://xeno-canto.org/sounds/uploaded/CFRYARSVHN/XC689835-recording-20211116-074030%20Pombo%20xc.mp3",
        recordist: "Ricardo José Mitidieri",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Tiradentes, MG",
        type: "song",
        start: 5.15,
        end: 15.85,
        fmax: 1500,
      },
    ],
  },
  {
    name: "Pomba-asa-branca",
    scientificName: "Patagioenas picazuro",
    family: "Columbidae",
    inatTaxonId: 3102,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/48616256/medium.jpeg",
    photoCredit:
      "(c) Pablo Balduvino, some rights reserved (CC BY-NC), uploaded by Pablo Balduvino",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 12s recording: one full song, a run of deep coos
        source: "xenocanto",
        xc: 100836,
        audio:
          "https://xeno-canto.org/sounds/uploaded/NBJQSQJRYH/Patagioenas-picazuro-LDiario-UR-2-3-12-ASilveira.mp3",
        recordist: "Antonio Silveira",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Maldonado, Uruguai",
        type: "song",
        duration: 12.54,
        fmax: 2500,
      },
    ],
  },
  {
    name: "Rolinha-roxa",
    scientificName: "Columbina talpacoti",
    family: "Columbidae",
    inatTaxonId: 3580,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/402007805/medium.jpg",
    photoCredit:
      "(c) eduardovieira17, some rights reserved (CC BY-NC), uploaded by eduardovieira17",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Fourteen coos from a long series, about 12s of the 2m07s recording
        source: "xenocanto",
        xc: 890941,
        audio:
          "https://xeno-canto.org/sounds/uploaded/YOXWKYFZAP/XC890941-Columbina-talpacoti-DCB-164-1a.mp3",
        recordist: "Dante Buzzetti",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Santo Antônio da Patrulha, RS",
        type: "song",
        start: 84.7,
        end: 96.85,
        fmax: 1500,
      },
    ],
  },
  {
    name: "Juriti-pupu",
    scientificName: "Leptotila verreauxi",
    family: "Columbidae",
    inatTaxonId: 3280,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/268175748/medium.jpeg",
    photoCredit: "(c) Christoph Moning, some rights reserved (CC BY), uploaded by Christoph Moning",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 22s recording: three two-part coos, about 8s apart
        source: "xenocanto",
        xc: 294701,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC294701-Columbidae_Leptotila_verreauxi_23_02_2015_H11_14_Doutor_Pedrinho.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Doutor Pedrinho, SC",
        type: "song",
        duration: 22.18,
        fmin: 200,
        fmax: 1200,
      },
    ],
  },
  {
    name: "Rolinha-picuí",
    scientificName: "Columbina picui",
    family: "Columbidae",
    inatTaxonId: 3577,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/553885334/medium.jpg",
    photoCredit:
      "(c) Pablo Edgardo Lucconi Grisolia, some rights reserved (CC BY-NC), uploaded by Pablo Edgardo Lucconi Grisolia",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // A series of six coos, about 4s of the 12s recording
        source: "xenocanto",
        xc: 510869,
        audio:
          "https://xeno-canto.org/sounds/uploaded/TGBFXDVERJ/XC510869-Columbina%20picui_Mostardas_1048.mp3",
        recordist: "Gabriel Leite",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Mostardas, RS",
        type: "song",
        start: 3.7,
        end: 7.65,
        fmax: 1200,
      },
    ],
  },
  {
    name: "Juriti-de-testa-branca",
    scientificName: "Leptotila rufaxilla",
    family: "Columbidae",
    inatTaxonId: 3302,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/5643258/medium.jpeg",
    photoCredit: "(c) Claudia Komesu, some rights reserved (CC BY-NC), uploaded by Claudia Komesu",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Five coos, about 18s of the 44s recording
        source: "xenocanto",
        xc: 758428,
        audio: "https://xeno-canto.org/sounds/uploaded/ORPKXJRFDZ/XC758428-juriti-gemedeira.mp3",
        recordist: "Luiz C. Silva",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Campo Mourão, PR",
        type: "song",
        start: 0.9,
        end: 19.4,
        fmax: 2000,
      },
    ],
  },
  {
    name: "Suindara",
    scientificName: "Tyto furcata",
    family: "Tytonidae",
    inatTaxonId: 1578502,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/103695544/medium.jpg",
    photoCredit:
      "(c) Andria E. Hernandez, some rights reserved (CC BY-NC), uploaded by Andria E. Hernandez",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 15s recording: two long screeches
        source: "xenocanto",
        xc: 70088,
        audio: "https://xeno-canto.org/sounds/uploaded/IGDDGNGPAL/lechuzacampanario.mp3",
        recordist: "Alvaro Riccetto",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Lavalleja, Uruguai",
        type: "call",
        duration: 14.58,
      },
    ],
  },
  {
    name: "Surucuá-variado",
    scientificName: "Trogon surrucura",
    family: "Trogonidae",
    inatTaxonId: 20763,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/544527120/medium.jpg",
    photoCredit: "(c) Victor Kenzo F. Tanaka, some rights reserved (CC BY-NC)",
    coa: { frequency: "Rara", season: "Todo o ano" },
    sounds: [
      {
        // The whole 29s recording: two long series of 'cow' notes
        source: "xenocanto",
        xc: 23567,
        audio: "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/Trogon_surrucura3.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Capão do Leão, RS",
        type: "song",
        duration: 28.78,
        fmax: 4000,
      },
    ],
  },
  {
    name: "Tico-tico",
    scientificName: "Zonotrichia capensis",
    family: "Passerellidae",
    inatTaxonId: 9183,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/112061150/medium.jpeg",
    photoCredit: "(c) Esteban Poveda, some rights reserved (CC BY), uploaded by Esteban Poveda",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // Two songs, about 11s of the 23s recording
        source: "xenocanto",
        xc: 153603,
        audio:
          "https://xeno-canto.org/sounds/uploaded/NBJQSQJRYH/XC153603-Zonotrichia-capensis-VlQuilomboGRRS-BR-28-10-13-ASilveira.mp3",
        recordist: "Antonio Silveira",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Gramado, RS",
        type: "song",
        start: 0.35,
        end: 11.1,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Tico-tico-do-campo",
    scientificName: "Ammodramus humeralis",
    family: "Passerellidae",
    inatTaxonId: 10134,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/88171938/medium.jpeg",
    photoCredit:
      "(c) Diego Caballero, some rights reserved (CC BY-NC), uploaded by Diego Caballero",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Two songs, about 13s of the 29s recording
        source: "xenocanto",
        xc: 200399,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/XC200399-Ammodramus_humeralis-51311%2025-10-2008.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Arroio Grande, RS",
        type: "song",
        start: 0.8,
        end: 14,
      },
    ],
  },
  {
    name: "Cambacica",
    scientificName: "Coereba flaveola",
    family: "Thraupidae",
    inatTaxonId: 10199,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/58407889/medium.jpeg",
    photoCredit: "(c) subhashc, some rights reserved (CC BY-NC)",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // Two song bouts, about 9s of the 53s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1634629.mp3",
        recordist: "amandapmarcon",
        license: "cc-by-nc",
        observation: 313541441,
        location: "Porto Alegre, RS",
        type: "song",
        start: 40.15,
        end: 49.6,
      },
    ],
  },
  {
    name: "Sanhaço-cinzento",
    scientificName: "Thraupis sayaca",
    family: "Thraupidae",
    inatTaxonId: 10293,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/9892758/medium.jpg",
    photoCredit: "(c) Greg Lasley, some rights reserved (CC BY-NC), uploaded by Greg Lasley",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // Four song phrases, nearly all of the 20s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/145580.m4a",
        recordist: "Eliara Solange Müller",
        license: "cc-by-nc",
        observation: 63716175,
        location: "Chapecó, SC",
        type: "song",
        start: 0.1,
        end: 20.1,
        fmin: 1500,
      },
    ],
  },
  {
    name: "Canário-da-terra",
    scientificName: "Sicalis flaveola",
    family: "Thraupidae",
    inatTaxonId: 9864,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/220765971/medium.jpg",
    photoCredit: "(c) Alejandro  Bayer Tamayo, some rights reserved (CC BY-SA)",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // Several song phrases, about 13s of the 29s recording
        source: "xenocanto",
        xc: 84693,
        audio: "https://xeno-canto.org/sounds/uploaded/DGVLLRYDXS/SICFLA11.mp3",
        recordist: "Jeremy Minns",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        start: 4.65,
        end: 17.75,
      },
    ],
  },
  {
    name: "Cardeal",
    scientificName: "Paroaria coronata",
    family: "Thraupidae",
    inatTaxonId: 10254,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/313854459/medium.jpg",
    photoCredit:
      "(c) GUSTAVO PASCUAS, some rights reserved (CC BY-NC), uploaded by GUSTAVO PASCUAS",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // A long run of song phrases, about 14s of the 27s recording
        source: "xenocanto",
        xc: 686325,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC686325-02-11-2021%2013e26%20Cardeal%20URUGUAIANA.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Uruguaiana, RS",
        type: "song",
        start: 1.05,
        end: 15.55,
        fmax: 5000,
      },
    ],
  },
  {
    name: "Sanhaço-papa-laranja",
    scientificName: "Rauenia bonariensis",
    family: "Thraupidae",
    inatTaxonId: 1289360,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/169931554/medium.jpeg",
    photoCredit: "(c) Esteban Poveda, some rights reserved (CC BY), uploaded by Esteban Poveda",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Two bursts of the fast squeaky song, about 10s of the 42s recording
        source: "xenocanto",
        xc: 686661,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC686661-06-11-2021%205e28%20Sanhaco%20papa%20laranja%20BAGE.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Bagé, RS",
        type: "song",
        start: 12.8,
        end: 22.35,
      },
    ],
  },
  {
    name: "Quete-do-sul",
    scientificName: "Microspingus cabanisi",
    family: "Thraupidae",
    inatTaxonId: 558562,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/102043623/medium.jpg",
    photoCredit: "(c) Norton Santos, some rights reserved (CC BY-NC), uploaded by Norton Santos",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 9s recording: eight loud song notes
        source: "xenocanto",
        xc: 419263,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC419263-Quete%20do%20sul%20%28Microspingus%20cabanisi-OK-OK%29.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Canela, RS",
        type: "song",
        duration: 8.66,
        fmin: 1500,
      },
    ],
  },
  {
    name: "Trinca-ferro",
    scientificName: "Saltator similis",
    family: "Thraupidae",
    inatTaxonId: 9861,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/102158323/medium.jpg",
    photoCredit: "(c) Norton Santos, some rights reserved (CC BY-NC), uploaded by Norton Santos",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Three song phrases, about 17s of the 30s recording
        source: "xenocanto",
        xc: 153662,
        audio:
          "https://xeno-canto.org/sounds/uploaded/NBJQSQJRYH/XC153662-Saltator%20similis-LinhaBonitaGR-BR-28-10-13-ASilveira.mp3",
        recordist: "Antonio Silveira",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Gramado, RS",
        type: "song",
        start: 12.45,
        end: 29.15,
      },
    ],
  },
  {
    name: "Quem-te-vestiu",
    scientificName: "Poospiza nigrorufa",
    family: "Thraupidae",
    inatTaxonId: 890970,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/177234831/medium.jpg",
    photoCredit: "(c) joseluisblazquez, some rights reserved (CC BY-NC)",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Two song bouts, about 14s of the 38s recording
        source: "xenocanto",
        xc: 471310,
        audio:
          "https://xeno-canto.org/sounds/uploaded/YRDADNREOP/XC471310-Poospiza_nigrorufa-2577413.mp3",
        recordist: "Ricardo Gagliardi",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Tavares, RS",
        type: "song",
        start: 9.9,
        end: 23.9,
      },
    ],
  },
  {
    name: "Saíra-preciosa",
    scientificName: "Stilpnia preciosa",
    family: "Thraupidae",
    inatTaxonId: 979964,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/118977504/medium.jpg",
    photoCredit:
      "(c) Luciano Bernardes, some rights reserved (CC BY-NC), uploaded by Luciano Bernardes",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 8s recording: three calls
        source: "xenocanto",
        xc: 725040,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC725040-13-05-2022%207e43%20Saira%20preciosa%20URUPEMA.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Urupema, SC",
        type: "call",
        duration: 7.81,
        fmin: 2000,
        fmax: 11000,
      },
    ],
  },
  {
    name: "Tiziu",
    scientificName: "Volatinia jacarina",
    family: "Thraupidae",
    inatTaxonId: 10288,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/862024/medium.jpg",
    photoCredit: "(c) Dario Sanches, some rights reserved (CC BY-SA)",
    coa: { frequency: "Pouco comum", season: "Indeterminada" },
    sounds: [
      {
        // The whole 24s recording: repeated buzzy 'ti-ziu' display songs, with other males farther off
        source: "xenocanto",
        xc: 8129,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/Tiziu%20-%20Volatinia%20jacarina00.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Pelotas, RS",
        type: "song",
        duration: 24.54,
        fmax: 12000,
      },
    ],
  },
  {
    name: "Cavalaria",
    scientificName: "Paroaria capitata",
    family: "Thraupidae",
    inatTaxonId: 10257,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/9854276/medium.jpg",
    photoCredit: "(c) Greg Lasley, some rights reserved (CC BY-NC), uploaded by Greg Lasley",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    introduced: true,
    sounds: [
      {
        // One phrase of slurred notes and a sharp call, about 2s of the 30s recording
        source: "xenocanto",
        xc: 838743,
        audio:
          "https://xeno-canto.org/sounds/uploaded/VKQHDAFQDZ/XC838743-Cardenilla-%28Call%29.mp3",
        recordist: "Pedro Rinaldi",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Salto, Uruguai",
        type: "call",
        start: 6.3,
        end: 8,
      },
    ],
  },
  {
    name: "Sanhaço-do-coqueiro",
    scientificName: "Thraupis palmarum",
    family: "Thraupidae",
    inatTaxonId: 10297,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/2967027/medium.jpg",
    photoCredit: "(c) Greg Lasley, some rights reserved (CC BY-NC), uploaded by Greg Lasley",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Two song phrases, about 13s of the 55s recording
        source: "xenocanto",
        xc: 440804,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/XC440804-Tangara%20Palmarum%20mp3%20-%20Balne%C3%A1rio%20Santo%20Ant%C3%B4nio%20-%20Laranjal%20-20181025-173704.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Pelotas, RS",
        type: "song",
        start: 29.8,
        end: 42.3,
        fmax: 11000,
      },
    ],
  },
  {
    name: "Saíra-viúva",
    scientificName: "Pipraeidea melanonota",
    family: "Thraupidae",
    inatTaxonId: 10711,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/14590974/medium.jpg",
    photoCredit: "(c) Cláudio Dias Timm, some rights reserved (CC BY-NC-SA)",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Three song phrases, about 13s of the 14s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1664448.mp3",
        recordist: "amandapmarcon",
        license: "cc-by-nc",
        observation: 320175739,
        location: "Passo Fundo, RS",
        type: "song",
        start: 0.6,
        end: 13.5,
        fmin: 2000,
        fmax: 11000,
      },
    ],
  },
  {
    name: "Tico-tico-rei",
    scientificName: "Coryphospingus cucullatus",
    family: "Thraupidae",
    inatTaxonId: 10310,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/26408652/medium.jpeg",
    photoCredit: "no rights reserved, uploaded by Diego Carús",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Two song bouts, about 13s of the 26s recording
        source: "xenocanto",
        xc: 200403,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/XC200403-Lanio_cucullatus-52911%2013-12-2008.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Arroio Grande, RS",
        type: "song",
        start: 10.9,
        end: 24.2,
      },
    ],
  },
  {
    name: "Tiê-preto",
    scientificName: "Tachyphonus coronatus",
    family: "Thraupidae",
    inatTaxonId: 10079,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/5643289/medium.jpeg",
    photoCredit: "(c) Claudia Komesu, some rights reserved (CC BY-NC), uploaded by Claudia Komesu",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // A steady run of 'chep' song notes, about 11s of the 13s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/162364.mp3",
        recordist: "henriqueandrades",
        license: "cc-by-nc",
        observation: 69093558,
        location: "Osório, RS",
        type: "song",
        start: 1.35,
        end: 12.5,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Coleirinho",
    scientificName: "Sporophila caerulescens",
    family: "Thraupidae",
    inatTaxonId: 9517,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/303058924/medium.jpeg",
    photoCredit: "(c) Palhas, some rights reserved (CC BY-NC), uploaded by Palhas",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 16s recording: three song phrases
        source: "xenocanto",
        xc: 200409,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/XC200409-Sporophila_caerulescens-52899%2015-11-2008.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Arroio Grande, RS",
        type: "song",
        duration: 15.54,
      },
    ],
  },
  {
    name: "Saí-azul",
    scientificName: "Dacnis cayana",
    family: "Thraupidae",
    inatTaxonId: 10506,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/65613623/medium.jpg",
    photoCredit:
      "(c) Hudson Martins Soares, some rights reserved (CC BY-NC), uploaded by Hudson Martins Soares",
    coa: { frequency: "Incomum", season: "Outono/inverno" },
    sounds: [
      {
        // The whole 10s recording: a twittering song burst followed by thin calls
        source: "xenocanto",
        xc: 176840,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC176840-Thraupidae_Dacnis_cayana_22_07_2011_H12_51_Casa_meus_pais_Salete.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Salete, SC",
        type: "song",
        duration: 9.58,
      },
    ],
  },
  {
    name: "Sanhaço-frade",
    scientificName: "Stephanophorus diadematus",
    family: "Thraupidae",
    inatTaxonId: 10706,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/51069292/medium.jpg",
    photoCredit:
      "(c) Sebastián Lescano, some rights reserved (CC BY-NC), uploaded by Sebastián Lescano",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Two song phrases, about 15s of the 31s recording
        source: "xenocanto",
        xc: 84747,
        audio: "https://xeno-canto.org/sounds/uploaded/DGVLLRYDXS/STEDIA10.mp3",
        recordist: "Jeremy Minns",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        start: 14.55,
        end: 30,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Sabiá-do-banhado",
    scientificName: "Embernagra platensis",
    family: "Thraupidae",
    inatTaxonId: 10670,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/48721764/medium.jpeg",
    photoCredit:
      "(c) Pablo Balduvino, some rights reserved (CC BY-NC), uploaded by Pablo Balduvino",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 13s recording: three song phrases
        source: "xenocanto",
        xc: 176466,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC176466-Emberizidae_Embernagra_platensis_09_07_2012_h07_41_Cotipor%C3%A3.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Cotiporã, RS",
        type: "song",
        duration: 13.07,
      },
    ],
  },
  {
    name: "Saí-andorinha",
    scientificName: "Tersina viridis",
    family: "Thraupidae",
    inatTaxonId: 10607,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/226698613/medium.jpg",
    photoCredit:
      "(c) Oswaldo Hernández, some rights reserved (CC BY-NC), uploaded by Oswaldo Hernández",
    coa: { frequency: "Incomum", season: "Outono" },
    sounds: [
      {
        // The whole 13s recording: five buzzy calls
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1665784.mp3",
        recordist: "amandapmarcon",
        license: "cc-by-nc",
        observation: 320445964,
        location: "Getúlio Vargas, RS",
        type: "call",
        duration: 12.67,
        fmax: 11000,
      },
    ],
  },
  {
    name: "Tipio",
    scientificName: "Sicalis luteola",
    family: "Thraupidae",
    inatTaxonId: 9869,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/33491763/medium.jpeg",
    photoCredit: "no rights reserved, uploaded by Diego Carús",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // A song trill then a group chorus of trills, about 16s of the 1m13s recording
        source: "xenocanto",
        xc: 890945,
        audio:
          "https://xeno-canto.org/sounds/uploaded/YOXWKYFZAP/XC890945-Sicalis-luteola-DCB-164-4.mp3",
        recordist: "Dante Buzzetti",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Santo Antônio da Patrulha, RS",
        type: "song",
        start: 1.35,
        end: 17.3,
      },
    ],
  },
  {
    name: "Coleiro-do-brejo",
    scientificName: "Sporophila collaris",
    family: "Thraupidae",
    inatTaxonId: 9516,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/32567696/medium.jpg",
    photoCredit: "(c) RAP, some rights reserved (CC BY), uploaded by RAP",
    coa: { frequency: "Rara", season: "Todo o ano" },
    conservation: { status: "NT", list: "RS" },
    sounds: [
      {
        // The whole 24s recording: two long warbled songs
        source: "xenocanto",
        xc: 203407,
        audio:
          "https://xeno-canto.org/sounds/uploaded/AOPMSCIDIA/XC203407-coleiro-do-brejo%20%28Sporophila%20collaris%29.mp3",
        recordist: "Adrian Eisen Rupp",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Mostardas, RS",
        type: "song",
        duration: 24,
      },
    ],
  },
  {
    name: "Saíra-de-papo-preto",
    scientificName: "Hemithraupis guira",
    family: "Thraupidae",
    inatTaxonId: 10303,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/109203635/medium.jpeg",
    photoCredit:
      "(c) Frederico Acaz Sonntag, some rights reserved (CC BY-NC), uploaded by Frederico Acaz Sonntag",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // A fast burst of high notes, then a long series of thin notes, about 18s of the 22s recording
        source: "xenocanto",
        xc: 308816,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/XC308816-Hemithraupis_guira-63199.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Derrubadas, RS",
        type: "song",
        start: 0.1,
        end: 17.9,
        fmin: 2000,
        fmax: 12000,
      },
    ],
  },
  {
    name: "Tico-tico-do-banhado",
    scientificName: "Donacospiza albifrons",
    family: "Thraupidae",
    inatTaxonId: 10715,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/545970146/medium.jpg",
    photoCredit:
      "(c) Agustín Gabriel Álvarez, some rights reserved (CC BY-NC), uploaded by Agustín Gabriel Álvarez",
    coa: { frequency: "Rara", season: "Todo o ano" },
    sounds: [
      {
        // One long song: a 9s series of rapid downslurred notes, from the 36s recording
        source: "xenocanto",
        xc: 1052975,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC1052975-05-11-2025-10e40-Tico-tico-do-banhado-SAO-FRANCISCO-DE-PAULA.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        start: 3,
        end: 12.6,
      },
    ],
  },
  {
    name: "Canário-do-campo",
    scientificName: "Emberizoides herbicola",
    family: "Thraupidae",
    inatTaxonId: 10556,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/555212/medium.jpg",
    photoCredit: "(c) Dario Sanches, some rights reserved (CC BY-SA)",
    coa: { frequency: "Rara", season: "Todo o ano" },
    sounds: [
      {
        // The whole 25s recording: nine song phrases
        source: "xenocanto",
        xc: 8150,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/Canario-do-campo%20-%20Emberizoides%20herbicola.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Pelotas, RS",
        type: "song",
        duration: 24.77,
      },
    ],
  },
  {
    name: "Cabecinha-castanha",
    scientificName: "Thlypopsis pyrrhocoma",
    family: "Thraupidae",
    inatTaxonId: 558557,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/104133569/medium.jpeg",
    photoCredit:
      "(c) Frederico Acaz Sonntag, some rights reserved (CC BY-NC), uploaded by Frederico Acaz Sonntag",
    sounds: [
      {
        // Two song phrases, about 8s of the 25s recording
        source: "xenocanto",
        xc: 84641,
        audio: "https://xeno-canto.org/sounds/uploaded/DGVLLRYDXS/PYRRUF13.mp3",
        recordist: "Jeremy Minns",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        start: 2,
        end: 10,
      },
    ],
  },
  {
    name: "Cigarra-bambu",
    scientificName: "Haplospiza unicolor",
    family: "Thraupidae",
    inatTaxonId: 9282,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/1507236/medium.jpg",
    photoCredit: "(c) Nigel Voaden, some rights reserved (CC BY)",
    coa: { frequency: "Acidental", season: "Indeterminada" },
    sounds: [
      {
        // Five songs, about 16s of the 40s recording
        source: "xenocanto",
        xc: 186838,
        audio:
          "https://xeno-canto.org/sounds/uploaded/CEKMJEZKSJ/XC186838-Haplospiza%20unicolor_BARRA_DO_OURO_12_04_2014.mp3",
        recordist: "João Gava",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Maquiné, RS",
        type: "song",
        start: 1.1,
        end: 17.5,
        fmin: 2000,
        fmax: 12000,
      },
    ],
  },
  {
    name: "Tiê-de-topete",
    scientificName: "Trichothraupis melanops",
    family: "Thraupidae",
    inatTaxonId: 10719,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/27445973/medium.jpg",
    photoCredit:
      "(c) João Paulo Rosa, some rights reserved (CC BY-NC), uploaded by João Paulo Rosa",
    coa: { frequency: "Incomum", season: "Indeterminada" },
    sounds: [
      {
        // A long jumbled song of chips and slurred whistles, about 10s of the 46s recording
        source: "xenocanto",
        xc: 488834,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MLTFMFCXEO/XC488834-Trichothraupis%20melanops%20-%20Arataca%20-%20Joinville%20-%20SC%20-%2017-10-2017%20%2817-18%29%20M%20editada.mp3",
        recordist: "Guilherme Willrich",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Joinville, SC",
        type: "song",
        start: 1.2,
        end: 11.4,
      },
    ],
  },
  {
    name: "Bem-te-vi",
    scientificName: "Pitangus sulphuratus",
    family: "Tyrannidae",
    inatTaxonId: 16956,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/1766279/medium.jpg",
    photoCredit: "(c) Dario Sanches, some rights reserved (CC BY-SA)",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 12s recording: three 'bem-te-vi' phrases
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/2198999.wav",
        recordist: "Rennan",
        license: "cc-by-nc",
        observation: 408784630,
        location: "Porto Alegre, RS",
        type: "song",
        duration: 11.82,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Suiriri",
    scientificName: "Tyrannus melancholicus",
    family: "Tyrannidae",
    inatTaxonId: 16787,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/254986834/medium.jpg",
    photoCredit:
      "(c) Steven Mlodinow, some rights reserved (CC BY-NC), uploaded by Steven Mlodinow",
    coa: { frequency: "Muito comum", season: "Primavera/verão" },
    sounds: [
      {
        // Four twittering call series, about 16s of the 32s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1664819.mp3",
        recordist: "amandapmarcon",
        license: "cc-by-nc",
        observation: 320253637,
        location: "Getúlio Vargas, RS",
        type: "call",
        start: 15.2,
        end: 30.8,
        fmin: 1500,
      },
    ],
  },
  {
    name: "Risadinha",
    scientificName: "Camptostoma obsoletum",
    family: "Tyrannidae",
    inatTaxonId: 16972,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/158365591/medium.jpg",
    photoCredit:
      "(c) Oswaldo Hernández, some rights reserved (CC BY-NC), uploaded by Oswaldo Hernández",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 14s recording: three song phrases
        source: "xenocanto",
        xc: 193223,
        audio:
          "https://xeno-canto.org/sounds/uploaded/FYHMASBKBC/XC193223-Camptostoma%20obsoletum.mp3",
        recordist: "Cleberton D. Bianchini",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Lajeado, RS",
        type: "song",
        duration: 13.92,
      },
    ],
  },
  {
    name: "Guaracava-de-barriga-amarela",
    scientificName: "Elaenia flavogaster",
    family: "Tyrannidae",
    inatTaxonId: 16714,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/664960111/medium.jpg",
    photoCredit: "(c) Marcelo Okamoto, some rights reserved (CC BY-NC)",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 12s recording: a long series of burry song notes
        source: "xenocanto",
        xc: 81024,
        audio:
          "https://xeno-canto.org/sounds/uploaded/XJSWEWQCEC/elaenia_flavogaster_banhado_macarico_06_june_2011_rafael_a_dias_14h.mp3",
        recordist: "Rafael Antunes Dias",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Rio Grande, RS",
        type: "song",
        duration: 12.01,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Tesourinha",
    scientificName: "Tyrannus savana",
    family: "Tyrannidae",
    inatTaxonId: 16793,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/596460001/medium.jpg",
    photoCredit:
      "(c) Guilherme Cameis Freda, some rights reserved (CC BY-SA), uploaded by Guilherme Cameis Freda",
    coa: { frequency: "Comum", season: "Primavera/verão" },
    sounds: [
      {
        // The whole 27s recording: long bouts of sputtering chatter
        source: "xenocanto",
        xc: 97299,
        audio:
          "https://xeno-canto.org/sounds/uploaded/IRBNRXBEVU/0202_191235_Tyrannus_savana_Campo_Belo_do_Sul.mp3",
        recordist: "Cid Espínola",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Campo Belo do Sul, SC",
        type: "song",
        duration: 27.11,
        fmin: 1500,
      },
    ],
  },
  {
    name: "Alegrinho",
    scientificName: "Serpophaga subcristata",
    family: "Tyrannidae",
    inatTaxonId: 17211,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/31262667/medium.jpg",
    photoCredit:
      "(c) marcelo_allende, some rights reserved (CC BY-NC), uploaded by marcelo_allende",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Three call bursts and a soft trill, about 11s of the 1m44s recording
        source: "xenocanto",
        xc: 1096827,
        audio:
          "https://xeno-canto.org/sounds/uploaded/YOXWKYFZAP/XC1096827-Serpophaga-subcristata-DCB-036-15.mp3",
        recordist: "Dante Buzzetti",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Cambará do Sul, RS",
        type: "song",
        start: 62.75,
        end: 73.3,
      },
    ],
  },
  {
    name: "Tuque-pium",
    scientificName: "Elaenia parvirostris",
    family: "Tyrannidae",
    inatTaxonId: 16733,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/103260661/medium.jpg",
    photoCredit:
      "(c) Reinaldo de Oliveira Elias, some rights reserved (CC BY), uploaded by Reinaldo de Oliveira Elias",
    coa: { frequency: "Muito comum", season: "Primavera/verão" },
    sounds: [
      {
        // Six song phrases, about 14s of the 28s recording
        source: "xenocanto",
        xc: 200401,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/XC200401-Elaenia_parvirostris-44379%2025-01-2009.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Arroio Grande, RS",
        type: "song",
        start: 0.15,
        end: 14,
      },
    ],
  },
  {
    name: "Suiriri-cavaleiro",
    scientificName: "Machetornis rixosa",
    family: "Tyrannidae",
    inatTaxonId: 17289,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/60197023/medium.jpg",
    photoCredit: "(c) Ad Konings, some rights reserved (CC BY-NC), uploaded by Ad Konings",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Two phrases of a thin high 'tseee' and squeaky twitters, about 12s of the 42s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/986467.m4a",
        recordist: "B. Phalan",
        license: "cc-by",
        observation: 209737342,
        location: "Foz do Iguaçu, PR",
        type: "song",
        start: 1.95,
        end: 14.25,
        fmin: 3000,
        fmax: 11000,
      },
    ],
  },
  {
    name: "Bem-te-vi-rajado",
    scientificName: "Myiodynastes maculatus",
    family: "Tyrannidae",
    inatTaxonId: 16063,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/620371179/medium.jpg",
    photoCredit: "(c) Anthony Batista, some rights reserved (CC BY), uploaded by Anthony Batista",
    coa: { frequency: "Pouco comum", season: "Primavera/verão" },
    sounds: [
      {
        // The whole 38s recording: sharp 'pik' calls and soft 'chup' notes, with two fast call series
        source: "xenocanto",
        xc: 8164,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/Bem-te-vi-rajado%20-%20Myiodinastes%20maculatus02.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-nd",
        licenseVersion: "2.5",
        location: "Pelotas, RS",
        type: "call",
        duration: 38.17,
        fmin: 1000,
      },
    ],
  },
  {
    name: "Suiriri-pequeno",
    scientificName: "Satrapa icterophrys",
    family: "Tyrannidae",
    inatTaxonId: 17345,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/241563790/medium.jpg",
    photoCredit: "no rights reserved, uploaded by Paulo Mascaretti",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Four soft calls, about 14s of the 28s recording
        source: "xenocanto",
        xc: 46709,
        audio:
          "https://xeno-canto.org/sounds/uploaded/BYLLSJRVDZ/Satrapa%20icterophrys_Yellow-browed%20Tyrant_Estancia%20El%20Potrero%20%28alrededores%20Puerto%20Unzue%29_Gualeguaychu_Entre%20Rios_17OCT2008_Bernabe%20Lopez-Lanus.mp3",
        recordist: "Bernabe Lopez-Lanus",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Gualeguaychú, Argentina",
        type: "call",
        start: 3.2,
        end: 17,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Peitica",
    scientificName: "Empidonomus varius",
    family: "Tyrannidae",
    inatTaxonId: 17060,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/293335919/medium.jpeg",
    photoCredit: "(c) Agustina Medina, some rights reserved (CC BY), uploaded by Agustina Medina",
    coa: { frequency: "Comum", season: "Primavera/verão" },
    sounds: [
      {
        // The whole 5s recording: a few thin, high descending calls
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1703083.mp3",
        recordist: "amandapmarcon",
        license: "cc-by-nc",
        observation: 328339361,
        location: "Mato Castelhano, RS",
        type: "call",
        duration: 4.54,
        fmin: 2000,
      },
    ],
  },
  {
    name: "Noivinha",
    scientificName: "Xolmis irupero",
    family: "Tyrannidae",
    inatTaxonId: 16134,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/1613677/medium.jpg",
    photoCredit: "(c) Lip Kee, some rights reserved (CC BY-SA)",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Seven soft two-note whistles, about 18s of the 54s recording
        source: "xenocanto",
        xc: 46683,
        audio:
          "https://xeno-canto.org/sounds/uploaded/BYLLSJRVDZ/Xolmis%20irupero_White%20Monjita_Reserva%20El%20Bagual_Formosa_Argentina_Bernabe%20Lopez-Lanus.mp3",
        recordist: "Bernabe Lopez-Lanus",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Formosa, Argentina",
        type: "song",
        start: 3.3,
        end: 21.4,
      },
    ],
  },
  {
    name: "Neinei",
    scientificName: "Megarynchus pitangua",
    family: "Tyrannidae",
    inatTaxonId: 16737,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/33899382/medium.jpg",
    photoCredit: "(c) iturriagal, some rights reserved (CC BY-NC-ND), uploaded by iturriagal",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Two bursts of the harsh, nasal call: the first 4.9s of the 5s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/172894.mp3",
        recordist: "henriqueandrades",
        license: "cc-by-nc",
        observation: 71334553,
        location: "Maquiné, RS",
        type: "call",
        start: 0,
        end: 4.87,
      },
    ],
  },
  {
    name: "Tucão",
    scientificName: "Elaenia sordida",
    family: "Tyrannidae",
    inatTaxonId: 979710,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/280201570/medium.jpg",
    photoCredit:
      "(c) Josh van der Meulen, some rights reserved (CC BY-NC-ND), uploaded by Josh van der Meulen",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Seven burry call phrases, about 13s of the 30s recording
        source: "xenocanto",
        xc: 825518,
        audio: "https://xeno-canto.org/sounds/uploaded/LBUERSNSGU/XC825518-230514_002.mp3",
        recordist: "Vinícius Soares Domingues",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Rio Grande, RS",
        type: "call",
        start: 5.9,
        end: 18.55,
        fmin: 1000,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Irré",
    scientificName: "Myiarchus swainsoni",
    family: "Tyrannidae",
    inatTaxonId: 16029,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/436950508/medium.jpeg",
    photoCredit: "(c) Christoph Moning, some rights reserved (CC BY), uploaded by Christoph Moning",
    coa: { frequency: "Pouco comum", season: "Primavera/verão" },
    sounds: [
      {
        // Dawn song: whistled 'whit' and 'wheer' notes, about 17s of the 2m26s recording
        source: "xenocanto",
        xc: 70817,
        audio: "https://xeno-canto.org/sounds/uploaded/WOEAFQRMUD/Myiarchus.swainsoni0607-1.mp3",
        recordist: "Daniel Lane",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Três Coroas, RS",
        type: "song",
        start: 36.7,
        end: 54.1,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Príncipe",
    scientificName: "Pyrocephalus rubinus",
    family: "Tyrannidae",
    inatTaxonId: 16447,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/13441277/medium.jpg",
    photoCredit: "(c) davy, some rights reserved (CC BY-NC), uploaded by davy",
    coa: { frequency: "Incomum", season: "Primavera/verão" },
    sounds: [
      {
        // A run of display-song phrases, about 9s of the 20s recording
        source: "xenocanto",
        xc: 686557,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC686557-03-11-2021%2010e10%20Principe%20voo%20BARRA.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Barra do Quaraí, RS",
        type: "song",
        start: 2.2,
        end: 11,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Tuque",
    scientificName: "Elaenia mesoleuca",
    family: "Tyrannidae",
    inatTaxonId: 16694,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/169802538/medium.jpeg",
    photoCredit: "(c) Guille Ivan Spajic, some rights reserved (CC BY-NC)",
    coa: { frequency: "Pouco comum", season: "Primavera" },
    sounds: [
      {
        // Burry calls and sharp notes, nearly all of the 11s recording
        source: "xenocanto",
        xc: 186492,
        audio:
          "https://xeno-canto.org/sounds/uploaded/CEKMJEZKSJ/XC186492-Elaenia_mesoleuca_08_11_2013_Flona_de_Passo_Fundo.mp3",
        recordist: "João Gava",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Mato Castelhano, RS",
        type: "call",
        start: 0,
        end: 10.05,
        fmax: 8000,
      },
    ],
  },
  {
    name: "João-pobre",
    scientificName: "Serpophaga nigricans",
    family: "Tyrannidae",
    inatTaxonId: 17210,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/164526641/medium.jpg",
    photoCredit: "(c) https://www.flickr.com/photos/dariosanches/, some rights reserved (CC BY-SA)",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // One song bout by a duetting pair, about 5s of the 9s recording
        source: "xenocanto",
        xc: 146681,
        audio:
          "https://xeno-canto.org/sounds/uploaded/XJSWEWQCEC/XC146681-serpophaga_nigricans_balneario_mostardense.mp3",
        recordist: "Rafael Antunes Dias",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Mostardas, RS",
        type: "song",
        start: 3.15,
        end: 8,
        fmin: 2000,
      },
    ],
  },
  {
    name: "Enferrujado",
    scientificName: "Lathrotriccus euleri",
    family: "Tyrannidae",
    inatTaxonId: 17231,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/6863445/medium.jpg",
    photoCredit: "(c) Cláudio Dias Timm, some rights reserved (CC BY-NC-SA)",
    coa: { frequency: "Pouco comum", season: "Primavera/verão" },
    sounds: [
      {
        // The whole 20s recording: five burry song phrases
        source: "xenocanto",
        xc: 198769,
        audio:
          "https://xeno-canto.org/sounds/uploaded/TLLUGZINYM/XC198769-Lathrotriccus%20euleri%20%28Candiota-RS%2C%2024.09.14%29.mp3",
        recordist: "Roberto Buss Stringari",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Pedras Altas, RS",
        type: "song",
        duration: 19.57,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Guaracava-grande",
    scientificName: "Elaenia spectabilis",
    family: "Tyrannidae",
    inatTaxonId: 16734,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/14148886/medium.jpg",
    photoCredit:
      "(c) João Vitor Andriola, some rights reserved (CC BY-NC), uploaded by João Vitor Andriola",
    coa: { frequency: "Rara", season: "Primavera/verão" },
    sounds: [
      {
        // The whole 18s recording: six burry calls
        source: "xenocanto",
        xc: 770640,
        audio:
          "https://xeno-canto.org/sounds/uploaded/VWCBCAIJUC/XC770640-MixPre-1377_Elaenia_spectabilis.mp3",
        recordist: "Guilherme Melo Becher",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Barra do Quaraí, RS",
        type: "call",
        duration: 18.49,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Amarelinho-do-junco",
    scientificName: "Pseudocolopteryx flaviventris",
    family: "Tyrannidae",
    inatTaxonId: 16594,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/1811216/medium.jpg",
    photoCredit: "(c) Nicolas Olejnik, some rights reserved (CC BY), uploaded by Nicolas Olejnik",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // Two song bouts of ticks ending in a short warble, about 9s of the 14s recording
        source: "xenocanto",
        xc: 574515,
        audio:
          "https://xeno-canto.org/sounds/uploaded/YOXWKYFZAP/XC574515-Pseudocolopteryx%20flaviventris%20DCB%20036-9B.mp3",
        recordist: "Dante Buzzetti",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Santa Vitória do Palmar, RS",
        type: "song",
        start: 4.95,
        end: 13.55,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Bem-te-vi-pirata",
    scientificName: "Legatus leucophaius",
    family: "Tyrannidae",
    inatTaxonId: 17312,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/63359967/medium.jpg",
    photoCredit:
      "(c) Josh van der Meulen, some rights reserved (CC BY-NC-ND), uploaded by Josh van der Meulen",
    sounds: [
      {
        // Three whining 'wee-yee' notes with short 'pi-ri-ri' series between them, about 20s of the 24s recording
        source: "xenocanto",
        xc: 114755,
        audio:
          "https://xeno-canto.org/sounds/uploaded/IRBNRXBEVU/XC114755-1209_101707_Legatus_leucophaius_Campo_Belo_do_Sul.mp3",
        recordist: "Cid Espínola",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Campo Belo do Sul, SC",
        type: "song",
        start: 0.3,
        end: 19.9,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Filipe",
    scientificName: "Myiophobus fasciatus",
    family: "Tyrannidae",
    inatTaxonId: 16862,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/77937/medium.jpg",
    photoCredit: "(c) Dario Sanches, some rights reserved (CC BY-SA)",
    coa: { frequency: "Pouco comum", season: "Primavera/verão" },
    sounds: [
      {
        // The whole 11s recording: two songs, each an upslur followed by a rapid 'pit-pit-pit' trill
        source: "xenocanto",
        xc: 551043,
        audio:
          "https://xeno-canto.org/sounds/uploaded/BYLLSJRVDZ/XC551043-0773%20BLL513-48%20Myiophobus%20fasciatus.mp3",
        recordist: "Bernabe Lopez-Lanus",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "San Pedro, Argentina",
        type: "song",
        duration: 11.25,
      },
    ],
  },
  {
    name: "Maria-preta-de-bico-azulado",
    scientificName: "Knipolegus cyanirostris",
    family: "Tyrannidae",
    inatTaxonId: 16828,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/26406838/medium.jpeg",
    photoCredit: "no rights reserved, uploaded by Diego Carús",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 6s recording: six thin, downslurred 'tsip' notes
        source: "xenocanto",
        xc: 138551,
        audio:
          "https://xeno-canto.org/sounds/uploaded/TWSKITNQOV/XC138551-maria-preta-de-bico-azuladoPESB.mp3",
        recordist: "Noé Eiterer",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Araponga, MG",
        type: "song",
        duration: 5.68,
        fmin: 3000,
      },
    ],
  },
  {
    name: "Guaracava-de-crista-alaranjada",
    scientificName: "Myiopagis viridicata",
    family: "Tyrannidae",
    inatTaxonId: 16892,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/2077595/medium.jpg",
    photoCredit: "(c) Nigel Voaden, some rights reserved (CC BY)",
    coa: { frequency: "Rara", season: "Primavera/verão" },
    sounds: [
      {
        // The whole 21s recording: dawn song of repeated burry 'chree-eet' notes, some followed by a quick 'pi-pi-pi' series
        source: "xenocanto",
        xc: 304367,
        audio:
          "https://xeno-canto.org/sounds/uploaded/CHDHFSVVIN/XC304367-308%20Myiopagis%20viridicata%28Morning%20song%29MoedaTr%C3%AAsLagoas150212.mp3",
        recordist: "Fernando Igor de Godoy",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Três Lagoas, MS",
        type: "song",
        duration: 20.59,
        fmax: 8000,
      },
    ],
  },
  {
    name: "Freirinha",
    scientificName: "Arundinicola leucocephala",
    family: "Tyrannidae",
    inatTaxonId: 17333,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/279432/medium.jpg",
    photoCredit: "(c) Dario Sanches, some rights reserved (CC BY-SA)",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Three song phrases (soft ticks and a sharp 'tsew'), about 7s of the 10s recording
        source: "xenocanto",
        xc: 414335,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC414335-Freirinha%20%28Arundinicola%20leucocephala-OK%29.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Goiânia, GO",
        type: "song",
        start: 0.1,
        end: 7,
      },
    ],
  },
  {
    name: "Barulhento",
    scientificName: "Euscarthmus meloryphus",
    family: "Tyrannidae",
    inatTaxonId: 16396,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/565889/medium.jpg",
    photoCredit: "(c) Dario Sanches, some rights reserved (CC BY-SA)",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // The whole 21s recording: the dry rattle-and-snap song, repeated
        source: "xenocanto",
        xc: 181728,
        audio:
          "https://xeno-canto.org/sounds/uploaded/TLLUGZINYM/XC181728-Euscarthmus%20meloryphus%20%28Candiota-RS%2C%2028.05.14%29%20%28p%C3%B3s-playback%29.mp3",
        recordist: "Roberto Buss Stringari",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Pedras Altas, RS",
        type: "song",
        duration: 21.21,
      },
    ],
  },
  {
    name: "Primavera",
    scientificName: "Nengetus cinereus",
    family: "Tyrannidae",
    inatTaxonId: 1289528,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/1718631/medium.jpg",
    photoCredit: "(c) Mauricio Mercadante, some rights reserved (CC BY-NC-SA)",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // Three whistled song phrases, about 11s of the 27s recording
        source: "xenocanto",
        xc: 350095,
        audio:
          "https://xeno-canto.org/sounds/uploaded/WZSVLIHYQF/XC350095-Xolmis_cinereus_Patrocinio_MG_30_Aug_2011_RSS.mp3",
        recordist: "Robson Silva e Silva",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Patrocínio, MG",
        type: "song",
        start: 15.55,
        end: 26.5,
      },
    ],
  },
  {
    name: "Alegrinho-trinador",
    scientificName: "Serpophaga griseicapilla",
    family: "Tyrannidae",
    inatTaxonId: 372353,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/2229701/medium.jpg",
    photoCredit:
      "(c) Jorge Schlemmer, some rights reserved (CC BY-NC), uploaded by Jorge Schlemmer",
    coa: { frequency: "Rara", season: "Outono/inverno" },
    sounds: [
      {
        // A call note and two trilled songs, about 8s of the 42s recording
        source: "xenocanto",
        xc: 440803,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MHHPJBCUXC/XC440803-Serpophaga%20griseicapilla%20mp3-%20Estrada%20do%20Cotovelo%20-%20A%C3%A7ude%20-%2020181015-105728.mp3",
        recordist: "Fernando Jacobs",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Pelotas, RS",
        type: "song",
        start: 31.2,
        end: 38.8,
        fmin: 2000,
        fmax: 12000,
      },
    ],
  },
  {
    name: "Viuvinha-de-óculos",
    scientificName: "Hymenops perspicillatus",
    family: "Tyrannidae",
    inatTaxonId: 17253,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/386914/medium.jpg",
    photoCredit: "(c) Lip Kee, some rights reserved (CC BY-SA)",
    coa: { frequency: "Incomum", season: "Indeterminada" },
    sounds: [
      {
        // The whole 5s recording: two of its whistled-and-clicking calls
        source: "xenocanto",
        xc: 510836,
        audio:
          "https://xeno-canto.org/sounds/uploaded/TGBFXDVERJ/XC510836-Hymenops%20perpicillatus_Tavares_1025.mp3",
        recordist: "Gabriel Leite",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Tavares, RS",
        type: "call",
        duration: 5.1,
      },
    ],
  },
  {
    name: "Lavadeira-mascarada",
    scientificName: "Fluvicola nengeta",
    family: "Tyrannidae",
    inatTaxonId: 17278,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/432771775/medium.jpg",
    photoCredit:
      "(c) Luciano Bernardes, some rights reserved (CC BY-NC), uploaded by Luciano Bernardes",
    coa: { frequency: "Rara", season: "Indeterminada" },
    sounds: [
      {
        // Bursts of sharp chattering notes, about 14s of the 47s recording
        source: "xenocanto",
        xc: 745046,
        audio:
          "https://xeno-canto.org/sounds/uploaded/CFRYARSVHN/XC745046-recording-20220818-075303%20Lavadeira%20xc.mp3",
        recordist: "Ricardo José Mitidieri",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Niterói, RJ",
        type: "song",
        start: 1.1,
        end: 14.75,
      },
    ],
  },
  {
    name: "Gibão-de-couro",
    scientificName: "Hirundinea ferruginea",
    family: "Tyrannidae",
    inatTaxonId: 17180,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/567541/medium.jpg",
    photoCredit: "(c) Dario Sanches, some rights reserved (CC BY-SA)",
    sounds: [
      {
        // The whole 10s recording: two loud 'wheee-titititi' song phrases
        source: "xenocanto",
        xc: 173287,
        audio:
          "https://xeno-canto.org/sounds/uploaded/MNENFHYTAE/XC173287-Tyrannidae_Hirundinea_ferruginea_03_11_2010_H13_15_Centro_Salete.mp3",
        recordist: "Douglas Meyer",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Salete, SC",
        type: "song",
        duration: 10.58,
      },
    ],
  },
  {
    name: "Guaracava-de-crista-branca",
    scientificName: "Elaenia albiceps chilensis",
    family: "Tyrannidae",
    inatTaxonId: 568439,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/462584928/medium.jpg",
    photoCredit:
      "(c) Cristóbal Costoya, some rights reserved (CC BY-NC), uploaded by Cristóbal Costoya",
    coa: { frequency: "Rara", season: "Outono/inverno" },
    sounds: [
      {
        // The whole 17s recording: the repeated dawn song note
        source: "xenocanto",
        xc: 29343,
        audio: "https://xeno-canto.org/sounds/uploaded/XTVEPHMPPJ/ELAALB01.mp3",
        recordist: "Niels Krabbe",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Calilegua, Argentina",
        type: "song",
        duration: 17.09,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Sabiá-laranjeira",
    scientificName: "Turdus rufiventris",
    family: "Turdidae",
    inatTaxonId: 12738,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/1507197/medium.jpg",
    photoCredit: "(c) Nigel Voaden, some rights reserved (CC BY)",
    coa: { frequency: "Muito comum", season: "Todo o ano" },
    sounds: [
      {
        // Continuous song, about 15s of the 1m23s recording
        source: "xenocanto",
        xc: 147328,
        audio: "https://xeno-canto.org/sounds/uploaded/YXIUXLVTAI/XC147328-sabialaranjeira.mp3",
        recordist: "Gilberto Sander Muller",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Porto Alegre, RS",
        type: "song",
        start: 13.15,
        end: 28.35,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Sabiá-poca",
    scientificName: "Turdus amaurochalinus",
    family: "Turdidae",
    inatTaxonId: 12710,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/262803778/medium.jpg",
    photoCredit:
      "(c) Nicolas Mazzini, some rights reserved (CC BY-NC), uploaded by Nicolas Mazzini",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Continuous song, about 9s of the 38s recording
        source: "xenocanto",
        xc: 153659,
        audio:
          "https://xeno-canto.org/sounds/uploaded/NBJQSQJRYH/XC153659-Turdus%20amaurochalinus-LinhaBonitaGRRS-BR-28-10-13-ASilveira.mp3",
        recordist: "Antonio Silveira",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Gramado, RS",
        type: "song",
        start: 11.75,
        end: 21,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Sabiá-barranco",
    scientificName: "Turdus leucomelas",
    family: "Turdidae",
    inatTaxonId: 12737,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/416376009/medium.jpg",
    photoCredit:
      "(c) Luciano Bernardes, some rights reserved (CC BY-NC), uploaded by Luciano Bernardes",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Four song phrases, about 16s of the 2m05s recording
        source: "xenocanto",
        xc: 384757,
        audio:
          "https://xeno-canto.org/sounds/uploaded/ORPKXJRFDZ/XC384757-sabi%C3%A1%20barranco.mp3",
        recordist: "Luiz C. Silva",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Campo Mourão, PR",
        type: "song",
        start: 0.1,
        end: 16.6,
      },
    ],
  },
  {
    name: "Sabiá-coleira",
    scientificName: "Turdus albicollis",
    family: "Turdidae",
    inatTaxonId: 12746,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/415633664/medium.jpg",
    photoCredit:
      "(c) Luciano Bernardes, some rights reserved (CC BY-NC), uploaded by Luciano Bernardes",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // Two runs of song phrases, about 13s of the 48s recording
        source: "xenocanto",
        xc: 1053061,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC1053061-06-11-2025-15e8-INCOGNITA-Sabia-ITATI.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Itati, RS",
        type: "song",
        start: 1,
        end: 14.45,
        fmax: 4000,
      },
    ],
  },
  {
    name: "Sabiá-ferreiro",
    scientificName: "Turdus subalaris",
    family: "Turdidae",
    inatTaxonId: 827407,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/5901302/medium.jpg",
    photoCredit:
      "(c) fabiomanfredini, some rights reserved (CC BY-NC), uploaded by fabiomanfredini",
    coa: { frequency: "Incomum", season: "Primavera" },
    sounds: [
      {
        // Metallic song phrases with high whistles, about 19s of the 29s recording
        source: "xenocanto",
        xc: 144908,
        audio:
          "https://xeno-canto.org/sounds/uploaded/NBJQSQJRYH/XC144908-Turdus-subalaris-FlonaCanelaRS-BR11-1-08-ASilveira.mp3",
        recordist: "Antonio Silveira",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Canela, RS",
        type: "song",
        start: 8.7,
        end: 27.35,
        fmax: 10000,
      },
    ],
  },
  {
    name: "Sabiá-una",
    scientificName: "Turdus flavipes",
    family: "Turdidae",
    inatTaxonId: 73542,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/276384930/medium.jpeg",
    photoCredit: "(c) Júlio Castellain, some rights reserved (CC BY), uploaded by Júlio Castellain",
    coa: { frequency: "Acidental", season: "Indeterminada" },
    sounds: [
      {
        // Two bouts of the high, varied song, about 14s of the 22s recording
        source: "xenocanto",
        xc: 291468,
        audio: "https://xeno-canto.org/sounds/uploaded/HJWRCPSXJP/XC291468-Turdus%20flavipes.mp3",
        recordist: "Samuel Lopes Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Santa Cruz do Sul, RS",
        type: "song",
        start: 0.25,
        end: 14.6,
      },
    ],
  },
  {
    name: "Tucano-de-bico-verde",
    scientificName: "Ramphastos dicolorus",
    family: "Ramphastidae",
    inatTaxonId: 18808,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/66312147/medium.jpeg",
    photoCredit:
      "(c) Javier González, some rights reserved (CC BY-NC), uploaded by Javier González",
    sounds: [
      {
        // The whole 23s recording: a steady series of frog-like croaks
        source: "xenocanto",
        xc: 166271,
        audio:
          "https://xeno-canto.org/sounds/uploaded/FUUWTBJYFV/XC166271-Ramphastos_dicolorus_tucano_bico_verde_4.mp3",
        recordist: "Antonio de Almeida Correia Junior",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "Abelardo Luz, SC",
        type: "call",
        duration: 23.48,
        fmax: 5000,
      },
    ],
  },
  {
    name: "Tucanuçu",
    scientificName: "Ramphastos toco",
    family: "Ramphastidae",
    inatTaxonId: 18793,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/63281117/medium.jpg",
    photoCredit: "(c) Paul Steeves, some rights reserved (CC BY-NC), uploaded by Paul Steeves",
    sounds: [
      {
        // Seven deep croaks, about 10s of the 12s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1570179.wav",
        recordist: "Simón Pla García",
        license: "cc-by-nc",
        observation: 298329861,
        location: "Comandante Andresito, Argentina",
        type: "call",
        start: 2.15,
        end: 11.8,
        fmax: 4000,
      },
    ],
  },
  {
    name: "Tangará",
    scientificName: "Chiroxiphia caudata",
    family: "Pipridae",
    inatTaxonId: 14306,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/543496196/medium.jpg",
    photoCredit: "(c) drbrachydactyl, some rights reserved (CC BY-NC)",
    coa: { frequency: "Pouco comum", season: "Todo o ano" },
    sounds: [
      {
        // The whole 14s recording: a series of song notes
        source: "xenocanto",
        xc: 421721,
        audio:
          "https://xeno-canto.org/sounds/uploaded/LXKLWEDKEM/XC421721-Tangara2%20%28Chiroxiphia%20caudata-OK%29.mp3",
        recordist: "Jayrson Araujo de Oliveira",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Canela, RS",
        type: "song",
        duration: 14.33,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Urutau",
    scientificName: "Nyctibius griseus",
    family: "Nyctibiidae",
    inatTaxonId: 19667,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/508102028/medium.jpg",
    photoCredit:
      "(c) Gabriel Delasala, some rights reserved (CC BY-NC), uploaded by Gabriel Delasala",
    coa: { frequency: "Incomum", season: "Primavera/verão" },
    sounds: [
      {
        // One descending song, about 4s of the 10s recording
        source: "xenocanto",
        xc: 965190,
        audio: "https://xeno-canto.org/sounds/uploaded/KJBWVXYZZU/XC965190-Nyctibius_griseus.mp3",
        recordist: "Ademir Fick",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Mato Castelhano, RS",
        type: "song",
        start: 2.8,
        end: 7.2,
        fmax: 3000,
      },
    ],
  },
  {
    name: "Vira-folha",
    scientificName: "Sclerurus scansor",
    family: "Scleruridae",
    inatTaxonId: 11653,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/457840576/medium.jpeg",
    photoCredit: "(c) Don Marsille, some rights reserved (CC BY-NC), uploaded by Don Marsille",
    coa: { frequency: "Incomum", season: "Todo o ano" },
    sounds: [
      {
        // Eight sharp calls, about 14s of the 31s recording
        source: "xenocanto",
        xc: 174533,
        audio:
          "https://xeno-canto.org/sounds/uploaded/RIVNLYTULO/XC174533-VIRA%20FOLHA%20-%20SALVADOR%20DO%20SUL%20-%2027-03-13.mp3",
        recordist: "João Antônio de B. Vitto",
        license: "cc-by-nc-sa",
        licenseVersion: "4.0",
        location: "Salvador do Sul, RS",
        type: "call",
        start: 5.7,
        end: 19.8,
      },
    ],
  },
  {
    name: "Pitiguari",
    scientificName: "Cyclarhis gujanensis",
    family: "Vireonidae",
    inatTaxonId: 17421,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/71632226/medium.jpg",
    photoCredit:
      "(c) Oswaldo Hernández, some rights reserved (CC BY-NC), uploaded by Oswaldo Hernández",
    coa: { frequency: "Comum", season: "Todo o ano" },
    sounds: [
      {
        // Four song phrases, about 16s of the 20s recording
        source: "inaturalist",
        audio: "https://static.inaturalist.org/sounds/1213101.m4a",
        recordist: "inesavasconcelos",
        license: "cc-by-nc",
        observation: 244268540,
        location: "Porto Alegre, RS",
        type: "song",
        start: 3.4,
        end: 19.7,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Juruviara",
    scientificName: "Vireo chivi",
    family: "Vireonidae",
    inatTaxonId: 827395,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/510496062/medium.jpg",
    photoCredit: "(c) luizanjos, some rights reserved (CC BY-NC)",
    coa: { frequency: "Incomum", season: "Primavera/verão" },
    sounds: [
      {
        // A series of short song phrases, about 15s of the 29s recording
        source: "xenocanto",
        xc: 82501,
        audio: "https://xeno-canto.org/sounds/uploaded/DGVLLRYDXS/VIROLI11.mp3",
        recordist: "Jeremy Minns",
        license: "cc-by-nc-sa",
        licenseVersion: "3.0",
        location: "São Francisco de Paula, RS",
        type: "song",
        start: 0.75,
        end: 15.4,
        fmax: 8000,
      },
    ],
  },
];
