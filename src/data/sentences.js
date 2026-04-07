// Sentence bank for Mode 2 (translation practice)
// Shape: { id, verb, tense, en, pt, alternatives? }
// `alternatives` holds additional accepted Portuguese answers (e.g. with explicit subject pronoun)
// `tense` is "presente" for all current entries except where noted.

export const SENTENCES = [
  // MODAL
  { id: "m1", verb: "dever", tense: "presente", en: "You must arrive early.", pt: "Deves chegar cedo." },
  { id: "m2", verb: "dever", tense: "presente", en: "We must go home.", pt: "Devemos ir para casa." },
  { id: "m3", verb: "poder", tense: "presente", en: "Can I help?", pt: "Posso ajudar?" },
  { id: "m4", verb: "poder", tense: "presente", en: "They can stay here.", pt: "Eles podem ficar aqui.", alternatives: ["Podem ficar aqui."] },
  { id: "m5", verb: "querer", tense: "presente", en: "He wants to leave now.", pt: "Ele quer sair agora.", alternatives: ["Quer sair agora."] },
  { id: "m6", verb: "querer", tense: "presente", en: "Do you want to eat?", pt: "Queres comer?" },
  { id: "m7", verb: "poder", tense: "presente", en: "I can speak Portuguese.", pt: "Consigo falar português.", alternatives: ["Posso falar português."] },
  { id: "m8", verb: "dever", tense: "presente", en: "She must read the book.", pt: "Ela deve ler o livro.", alternatives: ["Deve ler o livro."] },

  // IMPERSONAL
  { id: "i1", verb: "chover", tense: "presente", en: "It rains a lot in Portugal.", pt: "Chove muito em Portugal." },
  { id: "i2", verb: "acontecer", tense: "presente", en: "It happens frequently.", pt: "Acontece frequentemente." },
  { id: "i3", verb: "haver", tense: "presente", en: "There are two people.", pt: "Há duas pessoas." },
  { id: "i4", verb: "haver", tense: "presente", en: "For two years.", pt: "Há dois anos." },
  { id: "i5", verb: "chover", tense: "passado", en: "It was raining yesterday.", pt: "Chovia ontem." },

  // MOVEMENT
  { id: "mv1", verb: "ir", tense: "presente", en: "I'm going to the supermarket.", pt: "Vou ao supermercado." },
  { id: "mv2", verb: "ir", tense: "presente", en: "Are you going to school?", pt: "Vais à escola?" },
  { id: "mv3", verb: "vir", tense: "presente", en: "They come from Lisbon.", pt: "Vêm de Lisboa.", alternatives: ["Eles vêm de Lisboa."] },
  { id: "mv4", verb: "vir", tense: "presente", en: "She comes tomorrow.", pt: "Ela vem amanhã.", alternatives: ["Vem amanhã."] },
  { id: "mv5", verb: "sair", tense: "presente", en: "I leave home at 8.", pt: "Saio de casa às 8." },
  { id: "mv6", verb: "partir", tense: "presente", en: "We're leaving for Brazil.", pt: "Partimos para o Brasil." },
  { id: "mv7", verb: "chegar", tense: "presente", en: "He arrives at 9.", pt: "Ele chega às 9.", alternatives: ["Chega às 9."] },
  { id: "mv8", verb: "entrar", tense: "presente", en: "We enter the house.", pt: "Entramos em casa." },
  { id: "mv9", verb: "ir", tense: "presente", en: "Where are you going?", pt: "Para onde vais?", alternatives: ["Onde vais?"] },
  { id: "mv10", verb: "partir", tense: "presente", en: "They leave next week.", pt: "Eles partem na próxima semana.", alternatives: ["Partem na próxima semana."] },

  // STATE
  { id: "s1", verb: "ser", tense: "presente", en: "I'm from Porto.", pt: "Sou de Porto." },
  { id: "s2", verb: "ser", tense: "presente", en: "We are friends.", pt: "Somos amigos." },
  { id: "s3", verb: "estar", tense: "presente", en: "Is he at home?", pt: "Está em casa?", alternatives: ["Ele está em casa?"] },
  { id: "s4", verb: "estar", tense: "presente", en: "They are in the kitchen.", pt: "Estão na cozinha.", alternatives: ["Eles estão na cozinha."] },
  { id: "s5", verb: "ficar", tense: "presente", en: "I'm staying here.", pt: "Fico aqui." },
  { id: "s6", verb: "ficar", tense: "presente", en: "Are you staying in Portugal?", pt: "Ficam em Portugal?", alternatives: ["Ficas em Portugal?"] },
  { id: "s7", verb: "estar", tense: "presente", en: "I am well.", pt: "Estou bem." },
  { id: "s8", verb: "ser", tense: "presente", en: "What is your name?", pt: "Qual é o teu nome?" },

  // ACTION
  { id: "a1", verb: "fazer", tense: "presente", en: "I make breakfast.", pt: "Faço o pequeno-almoço." },
  { id: "a2", verb: "fazer", tense: "presente", en: "What are you doing?", pt: "O que fazes?" },
  { id: "a3", verb: "dizer", tense: "presente", en: "She tells the truth.", pt: "Ela diz a verdade.", alternatives: ["Diz a verdade."] },
  { id: "a4", verb: "dizer", tense: "presente", en: "What do you say?", pt: "O que dizes?" },
  { id: "a5", verb: "dar", tense: "presente", en: "I give a gift.", pt: "Dou um presente." },
  { id: "a6", verb: "dar", tense: "presente", en: "He gives the book.", pt: "Ele dá o livro.", alternatives: ["Dá o livro."] },
  { id: "a7", verb: "trazer", tense: "presente", en: "Bring the book.", pt: "Traz o livro." },
  { id: "a8", verb: "trazer", tense: "presente", en: "They bring wine.", pt: "Trazem vinho.", alternatives: ["Eles trazem vinho."] },
  { id: "a9", verb: "ver", tense: "presente", en: "I see the child.", pt: "Vejo a criança." },
  { id: "a10", verb: "ver", tense: "presente", en: "Do you see?", pt: "Vês?" },
  { id: "a11", verb: "ter", tense: "presente", en: "I have a cat.", pt: "Tenho um gato." },
  { id: "a12", verb: "ter", tense: "presente", en: "They have time.", pt: "Eles têm tempo.", alternatives: ["Têm tempo."] },

  // STEM-CHANGING
  { id: "st1", verb: "dormir", tense: "presente", en: "I sleep well.", pt: "Durmo bem." },
  { id: "st2", verb: "dormir", tense: "presente", en: "We sleep at night.", pt: "Dormimos à noite." },
  { id: "st3", verb: "sentir", tense: "presente", en: "I feel cold.", pt: "Sinto frio." },
  { id: "st4", verb: "pedir", tense: "presente", en: "I ask for help.", pt: "Peço ajuda." },
  { id: "st5", verb: "ouvir", tense: "presente", en: "Do you hear the noise?", pt: "Ouves o barulho?" },
  { id: "st6", verb: "seguir", tense: "presente", en: "They follow us.", pt: "Eles seguem-nos.", alternatives: ["Eles nos seguem.", "Seguem-nos."] },

  // REGULAR MODELS
  { id: "r1", verb: "tomar", tense: "presente", en: "I drink coffee.", pt: "Tomo café." },
  { id: "r2", verb: "comer", tense: "presente", en: "We eat at home.", pt: "Comemos em casa." },
  { id: "r3", verb: "partir", tense: "presente", en: "I leave from here.", pt: "Parto daqui." },

  // -AR
  { id: "ar1", verb: "morar", tense: "presente", en: "I live in Portugal for two years.", pt: "Moro em Portugal há dois anos." },
  { id: "ar2", verb: "ficar", tense: "presente", en: "Where do you stay?", pt: "Onde ficas?" },
  { id: "ar3", verb: "gostar", tense: "presente", en: "I like Portuguese.", pt: "Gosto de português." },
  { id: "ar4", verb: "encontrar", tense: "presente", en: "We meet friends.", pt: "Encontramos amigos." },
  { id: "ar5", verb: "comprar", tense: "presente", en: "They buy bread.", pt: "Eles compram pão.", alternatives: ["Compram pão."] },
  { id: "ar6", verb: "escutar", tense: "presente", en: "Do you listen?", pt: "Escutas?" },

  // -ER
  { id: "er1", verb: "conhecer", tense: "presente", en: "I know many people.", pt: "Conheço muitas pessoas." },
  { id: "er2", verb: "escrever", tense: "presente", en: "She writes a letter.", pt: "Ela escreve uma carta.", alternatives: ["Escreve uma carta."] },

  // CONVERSATIONAL
  { id: "c1", verb: "estar", tense: "presente", en: "How are you?", pt: "Como estás?" },
  { id: "c2", verb: "estar", tense: "presente", en: "I'm well, thank you.", pt: "Estou bem, obrigado.", alternatives: ["Estou bem, obrigada."] },
  { id: "c3", verb: "ser", tense: "presente", en: "What time is it?", pt: "Que horas são?" },
  { id: "c4", verb: "poder", tense: "presente", en: "Can you help me?", pt: "Podes ajudar-me?", alternatives: ["Pode ajudar-me?", "Podes me ajudar?"] },
];
