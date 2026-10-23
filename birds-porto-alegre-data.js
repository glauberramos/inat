// Aves de Porto Alegre: data for birds-porto-alegre.html.
//
// Birds are grouped by family (see BIRD_FAMILIES) and keep the order listed here
// within a family. Each sound is either:
//   { source: "inaturalist", audio: <file URL>, recordist, license, observation: <observation id> }
//   { source: "macaulay", ml: <ML number>, recordist: <the "©" name on the asset page>,
//     location: <where it was recorded, from the asset page: "City, UF", or just the state when that's all it gives> }
// plus an optional type: "song" (Canto, the default) or "call" (Chamado),
// optional start/end (seconds) to play and draw only part of the recording,
// and optional fmin/fmax (Hz, default 0 and 10000) to zoom the spectrogram in on the bird's pitch range.
// Macaulay Library (eBird/Merlin) audio is streamed from
// https://cdn.download.ams.birds.cornell.edu/api/v1/asset/<ml>/audio
//
// Spectrograms live in images/birds-porto-alegre/ (<iNat sound id>.webp or ml<ML number>.webp).
// After adding sounds, run: python3 scripts/bird-spectrograms.py

// Portuguese names for each bird's family (from iNaturalist), in taxonomic order as in
// field guides. The page groups birds by family in this order.
const BIRD_FAMILIES = {
  Cracidae: "Mutuns, jacus e aracuãs",
  Columbidae: "Pombos, rolas e rolinhas",
  Cuculidae: "Cucos e afins",
  Apodidae: "Andorinhões",
  Trochilidae: "Beija-flores",
  Rallidae: "Galinhas-d'água e afins",
  Charadriidae: "Batuíras, borrelhos, abibes e afins",
  Phalacrocoracidae: "Cormorões e biguás",
  Ardeidae: "Garças e socós",
  Threskiornithidae: "Colhereiros, íbises e afins",
  Cathartidae: "Condores e urubus",
  Accipitridae: "Gaviões, águias e afins", // iNaturalist's "Milhafres" is the European Portuguese name
  Alcedinidae: "Martins-pescadores",
  Picidae: "Pica-paus",
  Falconidae: "Falcões",
  Psittacidae: "Papagaios e periquitos",
  Furnariidae: "Joãos-de-barro, arapaçus e afins",
  Tyrannidae: "Tiranídeos",
  Hirundinidae: "Andorinhas",
  Troglodytidae: "Corruíras", // iNaturalist's "Carriças" is the European Portuguese name
  Turdidae: "Tordos, sabiás e afins",
  Mimidae: "Imitadores",
  Fringillidae: "Gaturamos, pintassilgos e afins", // iNaturalist's name lists European finches (tentilhões)
  Icteridae: "Iraúnas, graúnas, chupins e afins",
  Parulidae: "Mariquitas e pula-pulas",
  Thraupidae: "Tiês",
};

const BIRDS_PORTO_ALEGRE = [
  {
    name: "Quero-quero",
    scientificName: "Vanellus chilensis",
    family: "Charadriidae",
    inatTaxonId: 4867,
    photo: "https://static.inaturalist.org/photos/601222938/medium.jpg",
    photoCredit: "(c) Robin James, all rights reserved, uploaded by Robin James",
    sounds: [
      {
        // Duet, first bout only; the full recording is 18s
        source: "macaulay",
        ml: 663531498,
        recordist: "Jayrson Oliveira",
        location: "Taquaral de Goiás, GO",
        type: "song",
        start: 0.6,
        end: 9.6,
      },
      {
        // Nine spaced alarm calls, about 6s of the 1m06s recording
        source: "macaulay",
        ml: 661314527,
        recordist: "Ines Vasconcelos",
        location: "Porto Alegre, RS",
        type: "call",
        start: 27.3,
        end: 33.6,
        fmin: 1000,
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
    sounds: [
      {
        // First bout only; the full recording is 2m46s
        source: "macaulay",
        ml: 666858535,
        recordist: "Fernanda Fernandex",
        location: "Brasília, DF",
        type: "song",
        start: 2,
        end: 16,
        fmax: 5000,
      },
      {
        // First 2.5s only: five calls and a click; the full recording is 1m02s
        source: "macaulay",
        ml: 243801421,
        recordist: "Ciro Albano / Brazil Birding Experts",
        location: "Lençóis, BA",
        type: "call",
        start: 0,
        end: 2.55,
      },
    ],
  },
  {
    name: "Tapicuru",
    scientificName: "Phimosus infuscatus",
    family: "Threskiornithidae",
    inatTaxonId: 3736,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/417897827/medium.jpg",
    photoCredit: "(c) Bernard DUPONT, some rights reserved (CC BY-SA)",
    sounds: [
      {
        source: "macaulay",
        ml: 650562906,
        recordist: "Bruno Lima",
        location: "Peruíbe, SP",
        type: "call",
        start: 0.1,
        end: 2.4,
        fmax: 3000,
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
    sounds: [
      {
        source: "macaulay",
        ml: 264299561,
        recordist: "Luiz Matos",
        location: "Pompéu, MG",
        type: "song",
        start: 1,
        end: 6.8,
      },
      {
        // Seven calls, about 7s of the 2m03s recording
        source: "macaulay",
        ml: 19264,
        recordist: "William Belton",
        location: "Rio Grande do Sul",
        type: "call",
        start: 73,
        end: 79.8,
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
    sounds: [
      {
        // Skips the spoken intro; keeps ~6s of the 28s recording
        source: "macaulay",
        ml: 35592,
        recordist: "Ted Parker",
        location: "Mato Grosso",
        type: "call",
        start: 4,
        end: 9.9,
      },
      {
        // One bout of squawks, about 7s of the 35s recording
        source: "macaulay",
        ml: 643548272,
        recordist: "Ralph Hatt",
        location: "Rancharia, SP",
        type: "call",
        start: 9.05,
        end: 15.9,
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
    sounds: [
      {
        // First series of four coos only; the full recording is 29s
        source: "macaulay",
        ml: 512471441,
        recordist: "Celso Modesto Jr.",
        location: "Araraquara, SP",
        type: "song",
        start: 1.1,
        end: 5,
        fmax: 1200,
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
    sounds: [
      {
        source: "macaulay",
        ml: 535378771,
        recordist: "Pedro Diniz",
        location: "Brasília, DF",
        type: "song",
        start: 0.7,
        end: 4.2,
      },
      {
        // First three calls only; the full recording is 24s
        source: "macaulay",
        ml: 270369241,
        recordist: "Ana Luiza Catalano",
        location: "São Carlos, SP",
        type: "call",
        start: 0.85,
        end: 10.6,
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
    sounds: [
      {
        // Two full phrases; drops the cut-off third one at the end
        source: "macaulay",
        ml: 178691371,
        recordist: "Pedro Ayres",
        location: "Porto Alegre, RS",
        type: "song",
        start: 0.15,
        end: 6.6,
        fmax: 5000,
      },
      {
        // Six calls, 4s of the 33s recording
        source: "macaulay",
        ml: 656977099,
        recordist: "Jayrson Oliveira",
        location: "Uruguaiana, RS",
        type: "call",
        start: 20,
        end: 24,
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
    sounds: [
      {
        source: "macaulay",
        ml: 318253141,
        recordist: "Ricardo Mitidieri",
        location: "Niterói, RJ",
        type: "call",
        start: 0.7,
        end: 8.8,
      },
      {
        // Five croaks, about 7s of the 17s recording
        source: "macaulay",
        ml: 635067076,
        recordist: "Luis Weymar Junior",
        location: "Rio Grande, RS",
        type: "call",
        start: 7.4,
        end: 14.8,
        fmax: 5000,
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
    sounds: [
      {
        // First phrase only; skips the spoken intro and the rest of the 63s recording
        source: "macaulay",
        ml: 16487,
        recordist: "Rodman Ward",
        location: "Espírito Santo",
        type: "song",
        start: 8.4,
        end: 11.4,
      },
      {
        // First phrase only; the full recording is 18s
        source: "macaulay",
        ml: 373826921,
        recordist: "Arthur Gomes",
        location: "Campinas, SP",
        type: "song",
        start: 2.5,
        end: 6.3,
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
    sounds: [
      {
        // First four calls only; the full recording is 40s
        source: "macaulay",
        ml: 251677771,
        recordist: "Gabriel Bonfa",
        location: "Linhares, ES",
        type: "call",
        start: 3.9,
        end: 9.3,
      },
      {
        // The whole song of ten whistles; trims only the quiet edges of the 11s recording
        source: "macaulay",
        ml: 180187461,
        recordist: "Pedro Ayres",
        location: "Porto Alegre, RS",
        type: "song",
        start: 0.2,
        end: 11,
        fmin: 1000,
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
    photoCredit: "(c) Juan Cruzado Cortés, some rights reserved (CC BY), uploaded by Juan Cruzado Cortés",
    sounds: [
      {
        // First 6s of calls; the full recording is 53s
        source: "macaulay",
        ml: 484166891,
        recordist: "Victor Antonelli",
        location: "Botucatu, SP",
        type: "call",
        start: 0.55,
        end: 6.5,
      },
      {
        // The full rattle series; drops the last three notes of the 8s recording
        source: "macaulay",
        ml: 638016288,
        recordist: "Luis Weymar Junior",
        location: "Pelotas, RS",
        type: "call",
        start: 0,
        end: 6.5,
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
    sounds: [
      {
        source: "macaulay",
        ml: 612608911,
        recordist: "Fernanda Fernandex",
        location: "Brasília, DF",
        type: "song",
        start: 3,
        end: 8,
      },
      {
        // Second song bout only; skips the spoken intro and the rest of the 1m00s recording
        source: "macaulay",
        ml: 63582,
        recordist: "Paul A. Schwartz",
        location: "Rio Grande do Sul",
        type: "song",
        start: 15.5,
        end: 19.5,
      },
    ],
  },
  {
    name: "Saracura-do-mato",
    scientificName: "Aramides saracura",
    family: "Rallidae",
    inatTaxonId: 458,
    photo: "https://static.inaturalist.org/photos/38306077/medium.jpg",
    photoCredit: "(c) Eden Fontes, all rights reserved, uploaded by Eden Fontes",
    sounds: [
      {
        // First ~5s of the song; the full recording is 1m53s
        source: "macaulay",
        ml: 408793251,
        recordist: "Luiz Matos",
        location: "Rio Acima, MG",
        type: "song",
        start: 2.35,
        end: 7.45,
        fmax: 4000,
      },
      {
        // About 5s of a long call series; skips the spoken intro of the 2m13s recording
        source: "macaulay",
        ml: 229817,
        recordist: "Bret Whitney",
        location: "Paraná",
        type: "call",
        start: 21.55,
        end: 26.5,
        fmax: 6000,
      },
    ],
  },
  {
    name: "Cambacica",
    scientificName: "Coereba flaveola",
    family: "Thraupidae",
    inatTaxonId: 10199,
    photo: "https://static.inaturalist.org/photos/207544720/medium.jpg",
    photoCredit: "(c) Mason Maron, all rights reserved, uploaded by Mason Maron",
    sounds: [
      {
        // First song only; skips the spoken intro and the rest of the 3m40s recording
        source: "macaulay",
        ml: 110066,
        recordist: "Matthew D. Medler",
        location: "Mato Grosso",
        type: "song",
        start: 9.15,
        end: 10.95,
      },
      {
        // First nine calls; the full recording is 20s
        source: "macaulay",
        ml: 296707781,
        recordist: "Ricardo Mitidieri",
        location: "Niterói, RJ",
        type: "call",
        start: 0.3,
        end: 5.35,
        fmin: 4000,
        fmax: 11000,
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
    sounds: [
      {
        // First song only; the full recording is 2m12s
        source: "macaulay",
        ml: 354049511,
        recordist: "Guilherme Willrich",
        location: "Florianópolis, SC",
        type: "song",
        start: 1.55,
        end: 4.6,
      },
      {
        // One rattle, about 1.5s of the 49s recording
        source: "macaulay",
        ml: 20181,
        recordist: "William Belton",
        location: "Rio Grande do Sul",
        type: "call",
        start: 41.72,
        end: 43.2,
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
    sounds: [
      {
        // First ~5s of the song; skips the spoken intro
        source: "macaulay",
        ml: 39142,
        recordist: "Ted Parker",
        location: "São Roque de Minas, MG",
        type: "song",
        start: 3.8,
        end: 9.2,
      },
      {
        // One 'kew' and a 'wicka' duet bout, about 4s of the 30s recording
        source: "macaulay",
        ml: 614811985,
        recordist: "Luis Weymar Junior",
        location: "Pelotas, RS",
        type: "call",
        start: 15.4,
        end: 19.6,
      },
    ],
  },
  {
    name: "Biguá",
    scientificName: "Nannopterum brasilianum",
    family: "Phalacrocoracidae",
    inatTaxonId: 1289601,
    photo: "https://static.inaturalist.org/photos/48364706/medium.jpg",
    photoCredit:
      "(c) Luis Mauricio Mena Páramo, all rights reserved, uploaded by Luis Mauricio Mena Páramo",
    sounds: [
      {
        source: "macaulay",
        ml: 651140148,
        recordist: "Felipe Gulin - Observatório Alado",
        location: "Peruíbe, SP",
        type: "call",
        start: 0.1,
        end: 3,
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
    sounds: [
      {
        // First series only; the full recording is 57s
        source: "macaulay",
        ml: 458200071,
        recordist: "Filipe Bernardi",
        location: "Caxias do Sul, RS",
        type: "call",
        start: 0.75,
        end: 4.8,
      },
      {
        // One squabble of hisses and grunts, about 4s of the 14s recording
        source: "macaulay",
        ml: 662937244,
        recordist: "Jayrson Oliveira",
        location: "Santa Rita do Novo Destino, GO",
        type: "call",
        start: 5.5,
        end: 9.6,
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
    sounds: [
      {
        source: "macaulay",
        ml: 650388325,
        recordist: "Luiz Silva",
        location: "Laguna, SC",
        type: "call",
        start: 1.45,
        end: 5.15,
        fmax: 5000,
      },
    ],
  },
  {
    name: "Beija-flor-dourado",
    scientificName: "Hylocharis chrysura",
    family: "Trochilidae",
    inatTaxonId: 5979,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/407947064/medium.jpg",
    photoCredit: "(c) Leonardo Quintana, some rights reserved (CC BY-NC), uploaded by Leonardo Quintana",
    sounds: [
      {
        // First bout only; the full recording is 29s
        source: "macaulay",
        ml: 608389854,
        recordist: "Guillermo Andreo",
        location: "Porto Alegre, RS",
        type: "song",
        start: 0.8,
        end: 5.1,
        fmin: 6500,
        fmax: 10500,
      },
      {
        // About 4s of buzzy calls from the 15s recording
        source: "macaulay",
        ml: 621305662,
        recordist: "Ines Vasconcelos",
        location: "Porto Alegre, RS",
        type: "call",
        start: 8.2,
        end: 12.08,
        fmin: 3000,
        fmax: 11000,
      },
    ],
  },
  {
    name: "Pomba-asa-branca",
    scientificName: "Patagioenas picazuro",
    family: "Columbidae",
    inatTaxonId: 3102,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/48616256/medium.jpeg",
    photoCredit: "(c) Pablo Balduvino, some rights reserved (CC BY-NC), uploaded by Pablo Balduvino",
    sounds: [
      {
        // Opening coo and the first two phrases; the full recording is 58s
        source: "macaulay",
        ml: 246823981,
        recordist: "Rodrigo Dela Rosa",
        location: "São José dos Campos, SP",
        type: "song",
        start: 1.75,
        end: 7.55,
        fmax: 1200,
      },
      {
        // Two growls, about 4s of the 1m02s recording
        source: "macaulay",
        ml: 282182291,
        recordist: "Caio Brito | Brazil Birding Experts",
        location: "Divino de São Lourenço, ES",
        type: "call",
        start: 39.7,
        end: 43.6,
        fmax: 1500,
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
    sounds: [
      {
        // First four calls; the full recording is 19s
        source: "macaulay",
        ml: 203897291,
        recordist: "Josep del Hoyo",
        location: "Lagoa da Confusão, TO",
        type: "call",
        start: 1.15,
        end: 6.8,
      },
      {
        // About 7s of flock chatter from the 35s recording
        source: "macaulay",
        ml: 308717581,
        recordist: "Carlos Otávio Gussoni",
        location: "Rio Claro, SP",
        type: "call",
        start: 24.1,
        end: 31.4,
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
    sounds: [
      {
        // First section only; skips the spoken intro and the rest of the 4m56s recording
        source: "macaulay",
        ml: 103200,
        recordist: "Matthew D. Medler",
        location: "Mato Grosso",
        type: "call",
        start: 6.2,
        end: 9.3,
      },
      {
        // Whistled chatter and squawks of a passing flock, 3.5s to 10.9s of the 12s recording
        source: "macaulay",
        ml: 152821451,
        recordist: "Marcelo Feliti",
        location: "Brotas, SP",
        type: "song",
        start: 3.5,
        end: 10.9,
      },
    ],
  },
  {
    name: "Suiriri",
    scientificName: "Tyrannus melancholicus",
    family: "Tyrannidae",
    inatTaxonId: 16787,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/254986834/medium.jpg",
    photoCredit: "(c) Steven Mlodinow, some rights reserved (CC BY-NC), uploaded by Steven Mlodinow",
    sounds: [
      {
        // First complete phrase (the recording opens mid-phrase); the full recording is 3m38s
        source: "macaulay",
        ml: 484562401,
        recordist: "Fernanda Fernandex",
        location: "Brasília, DF",
        type: "call",
        start: 1.3,
        end: 3.1,
        fmin: 3500,
        fmax: 7500,
      },
      {
        // Two short calls, about 3s of the 35s recording
        source: "macaulay",
        ml: 178145,
        recordist: "Natxo Areta",
        location: "Bom Jesus, RS",
        type: "call",
        start: 12.95,
        end: 16.3,
        fmin: 2500,
        fmax: 8000,
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
    photoCredit: "(c) marcelo_allende, some rights reserved (CC BY-NC), uploaded by marcelo_allende",
    sounds: [
      {
        // First bout of twittering; the full recording is 26s
        source: "macaulay",
        ml: 231688261,
        recordist: "Nick Athanas",
        location: "Guaramiranga, CE",
        type: "call",
        end: 2.35,
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
    sounds: [
      {
        // First 5.5s; the full recording is 54s
        source: "macaulay",
        ml: 152822611,
        recordist: "Marcelo Feliti",
        location: "Brotas, SP",
        type: "song",
        end: 5.5,
      },
      {
        // One bout of twittering calls, about 3s of the 23s recording
        source: "macaulay",
        ml: 634915515,
        recordist: "Grace Oliver",
        location: "Guarulhos, SP",
        type: "call",
        start: 16.82,
        end: 19.9,
        fmin: 2000,
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
    sounds: [
      {
        // First full song; skips the spoken intro and the rest of the 2m40s recording
        source: "macaulay",
        ml: 127497,
        recordist: "Curtis Marantz",
        location: "Amazonas",
        type: "song",
        start: 8.4,
        end: 11.25,
      },
      {
        // One song; the full recording is 14s
        source: "macaulay",
        ml: 181532661,
        recordist: "Pedro Ayres",
        location: "Porto Alegre, RS",
        type: "song",
        start: 3.85,
        end: 6.05,
      },
    ],
  },
  {
    name: "Sabiá-barranco",
    scientificName: "Turdus leucomelas",
    family: "Turdidae",
    inatTaxonId: 12737,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/416376009/medium.jpg",
    photoCredit: "(c) Luciano Bernardes, some rights reserved (CC BY-NC), uploaded by Luciano Bernardes",
    sounds: [
      {
        // First 2.5s of harsh calls; the full recording is 1m23s
        source: "macaulay",
        ml: 244630151,
        recordist: "Ciro Albano / Brazil Birding Experts",
        location: "Lençóis, BA",
        type: "call",
        end: 2.5,
      },
      {
        // First 4s of whistles; the full recording is 45s
        source: "macaulay",
        ml: 203895121,
        recordist: "Josep del Hoyo",
        location: "Parauapebas, PA",
        type: "call",
        end: 4,
        fmax: 4000,
      },
    ],
  },
  {
    name: "Besourinho-de-bico-vermelho",
    scientificName: "Chlorostilbon lucidus",
    family: "Trochilidae",
    inatTaxonId: 6085,
    photo: "https://static.inaturalist.org/photos/251801157/medium.jpg",
    photoCredit: "(c) Alenilson, all rights reserved, uploaded by Alenilson",
    sounds: [
      {
        // First ~5s of chips; the full recording is 25s
        source: "macaulay",
        ml: 641406045,
        recordist: "Marcelo Telles",
        location: "Cavalcante, GO",
        type: "call",
        end: 5.15,
      },
      {
        // First song bout, 7s to 11.7s of the 40s recording
        source: "macaulay",
        ml: 112683861,
        recordist: "Arthur Gomes",
        location: "Rio Claro, SP",
        type: "song",
        start: 7,
        end: 11.7,
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
    sounds: [
      {
        // 2.5s to 7.5s of the 37s recording
        source: "macaulay",
        ml: 661203279,
        recordist: "Ralph Hatt",
        location: "Rancharia, SP",
        type: "song",
        start: 2.5,
        end: 7.5,
      },
      {
        // One group chorus, about 6s of the 1m03s recording
        source: "macaulay",
        ml: 650497238,
        recordist: "Lucas Figueiredo Irion",
        location: "Florianópolis, SC",
        type: "song",
        start: 47.95,
        end: 54.25,
      },
    ],
  },
  {
    name: "Saracura-sanã",
    scientificName: "Pardirallus nigricans",
    family: "Rallidae",
    inatTaxonId: 297,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/532685404/medium.jpg",
    photoCredit: "(c) eduardovieira17, some rights reserved (CC BY-NC), uploaded by eduardovieira17",
    sounds: [
      {
        // First 5s of the 9.6s recording
        source: "macaulay",
        ml: 297074321,
        recordist: "LAERTE CARDIM",
        location: "Salesópolis, SP",
        type: "song",
        end: 5,
        fmax: 6000,
      },
      {
        // Five calls, about 6s of the 1m01s recording
        source: "macaulay",
        ml: 323816731,
        recordist: "Fernando Farias | Brazil Birding Experts",
        location: "Florianópolis, SC",
        type: "call",
        start: 3.9,
        end: 10.1,
        fmax: 5000,
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
    sounds: [
      {
        // First 10s of the 1m02s recording
        source: "macaulay",
        ml: 290020561,
        recordist: "Guilherme Melo",
        location: "Bom Jesus, RS",
        type: "song",
        end: 10,
      },
      {
        // About 5s of the 1m27s duet
        source: "macaulay",
        ml: 623644994,
        recordist: "Guillermo Andreo",
        location: "Viamão, RS",
        type: "song",
        start: 17.75,
        end: 23,
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
    sounds: [
      {
        source: "macaulay",
        ml: 638240357,
        recordist: "Fabricio Grigolin",
        location: "Curitiba, PR",
        type: "song",
        start: 0.95,
        end: 5.45,
        fmax: 6000,
      },
      {
        // One call, 2.75s to 6.3s of the 11s recording
        source: "macaulay",
        ml: 171905291,
        recordist: "Paulo Krieser",
        location: "Porto Alegre, RS",
        type: "call",
        start: 2.75,
        end: 6.3,
        fmax: 8000,
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
    sounds: [
      {
        source: "macaulay",
        ml: 616490414,
        recordist: "Simon Mitchell",
        location: "Poconé, MT",
        type: "song",
        start: 0.75,
        end: 4.65,
        fmax: 5000,
      },
      {
        // Last two calls; the full recording is 18s
        source: "macaulay",
        ml: 637335955,
        recordist: "Guillermo Andreo",
        location: "Porto Alegre, RS",
        type: "call",
        start: 15.3,
        end: 17.9,
        fmin: 1000,
      },
    ],
  },
  {
    name: "Rolinha-roxa",
    scientificName: "Columbina talpacoti",
    family: "Columbidae",
    inatTaxonId: 3580,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/402007805/medium.jpg",
    photoCredit: "(c) eduardovieira17, some rights reserved (CC BY-NC), uploaded by eduardovieira17",
    sounds: [
      {
        // Five coos, up to 5s of the 20s recording
        source: "macaulay",
        ml: 226759621,
        recordist: "Nick Athanas",
        location: "Cachoeiras de Macacu, RJ",
        type: "song",
        start: 0.35,
        end: 5,
        fmax: 1200,
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
    sounds: [
      {
        // Three coos, 4s to 13.5s of the 16s recording
        source: "macaulay",
        ml: 203897401,
        recordist: "Josep del Hoyo",
        location: "Lagoa da Confusão, TO",
        type: "song",
        start: 4,
        end: 13.5,
        fmin: 200, // drops a low hum
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
    sounds: [
      {
        // First series of coos only; the full recording is 44s
        source: "macaulay",
        ml: 628659591,
        recordist: "Jerffson Gomes",
        location: "Quixadá, CE",
        type: "song",
        start: 2,
        end: 7.8,
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
    sounds: [
      {
        // Three coos, up to 11s of the 26s recording
        source: "macaulay",
        ml: 622578730,
        recordist: "Guilherme Melo",
        location: "Vitória do Xingu, PA",
        type: "song",
        end: 11,
        fmin: 200, // drops a low hum
        fmax: 1200,
      },
    ],
  },
  {
    name: "Pica-pau-verde-barrado",
    scientificName: "Colaptes melanochloros",
    family: "Picidae",
    inatTaxonId: 18250,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/171007754/medium.jpeg",
    photoCredit: "(c) Gustavo Fernando Durán, some rights reserved (CC BY-NC-SA), uploaded by Gustavo Fernando Durán",
    sounds: [
      {
        // Recorded in Porto Alegre; the whole 4s recording, eight notes
        source: "macaulay",
        ml: 185513401,
        recordist: "Pedro Ayres",
        location: "Porto Alegre, RS",
        type: "song",
        end: 4,
      },
      {
        // Recorded in Porto Alegre; five calls, about 5.5s of the 12s recording
        source: "macaulay",
        ml: 175835881,
        recordist: "Pedro Ayres",
        location: "Porto Alegre, RS",
        type: "call",
        start: 0.1,
        end: 5.7,
        fmin: 600,
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
    sounds: [
      {
        // First four calls only; the full recording is 1m24s
        source: "macaulay",
        ml: 332027481,
        recordist: "Fernando Farias | Brazil Birding Experts",
        location: "Florianópolis, SC",
        type: "call",
        start: 0.3,
        end: 3.3,
      },
      {
        // First two bursts of the chorus, about 5s of the 10s recording
        source: "macaulay",
        ml: 163569061,
        recordist: "Luis Weymar Junior",
        location: "Pelotas, RS",
        type: "song",
        start: 0,
        end: 4.82,
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
    sounds: [
      {
        // First four coos, about 4.5s of the 65s recording
        source: "macaulay",
        ml: 627104332,
        recordist: "Celso Modesto Jr.",
        location: "Araraquara, SP",
        type: "song",
        start: 0.2,
        end: 4.7,
        fmax: 1500, // the coo is very low
      },
    ],
  },
  {
    name: "Garça-branca-pequena",
    scientificName: "Egretta thula",
    family: "Ardeidae",
    inatTaxonId: 4940,
    photo: "https://static.inaturalist.org/photos/107527504/medium.jpeg",
    photoCredit: "(c) Juan Miguel Artigas Azas, all rights reserved, uploaded by Juan Miguel Artigas Azas",
    sounds: [
      {
        // First croaks, about 3s of the 18s recording
        source: "macaulay",
        ml: 646217871,
        recordist: "Vinícius Domingues",
        location: "Rio Grande, RS",
        type: "call",
        start: 0,
        end: 3.3,
      },
    ],
  },
  {
    name: "Alma-de-gato",
    scientificName: "Piaya cayana",
    family: "Cuculidae",
    inatTaxonId: 1758,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/59994525/medium.jpg",
    photoCredit: "(c) Roberto González, some rights reserved (CC BY-NC), uploaded by Roberto González",
    sounds: [
      {
        // First six notes, about 5s of the 24s recording
        source: "macaulay",
        ml: 276788081,
        recordist: "Ricardo Mitidieri",
        location: "Niterói, RJ",
        type: "song",
        start: 0.2,
        end: 5.1,
      },
      {
        // Two calls, about 4s of the 28s recording
        source: "macaulay",
        ml: 644555810,
        recordist: "Vinícius Domingues",
        location: "Rio Grande, RS",
        type: "call",
        start: 1.7,
        end: 5.7,
        fmin: 300,
      },
    ],
  },
  {
    name: "Gavião-carijó",
    scientificName: "Rupornis magnirostris",
    family: "Accipitridae",
    inatTaxonId: 201041,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/395917812/medium.jpeg",
    photoCredit: "(c) floris_heemskerk, some rights reserved (CC BY-NC), uploaded by floris_heemskerk",
    sounds: [
      {
        // First scream only; the full recording is 3m09s
        source: "macaulay",
        ml: 663063630,
        recordist: "Guilherme Melo",
        location: "Guaraqueçaba, PR",
        type: "call",
        start: 1.6,
        end: 3.1,
      },
      {
        // One laughing series, about 4.5s of the 44s recording
        source: "macaulay",
        ml: 19866,
        recordist: "William Belton",
        location: "Rio Grande do Sul",
        type: "call",
        start: 16.6,
        end: 21.05,
      },
    ],
  },
  {
    name: "Sabiá-do-campo",
    scientificName: "Mimus saturninus",
    family: "Mimidae",
    inatTaxonId: 14878,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/197389027/medium.jpg",
    photoCredit: "(c) Quentin Vandemoortele, some rights reserved (CC BY-NC), uploaded by Quentin Vandemoortele",
    sounds: [
      {
        // First phrase only; the full recording is 31s
        source: "macaulay",
        ml: 229295801,
        recordist: "Pedro Ayres",
        location: "Porto Alegre, RS",
        type: "song",
        end: 1.85,
        fmin: 1000, // drops low rumble
        fmax: 5000,
      },
      {
        // One scolding series, about 3s of the 41s recording
        source: "macaulay",
        ml: 19593,
        recordist: "William Belton",
        location: "Rio Grande do Sul",
        type: "call",
        start: 13.2,
        end: 15.9,
        fmin: 1000,
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
    sounds: [
      {
        // First scream only; the full recording is 38s
        source: "macaulay",
        ml: 305067591,
        recordist: "Ciro Albano / Brazil Birding Experts",
        location: "Uruçuca, BA",
        type: "call",
        start: 0.6,
        end: 2,
      },
    ],
  },
  {
    name: "Martim-pescador-verde",
    scientificName: "Chloroceryle amazona",
    family: "Alcedinidae",
    inatTaxonId: 2679,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/170123283/medium.jpeg",
    photoCredit: "(c) Estación Biológica Las Guacamayas, some rights reserved (CC BY-NC), uploaded by Estación Biológica Las Guacamayas",
    sounds: [
      {
        // Whistles and the start of the rattle, 3s of the 63s recording
        source: "macaulay",
        ml: 293310,
        recordist: "Peter Boesman",
        location: "Ubatuba, SP",
        type: "song",
        start: 29,
        end: 32,
      },
      {
        // The whole 4s recording: spaced tick calls with a short burst in the middle
        source: "macaulay",
        ml: 608297858,
        recordist: "Brian Sullivan",
        location: "Iranduba, AM",
        type: "call",
        start: 0,
        end: 4.1,
        fmin: 1000,
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
    sounds: [
      {
        // First phrase only, after the spoken introduction; the full recording is 27s
        source: "macaulay",
        ml: 19963,
        recordist: "William Belton",
        location: "Rio Grande do Sul",
        type: "song",
        start: 4.1,
        end: 5.6,
        fmin: 1500, // drops low tape rumble
        fmax: 9500,
      },
      {
        // About 4s of birds singing together; the full recording is 22s
        source: "macaulay",
        ml: 656625162,
        recordist: "Jayrson Oliveira",
        location: "Bagé, RS",
        type: "song",
        start: 6.15,
        end: 10.25,
        fmin: 1500,
      },
    ],
  },
  {
    name: "Sabiá-poca",
    scientificName: "Turdus amaurochalinus",
    family: "Turdidae",
    inatTaxonId: 12710,
    photo: "https://static.inaturalist.org/photos/49252238/medium.jpg",
    photoCredit: "(c) Mariano Ordoñez, all rights reserved, uploaded by Mariano Ordoñez",
    sounds: [
      {
        // About 10s from where the song starts; the full recording is 2m36s
        source: "macaulay",
        ml: 645154741,
        recordist: "Fernanda Fernandex",
        location: "Brasília, DF",
        type: "song",
        start: 2,
        end: 12.15,
        fmax: 5000,
      },
      {
        // Four 'pok' calls (one doubled), about 6s of the 29s recording
        source: "macaulay",
        ml: 631044656,
        recordist: "Jerffson Gomes",
        location: "Quixadá, CE",
        type: "call",
        start: 0.6,
        end: 6.4,
        fmax: 6000,
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
    sounds: [
      {
        // First two "fim-fim" pairs, four notes, of the 9s recording
        source: "macaulay",
        ml: 611669712,
        recordist: "Daniel Alfenas",
        location: "Cabreúva, SP",
        type: "call",
        start: 0.8,
        end: 4.55,
        fmin: 1500, // drops low background noise
        fmax: 8500,
      },
      {
        // Two song bursts, about 7s of the 1m40s recording
        source: "macaulay",
        ml: 25432,
        recordist: "William Belton",
        location: "Rio Grande do Sul",
        type: "song",
        start: 28.5,
        end: 35.05,
        fmin: 1000,
      },
    ],
  },
  {
    name: "Mariquita",
    scientificName: "Setophaga pitiayumi",
    family: "Parulidae",
    inatTaxonId: 145234,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/115454163/medium.jpg",
    photoCredit: "(c) Oswaldo Hernández, some rights reserved (CC BY-NC), uploaded by Oswaldo Hernández",
    sounds: [
      {
        // Second song only; the full recording is 2m58s
        source: "macaulay",
        ml: 19869,
        recordist: "William Belton",
        location: "Rio Grande do Sul",
        type: "song",
        start: 13.9,
        end: 16.5,
        fmin: 3000, // drops other birds and noise below the song
        fmax: 9500,
      },
      {
        // One song, under 2s of the 1m53s recording
        source: "macaulay",
        ml: 488981051,
        recordist: "Mateus Gonçalves",
        location: "Vitória da Conquista, BA",
        type: "song",
        start: 12.8,
        end: 14.5,
        fmin: 2000,
      },
    ],
  },
  {
    name: "Beija-flor-tesoura",
    scientificName: "Eupetomena macroura",
    family: "Trochilidae",
    inatTaxonId: 6065,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/586765879/medium.jpg",
    photoCredit: "(c) Mauricio Mercadante, some rights reserved (CC BY-NC-SA), uploaded by Mauricio Mercadante",
    sounds: [
      {
        // First 16 chips, under 5s of the 51s recording
        source: "macaulay",
        ml: 203959231,
        recordist: "Tomaz Melo",
        location: "Jacareí, SP",
        type: "call",
        start: 0.15,
        end: 4.8,
        fmin: 2000,
        fmax: 9000,
      },
      {
        // Four song notes, about 5s of the 4m16s recording
        source: "macaulay",
        ml: 109938,
        recordist: "Matthew D. Medler",
        location: "Mato Grosso",
        type: "song",
        start: 5.7,
        end: 10.9,
        fmin: 3000,
        fmax: 11000,
      },
    ],
  },
  {
    name: "Saracura-três-potes",
    scientificName: "Aramides cajaneus",
    family: "Rallidae",
    inatTaxonId: 513889,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/455464195/medium.jpg",
    photoCredit: "(c) eduardovieira17, some rights reserved (CC BY-NC), uploaded by eduardovieira17",
    sounds: [
      {
        // Opening note and eight pairs, about 8s of the 43s recording
        source: "macaulay",
        ml: 627800610,
        recordist: "Arthur Gomes",
        location: "Guaramiranga, CE",
        type: "song",
        start: 1.2,
        end: 9.4,
      },
      {
        // Bursts of harsh 'kek' calls, the first 6s of the 10s recording
        source: "macaulay",
        ml: 610927580,
        recordist: "Celso Modesto Jr.",
        location: "Araraquara, SP",
        type: "call",
        start: 0,
        end: 5.7,
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
    sounds: [
      {
        // First four songs, about 7s of the 40s recording
        source: "macaulay",
        ml: 609094067,
        recordist: "Luis Roberto da Silva",
        location: "São Paulo, SP",
        type: "song",
        start: 0.3,
        end: 7.6,
        fmin: 1500, // drops low background noise
      },
      {
        // One call, 1.5s of the 52s recording
        source: "macaulay",
        ml: 19520,
        recordist: "William Belton",
        location: "Rio Grande do Sul",
        type: "call",
        start: 36.35,
        end: 37.85,
        fmin: 1500,
        fmax: 8000,
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
    sounds: [
      {
        // First two bouts of the 14s recording
        source: "macaulay",
        ml: 622578602,
        recordist: "Guilherme Melo",
        location: "Altamira, PA",
        type: "call",
        start: 1.2,
        end: 5.6,
        fmin: 2000, // drops low background noise
      },
      {
        // Two thin whistles with soft notes, about 6s of the 25s recording
        source: "macaulay",
        ml: 652306916,
        recordist: "Luis Weymar Junior",
        location: "Capão do Leão, RS",
        type: "call",
        start: 1.95,
        end: 7.65,
        fmin: 3000,
      },
    ],
  },
  {
    name: "Pula-pula-assobiador",
    scientificName: "Myiothlypis leucoblephara",
    family: "Parulidae",
    inatTaxonId: 201224,
    photo: "https://inaturalist-open-data.s3.amazonaws.com/photos/179298338/medium.jpg",
    photoCredit: "(c) Luciano Bernardes, some rights reserved (CC BY-NC), uploaded by Luciano Bernardes",
    sounds: [
      {
        // First song only, between calls; the full recording is 43s
        source: "macaulay",
        ml: 619502506,
        recordist: "Guillermo Andreo",
        location: "Porto Alegre, RS",
        type: "song",
        start: 21.4,
        end: 25.12,
        fmin: 2000,
        fmax: 8000,
      },
      {
        // Three calls, about 7s of the 15s recording, before the song
        source: "macaulay",
        ml: 159855471,
        recordist: "Pedro Ayres",
        location: "Porto Alegre, RS",
        type: "call",
        start: 1.1,
        end: 7.8,
        fmin: 2000,
      },
    ],
  },
  {
    name: "Quete-do-sul",
    scientificName: "Microspingus cabanisi",
    family: "Thraupidae",
    inatTaxonId: 558562,
    photo: "https://static.inaturalist.org/photos/93995721/medium.jpeg",
    photoCredit: "(c) Arthur Alves, all rights reserved, uploaded by Arthur Alves",
    sounds: [
      {
        // One full song, under 6s of the 2m recording
        source: "macaulay",
        ml: 67588,
        recordist: "Paul A. Schwartz",
        location: "Rio Grande do Sul",
        type: "song",
        start: 97.8,
        end: 103.5,
        fmin: 1500,
      },
      {
        // About 5s of 'tsip' calls from the 1m31s recording
        source: "macaulay",
        ml: 90125,
        recordist: "William Belton",
        location: "Rio Grande do Sul",
        type: "call",
        start: 4.42,
        end: 9.1,
        fmin: 1500,
      },
    ],
  },
  {
    name: "Trinca-ferro",
    scientificName: "Saltator similis",
    family: "Thraupidae",
    inatTaxonId: 9861,
    photo: "https://static.inaturalist.org/photos/51081666/medium.jpg",
    photoCredit: "(c) Mariano Ordoñez, all rights reserved, uploaded by Mariano Ordoñez",
    sounds: [
      {
        // Second phrase only, the loudest; the full recording is 17s
        source: "macaulay",
        ml: 178085061,
        recordist: "Pedro Ayres",
        location: "Porto Alegre, RS",
        type: "song",
        start: 7.7,
        end: 10.1,
      },
    ],
  },
];
