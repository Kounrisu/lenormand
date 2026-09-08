type Arg = number | string;
type Value = string | ((...args: Arg[]) => string);

interface Entry {
  readonly en: Value;
  readonly fr: Value;
}

export const I18N = {
  // Header
  'header.settings': { en: 'Settings', fr: 'Réglages' },
  'header.table': { en: '← Table', fr: '← Table' },
  'header.about': { en: 'Madame Lenormand', fr: 'Madame Lenormand' },
  'header.past': { en: 'Past', fr: 'Tirages' },
  'header.pastMore': { en: ' draws', fr: ' passés' },
  'header.newDeck': { en: 'New deck', fr: 'Nouveau jeu' },

  // Result sheet
  'result.atCut': {
    en: 'The Ring was waiting at the cut — a yes at once.',
    fr: 'L’Anneau attendait juste à la coupe — un oui immédiat.',
  },
  'result.ringPosition': {
    en: (n: Arg) => `The Ring came up ${n} cards in.`,
    fr: (n: Arg) => `L’Anneau est apparu à la carte ${n}.`,
  },
  'result.noRing': {
    en: 'The Ring stayed in the pack, under the first 13.',
    fr: 'L’Anneau est resté dans le paquet, sous les 13 premières.',
  },
  'result.yes': { en: 'Yes', fr: 'Oui' },
  'result.no': { en: 'No', fr: 'Non' },
  'result.back': { en: '← Back to the table', fr: '← Retour à la table' },

  // Question / home screen
  'question.title': { en: 'Yes or no?', fr: 'Oui ou non ?' },
  'question.lede.shuffling': {
    en: 'Hold the question. Don’t rush the shuffle.',
    fr: 'Garde ta question en tête. Ne bâcle pas le mélange.',
  },
  'question.lede.shuffled': {
    en: 'Shuffle again, split the pack yourself, or seek a yes or no.',
    fr: 'Mélange encore, coupe le jeu toi-même, ou cherche un oui ou non.',
  },
  'question.lede.idleFactory': {
    en: 'Hold a yes-or-no. Shuffle, or split the pack by hand, then seek.',
    fr: 'Garde un oui-ou-non en tête. Mélange, ou coupe le jeu à la main, puis cherche.',
  },
  'question.lede.idleNonFactory': {
    en: 'The pack is as you left it. Shuffle, split it yourself, or seek a yes or no — or start over with a new deck.',
    fr: 'Le jeu est comme tu l’as laissé. Mélange, coupe-le toi-même, ou cherche un oui ou non — ou repars avec un jeu neuf.',
  },
  'question.shuffle': { en: 'Shuffle', fr: 'Mélanger' },
  'question.shuffling': { en: 'Shuffling…', fr: 'Mélange…' },
  'question.or': { en: 'or', fr: 'ou' },
  'question.splitYourself': { en: 'Split it yourself', fr: 'Coupe-le toi-même' },
  'question.seek': { en: 'Seek a yes or no', fr: 'Chercher un oui ou non' },
  'question.writeDown': { en: 'Write the question down', fr: 'Écrire la question' },
  'question.yourQuestion': { en: 'Your question', fr: 'Ta question' },
  'question.placeholder': { en: 'Will it work out?', fr: 'Est-ce que ça va marcher ?' },
  'question.mixing.cut': { en: 'The top goes under.', fr: 'Le dessus passe dessous.' },
  'question.mixing.lay': { en: 'The pack spreads on the cloth.', fr: 'Le jeu s’étale sur le tapis.' },
  'question.mixing.spread': {
    en: 'Tap where you cut. The top goes under the rest.',
    fr: 'Touche l’endroit où tu coupes. Le dessus passe sous le reste.',
  },
  'question.asking.spread': { en: 'Tap the cut. That card answers.', fr: 'Touche la coupe. Cette carte répond.' },
  'question.backToPack': { en: 'Back to the pack', fr: 'Retour au paquet' },

  // Reading / deal
  'reading.atCut': { en: 'At the cut', fr: 'À la coupe' },
  'reading.cutNote': {
    en: (name: Arg) => `The cut was the ${name}.`,
    fr: (name: Arg) => `La coupe est tombée sur ${name}.`,
  },
  'reading.dealing': { en: 'Dealing', fr: 'Distribution' },
  'reading.turnAll': { en: 'Turn them all', fr: 'Tout retourner' },

  // History
  'history.title': { en: 'Past draws', fr: 'Tirages passés' },
  'history.loading': { en: 'Loading…', fr: 'Chargement…' },
  'history.error': { en: 'Couldn’t load past draws.', fr: 'Impossible de charger les tirages passés.' },
  'history.empty': { en: 'Nothing here yet. Shuffle the deck first.', fr: 'Rien ici pour l’instant. Mélange le jeu d’abord.' },
  'history.noQuestion': { en: 'No question written', fr: 'Aucune question écrite' },
  'history.ringAt': {
    en: (n: Arg) => `Ring at ${n} · `,
    fr: (n: Arg) => `Anneau à ${n} · `,
  },
  'history.back': { en: 'Back to the table', fr: 'Retour à la table' },

  // Looks / settings
  'looks.title': { en: 'Settings', fr: 'Réglages' },
  'looks.lede': {
    en: 'The back of the pack, the faces, and the cloth they sit on.',
    fr: 'Le dos du jeu, les faces, et le tapis sur lequel elles reposent.',
  },
  'looks.backsHeading': { en: 'Card backs', fr: 'Dos des cartes' },
  'looks.facesHeading': { en: 'Card faces', fr: 'Faces des cartes' },
  'looks.clothHeading': { en: 'Cloth', fr: 'Tapis' },
  'looks.languageHeading': { en: 'Language', fr: 'Langue' },
  'looks.english': { en: 'English', fr: 'Anglais' },
  'looks.french': { en: 'Français', fr: 'Français' },
  'looks.moreLater': { en: 'More later', fr: 'Bientôt plus' },
  'looks.newPack': { en: 'New pack', fr: 'Nouveau jeu' },
  'looks.backToTable': { en: 'Back to the table', fr: 'Retour à la table' },

  // About
  'about.back': { en: '← Table', fr: '← Table' },
  'about.crumb': { en: 'Madame Lenormand', fr: 'Madame Lenormand' },
  'about.kicker': {
    en: 'The pack, and the woman it was named for',
    fr: 'Le jeu, et la femme qui lui a donné son nom',
  },
  'about.title': { en: 'Marie-Anne Lenormand', fr: 'Marie-Anne Lenormand' },
  'about.lede': {
    en: 'A famous Paris reader, a Nuremberg parlour game, and thirty-six pictures that picked up her name after she was gone.',
    fr: 'Une célèbre cartomancienne parisienne, un jeu de salon de Nuremberg, et trente-six images qui ont pris son nom après sa mort.',
  },
  'about.whoTitle': { en: 'Who she was', fr: 'Qui elle était' },
  'about.who1': {
    en: 'Marie-Anne-Adélaïde Lenormand was born on 27 May 1772 in Alençon, in Normandy. Her father was a draper. She was orphaned young, sent to a convent school, and left for Paris as a teenager.',
    fr: 'Marie-Anne-Adélaïde Lenormand est née le 27 mai 1772 à Alençon, en Normandie. Son père était drapier. Orpheline très jeune, elle est envoyée dans un couvent, puis part pour Paris à l’adolescence.',
  },
  'about.who2': {
    en: 'She kept a bookseller’s shop at 5 rue de Tournon, in the faubourg Saint-Germain — a legal front, because fortune-telling was not. Under that sign she read ordinary French playing cards for a public that ran from actors to, so the stories go, Joséphine and the men of the Revolution. She never married. She died in Paris on 25 June 1843 and is buried at Père-Lachaise.',
    fr: 'Elle tient une librairie au 5 rue de Tournon, dans le faubourg Saint-Germain — une couverture légale, car la voyance ne l’était pas. Sous cette enseigne, elle lisait de simples cartes à jouer françaises pour un public allant des comédiens à, selon la légende, Joséphine et des hommes de la Révolution. Elle ne s’est jamais mariée. Elle est morte à Paris le 25 juin 1843 et repose au Père-Lachaise.',
  },
  'about.aside': {
    en: 'She was famous. She did not invent this pack.',
    fr: 'Elle était célèbre. Elle n’a pas inventé ce jeu.',
  },
  'about.gallery1': {
    en: 'Jeanne-Philiberte Ledoux, oil portrait, early 1800s',
    fr: 'Jeanne-Philiberte Ledoux, portrait à l’huile, début XIXe',
  },
  'about.gallery2': { en: '"The palmist Le Normand," 1827', fr: '« La chiromancienne Le Normand », 1827' },
  'about.gallery3': {
    en: 'Frontispiece of her memoir of the 1809 arrest, 1814',
    fr: 'Frontispice de ses mémoires sur l’arrestation de 1809, 1814',
  },
  'about.addressTitle': { en: 'Her address in Paris', fr: 'Son adresse à Paris' },
  'about.address1': {
    en: 'For about forty years she read cards at 5 rue de Tournon, a short walk from the Luxembourg Palace — the marker below sits on that address today.',
    fr: 'Pendant une quarantaine d’années, elle a lu les cartes au 5 rue de Tournon, à deux pas du palais du Luxembourg — le repère ci-dessous marque cette adresse aujourd’hui.',
  },
  'about.mapLink': { en: 'Open in Google Maps ↗', fr: 'Ouvrir dans Google Maps ↗' },
  'about.gameTitle': { en: 'Where the game started', fr: 'D’où vient le jeu' },
  'about.game1': {
    en: 'The thirty-six pictures on this table were drawn for a German parlour game, Das Spiel der Hofnung — The Game of Hope. Johann Kaspar Hechtel of Nuremberg designed it. Gustav Philipp Jakob Bieling printed it there around 1799 as a race game: you laid the cards in six rows of six and moved with dice. The same sheet could be used as a 36-card piquet pack. Hechtel died of smallpox that December, aged twenty-eight.',
    fr: 'Les trente-six images de cette table ont été dessinées pour un jeu de salon allemand, Das Spiel der Hofnung — le Jeu de l’Espoir. Johann Kaspar Hechtel, de Nuremberg, l’a conçu. Gustav Philipp Jakob Bieling l’a imprimé vers 1799 comme un jeu de parcours : on posait les cartes en six rangées de six et on avançait aux dés. La même planche pouvait servir de jeu de piquet à 36 cartes. Hechtel est mort de la variole en décembre de cette année-là, à vingt-huit ans.',
  },
  'about.game2': {
    en: 'The box already carried a French title as well as a German one. It was meant to travel. The faces in this game are crops of that 1799 sheet, now in the British Museum.',
    fr: 'La boîte portait déjà un titre français en plus du titre allemand. Elle était destinée à voyager. Les faces de ce jeu sont des extraits de cette planche de 1799, aujourd’hui conservée au British Museum.',
  },
  'about.nameTitle': { en: 'Why her name is on it', fr: 'Pourquoi son nom y est attaché' },
  'about.name1': {
    en: 'After she died, German publishers needed a name people already knew. Around 1846, J. F. August Reiff of Koblenz reissued Hechtel’s figures as the fortune-telling pack of "Mademoiselle Lenormand." The tale that a pack was found among her things is advertising. She had used plain playing cards.',
    fr: 'Après sa mort, des éditeurs allemands ont eu besoin d’un nom déjà connu du public. Vers 1846, J. F. August Reiff, à Coblence, a réédité les figures de Hechtel comme le jeu de divination de « Mademoiselle Lenormand ». L’histoire d’un jeu retrouvé parmi ses affaires n’est que publicité. Elle utilisait de simples cartes à jouer.',
  },
  'about.name2': {
    en: 'The Petit Lenormand stuck. French houses printed it later; the pictures spread through Europe and then much further. The yes-or-no on this table is a later French cut, not her salon trick — but it uses the same thirty-six.',
    fr: 'Le nom de Petit Lenormand est resté. Des maisons françaises l’ont imprimé plus tard ; les images se sont répandues à travers l’Europe, puis bien plus loin. Le oui-ou-non de cette table est une coupe française plus tardive, pas son tour de salon — mais il utilise les mêmes trente-six cartes.',
  },
  'about.cardsTitle': { en: 'The thirty-six', fr: 'Les trente-six' },
  'about.biggerPhotos': { en: 'Bigger photos', fr: 'Photos plus grandes' },
  'about.cardsHint': {
    en: 'Each card carries a small scene and a playing-card inset. The notes are ordinary table-talk, not a law.',
    fr: 'Chaque carte porte une petite scène et une carte à jouer en médaillon. Les notes sont du bavardage de table, pas une loi.',
  },
} as const satisfies Record<string, Entry>;

export type I18nKey = keyof typeof I18N;
