import { useState, useEffect, useRef } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart } from "recharts";
import packageInfo from "../package.json";

const ALL_VERBS = [
  // ── IRREGULAR ──
  { id:"ser", verb:"ser", transl:"to be (permanent)", prep:"—", type:"irregular",
    presente:{eu:"sou",tu:"és","ele/ela":"é",nós:"somos","eles(as)/vocês":"são"},
    passado:{eu:"fui",tu:"foste","ele/ela":"foi",nós:"fomos","eles(as)/vocês":"foram"}},
  { id:"estar", verb:"estar", transl:"to be (state)", prep:"em, a", type:"irregular",
    presente:{eu:"estou",tu:"estás","ele/ela":"está",nós:"estamos","eles(as)/vocês":"estão"},
    passado:{eu:"estive",tu:"estiveste","ele/ela":"esteve",nós:"estivemos","eles(as)/vocês":"estiveram"}},
  { id:"ter", verb:"ter", transl:"to have", prep:"de, que", type:"irregular",
    presente:{eu:"tenho",tu:"tens","ele/ela":"tem",nós:"temos","eles(as)/vocês":"têm"},
    passado:{eu:"tive",tu:"tiveste","ele/ela":"teve",nós:"tivemos","eles(as)/vocês":"tiveram"}},
  { id:"haver", verb:"haver", transl:"to exist / aux.", prep:"de", type:"irregular",
    presente:{eu:"hei",tu:"hás","ele/ela":"há",nós:"havemos","eles(as)/vocês":"hão"},
    passado:{eu:"houve",tu:"houveste","ele/ela":"houve",nós:"houvemos","eles(as)/vocês":"houveram"}},
  { id:"ir", verb:"ir", transl:"to go", prep:"a, para", type:"irregular",
    presente:{eu:"vou",tu:"vais","ele/ela":"vai",nós:"vamos","eles(as)/vocês":"vão"},
    passado:{eu:"fui",tu:"foste","ele/ela":"foi",nós:"fomos","eles(as)/vocês":"foram"}},
  { id:"vir", verb:"vir", transl:"to come", prep:"de, a", type:"irregular",
    presente:{eu:"venho",tu:"vens","ele/ela":"vem",nós:"vimos","eles(as)/vocês":"vêm"},
    passado:{eu:"vim",tu:"vieste","ele/ela":"veio",nós:"viemos","eles(as)/vocês":"vieram"}},
  { id:"dar", verb:"dar", transl:"to give", prep:"a", type:"irregular",
    presente:{eu:"dou",tu:"dás","ele/ela":"dá",nós:"damos","eles(as)/vocês":"dão"},
    passado:{eu:"dei",tu:"deste","ele/ela":"deu",nós:"demos","eles(as)/vocês":"deram"}},
  { id:"fazer", verb:"fazer", transl:"to do / make", prep:"—", type:"irregular",
    presente:{eu:"faço",tu:"fazes","ele/ela":"faz",nós:"fazemos","eles(as)/vocês":"fazem"},
    passado:{eu:"fiz",tu:"fizeste","ele/ela":"fez",nós:"fizemos","eles(as)/vocês":"fizeram"}},
  { id:"dizer", verb:"dizer", transl:"to say / tell", prep:"a", type:"irregular",
    presente:{eu:"digo",tu:"dizes","ele/ela":"diz",nós:"dizemos","eles(as)/vocês":"dizem"},
    passado:{eu:"disse",tu:"disseste","ele/ela":"disse",nós:"dissemos","eles(as)/vocês":"disseram"}},
  { id:"trazer", verb:"trazer", transl:"to bring", prep:"a, para", type:"irregular",
    presente:{eu:"trago",tu:"trazes","ele/ela":"traz",nós:"trazemos","eles(as)/vocês":"trazem"},
    passado:{eu:"trouxe",tu:"trouxeste","ele/ela":"trouxe",nós:"trouxemos","eles(as)/vocês":"trouxeram"}},
  { id:"poder", verb:"poder", transl:"can", prep:"—", type:"irregular",
    presente:{eu:"posso",tu:"podes","ele/ela":"pode",nós:"podemos","eles(as)/vocês":"podem"},
    passado:{eu:"pude",tu:"pudeste","ele/ela":"pôde",nós:"pudemos","eles(as)/vocês":"puderam"}},
  { id:"querer", verb:"querer", transl:"to want", prep:"—", type:"irregular",
    presente:{eu:"quero",tu:"queres","ele/ela":"quer",nós:"queremos","eles(as)/vocês":"querem"},
    passado:{eu:"quis",tu:"quiseste","ele/ela":"quis",nós:"quisemos","eles(as)/vocês":"quiseram"}},
  { id:"saber", verb:"saber", transl:"to know (facts)", prep:"de", type:"irregular",
    presente:{eu:"sei",tu:"sabes","ele/ela":"sabe",nós:"sabemos","eles(as)/vocês":"sabem"},
    passado:{eu:"soube",tu:"soubeste","ele/ela":"soube",nós:"soubemos","eles(as)/vocês":"souberam"}},
  { id:"ver", verb:"ver", transl:"to see", prep:"—", type:"irregular",
    presente:{eu:"vejo",tu:"vês","ele/ela":"vê",nós:"vemos","eles(as)/vocês":"veem"},
    passado:{eu:"vi",tu:"viste","ele/ela":"viu",nós:"vimos","eles(as)/vocês":"viram"}},
  { id:"ler", verb:"ler", transl:"to read", prep:"—", type:"irregular",
    presente:{eu:"leio",tu:"lês","ele/ela":"lê",nós:"lemos","eles(as)/vocês":"leem"},
    passado:{eu:"li",tu:"leste","ele/ela":"leu",nós:"lemos","eles(as)/vocês":"leram"}},
  { id:"crer", verb:"crer", transl:"to believe", prep:"em", type:"irregular",
    presente:{eu:"creio",tu:"crês","ele/ela":"crê",nós:"cremos","eles(as)/vocês":"creem"},
    passado:{eu:"cri",tu:"creste","ele/ela":"creu",nós:"cremos","eles(as)/vocês":"creram"}},
  { id:"por", verb:"pôr", transl:"to put", prep:"em", type:"irregular",
    presente:{eu:"ponho",tu:"pões","ele/ela":"põe",nós:"pomos","eles(as)/vocês":"põem"},
    passado:{eu:"pus",tu:"puseste","ele/ela":"pôs",nós:"pusemos","eles(as)/vocês":"puseram"}},
  { id:"perder", verb:"perder", transl:"to lose", prep:"—", type:"irregular",
    presente:{eu:"perco",tu:"perdes","ele/ela":"perde",nós:"perdemos","eles(as)/vocês":"perdem"},
    passado:{eu:"perdi",tu:"perdeste","ele/ela":"perdeu",nós:"perdemos","eles(as)/vocês":"perderam"}},
  { id:"caber", verb:"caber", transl:"to fit", prep:"em", type:"irregular",
    presente:{eu:"caibo",tu:"cabes","ele/ela":"cabe",nós:"cabemos","eles(as)/vocês":"cabem"},
    passado:{eu:"coube",tu:"coubeste","ele/ela":"coube",nós:"coubemos","eles(as)/vocês":"couberam"}},
  { id:"dormir", verb:"dormir", transl:"to sleep", prep:"—", type:"irregular",
    presente:{eu:"durmo",tu:"dormes","ele/ela":"dorme",nós:"dormimos","eles(as)/vocês":"dormem"},
    passado:{eu:"dormi",tu:"dormiste","ele/ela":"dormiu",nós:"dormimos","eles(as)/vocês":"dormiram"}},
  { id:"sentir", verb:"sentir", transl:"to feel", prep:"—", type:"irregular",
    presente:{eu:"sinto",tu:"sentes","ele/ela":"sente",nós:"sentimos","eles(as)/vocês":"sentem"},
    passado:{eu:"senti",tu:"sentiste","ele/ela":"sentiu",nós:"sentimos","eles(as)/vocês":"sentiram"}},
  { id:"rir", verb:"rir", transl:"to laugh", prep:"de", type:"irregular",
    presente:{eu:"rio",tu:"ris","ele/ela":"ri",nós:"rimos","eles(as)/vocês":"riem"},
    passado:{eu:"ri",tu:"riste","ele/ela":"riu",nós:"rimos","eles(as)/vocês":"riram"}},
  { id:"sorrir", verb:"sorrir", transl:"to smile", prep:"para, a", type:"irregular",
    presente:{eu:"sorrio",tu:"sorris","ele/ela":"sorri",nós:"sorrimos","eles(as)/vocês":"sorriem"},
    passado:{eu:"sorri",tu:"sorriste","ele/ela":"sorriu",nós:"sorrimos","eles(as)/vocês":"sorriram"}},
  { id:"pedir", verb:"pedir", transl:"to ask for", prep:"a", type:"irregular",
    presente:{eu:"peço",tu:"pedes","ele/ela":"pede",nós:"pedimos","eles(as)/vocês":"pedem"},
    passado:{eu:"pedi",tu:"pediste","ele/ela":"pediu",nós:"pedimos","eles(as)/vocês":"pediram"}},
  { id:"medir", verb:"medir", transl:"to measure", prep:"—", type:"irregular",
    presente:{eu:"meço",tu:"medes","ele/ela":"mede",nós:"medimos","eles(as)/vocês":"medem"},
    passado:{eu:"medi",tu:"mediste","ele/ela":"mediu",nós:"medimos","eles(as)/vocês":"mediram"}},
  { id:"seguir", verb:"seguir", transl:"to follow", prep:"—", type:"irregular",
    presente:{eu:"sigo",tu:"segues","ele/ela":"segue",nós:"seguimos","eles(as)/vocês":"seguem"},
    passado:{eu:"segui",tu:"seguiste","ele/ela":"seguiu",nós:"seguimos","eles(as)/vocês":"seguiram"}},
  { id:"sair", verb:"sair", transl:"to leave", prep:"de", type:"irregular",
    presente:{eu:"saio",tu:"sais","ele/ela":"sai",nós:"saímos","eles(as)/vocês":"saem"},
    passado:{eu:"saí",tu:"saíste","ele/ela":"saiu",nós:"saímos","eles(as)/vocês":"saíram"}},
  { id:"subir", verb:"subir", transl:"to go up", prep:"—", type:"irregular",
    presente:{eu:"subo",tu:"sobes","ele/ela":"sobe",nós:"subimos","eles(as)/vocês":"sobem"},
    passado:{eu:"subi",tu:"subiste","ele/ela":"subiu",nós:"subimos","eles(as)/vocês":"subiram"}},
  { id:"sumir", verb:"sumir", transl:"to disappear", prep:"—", type:"irregular",
    presente:{eu:"sumo",tu:"somes","ele/ela":"some",nós:"sumimos","eles(as)/vocês":"somem"},
    passado:{eu:"sumi",tu:"sumiste","ele/ela":"sumiu",nós:"sumimos","eles(as)/vocês":"sumiram"}},
  { id:"consumir", verb:"consumir", transl:"to consume", prep:"—", type:"irregular",
    presente:{eu:"consumo",tu:"consomes","ele/ela":"consome",nós:"consumimos","eles(as)/vocês":"consomem"},
    passado:{eu:"consumi",tu:"consumiste","ele/ela":"consumiu",nós:"consumimos","eles(as)/vocês":"consumiram"}},
  { id:"ouvir", verb:"ouvir", transl:"to hear", prep:"—", type:"irregular",
    presente:{eu:"ouço",tu:"ouves","ele/ela":"ouve",nós:"ouvimos","eles(as)/vocês":"ouvem"},
    passado:{eu:"ouvi",tu:"ouviste","ele/ela":"ouviu",nós:"ouvimos","eles(as)/vocês":"ouviram"}},
  { id:"traduzir", verb:"traduzir", transl:"to translate", prep:"de, para", type:"irregular",
    presente:{eu:"traduzo",tu:"traduzes","ele/ela":"traduz",nós:"traduzimos","eles(as)/vocês":"traduzem"},
    passado:{eu:"traduzi",tu:"traduziste","ele/ela":"traduziu",nós:"traduzimos","eles(as)/vocês":"traduziram"}},
  { id:"despedir-se", verb:"despedir-se", transl:"to say goodbye", prep:"de", type:"irregular",
    presente:{eu:"despeço-me",tu:"despedes-te","ele/ela":"despede-se",nós:"despedimo-nos","eles(as)/vocês":"despedem-se"},
    passado:{eu:"despedi-me",tu:"despediste-te","ele/ela":"despediu-se",nós:"despedimo-nos","eles(as)/vocês":"despediram-se"}},
  // ── REGULAR -AR ──
  { id:"tomar", verb:"tomar", transl:"to take (drink)", prep:"—", type:"regular-ar", presente:{eu:"tomo",tu:"tomas","ele/ela":"toma",nós:"tomamos","eles(as)/vocês":"tomam"}, passado:{eu:"tomei",tu:"tomaste","ele/ela":"tomou",nós:"tomámos","eles(as)/vocês":"tomaram"}},
  { id:"comprar", verb:"comprar", transl:"to buy", prep:"—", type:"regular-ar", presente:{eu:"compro",tu:"compras","ele/ela":"compra",nós:"compramos","eles(as)/vocês":"compram"}, passado:{eu:"comprei",tu:"compraste","ele/ela":"comprou",nós:"comprámos","eles(as)/vocês":"compraram"}},
  { id:"precisar", verb:"precisar", transl:"to need", prep:"de", type:"regular-ar", presente:{eu:"preciso",tu:"precisas","ele/ela":"precisa",nós:"precisamos","eles(as)/vocês":"precisam"}, passado:{eu:"precisei",tu:"precisaste","ele/ela":"precisou",nós:"precisámos","eles(as)/vocês":"precisaram"}},
  { id:"jantar", verb:"jantar", transl:"to have dinner", prep:"—", type:"regular-ar", presente:{eu:"janto",tu:"jantas","ele/ela":"janta",nós:"jantamos","eles(as)/vocês":"jantam"}, passado:{eu:"jantei",tu:"jantaste","ele/ela":"jantou",nós:"jantámos","eles(as)/vocês":"jantaram"}},
  { id:"escutar", verb:"escutar", transl:"to listen", prep:"—", type:"regular-ar", presente:{eu:"escuto",tu:"escutas","ele/ela":"escuta",nós:"escutamos","eles(as)/vocês":"escutam"}, passado:{eu:"escutei",tu:"escutaste","ele/ela":"escutou",nós:"escutámos","eles(as)/vocês":"escutaram"}},
  { id:"encontrar", verb:"encontrar", transl:"to find / meet", prep:"— / com", type:"regular-ar", presente:{eu:"encontro",tu:"encontras","ele/ela":"encontra",nós:"encontramos","eles(as)/vocês":"encontram"}, passado:{eu:"encontrei",tu:"encontraste","ele/ela":"encontrou",nós:"encontrámos","eles(as)/vocês":"encontraram"}},
  { id:"entrar", verb:"entrar", transl:"to enter", prep:"em", type:"regular-ar", presente:{eu:"entro",tu:"entras","ele/ela":"entra",nós:"entramos","eles(as)/vocês":"entram"}, passado:{eu:"entrei",tu:"entraste","ele/ela":"entrou",nós:"entrámos","eles(as)/vocês":"entraram"}},
  { id:"limpar", verb:"limpar", transl:"to clean", prep:"—", type:"regular-ar", presente:{eu:"limpo",tu:"limpas","ele/ela":"limpa",nós:"limpamos","eles(as)/vocês":"limpam"}, passado:{eu:"limpei",tu:"limpaste","ele/ela":"limpou",nós:"limpámos","eles(as)/vocês":"limparam"}},
  { id:"lavar", verb:"lavar", transl:"to wash", prep:"—", type:"regular-ar", presente:{eu:"lavo",tu:"lavas","ele/ela":"lava",nós:"lavamos","eles(as)/vocês":"lavam"}, passado:{eu:"lavei",tu:"lavaste","ele/ela":"lavou",nós:"lavámos","eles(as)/vocês":"lavaram"}},
  { id:"levar", verb:"levar", transl:"to take / carry", prep:"a, para", type:"regular-ar", presente:{eu:"levo",tu:"levas","ele/ela":"leva",nós:"levamos","eles(as)/vocês":"levam"}, passado:{eu:"levei",tu:"levaste","ele/ela":"levou",nós:"levámos","eles(as)/vocês":"levaram"}},
  { id:"jogar", verb:"jogar", transl:"to play (sport)", prep:"—", type:"regular-ar", presente:{eu:"jogo",tu:"jogas","ele/ela":"joga",nós:"jogamos","eles(as)/vocês":"jogam"}, passado:{eu:"joguei",tu:"jogaste","ele/ela":"jogou",nós:"jogámos","eles(as)/vocês":"jogaram"}},
  { id:"trocar", verb:"trocar", transl:"to exchange", prep:"—", type:"regular-ar", presente:{eu:"troco",tu:"trocas","ele/ela":"troca",nós:"trocamos","eles(as)/vocês":"trocam"}, passado:{eu:"troquei",tu:"trocaste","ele/ela":"trocou",nós:"trocámos","eles(as)/vocês":"trocaram"}},
  { id:"brincar", verb:"brincar", transl:"to play (fun)", prep:"com", type:"regular-ar", presente:{eu:"brinco",tu:"brincas","ele/ela":"brinca",nós:"brincamos","eles(as)/vocês":"brincam"}, passado:{eu:"brinquei",tu:"brincaste","ele/ela":"brincou",nós:"brincámos","eles(as)/vocês":"brincaram"}},
  { id:"tentar", verb:"tentar", transl:"to try", prep:"—", type:"regular-ar", presente:{eu:"tento",tu:"tentas","ele/ela":"tenta",nós:"tentamos","eles(as)/vocês":"tentam"}, passado:{eu:"tentei",tu:"tentaste","ele/ela":"tentou",nós:"tentámos","eles(as)/vocês":"tentaram"}},
  { id:"usar", verb:"usar", transl:"to use", prep:"—", type:"regular-ar", presente:{eu:"uso",tu:"usas","ele/ela":"usa",nós:"usamos","eles(as)/vocês":"usam"}, passado:{eu:"usei",tu:"usaste","ele/ela":"usou",nós:"usámos","eles(as)/vocês":"usaram"}},
  { id:"fechar", verb:"fechar", transl:"to close", prep:"—", type:"regular-ar", presente:{eu:"fecho",tu:"fechas","ele/ela":"fecha",nós:"fechamos","eles(as)/vocês":"fecham"}, passado:{eu:"fechei",tu:"fechaste","ele/ela":"fechou",nós:"fechámos","eles(as)/vocês":"fecharam"}},
  { id:"cumprimentar", verb:"cumprimentar", transl:"to greet", prep:"—", type:"regular-ar", presente:{eu:"cumprimento",tu:"cumprimentas","ele/ela":"cumprimenta",nós:"cumprimentamos","eles(as)/vocês":"cumprimentam"}, passado:{eu:"cumprimentei",tu:"cumprimentaste","ele/ela":"cumprimentou",nós:"cumprimentámos","eles(as)/vocês":"cumprimentaram"}},
  { id:"apresentar-se", verb:"apresentar-se", transl:"to introduce oneself", prep:"a", type:"regular-ar", presente:{eu:"apresento-me",tu:"apresentas-te","ele/ela":"apresenta-se",nós:"apresentamo-nos","eles(as)/vocês":"apresentam-se"}, passado:{eu:"apresentei-me",tu:"apresentaste-te","ele/ela":"apresentou-se",nós:"apresentámo-nos","eles(as)/vocês":"apresentaram-se"}},
  { id:"cozinhar", verb:"cozinhar", transl:"to cook", prep:"—", type:"regular-ar", presente:{eu:"cozinho",tu:"cozinhas","ele/ela":"cozinha",nós:"cozinhamos","eles(as)/vocês":"cozinham"}, passado:{eu:"cozinhei",tu:"cozinhaste","ele/ela":"cozinhou",nós:"cozinhámos","eles(as)/vocês":"cozinharam"}},
  { id:"tirar", verb:"tirar", transl:"to take (photos)", prep:"—", type:"regular-ar", presente:{eu:"tiro",tu:"tiras","ele/ela":"tira",nós:"tiramos","eles(as)/vocês":"tiram"}, passado:{eu:"tirei",tu:"tiraste","ele/ela":"tirou",nós:"tirámos","eles(as)/vocês":"tiraram"}},
  { id:"pagar", verb:"pagar", transl:"to pay", prep:"—", type:"regular-ar", presente:{eu:"pago",tu:"pagas","ele/ela":"paga",nós:"pagamos","eles(as)/vocês":"pagam"}, passado:{eu:"paguei",tu:"pagaste","ele/ela":"pagou",nós:"pagámos","eles(as)/vocês":"pagaram"}},
  { id:"telefonar", verb:"telefonar", transl:"to phone", prep:"a, para", type:"regular-ar", presente:{eu:"telefono",tu:"telefonas","ele/ela":"telefona",nós:"telefonamos","eles(as)/vocês":"telefonam"}, passado:{eu:"telefonei",tu:"telefonaste","ele/ela":"telefonou",nós:"telefonámos","eles(as)/vocês":"telefonaram"}},
  { id:"viajar", verb:"viajar", transl:"to travel", prep:"para, a", type:"regular-ar", presente:{eu:"viajo",tu:"viajas","ele/ela":"viaja",nós:"viajamos","eles(as)/vocês":"viajam"}, passado:{eu:"viajei",tu:"viajaste","ele/ela":"viajou",nós:"viajámos","eles(as)/vocês":"viajaram"}},
  { id:"enviar", verb:"enviar", transl:"to send", prep:"a, para", type:"regular-ar", presente:{eu:"envio",tu:"envias","ele/ela":"envia",nós:"enviamos","eles(as)/vocês":"enviam"}, passado:{eu:"enviei",tu:"enviaste","ele/ela":"enviou",nós:"enviámos","eles(as)/vocês":"enviaram"}},
  { id:"fumar", verb:"fumar", transl:"to smoke", prep:"—", type:"regular-ar", presente:{eu:"fumo",tu:"fumas","ele/ela":"fuma",nós:"fumamos","eles(as)/vocês":"fumam"}, passado:{eu:"fumei",tu:"fumaste","ele/ela":"fumou",nós:"fumámos","eles(as)/vocês":"fumaram"}},
  { id:"atravessar", verb:"atravessar", transl:"to cross", prep:"—", type:"regular-ar", presente:{eu:"atravesso",tu:"atravessas","ele/ela":"atravessa",nós:"atravessamos","eles(as)/vocês":"atravessam"}, passado:{eu:"atravessei",tu:"atravessaste","ele/ela":"atravessou",nós:"atravessámos","eles(as)/vocês":"atravessaram"}},
  { id:"ligar", verb:"ligar", transl:"to call / turn on", prep:"a, para", type:"regular-ar", presente:{eu:"ligo",tu:"ligas","ele/ela":"liga",nós:"ligamos","eles(as)/vocês":"ligam"}, passado:{eu:"liguei",tu:"ligaste","ele/ela":"ligou",nós:"ligámos","eles(as)/vocês":"ligaram"}},
  { id:"gostar", verb:"gostar", transl:"to like", prep:"de", type:"regular-ar", presente:{eu:"gosto",tu:"gostas","ele/ela":"gosta",nós:"gostamos","eles(as)/vocês":"gostam"}, passado:{eu:"gostei",tu:"gostaste","ele/ela":"gostou",nós:"gostámos","eles(as)/vocês":"gostaram"}},
  { id:"morar", verb:"morar", transl:"to live (reside)", prep:"em", type:"regular-ar", presente:{eu:"moro",tu:"moras","ele/ela":"mora",nós:"moramos","eles(as)/vocês":"moram"}, passado:{eu:"morei",tu:"moraste","ele/ela":"morou",nós:"morámos","eles(as)/vocês":"moraram"}},
  { id:"ficar", verb:"ficar", transl:"to stay", prep:"em", type:"regular-ar", presente:{eu:"fico",tu:"ficas","ele/ela":"fica",nós:"ficamos","eles(as)/vocês":"ficam"}, passado:{eu:"fiquei",tu:"ficaste","ele/ela":"ficou",nós:"ficámos","eles(as)/vocês":"ficaram"}},
  { id:"passear", verb:"passear", transl:"to stroll", prep:"por, em", type:"regular-ar", presente:{eu:"passeio",tu:"passeias","ele/ela":"passeia",nós:"passeamos","eles(as)/vocês":"passeiam"}, passado:{eu:"passeei",tu:"passeaste","ele/ela":"passeou",nós:"passeámos","eles(as)/vocês":"passearam"}},
  { id:"chegar", verb:"chegar", transl:"to arrive", prep:"a", type:"regular-ar", presente:{eu:"chego",tu:"chegas","ele/ela":"chega",nós:"chegamos","eles(as)/vocês":"chegam"}, passado:{eu:"cheguei",tu:"chegaste","ele/ela":"chegou",nós:"chegámos","eles(as)/vocês":"chegaram"}},
  { id:"transportar", verb:"transportar", transl:"to transport", prep:"—", type:"regular-ar", presente:{eu:"transporto",tu:"transportas","ele/ela":"transporta",nós:"transportamos","eles(as)/vocês":"transportam"}, passado:{eu:"transportei",tu:"transportaste","ele/ela":"transportou",nós:"transportámos","eles(as)/vocês":"transportaram"}},
  { id:"andar", verb:"andar", transl:"to walk / go around", prep:"de, por, a", type:"regular-ar", presente:{eu:"ando",tu:"andas","ele/ela":"anda",nós:"andamos","eles(as)/vocês":"andam"}, passado:{eu:"andei",tu:"andaste","ele/ela":"andou",nós:"andámos","eles(as)/vocês":"andaram"}},
  { id:"deixar", verb:"deixar", transl:"to leave / to let", prep:"de", type:"regular-ar", presente:{eu:"deixo",tu:"deixas","ele/ela":"deixa",nós:"deixamos","eles(as)/vocês":"deixam"}, passado:{eu:"deixei",tu:"deixaste","ele/ela":"deixou",nós:"deixámos","eles(as)/vocês":"deixaram"}},
  // ── REGULAR -ER ──
  { id:"comer", verb:"comer", transl:"to eat", prep:"—", type:"regular-er", presente:{eu:"como",tu:"comes","ele/ela":"come",nós:"comemos","eles(as)/vocês":"comem"}, passado:{eu:"comi",tu:"comeste","ele/ela":"comeu",nós:"comemos","eles(as)/vocês":"comeram"}},
  { id:"responder", verb:"responder", transl:"to answer", prep:"a", type:"regular-er", presente:{eu:"respondo",tu:"respondes","ele/ela":"responde",nós:"respondemos","eles(as)/vocês":"respondem"}, passado:{eu:"respondi",tu:"respondeste","ele/ela":"respondeu",nós:"respondemos","eles(as)/vocês":"responderam"}},
  { id:"beber", verb:"beber", transl:"to drink", prep:"—", type:"regular-er", presente:{eu:"bebo",tu:"bebes","ele/ela":"bebe",nós:"bebemos","eles(as)/vocês":"bebem"}, passado:{eu:"bebi",tu:"bebeste","ele/ela":"bebeu",nós:"bebemos","eles(as)/vocês":"beberam"}},
  { id:"escrever", verb:"escrever", transl:"to write", prep:"a, para", type:"regular-er", presente:{eu:"escrevo",tu:"escreves","ele/ela":"escreve",nós:"escrevemos","eles(as)/vocês":"escrevem"}, passado:{eu:"escrevi",tu:"escreveste","ele/ela":"escreveu",nós:"escrevemos","eles(as)/vocês":"escreveram"}},
  { id:"receber", verb:"receber", transl:"to receive", prep:"de", type:"regular-er", presente:{eu:"recebo",tu:"recebes","ele/ela":"recebe",nós:"recebemos","eles(as)/vocês":"recebem"}, passado:{eu:"recebi",tu:"recebeste","ele/ela":"recebeu",nós:"recebemos","eles(as)/vocês":"receberam"}},
  { id:"parecer", verb:"parecer", transl:"to seem", prep:"—", type:"regular-er", presente:{eu:"pareço",tu:"pareces","ele/ela":"parece",nós:"parecemos","eles(as)/vocês":"parecem"}, passado:{eu:"pareci",tu:"pareceste","ele/ela":"pareceu",nós:"parecemos","eles(as)/vocês":"pareceram"}},
  { id:"conhecer", verb:"conhecer", transl:"to know (people)", prep:"—", type:"regular-er", presente:{eu:"conheço",tu:"conheces","ele/ela":"conhece",nós:"conhecemos","eles(as)/vocês":"conhecem"}, passado:{eu:"conheci",tu:"conheceste","ele/ela":"conheceu",nós:"conhecemos","eles(as)/vocês":"conheceram"}},
  { id:"acontecer", verb:"acontecer", transl:"to happen", prep:"—", type:"regular-er", presente:{eu:"aconteço",tu:"aconteces","ele/ela":"acontece",nós:"acontecemos","eles(as)/vocês":"acontecem"}, passado:{eu:"aconteci",tu:"aconteceste","ele/ela":"aconteceu",nós:"acontecemos","eles(as)/vocês":"aconteceram"}},
  { id:"descer", verb:"descer", transl:"to go down", prep:"—", type:"regular-er", presente:{eu:"desço",tu:"desces","ele/ela":"desce",nós:"descemos","eles(as)/vocês":"descem"}, passado:{eu:"desci",tu:"desceste","ele/ela":"desceu",nós:"descemos","eles(as)/vocês":"desceram"}},
  { id:"chover", verb:"chover", transl:"to rain", prep:"—", type:"regular-er", presente:{eu:"chovo",tu:"choves","ele/ela":"chove",nós:"chovemos","eles(as)/vocês":"chovem"}, passado:{eu:"chovi",tu:"choveste","ele/ela":"choveu",nós:"chovemos","eles(as)/vocês":"choveram"}},
  // ── REGULAR -IR ──
  { id:"partir", verb:"partir", transl:"to leave / break", prep:"de, para", type:"regular-ir", presente:{eu:"parto",tu:"partes","ele/ela":"parte",nós:"partimos","eles(as)/vocês":"partem"}, passado:{eu:"parti",tu:"partiste","ele/ela":"partiu",nós:"partimos","eles(as)/vocês":"partiram"}},
  { id:"assistir", verb:"assistir", transl:"to watch / attend", prep:"a", type:"regular-ir", presente:{eu:"assisto",tu:"assistes","ele/ela":"assiste",nós:"assistimos","eles(as)/vocês":"assistem"}, passado:{eu:"assisti",tu:"assististe","ele/ela":"assistiu",nós:"assistimos","eles(as)/vocês":"assistiram"}},
  { id:"discutir", verb:"discutir", transl:"to discuss", prep:"—", type:"regular-ir", presente:{eu:"discuto",tu:"discutes","ele/ela":"discute",nós:"discutimos","eles(as)/vocês":"discutem"}, passado:{eu:"discuti",tu:"discutiste","ele/ela":"discutiu",nós:"discutimos","eles(as)/vocês":"discutiram"}},
  { id:"abrir", verb:"abrir", transl:"to open", prep:"—", type:"regular-ir", presente:{eu:"abro",tu:"abres","ele/ela":"abre",nós:"abrimos","eles(as)/vocês":"abrem"}, passado:{eu:"abri",tu:"abriste","ele/ela":"abriu",nós:"abrimos","eles(as)/vocês":"abriram"}},
];

const PRONOUNS=["eu","tu","ele/ela","nós","eles(as)/vocês"];
const TENSES=["presente","passado"];
const SK_HIST="verbos-history";
const SK_CONF="verbos-config";
const SK_FILTERS="verbos-filters";

function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function stripAccents(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function norm(s){return s.trim().toLowerCase().replace(/\s+/g," ");}
function cmpAns(i,c){const ni=norm(i),nc=norm(c);if(ni===nc)return"exact";if(stripAccents(ni)===stripAccents(nc))return"accent";return"wrong";}

function speak(text){if(!window.speechSynthesis)return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="pt-PT";u.rate=0.85;const v=window.speechSynthesis.getVoices();const pt=v.find(x=>x.lang==="pt-PT")||v.find(x=>x.lang.startsWith("pt"));if(pt)u.voice=pt;window.speechSynthesis.speak(u);}
function AudioBtn({text}){return(<button onClick={()=>speak(text)} style={S.audio} title="Listen"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg></button>);}

function Confetti(){
  const ref=useRef(null);
  useEffect(()=>{
    const canvas=ref.current;const ctx=canvas.getContext("2d");
    canvas.width=window.innerWidth;canvas.height=window.innerHeight;
    const colors=["#1a3a5c","#1e7a3a","#FFD700","#c0392b","#3498db","#e67e22"];
    const pts=Array.from({length:100},()=>({
      x:Math.random()*canvas.width,y:Math.random()*-canvas.height*1.2,
      w:Math.random()*10+5,h:Math.random()*6+3,
      color:colors[Math.floor(Math.random()*colors.length)],
      vx:(Math.random()-0.5)*3,vy:Math.random()*3+2,
      angle:Math.random()*360,spin:(Math.random()-0.5)*5,
    }));
    let frame;const start=Date.now();
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const elapsed=Date.now()-start;
      const opacity=elapsed>2500?Math.max(0,1-(elapsed-2500)/1200):1;
      pts.forEach(p=>{
        p.x+=p.vx;p.y+=p.vy;p.angle+=p.spin;
        if(p.y>canvas.height){p.y=-10;p.x=Math.random()*canvas.width;}
        ctx.save();ctx.globalAlpha=opacity;ctx.translate(p.x,p.y);
        ctx.rotate(p.angle*Math.PI/180);ctx.fillStyle=p.color;
        ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();
      });
      if(elapsed<3700)frame=requestAnimationFrame(draw);
    }
    draw();return()=>cancelAnimationFrame(frame);
  },[]);
  return <canvas ref={ref} style={{position:"fixed",top:0,left:0,pointerEvents:"none",zIndex:999}}/>;
}

// Storage — uses localStorage for persistence
function sGet(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch{return null;}}
function sSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch{return false;}}
function sDel(k){try{localStorage.removeItem(k);}catch{}}

function defaultConfig(){const c={};ALL_VERBS.forEach(v=>{c[v.id]={presente:true,passado:true};});return c;}

export default function App(){
  const [screen,setScreen]=useState("menu");
  const [filterIrregular,setFilterIrregular]=useState(true);
  const [filterRegular,setFilterRegular]=useState(true);
  const [tensePresente,setTensePresente]=useState(true);
  const [tensePassado,setTensePassado]=useState(false);
  const [cards,setCards]=useState([]);
  const [idx,setIdx]=useState(0);
  const [input,setInput]=useState("");
  const [result,setResult]=useState(null);
  const [accentNote,setAccentNote]=useState(null);
  const [score,setScore]=useState({correct:0,wrong:0,accentMisses:0});
  const [wrongOnes,setWrongOnes]=useState([]);
  const [history,setHistory]=useState([]);
  const [config,setConfig]=useState(defaultConfig);
  const [settingsTab,setSettingsTab]=useState("irregular");
  const inputRef=useRef(null);

  useEffect(()=>{
    window.speechSynthesis?.getVoices();
    const h=sGet(SK_HIST);if(h&&Array.isArray(h))setHistory(h);
    const c=sGet(SK_CONF);if(c&&typeof c==="object"){const def=defaultConfig();Object.keys(def).forEach(k=>{if(!c[k])c[k]=def[k];});setConfig(c);}
    const f=sGet(SK_FILTERS);if(f){setFilterIrregular(f.filterIrregular??true);setFilterRegular(f.filterRegular??true);setTensePresente(f.tensePresente??true);setTensePassado(f.tensePassado??false);}
  },[]);

  useEffect(()=>{sSet(SK_FILTERS,{filterIrregular,filterRegular,tensePresente,tensePassado});},[filterIrregular,filterRegular,tensePresente,tensePassado]);

  const saveConfig=(nc)=>{setConfig(nc);sSet(SK_CONF,nc);};

  const startGame=()=>{
    const gen=[];
    for(const v of ALL_VERBS){
      const conf=config[v.id];if(!conf)continue;
      if(!filterIrregular&&v.type==="irregular")continue;
      if(!filterRegular&&v.type!=="irregular")continue;
      const tenses=[];
      if(conf.presente&&tensePresente)tenses.push("presente");
      if(conf.passado&&tensePassado)tenses.push("passado");
      if(tenses.length===0)continue;
      for(const t of tenses){const pr=PRONOUNS[Math.floor(Math.random()*PRONOUNS.length)];gen.push({...v,tense:t,pronoun:pr,answer:v[t][pr]});}
    }
    if(gen.length===0){alert("No verbs match your filters!");return;}
    setCards(shuffle(gen).slice(0,10));setIdx(0);setInput("");setResult(null);setAccentNote(null);
    setScore({correct:0,wrong:0,accentMisses:0});setWrongOnes([]);setScreen("play");
  };

  const check=()=>{if(!input.trim())return;const c=cards[idx],r=cmpAns(input,c.answer);if(r==="exact"){setResult("correct");setAccentNote(null);setScore(s=>({...s,correct:s.correct+1}));}else if(r==="accent"){setResult("correct");setAccentNote(c.answer);setScore(s=>({...s,correct:s.correct+1,accentMisses:s.accentMisses+1}));}else{setResult("wrong");setAccentNote(null);setScore(s=>({...s,wrong:s.wrong+1}));setWrongOnes(w=>[...w,c]);}};

  const next=()=>{if(idx+1>=cards.length){const sess={date:new Date().toISOString(),correct:score.correct,wrong:score.wrong,accentMisses:score.accentMisses,total:cards.length,pct:Math.round((score.correct/cards.length)*100)};const nh=[...history,sess];setHistory(nh);sSet(SK_HIST,nh);setScreen("results");}else{setIdx(i=>i+1);setInput("");setResult(null);setAccentNote(null);setTimeout(()=>inputRef.current?.focus(),50);}};
  const onKey=(e)=>{if(e.key==="Enter"){result===null?check():next();}};

  const card=cards[idx];const total=score.correct+score.wrong;const pct=total>0?Math.round((score.correct/total)*100):0;
  const chartData=history.map((h,i)=>{const d=new Date(h.date);return{label:`${d.getDate()}/${d.getMonth()+1}`,score:h.pct,session:i+1};});
  const trendText=()=>{if(history.length<2)return null;const l5=history.slice(-5),f5=history.slice(0,Math.min(5,history.length));const ar=l5.reduce((a,b)=>a+b.pct,0)/l5.length;const af=f5.reduce((a,b)=>a+b.pct,0)/f5.length;const d=Math.round(ar-af);if(d>5)return <span style={{color:"#1e7a3a"}}> · Up +{d}%</span>;if(d<-5)return <span style={{color:"#c0392b"}}> · Down {d}%</span>;return <span style={{color:"#888"}}> · Steady</span>;};

  const Chart=()=>(<div style={{width:"100%",height:140}}><ResponsiveContainer><BarChart data={chartData} margin={{top:5,right:5,bottom:5,left:-20}} barSize={14}><CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false}/><XAxis dataKey="label" tick={{fontSize:10,fill:"#999"}} axisLine={false} tickLine={false}/><YAxis domain={[0,100]} tick={{fontSize:10,fill:"#999"}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{fontSize:12,borderRadius:8,border:"1px solid #eee"}} cursor={{fill:"#f5f5f5"}} formatter={v=>[`${v}%`,"Score"]}/><Bar dataKey="score" fill="#1a3a5c" radius={[4,4,0,0]} isAnimationActive={true} animationDuration={600}/></BarChart></ResponsiveContainer></div>);

  const toggleVerb=(id,tense)=>{const nc={...config,[id]:{...config[id],[tense]:!config[id][tense]}};saveConfig(nc);};
  const bulkToggle=(type,tense,val)=>{const nc={...config};ALL_VERBS.filter(v=>type==="all"||v.type===type||(type==="regular"&&v.type!=="irregular")).forEach(v=>{nc[v.id]={...nc[v.id],[tense]:val};});saveConfig(nc);};
  const Version=()=>(<div style={S.version}>v{packageInfo.version}</div>);

  const NavBar=()=>(
    <nav style={S.nav}>
      <button onClick={()=>setScreen("menu")} style={{...S.navBtn,...(screen==="menu"?S.navActive:{})}} title="Play">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </button>
      <button onClick={()=>setScreen("history")} style={{...S.navBtn,...(screen==="history"?S.navActive:{})}} title="History">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
      </button>
      <button onClick={()=>setScreen("settings")} style={{...S.navBtn,...(screen==="settings"?S.navActive:{})}} title="Settings">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </button>
    </nav>
  );

  if(screen==="menu"){return(<div style={S.container}><div style={S.page}>
    <div style={S.flag}><div style={{flex:1,background:"#006600"}}/><div style={{flex:1,background:"#FF0000"}}/><div style={S.shield}/></div>
    <h1 style={S.title}>Verbos Portugueses</h1><p style={S.sub}>European Portuguese · Flashcards</p>
    <div style={S.og}><label style={S.ol}>Verbs</label><div style={S.row}>
      <button onClick={()=>setFilterIrregular(f=>!f)} style={{...S.qToggle,...(filterIrregular?S.toggleOn:S.toggleOff)}}>Irregular</button>
      <button onClick={()=>setFilterRegular(f=>!f)} style={{...S.qToggle,...(filterRegular?S.toggleOn:S.toggleOff)}}>Regular</button>
    </div></div>
    <div style={S.og}><label style={S.ol}>Tense</label><div style={S.row}>
      <button onClick={()=>setTensePresente(f=>!f)} style={{...S.qToggle,...(tensePresente?S.toggleOn:S.toggleOff)}}>Presente</button>
      <button onClick={()=>setTensePassado(f=>!f)} style={{...S.qToggle,...(tensePassado?S.toggleOn:S.toggleOff)}}>Passado</button>
    </div></div>
    <button onClick={startGame} style={S.start}>Começar</button>
  </div><NavBar/><Version/></div>);}

  if(screen==="settings"){const irregulars=ALL_VERBS.filter(v=>v.type==="irregular");const regulars=ALL_VERBS.filter(v=>v.type!=="irregular");const list=settingsTab==="irregular"?irregulars:regulars;const typeKey=settingsTab==="irregular"?"irregular":"regular";
    return(<div style={S.container}><div style={S.page}>
      <h1 style={{...S.title,fontSize:20}}>Settings</h1><p style={{fontSize:12,color:"#888",fontFamily:"system-ui,sans-serif",margin:0}}>Toggle verbs and tenses individually</p>
      <div style={S.row}>{[["irregular","Irregular ("+irregulars.length+")"],["regular","Regular ("+regulars.length+")"]].map(([v,l])=>(<button key={v} onClick={()=>setSettingsTab(v)} style={{...S.ob,...(settingsTab===v?S.oba:{})}}>{l}</button>))}</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}><button onClick={()=>bulkToggle(typeKey,"presente",true)} style={S.bulkBtn}>All Presente On</button><button onClick={()=>bulkToggle(typeKey,"passado",true)} style={S.bulkBtn}>All Passado On</button><button onClick={()=>{bulkToggle(typeKey,"presente",false);bulkToggle(typeKey,"passado",false);}} style={{...S.bulkBtn,color:"#c0392b",borderColor:"#e0c0c0"}}>All Off</button></div>
      <div style={S.verbList}><div style={S.verbHeaderRow}><span style={{flex:1,fontSize:11,color:"#999",fontFamily:"system-ui,sans-serif"}}>Verb</span><span style={{width:55,textAlign:"center",fontSize:10,color:"#999",fontFamily:"system-ui,sans-serif"}}>Pres.</span><span style={{width:55,textAlign:"center",fontSize:10,color:"#999",fontFamily:"system-ui,sans-serif"}}>Pass.</span></div>
        {list.map((v,i)=>(<div key={v.id} style={{...S.verbRow,background:i%2===0?"#fff":"#fafafa"}}><div style={{flex:1}}><span style={{fontSize:13,fontWeight:600,color:"#1a3a5c"}}>{v.verb}</span>{v.prep!=="—"&&<span style={{fontSize:10,color:"#aaa"}}> [{v.prep}]</span>}<br/><span style={{fontSize:11,color:"#888",fontStyle:"italic"}}>{v.transl}</span></div>
          <div style={{width:55,display:"flex",justifyContent:"center"}}><button onClick={()=>toggleVerb(v.id,"presente")} style={{...S.toggle,...(config[v.id]?.presente?S.toggleOn:S.toggleOff)}}>{config[v.id]?.presente?"ON":"OFF"}</button></div>
          <div style={{width:55,display:"flex",justifyContent:"center"}}><button onClick={()=>toggleVerb(v.id,"passado")} style={{...S.toggle,...(config[v.id]?.passado?S.toggleOn:S.toggleOff)}}>{config[v.id]?.passado?"ON":"OFF"}</button></div></div>))}</div>
      </div><NavBar/></div>);}

  if(screen==="history"){return(<div style={S.container}><div style={S.page}>
    <h1 style={{...S.title,fontSize:20}}>History</h1>
    {history.length===0?(<p style={{fontSize:14,color:"#888",textAlign:"center"}}>No sessions yet. Play a round first!</p>):(<>
      <p style={S.chartS}>{history.length} session{history.length!==1?"s":""}{trendText()}</p><Chart/>
      <div style={{width:"100%",display:"flex",flexDirection:"column",gap:4}}>
        {[...history].reverse().map((h,i)=>{const d=new Date(h.date);const ds=`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
          return(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:i%2===0?"#fff":"#f7f7f7",borderRadius:6,fontFamily:"system-ui,sans-serif",fontSize:12}}>
            <span style={{color:"#888"}}>{ds}</span><span style={{fontWeight:600,color:h.pct>=70?"#1e7a3a":h.pct>=40?"#d4850a":"#c0392b"}}>{h.pct}%</span><span style={{color:"#aaa"}}>{h.correct}/{h.total}</span></div>);})}</div>
      <button onClick={()=>{sDel(SK_HIST);setHistory([]);}} style={S.clr}>Reset history</button></>)}
    </div><NavBar/></div>);}

  if(screen==="results"){
    const rating=score.correct===10?{stars:"⭐⭐⭐",label:"Alegria!",confetti:true}:score.correct===9?{stars:"⭐⭐",label:"Óptimo!"}:score.correct===8?{stars:"⭐",label:"Fixe!"}:null;
    return(<div style={S.container}>
      {rating?.confetti&&<Confetti/>}
      <div style={S.card}>
        <h1 style={S.title}>Resultados</h1>
        {rating&&<div style={S.rating}><span style={S.ratingStars}>{rating.stars}</span><span style={S.ratingLabel}>{rating.label}</span></div>}
        <div style={S.big}>{pct}%</div>
        <p style={S.det}>{score.correct} correct / {score.wrong} wrong{score.accentMisses>0&&<span style={{color:"#d4850a"}}> · {score.accentMisses} accent{score.accentMisses>1?"s":""} missed</span>}</p>
        {wrongOnes.length>0&&(<div style={S.wl}><h3 style={S.wt}>Review these:</h3>{wrongOnes.map((w,i)=>(<div key={i} style={S.wi}><span style={S.wv}>{w.verb}</span><span style={S.wd}>{w.pronoun} · {w.tense} → <strong>{w.answer}</strong> <AudioBtn text={w.answer}/></span></div>))}</div>)}
        <div style={S.row}><button onClick={startGame} style={S.start}>Play Again</button><button onClick={()=>setScreen("menu")} style={S.back}>Menu</button></div>
      </div>
    </div>);}

  // ── PLAY ──
  const tl=card.tense==="presente"?"Presente":"Passado";const tc=card.tense==="presente"?"#1e7a3a":"#8e2b1d";
  return(<div style={S.container}>
    <div style={S.top}>
      <button onClick={()=>setScreen("menu")} style={S.closeBtn}>✕</button>
      <span>{idx+1}/{cards.length}</span>
      <span style={{fontWeight:"600"}}><span style={{color:"#1e7a3a"}}>{score.correct}</span>{" · "}<span style={{color:"#c0392b"}}>{score.wrong}</span></span>
    </div>
    <div style={S.play}>
      <div style={{...S.badge,background:tc}}>{tl}</div>
      <div style={S.prompt}><div style={S.pv}>{card.transl}</div></div>
      <div style={S.pLine}><span style={S.pText}>{card.pronoun}</span><span style={S.pDots}>· · ·</span></div>
      <input ref={inputRef} style={{...S.inp,borderColor:result==="correct"?(accentNote?"#d4850a":"#1e7a3a"):result==="wrong"?"#c0392b":"#ccc",background:result==="correct"?(accentNote?"#fef9ee":"#eef7f0"):result==="wrong"?"#fdf0ee":"#fff"}} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey} placeholder="Type conjugation..." disabled={result!==null} autoFocus/>
      {result===null&&<button onClick={check} style={S.chk}>Check</button>}
      {result==="correct"&&(<div style={S.fb}><span style={S.fbOk}>Correto! <AudioBtn text={card.answer}/></span>{accentNote&&<div style={S.aw}>Watch the accent: <strong>{accentNote}</strong> <AudioBtn text={accentNote}/></div>}
        <div style={S.af}><div style={S.afVerb}>{card.verb}{card.prep!=="—"&&<span style={S.afPrep}> [{card.prep}]</span>}</div>{PRONOUNS.map(p=>(<div key={p} style={S.afR}><span style={S.afP}>{p}</span><span style={p===card.pronoun?{fontWeight:700}:{}}>{card[card.tense][p]}</span><AudioBtn text={`${p}, ${card[card.tense][p]}`}/></div>))}</div>
        <button onClick={next} style={S.nxt}>Next →</button></div>)}
      {result==="wrong"&&(<div style={S.fb}><div style={S.fbNo}>✗ The answer is: <strong>{card.answer}</strong> <AudioBtn text={card.answer}/></div>
        <div style={S.af}><div style={S.afVerb}>{card.verb}{card.prep!=="—"&&<span style={S.afPrep}> [{card.prep}]</span>}</div>{PRONOUNS.map(p=>(<div key={p} style={S.afR}><span style={S.afP}>{p}</span><span style={p===card.pronoun?{fontWeight:700}:{}}>{card[card.tense][p]}</span><AudioBtn text={`${p}, ${card[card.tense][p]}`}/></div>))}</div>
        <button onClick={next} style={S.nxt}>Next →</button></div>)}
    </div>
  </div>);
}

const S={
  container:{minHeight:"100vh",background:"#fff",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Georgia','Times New Roman',serif",paddingBottom:80},
  page:{width:"100%",maxWidth:480,padding:"32px 24px",display:"flex",flexDirection:"column",gap:20,alignItems:"center"},
  card:{background:"#fff",borderRadius:16,padding:"28px 28px 24px",maxWidth:440,width:"100%",boxShadow:"0 4px 24px rgba(0,0,0,.08)",display:"flex",flexDirection:"column",alignItems:"center",gap:14},
  flag:{width:60,height:40,borderRadius:4,overflow:"hidden",display:"flex",position:"relative",border:"1px solid #ddd"},
  shield:{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:14,height:14,borderRadius:"50%",background:"#FFD700",border:"2px solid #c0392b"},
  title:{fontSize:24,fontWeight:700,color:"#1a3a5c",margin:0,letterSpacing:"-0.5px"},
  sub:{fontSize:14,color:"#888",margin:"-6px 0 4px"},
  og:{width:"100%",display:"flex",flexDirection:"column",gap:6},
  ol:{fontSize:11,textTransform:"uppercase",letterSpacing:1,color:"#999",fontFamily:"system-ui,sans-serif"},
  row:{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"},
  ob:{flex:1,padding:"8px 12px",border:"1.5px solid #ddd",borderRadius:8,background:"#fafafa",cursor:"pointer",fontSize:13,fontFamily:"system-ui,sans-serif",color:"#555",transition:"all .15s",minWidth:80},
  oba:{borderColor:"#1a3a5c",background:"#1a3a5c",color:"#fff"},
  start:{marginTop:4,padding:"12px 48px",background:"#1a3a5c",color:"#fff",border:"none",borderRadius:10,fontSize:16,fontFamily:"'Georgia',serif",cursor:"pointer"},
  back:{padding:"12px 32px",background:"transparent",color:"#1a3a5c",border:"1.5px solid #1a3a5c",borderRadius:10,fontSize:14,fontFamily:"'Georgia',serif",cursor:"pointer"},
  nav:{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #eee",display:"flex",justifyContent:"space-around",alignItems:"center",padding:"14px 0 max(16px,env(safe-area-inset-bottom))",zIndex:100,boxShadow:"0 -2px 12px rgba(0,0,0,.06)"},
  navBtn:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"10px 0",border:"none",background:"transparent",color:"#ccc",cursor:"pointer",transition:"color .15s"},
  navActive:{color:"#1a3a5c"},
  chartWrap:{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:4},
  chartT:{fontSize:13,textTransform:"uppercase",letterSpacing:1,color:"#1a3a5c",fontFamily:"system-ui,sans-serif",margin:0},
  chartS:{fontSize:12,color:"#888",fontFamily:"system-ui,sans-serif",margin:0},
  clr:{marginTop:4,padding:"4px 12px",background:"transparent",border:"1px solid #ddd",borderRadius:6,fontSize:11,fontFamily:"system-ui,sans-serif",color:"#aaa",cursor:"pointer"},
  verbList:{width:"100%",maxHeight:400,overflowY:"auto",display:"flex",flexDirection:"column",gap:0},
  verbHeaderRow:{display:"flex",alignItems:"center",padding:"4px 8px",borderBottom:"1px solid #eee"},
  verbRow:{display:"flex",alignItems:"center",padding:"8px",borderBottom:"1px solid #f5f5f5"},
  toggle:{padding:"3px 10px",borderRadius:4,border:"1px solid #ddd",fontSize:10,fontFamily:"system-ui,sans-serif",fontWeight:600,cursor:"pointer",transition:"all .15s",minWidth:36,textAlign:"center"},
  qToggle:{flex:1,padding:"9px 16px",borderRadius:8,border:"1.5px solid #ddd",fontSize:14,fontFamily:"system-ui,sans-serif",fontWeight:600,cursor:"pointer",transition:"all .15s",textAlign:"center"},
  toggleOn:{background:"#1e7a3a",color:"#fff",borderColor:"#1e7a3a"},
  toggleOff:{background:"#f5f5f5",color:"#bbb",borderColor:"#ddd"},
  bulkBtn:{padding:"5px 10px",border:"1px solid #ddd",borderRadius:6,fontSize:11,fontFamily:"system-ui,sans-serif",color:"#666",cursor:"pointer",background:"#fafafa"},
  top:{width:"100%",maxWidth:440,display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,fontFamily:"system-ui,sans-serif",fontSize:13,color:"#999"},
  closeBtn:{background:"none",border:"none",fontSize:16,color:"#bbb",cursor:"pointer",padding:"4px 8px",lineHeight:1},
  play:{background:"#fff",borderRadius:16,padding:"28px 28px 24px",maxWidth:440,width:"100%",boxShadow:"0 4px 24px rgba(0,0,0,.08)",display:"flex",flexDirection:"column",gap:14},
  badge:{alignSelf:"flex-start",color:"#fff",fontSize:11,fontFamily:"system-ui,sans-serif",fontWeight:600,textTransform:"uppercase",letterSpacing:1,padding:"3px 10px",borderRadius:4},
  prompt:{textAlign:"center",padding:"8px 0"},
  pv:{fontSize:28,fontWeight:700,color:"#1a3a5c",letterSpacing:"-0.5px"},
  reveal:{fontSize:16,color:"#888",marginTop:6,fontStyle:"italic"},
  pp:{fontSize:15,fontWeight:400,color:"#aaa"},
  pLine:{display:"flex",alignItems:"center",gap:10,padding:"4px 0"},
  pText:{fontSize:18,color:"#8e2b1d",fontStyle:"italic",fontWeight:600,minWidth:120},
  pDots:{color:"#ddd",fontSize:18,letterSpacing:4},
  inp:{width:"100%",padding:"12px 14px",fontSize:18,fontFamily:"'Georgia',serif",border:"2px solid #ccc",borderRadius:10,outline:"none",boxSizing:"border-box",transition:"border-color .2s,background .2s"},
  chk:{padding:10,background:"#1a3a5c",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontFamily:"'Georgia',serif",cursor:"pointer"},
  fb:{display:"flex",flexDirection:"column",gap:10},
  fbOk:{color:"#1e7a3a",fontSize:18,fontWeight:700,textAlign:"center"},
  fbNo:{color:"#c0392b",fontSize:15,textAlign:"center",lineHeight:"1.6"},
  aw:{textAlign:"center",fontSize:13,color:"#d4850a",fontFamily:"system-ui,sans-serif",background:"#fef9ee",padding:"6px 12px",borderRadius:6,border:"1px solid #f0ddb0"},
  saBtn:{padding:"6px 12px",background:"transparent",border:"1px solid #ddd",borderRadius:6,fontSize:12,fontFamily:"system-ui,sans-serif",color:"#888",cursor:"pointer",alignSelf:"center"},
  af:{background:"#faf8f5",borderRadius:8,padding:"10px 14px",display:"flex",flexDirection:"column",gap:3,fontSize:13,fontFamily:"system-ui,sans-serif"},
  afR:{display:"flex",gap:8,alignItems:"center"},
  afP:{color:"#999",fontStyle:"italic",minWidth:110},
  nxt:{padding:10,background:"#1a3a5c",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontFamily:"'Georgia',serif",cursor:"pointer"},
  audio:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:26,height:26,borderRadius:"50%",border:"1px solid #ddd",background:"#fafafa",cursor:"pointer",color:"#1a3a5c",verticalAlign:"middle",marginLeft:4,padding:0,transition:"all .15s"},
  rating:{display:"flex",flexDirection:"column",alignItems:"center",gap:2},
  ratingStars:{fontSize:28,letterSpacing:2},
  ratingLabel:{fontSize:20,fontWeight:700,color:"#1a3a5c",fontFamily:"'Georgia',serif"},
  big:{fontSize:64,fontWeight:700,color:"#1a3a5c",margin:"8px 0 0"},
  det:{fontSize:14,color:"#888",fontFamily:"system-ui,sans-serif",margin:"0 0 8px"},
  wl:{width:"100%",maxHeight:240,overflowY:"auto",display:"flex",flexDirection:"column",gap:6},
  wt:{fontSize:13,textTransform:"uppercase",letterSpacing:1,color:"#c0392b",fontFamily:"system-ui,sans-serif",margin:"0 0 4px"},
  wi:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 10px",background:"#fdf0ee",borderRadius:6,fontSize:13,fontFamily:"system-ui,sans-serif"},
  wv:{fontWeight:600,color:"#1a3a5c"},
  wd:{color:"#666",textAlign:"right"},
  version:{position:"fixed",bottom:88,left:"50%",transform:"translateX(-50%)",fontSize:10,color:"#999",fontFamily:"monospace",opacity:0.8,zIndex:50},
};
