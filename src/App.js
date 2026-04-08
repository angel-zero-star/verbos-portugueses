import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart, ReferenceLine, Cell } from "recharts";
import { Play, Trophy, Settings as SettingsIcon, X, Volume2, Sun, Moon, ArrowRight, Check, Sparkles, RotateCcw, Layers, MessageCircle, BookOpen, SlidersHorizontal } from "lucide-react";
import packageInfo from "../package.json";
import { cn } from "./lib/utils";
import { useTheme } from "./lib/useTheme";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";
import { Input } from "./components/ui/Input";
import { Badge } from "./components/ui/Badge";
import { SENTENCES } from "./data/sentences";
import { PALAVRAS } from "./data/palavras";
import { EXPRESSOES } from "./data/expressoes";
import { evaluateSentence } from "./lib/evaluateSentence";

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
  { id:"haver", verb:"haver", transl:"to exist (for/ago)", prep:"de", type:"irregular", impessoal:true,
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
  { id:"acontecer", verb:"acontecer", transl:"to happen", prep:"—", type:"regular-er", impessoal:true, presente:{eu:"aconteço",tu:"aconteces","ele/ela":"acontece",nós:"acontecemos","eles(as)/vocês":"acontecem"}, passado:{eu:"aconteci",tu:"aconteceste","ele/ela":"aconteceu",nós:"acontecemos","eles(as)/vocês":"aconteceram"}},
  { id:"descer", verb:"descer", transl:"to go down", prep:"—", type:"regular-er", presente:{eu:"desço",tu:"desces","ele/ela":"desce",nós:"descemos","eles(as)/vocês":"descem"}, passado:{eu:"desci",tu:"desceste","ele/ela":"desceu",nós:"descemos","eles(as)/vocês":"desceram"}},
  { id:"dever", verb:"dever", transl:"must / to have to", prep:"—", type:"regular-er", presente:{eu:"devo",tu:"deves","ele/ela":"deve",nós:"devemos","eles(as)/vocês":"devem"}, passado:{eu:"devi",tu:"deveste","ele/ela":"deveu",nós:"devemos","eles(as)/vocês":"deveram"}},
  { id:"chover", verb:"chover", transl:"to rain", prep:"—", type:"regular-er", impessoal:true, presente:{eu:"chovo",tu:"choves","ele/ela":"chove",nós:"chovemos","eles(as)/vocês":"chovem"}, passado:{eu:"chovi",tu:"choveste","ele/ela":"choveu",nós:"chovemos","eles(as)/vocês":"choveram"}},
  // ── REGULAR -IR ──
  { id:"partir", verb:"partir", transl:"to leave / break", prep:"de, para", type:"regular-ir", presente:{eu:"parto",tu:"partes","ele/ela":"parte",nós:"partimos","eles(as)/vocês":"partem"}, passado:{eu:"parti",tu:"partiste","ele/ela":"partiu",nós:"partimos","eles(as)/vocês":"partiram"}},
  { id:"assistir", verb:"assistir", transl:"to watch / attend", prep:"a", type:"regular-ir", presente:{eu:"assisto",tu:"assistes","ele/ela":"assiste",nós:"assistimos","eles(as)/vocês":"assistem"}, passado:{eu:"assisti",tu:"assististe","ele/ela":"assistiu",nós:"assistimos","eles(as)/vocês":"assistiram"}},
  { id:"discutir", verb:"discutir", transl:"to discuss", prep:"—", type:"regular-ir", presente:{eu:"discuto",tu:"discutes","ele/ela":"discute",nós:"discutimos","eles(as)/vocês":"discutem"}, passado:{eu:"discuti",tu:"discutiste","ele/ela":"discutiu",nós:"discutimos","eles(as)/vocês":"discutiram"}},
  { id:"abrir", verb:"abrir", transl:"to open", prep:"—", type:"regular-ir", presente:{eu:"abro",tu:"abres","ele/ela":"abre",nós:"abrimos","eles(as)/vocês":"abrem"}, passado:{eu:"abri",tu:"abriste","ele/ela":"abriu",nós:"abrimos","eles(as)/vocês":"abriram"}},
  // ── REGULAR (added in content update) ──
  { id:"ajudar", verb:"ajudar", transl:"to help", prep:"—", type:"regular-ar", presente:{eu:"ajudo",tu:"ajudas","ele/ela":"ajuda",nós:"ajudamos","eles(as)/vocês":"ajudam"}, passado:{eu:"ajudei",tu:"ajudaste","ele/ela":"ajudou",nós:"ajudámos","eles(as)/vocês":"ajudaram"}},
  { id:"voltar", verb:"voltar", transl:"to come back", prep:"a, para", type:"regular-ar", presente:{eu:"volto",tu:"voltas","ele/ela":"volta",nós:"voltamos","eles(as)/vocês":"voltam"}, passado:{eu:"voltei",tu:"voltaste","ele/ela":"voltou",nós:"voltámos","eles(as)/vocês":"voltaram"}},
  { id:"entregar", verb:"entregar", transl:"to deliver", prep:"a", type:"regular-ar", presente:{eu:"entrego",tu:"entregas","ele/ela":"entrega",nós:"entregamos","eles(as)/vocês":"entregam"}, passado:{eu:"entreguei",tu:"entregaste","ele/ela":"entregou",nós:"entregámos","eles(as)/vocês":"entregaram"}},
  { id:"convidar", verb:"convidar", transl:"to invite", prep:"para", type:"regular-ar", presente:{eu:"convido",tu:"convidas","ele/ela":"convida",nós:"convidamos","eles(as)/vocês":"convidam"}, passado:{eu:"convidei",tu:"convidaste","ele/ela":"convidou",nós:"convidámos","eles(as)/vocês":"convidaram"}},
  { id:"concordar", verb:"concordar", transl:"to agree", prep:"com", type:"regular-ar", presente:{eu:"concordo",tu:"concordas","ele/ela":"concorda",nós:"concordamos","eles(as)/vocês":"concordam"}, passado:{eu:"concordei",tu:"concordaste","ele/ela":"concordou",nós:"concordámos","eles(as)/vocês":"concordaram"}},
  { id:"mostrar", verb:"mostrar", transl:"to show", prep:"a", type:"regular-ar", presente:{eu:"mostro",tu:"mostras","ele/ela":"mostra",nós:"mostramos","eles(as)/vocês":"mostram"}, passado:{eu:"mostrei",tu:"mostraste","ele/ela":"mostrou",nós:"mostrámos","eles(as)/vocês":"mostraram"}},
  { id:"apanhar", verb:"apanhar", transl:"to catch / pick up", prep:"—", type:"regular-ar", presente:{eu:"apanho",tu:"apanhas","ele/ela":"apanha",nós:"apanhamos","eles(as)/vocês":"apanham"}, passado:{eu:"apanhei",tu:"apanhaste","ele/ela":"apanhou",nós:"apanhámos","eles(as)/vocês":"apanharam"}},
  { id:"olhar", verb:"olhar", transl:"to look at", prep:"para", type:"regular-ar", presente:{eu:"olho",tu:"olhas","ele/ela":"olha",nós:"olhamos","eles(as)/vocês":"olham"}, passado:{eu:"olhei",tu:"olhaste","ele/ela":"olhou",nós:"olhámos","eles(as)/vocês":"olharam"}},
  { id:"surfar", verb:"surfar", transl:"to surf", prep:"—", type:"regular-ar", presente:{eu:"surfo",tu:"surfas","ele/ela":"surfa",nós:"surfamos","eles(as)/vocês":"surfam"}, passado:{eu:"surfei",tu:"surfaste","ele/ela":"surfou",nós:"surfámos","eles(as)/vocês":"surfaram"}},
  { id:"vender", verb:"vender", transl:"to sell", prep:"—", type:"regular-er", presente:{eu:"vendo",tu:"vendes","ele/ela":"vende",nós:"vendemos","eles(as)/vocês":"vendem"}, passado:{eu:"vendi",tu:"vendeste","ele/ela":"vendeu",nós:"vendemos","eles(as)/vocês":"venderam"}},
  { id:"escolher", verb:"escolher", transl:"to choose", prep:"—", type:"regular-er", presente:{eu:"escolho",tu:"escolhes","ele/ela":"escolhe",nós:"escolhemos","eles(as)/vocês":"escolhem"}, passado:{eu:"escolhi",tu:"escolheste","ele/ela":"escolheu",nós:"escolhemos","eles(as)/vocês":"escolheram"}},
];

// Category tagging — applied to every verb in ALL_VERBS.
// "irregular"/"regular" mutually exclusive; a verb may have multiple extra tags.
const CATEGORY_MODAL      = new Set(["poder","querer","dever","precisar","saber"]);
const CATEGORY_MOVEMENT   = new Set(["ir","vir","chegar","partir","sair","voltar","entrar","subir","descer","levar","trazer","atravessar","apanhar","transportar"]);
const CATEGORY_STATE      = new Set(["ser","estar","ter","ficar","parecer","haver","caber"]);
function categoriesFor(v){
  const cats = [v.type==="irregular" ? "irregular" : "regular"];
  if(CATEGORY_MODAL.has(v.id))    cats.push("modal");
  if(CATEGORY_MOVEMENT.has(v.id)) cats.push("movement");
  if(CATEGORY_STATE.has(v.id))    cats.push("state");
  // "action" = any verb not already tagged with modal/movement/state
  if(cats.length===1) cats.push("action");
  return cats;
}
// Enrich every verb in-place so all downstream code sees `.categories`.
ALL_VERBS.forEach(v=>{ v.categories = categoriesFor(v); });

const CONJUGATE_CAT_KEYS = ["irregular","regular","modal","movement","state","action"];
const CONJUGATE_CAT_LABELS = {
  irregular:"Irregular", regular:"Regular", modal:"Modal",
  movement:"Movement",   state:"State",     action:"Action",
};

const PRONOUNS=["eu","tu","ele/ela","nós","eles(as)/vocês"];
const PRONOUN_LABELS={"eu":"eu","tu":"tu","ele/ela":"ele(a)/você","nós":"nós","eles(as)/vocês":"eles(as)/vocês"};
const pLabel=(p)=>PRONOUN_LABELS[p]||p;
const DISPLAY_PRONOUNS=["eu","tu","ele","ela","você","nós","eles","elas","vocês"];
const PRONOUN_KEY={"eu":"eu","tu":"tu","ele":"ele/ela","ela":"ele/ela","você":"ele/ela","nós":"nós","eles":"eles(as)/vocês","elas":"eles(as)/vocês","vocês":"eles(as)/vocês"};
const TENSES=["presente","passado"];
const SK_HIST="verbos-history";
const SK_CONF="verbos-config";
const SK_FILTERS="verbos-filters";
const SK_MODE="verbos-mode";
const SK_FILTER_CONJ="verbos-filter-conjugate";
const SK_FILTER_PAL="verbos-filter-palavras";
const SK_FILTER_FRA="verbos-filter-frases";

function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function stripAccents(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function norm(s){return s.trim().toLowerCase().replace(/\s+/g," ");}
function cmpAns(i,c){const ni=norm(i),nc=norm(c);if(ni===nc)return"exact";if(stripAccents(ni)===stripAccents(nc))return"accent";return"wrong";}
// For Palavras/Frases: split answer on "/" (e.g. "casado / casada") and accept either form.
// Returns "exact" | "accent" | "wrong".
function cmpMulti(input, answer){
  const parts = answer.split("/").map(s=>s.trim()).filter(Boolean);
  let best="wrong";
  for(const p of parts){
    const r=cmpAns(input,p);
    if(r==="exact")return"exact";
    if(r==="accent")best="accent";
  }
  return best;
}

function speak(text){if(!window.speechSynthesis)return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="pt-PT";u.rate=0.85;const v=window.speechSynthesis.getVoices();const pt=v.find(x=>x.lang==="pt-PT")||v.find(x=>x.lang.startsWith("pt"));if(pt)u.voice=pt;window.speechSynthesis.speak(u);}

function AudioBtn({text,className,size=14}){
  return (
    <button
      type="button"
      onClick={(e)=>{e.stopPropagation();speak(text);}}
      title="Listen"
      className={cn(
        "inline-flex items-center justify-center h-7 w-7 rounded-full border border-border bg-surface text-text-sub hover:text-primary hover:border-primary/60 transition-colors shrink-0",
        className
      )}
    >
      <Volume2 size={size} strokeWidth={2.25}/>
    </button>
  );
}

function Confetti(){
  const ref=useRef(null);
  useEffect(()=>{
    const canvas=ref.current;const ctx=canvas.getContext("2d");
    canvas.width=window.innerWidth;canvas.height=window.innerHeight;
    const colors=["#3B82F6","#22C55E","#EF4444","#F59E0B","#F0F0F5"];
    const pts=Array.from({length:120},()=>({
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

// ── Animated number counter ──
function AnimatedNumber({value,duration=1.2}){
  const mv=useMotionValue(0);
  const rounded=useTransform(mv,(v)=>Math.round(v));
  const [display,setDisplay]=useState(0);
  useEffect(()=>{
    const controls=animate(mv,value,{duration,ease:"easeOut"});
    const unsub=rounded.on("change",(v)=>setDisplay(v));
    return ()=>{controls.stop();unsub();};
  },[value,duration,mv,rounded]);
  return <>{display}</>;
}

// ── Toggle pill — monotone secondary look (Linear-like transparency) ──
function TogglePill({active,onClick,children,disabled}){
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative px-5 h-11 rounded-md text-sm font-medium border transition-all duration-200 flex-1 min-w-[88px]",
        disabled && "opacity-40 pointer-events-none",
        active
          ? "bg-secondary/10 text-text border-secondary/25"
          : "bg-transparent text-text-sub border-border hover:text-text hover:border-muted"
      )}
    >
      {children}
    </button>
  );
}

// ── Segmented group toggle (two options, sliding indicator) ──
function SegmentedToggle({options,value,onChange}){
  return (
    <div className="relative flex p-1 bg-secondary/5 border border-border rounded-md">
      {options.map(opt=>{
        const active=value===opt.value;
        return (
          <button
            key={opt.value}
            onClick={()=>onChange(opt.value)}
            className="relative flex-1 h-9 rounded-sm text-sm font-medium transition-colors z-10"
          >
            {active && (
              <motion.div
                layoutId="seg-toggle-pill"
                className="absolute inset-0 bg-secondary/15 border border-secondary/25 rounded-sm"
                transition={{type:"spring",stiffness:400,damping:32}}
              />
            )}
            <span className={cn("relative z-10",active?"text-text":"text-text-sub")}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Filter sheet (modal) — used for per-mode gear icons ──
function FilterSheet({open, onClose, title, options, selected, onToggle, count, countLabel}){
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            transition={{duration:0.2}}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{y:40,opacity:0}}
            animate={{y:0,opacity:1}}
            exit={{y:40,opacity:0}}
            transition={{type:"spring",stiffness:320,damping:32}}
            className="fixed left-0 right-0 bottom-0 z-50 flex justify-center"
            style={{paddingBottom:"max(16px,env(safe-area-inset-bottom))"}}
          >
            <div className="w-full max-w-[480px] mx-4 bg-surface border border-secondary/25 rounded-lg shadow-[0_4px_8px_0_rgba(0,0,0,0.4)] p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-text tracking-tight">{title}</h3>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-md border border-border bg-secondary/05 text-text-sub hover:text-text flex items-center justify-center"
                >
                  <X size={14}/>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {options.map(opt=>(
                  <div key={opt.key} className={opt.full?"w-full":"flex-1 min-w-[88px]"}>
                  <TogglePill
                    active={!!selected[opt.key]}
                    onClick={()=>onToggle(opt.key)}
                  >
                    {opt.label}
                  </TogglePill>
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-mono-ui text-text-sub uppercase tracking-[0.15em] text-center">
                {count} {countLabel}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Portuguese flag (simple SVG)
function FlagPT({className}){
  return (
    <svg viewBox="0 0 60 40" className={className} aria-label="Portugal">
      <rect width="24" height="40" fill="#046A38"/>
      <rect x="24" width="36" height="40" fill="#DA291C"/>
      <circle cx="24" cy="20" r="8" fill="#FFE900" stroke="#000" strokeWidth="0.5"/>
      <circle cx="24" cy="20" r="5" fill="#DA291C" stroke="#000" strokeWidth="0.5"/>
    </svg>
  );
}

// ── Page wrapper with consistent padding + animated entrance ──
function Screen({children,className}){
  return (
    <motion.div
      initial={{opacity:0,y:8}}
      animate={{opacity:1,y:0}}
      exit={{opacity:0,y:-4}}
      transition={{duration:0.22,ease:"easeOut"}}
      className={cn(
        "w-full max-w-[480px] mx-auto px-6 md:px-10 pt-6 pb-28 flex flex-col gap-4",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export default function App(){
  const {theme,toggle:toggleTheme}=useTheme();
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
  const lastEnterRef=useRef(0);
  const [keyboardOpen,setKeyboardOpen]=useState(false);
  const [gameMode,setGameMode]=useState("conjugation"); // "conjugation" | "palavras" | "frases"
  const [showSplash,setShowSplash]=useState(true);

  // Per-mode category filters (multi-select). All ON by default.
  const [conjFilter,setConjFilter]=useState({irregular:true,regular:true,modal:true,movement:true,state:true,action:true});
  const [palFilter,setPalFilter]=useState({substantivo:true,adjetivo:true});
  const [fraFilter,setFraFilter]=useState({frases:true,expressoes:true});
  const [filterSheet,setFilterSheet]=useState(null); // null | "conjugation" | "palavras" | "frases"

  useEffect(()=>{
    window.speechSynthesis?.getVoices();
    const h=sGet(SK_HIST);if(h&&Array.isArray(h))setHistory(h);
    const c=sGet(SK_CONF);if(c&&typeof c==="object"){const def=defaultConfig();Object.keys(def).forEach(k=>{if(!c[k])c[k]=def[k];});setConfig(c);}
    const f=sGet(SK_FILTERS);if(f){setFilterIrregular(f.filterIrregular??true);setFilterRegular(f.filterRegular??true);setTensePresente(f.tensePresente??true);setTensePassado(f.tensePassado??false);}
    const m=sGet(SK_MODE);
    if(m==="conjugation"||m==="palavras"||m==="frases")setGameMode(m);
    else if(m==="sentences")setGameMode("frases"); // migrate old key
    const fc=sGet(SK_FILTER_CONJ);if(fc&&typeof fc==="object")setConjFilter(f=>({...f,...fc}));
    const fp=sGet(SK_FILTER_PAL);if(fp&&typeof fp==="object")setPalFilter(f=>({...f,...fp}));
    const ff=sGet(SK_FILTER_FRA);if(ff&&typeof ff==="object")setFraFilter(f=>({...f,...ff}));
  },[]);

  useEffect(()=>{sSet(SK_MODE,gameMode);},[gameMode]);
  useEffect(()=>{sSet(SK_FILTER_CONJ,conjFilter);},[conjFilter]);
  useEffect(()=>{sSet(SK_FILTER_PAL,palFilter);},[palFilter]);
  useEffect(()=>{sSet(SK_FILTER_FRA,fraFilter);},[fraFilter]);

  useEffect(()=>{
    const t=setTimeout(()=>setShowSplash(false),1300);
    return()=>clearTimeout(t);
  },[]);

  useEffect(()=>{sSet(SK_FILTERS,{filterIrregular,filterRegular,tensePresente,tensePassado});},[filterIrregular,filterRegular,tensePresente,tensePassado]);

  const saveConfig=(nc)=>{setConfig(nc);sSet(SK_CONF,nc);};

  // Filtered pools (for counts shown in filter sheets AND for startGame)
  const activeConjVerbs=()=>{
    const keys=Object.entries(conjFilter).filter(([,v])=>v).map(([k])=>k);
    const active=keys.length?keys:CONJUGATE_CAT_KEYS;
    return ALL_VERBS.filter(v=>v.categories.some(c=>active.includes(c)));
  };
  const activePalavras=()=>{
    const keys=Object.entries(palFilter).filter(([,v])=>v).map(([k])=>k);
    const active=keys.length?keys:["substantivo","adjetivo"];
    return PALAVRAS.filter(p=>active.includes(p.cat));
  };
  const activeFrases=()=>{
    const keys=Object.entries(fraFilter).filter(([,v])=>v).map(([k])=>k);
    const active=keys.length?keys:["frases","expressoes"];
    const pool=[];
    if(active.includes("frases")){
      for(const s of SENTENCES){
        if(s.tense==="presente"&&!tensePresente)continue;
        if(s.tense==="passado"&&!tensePassado)continue;
        pool.push({kind:"sentence",id:s.id,verb:s.verb,tense:s.tense,en:s.en,pt:s.pt,alternatives:s.alternatives||[]});
      }
    }
    if(active.includes("expressoes")){
      for(const e of EXPRESSOES){pool.push({kind:"expressao",en:e.en,pt:e.pt});}
    }
    return pool;
  };

  const startGame=()=>{
    if(gameMode==="palavras"){
      const pool=activePalavras();
      if(pool.length===0){alert("No palavras match your filters!");return;}
      const picked=shuffle(pool).slice(0,10).map(p=>({
        mode:"palavras",
        en:p.en,
        answer:p.pt,
        cat:p.cat,
      }));
      setCards(picked);setIdx(0);setInput("");setResult(null);setAccentNote(null);
      setScore({correct:0,wrong:0,accentMisses:0});setWrongOnes([]);setScreen("play");
      return;
    }
    if(gameMode==="frases"){
      const pool=activeFrases();
      if(pool.length===0){alert("No frases match your filters!");return;}
      const picked=shuffle(pool).slice(0,8).map(p=>p.kind==="sentence"?({
        mode:"frases",
        subMode:"sentence",
        id:p.id,
        verb:p.verb,
        tense:p.tense,
        en:p.en,
        answer:p.pt,
        alternatives:p.alternatives,
      }):({
        mode:"frases",
        subMode:"expressao",
        en:p.en,
        answer:p.pt,
      }));
      setCards(picked);setIdx(0);setInput("");setResult(null);setAccentNote(null);
      setScore({correct:0,wrong:0,accentMisses:0});setWrongOnes([]);setScreen("play");
      return;
    }
    // Conjugation
    const gen=[];
    const verbs=activeConjVerbs();
    for(const v of verbs){
      const conf=config[v.id];if(!conf)continue;
      const tenses=[];
      if(conf.presente&&tensePresente)tenses.push("presente");
      if(conf.passado&&tensePassado)tenses.push("passado");
      if(tenses.length===0)continue;
      for(const t of tenses){
        const pr=v.impessoal?"impessoal (ele)":DISPLAY_PRONOUNS[Math.floor(Math.random()*DISPLAY_PRONOUNS.length)];
        const prKey=v.impessoal?"ele/ela":PRONOUN_KEY[pr];
        gen.push({...v,mode:"conjugation",tense:t,pronoun:pr,pronounKey:prKey,answer:v[t][prKey]});
      }
    }
    if(gen.length===0){alert("No verbs match your filters!");return;}
    setCards(shuffle(gen).slice(0,10));setIdx(0);setInput("");setResult(null);setAccentNote(null);
    setScore({correct:0,wrong:0,accentMisses:0});setWrongOnes([]);setScreen("play");
  };

  const check=()=>{
    if(!input.trim())return;
    const c=cards[idx];
    // Palavras + Frases/expressao: simple slash-tolerant, accent-tolerant match.
    if(c.mode==="palavras" || (c.mode==="frases" && c.subMode==="expressao")){
      const r=cmpMulti(input,c.answer);
      if(r==="exact"){setResult("correct");setAccentNote(null);setScore(s=>({...s,correct:s.correct+1}));}
      else if(r==="accent"){setResult("correct");setAccentNote(c.answer);setScore(s=>({...s,correct:s.correct+1,accentMisses:s.accentMisses+1}));}
      else{setResult("wrong");setAccentNote(null);setScore(s=>({...s,wrong:s.wrong+1}));setWrongOnes(w=>[...w,{...c,userAnswer:input}]);}
      return;
    }
    if(c.mode==="frases" && c.subMode==="sentence"){
      const {result:er,note}=evaluateSentence(input,c.answer,c.alternatives);
      if(er==="correct"){
        setResult("correct");setAccentNote(note?c.answer:null);
        setScore(s=>({...s,correct:s.correct+1,accentMisses:s.accentMisses+(note?1:0)}));
      }else if(er==="close"){
        setResult("correct");setAccentNote(c.answer);
        setScore(s=>({...s,correct:s.correct+1,accentMisses:s.accentMisses+1}));
      }else{
        setResult("wrong");setAccentNote(null);
        setScore(s=>({...s,wrong:s.wrong+1}));
        setWrongOnes(w=>[...w,{...c,userAnswer:input}]);
      }
      return;
    }
    const r=cmpAns(input,c.answer);
    if(r==="exact"){setResult("correct");setAccentNote(null);setScore(s=>({...s,correct:s.correct+1}));}
    else if(r==="accent"){setResult("correct");setAccentNote(c.answer);setScore(s=>({...s,correct:s.correct+1,accentMisses:s.accentMisses+1}));}
    else{setResult("wrong");setAccentNote(null);setScore(s=>({...s,wrong:s.wrong+1}));setWrongOnes(w=>[...w,c]);}
  };

  const next=()=>{if(idx+1>=cards.length){const sess={date:new Date().toISOString(),mode:gameMode,correct:score.correct,wrong:score.wrong,accentMisses:score.accentMisses,total:cards.length,pct:Math.round((score.correct/cards.length)*100)};const nh=[...history,sess];setHistory(nh);sSet(SK_HIST,nh);setScreen("results");}else{setIdx(i=>i+1);setInput("");setResult(null);setAccentNote(null);setTimeout(()=>inputRef.current?.focus(),50);}};
  // Single Enter handler — debounced to avoid double-fire (key repeat / fast double-press)
  useEffect(()=>{
    if(screen!=="play")return;
    const handler=(e)=>{
      if(e.key!=="Enter"||e.repeat)return;
      const now=Date.now();
      if(now-lastEnterRef.current<350)return;
      lastEnterRef.current=now;
      e.preventDefault();
      if(result===null)check();else next();
    };
    window.addEventListener("keydown",handler);
    return()=>window.removeEventListener("keydown",handler);
  },[screen,result,check,next]);

  // Track visual viewport so the play wrapper fits exactly inside the visible
  // area (shrinks when the keyboard opens). --vvh is consumed by the play
  // wrapper style below. No scroll lock — if content still doesn't fit on
  // very small screens the browser can scroll as normal.
  useEffect(()=>{
    const vv=window.visualViewport;
    const update=()=>{
      const h=vv?vv.height:window.innerHeight;
      document.documentElement.style.setProperty("--vvh",`${h}px`);
      setKeyboardOpen(window.innerHeight-h>150);
    };
    update();
    window.addEventListener("resize",update);
    vv?.addEventListener("resize",update);
    vv?.addEventListener("scroll",update);
    return()=>{
      window.removeEventListener("resize",update);
      vv?.removeEventListener("resize",update);
      vv?.removeEventListener("scroll",update);
    };
  },[]);


  const card=cards[idx];
  const total=score.correct+score.wrong;
  const pct=total>0?Math.round((score.correct/total)*100):0;
  const chartData=history.map((h,i)=>{const d=new Date(h.date);return{label:`${d.getDate()}/${d.getMonth()+1}`,score:h.pct,session:i+1,mode:h.mode||"conjugation"};});
  const trendText=()=>{
    if(history.length<2)return null;
    const l5=history.slice(-5),f5=history.slice(0,Math.min(5,history.length));
    const ar=l5.reduce((a,b)=>a+b.pct,0)/l5.length;
    const af=f5.reduce((a,b)=>a+b.pct,0)/f5.length;
    const d=Math.round(ar-af);
    if(d>5)return <span className="text-accent"> · Up +{d}%</span>;
    if(d<-5)return <span className="text-danger"> · Down {d}%</span>;
    return <span className="text-text-sub"> · Steady</span>;
  };

  const Chart=()=>(
    <div className="w-full h-[160px]">
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{top:5,right:5,bottom:5,left:-20}} barSize={14}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false}/>
          <XAxis dataKey="label" tick={{fontSize:10,fill:"hsl(var(--text-sub))"}} axisLine={false} tickLine={false}/>
          <YAxis domain={[0,100]} tick={{fontSize:10,fill:"hsl(var(--text-sub))"}} axisLine={false} tickLine={false}/>
          <Tooltip
            contentStyle={{
              fontSize:12,
              borderRadius:8,
              border:"1px solid hsl(var(--border))",
              background:"hsl(var(--surface))",
              color:"hsl(var(--text))",
            }}
            cursor={{fill:"hsl(var(--surface))"}}
            formatter={v=>[`${v}%`,"Score"]}
          />
          <Bar dataKey="score" radius={[4,4,0,0]} isAnimationActive={true} animationDuration={600}>
            {chartData.map((d,i)=>(
              <Cell key={i} fill={d.mode==="frases"||d.mode==="sentences"?"hsl(var(--warn))":d.mode==="palavras"?"hsl(var(--accent))":"hsl(var(--primary))"}/>
            ))}
          </Bar>
          <ReferenceLine y={75} stroke="hsl(var(--border))" strokeDasharray="3 3" strokeWidth={1}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const toggleVerb=(id,tense)=>{const nc={...config,[id]:{...config[id],[tense]:!config[id][tense]}};saveConfig(nc);};
  const bulkToggle=(type,tense,val)=>{const nc={...config};ALL_VERBS.filter(v=>type==="all"||v.type===type||(type==="regular"&&v.type!=="irregular")).forEach(v=>{nc[v.id]={...nc[v.id],[tense]:val};});saveConfig(nc);};

  // (TopBar removed — theme toggle now lives in Settings, version shown on menu footer)
  const TopBar=()=>null;

  // ── Bottom navigation with sliding pill ──
  const NavBar=()=>{
    const items=[
      {key:"menu",icon:Play,label:"Play"},
      {key:"history",icon:Trophy,label:"Score"},
      {key:"settings",icon:SettingsIcon,label:"Settings"},
    ];
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-surface/85 backdrop-blur-xl border-t border-border" style={{paddingBottom:"max(12px,env(safe-area-inset-bottom))"}}>
        <div className="max-w-[480px] mx-auto px-4 pt-3 flex items-center justify-around gap-2">
          {items.map(it=>{
            const active=screen===it.key;
            const Icon=it.icon;
            return (
              <button
                key={it.key}
                onClick={()=>setScreen(it.key)}
                className="relative flex-1 h-12 rounded-md flex flex-col items-center justify-center gap-1 transition-colors"
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-secondary/10 border border-secondary/25 rounded-md"
                    transition={{type:"spring",stiffness:400,damping:32}}
                  />
                )}
                <Icon
                  size={20}
                  strokeWidth={2.25}
                  className={cn("relative z-10 transition-colors",active?"text-text":"text-muted")}
                />
                <span className={cn("relative z-10 text-[9px] font-mono-ui uppercase tracking-[0.1em]",active?"text-text":"text-muted")}>
                  {it.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  };

  // ─────────────────────── SPLASH ───────────────────────
  if(showSplash){
    return (
      <div className="fixed inset-0 bg-bg text-text flex flex-col items-center justify-center gap-5">
        <motion.div
          layoutId="brand-flag"
          transition={{type:"spring",stiffness:260,damping:30}}
        >
          <FlagPT className="w-24 h-auto rounded-sm shadow-[0_0_0_1px_hsl(var(--border))]"/>
        </motion.div>
        <motion.h1
          layoutId="brand-title"
          className="font-display text-[72px] leading-[1] tracking-tightest text-text"
          transition={{type:"spring",stiffness:260,damping:30}}
        >
          Verbos
        </motion.h1>
      </div>
    );
  }

  // ─────────────────────── MENU ───────────────────────
  if(screen==="menu"){
    const conjCount=activeConjVerbs().length;
    const palCount=activePalavras().length;
    const fraCount=activeFrases().length;
    const MODE_TILES=[
      {value:"conjugation",icon:Layers,title:"Conjugate",sub:"Verb forms",count:conjCount,countLabel:"verbos"},
      {value:"palavras",   icon:BookOpen,title:"Palavras",sub:"Nouns & adjectives",count:palCount,countLabel:"palavras"},
      {value:"frases",     icon:MessageCircle,title:"Frases",sub:"Sentences & expressions",count:fraCount,countLabel:"frases"},
    ];
    return (
      <div className="min-h-screen bg-bg text-text">
        <TopBar/>
        <AnimatePresence mode="wait">
          <Screen key="menu">

            <div className="flex justify-end">
              <button
                className="h-9 w-9 rounded-full overflow-hidden shadow-[0_0_0_1px_hsl(var(--border))] hover:shadow-[0_0_0_2px_hsl(var(--muted))] transition-shadow"
                title="Language: Portuguese"
              >
                <FlagPT className="h-full w-auto -translate-x-2"/>
              </button>
            </div>

            {/* 3 mode tiles — per Figma spec */}
            <div className="flex flex-col gap-3">
              {MODE_TILES.map(m=>{
                const Icon=m.icon;
                const onPlay=()=>{setGameMode(m.value);setTimeout(startGame,0);};
                return (
                  <motion.div
                    key={m.value}
                    initial={{opacity:0,y:8}}
                    animate={{opacity:1,y:0}}
                    transition={{duration:0.25,ease:"easeOut"}}
                  >
                    <Card className="p-5 flex flex-col gap-2 items-start">
                      <div className="flex items-start justify-between w-full">
                        <div className="h-10 w-10 rounded-full bg-secondary/15 border border-secondary flex items-center justify-center text-text">
                          <Icon size={20} strokeWidth={2.25}/>
                        </div>
                        <button
                          onClick={()=>setFilterSheet(m.value)}
                          title="Filter"
                          className="h-9 w-9 rounded-md bg-secondary/05 border border-border text-text-sub hover:text-text flex items-center justify-center"
                        >
                          <SlidersHorizontal size={16} strokeWidth={2.25}/>
                        </button>
                      </div>
                      <div className="font-display text-lg text-text tracking-tight mt-2">{m.title}</div>
                      <div className="text-xs text-text-sub">{m.sub} · <span className="font-mono-ui">{m.count} {m.countLabel}</span></div>
                      <Button size="lg" onClick={onPlay} className="w-full mt-3 !bg-secondary !text-muted hover:!brightness-95">
                        Começar
                      </Button>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-auto pt-8 text-center text-[10px] font-mono-ui text-text-sub uppercase tracking-[0.15em]">
              verbos · v{packageInfo.version}
            </div>
          </Screen>
        </AnimatePresence>
        <NavBar/>

        {/* Gear filter sheets — one per mode */}
        <FilterSheet
          open={filterSheet==="conjugation"}
          onClose={()=>setFilterSheet(null)}
          title="Conjugate — Filters"
          options={CONJUGATE_CAT_KEYS.map(k=>({key:k,label:CONJUGATE_CAT_LABELS[k],full:k==="irregular"||k==="regular"}))}
          selected={conjFilter}
          onToggle={(k)=>setConjFilter(f=>({...f,[k]:!f[k]}))}
          count={conjCount}
          countLabel="verbos"
        />
        <FilterSheet
          open={filterSheet==="palavras"}
          onClose={()=>setFilterSheet(null)}
          title="Palavras — Filters"
          options={[{key:"substantivo",label:"Substantivos"},{key:"adjetivo",label:"Adjetivos"}]}
          selected={palFilter}
          onToggle={(k)=>setPalFilter(f=>({...f,[k]:!f[k]}))}
          count={palCount}
          countLabel="palavras"
        />
        <FilterSheet
          open={filterSheet==="frases"}
          onClose={()=>setFilterSheet(null)}
          title="Frases — Filters"
          options={[{key:"frases",label:"Verb Frases"},{key:"expressoes",label:"Expressões"}]}
          selected={fraFilter}
          onToggle={(k)=>setFraFilter(f=>({...f,[k]:!f[k]}))}
          count={fraCount}
          countLabel="frases"
        />
      </div>
    );
  }

  // ─────────────────────── SETTINGS ───────────────────────
  if(screen==="settings"){
    const irregulars=ALL_VERBS.filter(v=>v.type==="irregular");
    const regulars=ALL_VERBS.filter(v=>v.type!=="irregular");
    const list=settingsTab==="irregular"?irregulars:regulars;
    const typeKey=settingsTab==="irregular"?"irregular":"regular";
    return (
      <div className="min-h-screen bg-bg text-text">
        <TopBar/>
        <AnimatePresence mode="wait">
          <Screen key="settings">
            <div>
              <h1 className="font-display text-[28px] tracking-tighter text-text">Settings</h1>
              <p className="text-sm text-text-sub mt-1">Toggle verbs and tenses individually.</p>
            </div>

            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-md bg-secondary/5 border border-border">
              <div className="flex items-center gap-2 text-sm text-text">
                {theme==="dark"?<Moon size={15}/>:<Sun size={15}/>}
                <span>Theme</span>
              </div>
              <button
                onClick={toggleTheme}
                className="text-[11px] font-mono-ui uppercase tracking-[0.12em] text-text-sub hover:text-text transition-colors px-3 py-2 rounded-sm border border-border bg-surface"
              >
                {theme==="dark"?"Dark":"Light"}
              </button>
            </div>

            <SegmentedToggle
              value={settingsTab}
              onChange={setSettingsTab}
              options={[
                {value:"irregular",label:`Irregular (${irregulars.length})`},
                {value:"regular",label:`Regular (${regulars.length})`},
              ]}
            />

            <div className="flex gap-2 flex-wrap">
              <Button variant="ghost" size="sm" onClick={()=>bulkToggle(typeKey,"presente",true)}>All Presente On</Button>
              <Button variant="ghost" size="sm" onClick={()=>bulkToggle(typeKey,"passado",true)}>All Passado On</Button>
              <Button variant="danger" size="sm" onClick={()=>{bulkToggle(typeKey,"presente",false);bulkToggle(typeKey,"passado",false);}}>All Off</Button>
            </div>

            <Card className="overflow-hidden">
              <div className="grid grid-cols-[1fr_72px_72px] items-center px-4 py-3 border-b border-border text-[10px] font-mono-ui text-text-sub uppercase tracking-[0.12em]">
                <span>Verb</span>
                <span className="text-center">Pres.</span>
                <span className="text-center">Pass.</span>
              </div>
              <div className="max-h-[420px] overflow-y-auto no-scrollbar divide-y divide-border">
                {list.map((v)=>(
                  <div key={v.id} className="grid grid-cols-[1fr_72px_72px] items-center px-4 py-3 hover:bg-bg/40 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-text">{v.verb}</span>
                        {v.prep!=="—" && <span className="text-[10px] text-text-sub font-mono-ui">[{v.prep}]</span>}
                      </div>
                      <div className="text-[11px] text-text-sub italic truncate">{v.transl}</div>
                    </div>
                    <div className="flex justify-center">
                      <MiniToggle on={!!config[v.id]?.presente} onClick={()=>toggleVerb(v.id,"presente")}/>
                    </div>
                    <div className="flex justify-center">
                      <MiniToggle on={!!config[v.id]?.passado} onClick={()=>toggleVerb(v.id,"passado")}/>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Screen>
        </AnimatePresence>
        <NavBar/>
      </div>
    );
  }

  // ─────────────────────── HISTORY ───────────────────────
  if(screen==="history"){
    return (
      <div className="min-h-screen bg-bg text-text">
        <TopBar/>
        <AnimatePresence mode="wait">
          <Screen key="history">
            <div>
              <h1 className="font-display text-[28px] tracking-tighter text-text">Score</h1>
              <p className="text-sm text-text-sub mt-1">
                {history.length===0
                  ? "No sessions yet. Play a round first."
                  : <>{history.length} session{history.length!==1?"s":""}{trendText()}</>
                }
              </p>
            </div>

            {history.length>0 && (
              <>
                <Card className="p-4">
                  <Chart/>
                </Card>

                <div className="flex flex-col gap-2">
                  {[...history].reverse().map((h,i)=>{
                    const d=new Date(h.date);
                    const ds=`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
                    return (
                      <div key={i} className="flex items-center justify-between px-4 py-3 rounded-md bg-surface border border-border text-sm">
                        <span className="text-text-sub text-xs font-mono-ui">{ds}</span>
                        <span className={cn(
                          "font-semibold tabular-nums",
                          h.pct>=70?"text-accent":h.pct>=40?"text-warn":"text-danger"
                        )}>{h.pct}%</span>
                        <span className="text-text-sub text-xs font-mono-ui">{h.correct}/{h.total}</span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={()=>{sDel(SK_HIST);setHistory([]);}}
                  className="self-center mt-2 text-[11px] font-mono-ui uppercase tracking-[0.12em] text-text-sub hover:text-danger transition-colors flex items-center gap-2"
                >
                  <RotateCcw size={11}/> Reset scores
                </button>
              </>
            )}
          </Screen>
        </AnimatePresence>
        <NavBar/>
      </div>
    );
  }

  // ─────────────────────── RESULTS ───────────────────────
  if(screen==="results"){
    const rating=score.correct===10?{stars:3,label:"Alegria!",confetti:true}:score.correct===9?{stars:2,label:"Óptimo!"}:score.correct===8?{stars:1,label:"Fixe!"}:null;
    return (
      <div className="min-h-[100dvh] bg-bg text-text relative">
        <TopBar/>
        {rating?.confetti && <Confetti/>}
        <AnimatePresence mode="wait">
          <Screen key="results">
            <div className="text-center flex flex-col items-center gap-3">
              <Badge variant="presente">Resultados</Badge>
              {rating && (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-2 mt-2">
                    {Array.from({length:rating.stars}).map((_,i)=>(
                      <motion.div
                        key={i}
                        initial={{scale:0,rotate:-30,opacity:0}}
                        animate={{scale:[0,1.2,1],rotate:0,opacity:1}}
                        transition={{delay:0.2+i*0.15,duration:0.5,times:[0,0.6,1],type:"spring",stiffness:400,damping:15}}
                      >
                        <Sparkles size={36} className="text-accent" strokeWidth={2} fill="hsl(var(--accent))"/>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    initial={{opacity:0,y:6}}
                    animate={{opacity:1,y:0}}
                    transition={{delay:0.2+rating.stars*0.15+0.1}}
                    className="text-[22px] font-display text-accent"
                  >
                    {rating.label}
                  </motion.div>
                </div>
              )}
            </div>

            <Card className="p-8 flex flex-col items-center text-center">
              <div className="font-display text-[88px] leading-none text-text tabular-nums">
                <AnimatedNumber value={pct}/>%
              </div>
              <p className="mt-3 text-sm text-text-sub">
                <span className="text-accent font-semibold">{score.correct}</span> correct
                {" · "}
                <span className="text-danger font-semibold">{score.wrong}</span> wrong
                {score.accentMisses>0 && (
                  <span className="text-warn"> · {score.accentMisses} accent{score.accentMisses>1?"s":""} missed</span>
                )}
              </p>
            </Card>

            {wrongOnes.length>0 && (
              <Card className="p-5">
                <h3 className="text-[10px] font-mono-ui text-text uppercase tracking-[0.15em] mb-3">Review these</h3>
                <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto no-scrollbar">
                  {wrongOnes.map((w,i)=>(
                    (w.mode==="frases" || w.mode==="palavras" || w.mode==="sentences") ? (
                      <div key={i} className="flex flex-col gap-1 px-3 py-3 rounded-md bg-danger/5 border border-danger/20">
                        <div className="text-[11px] text-text-sub font-mono-ui uppercase tracking-[0.1em]">{w.mode==="palavras"?w.cat:w.subMode==="expressao"?"expressão":w.verb}</div>
                        <div className="text-sm text-text italic">{w.en}</div>
                        {w.userAnswer && (
                          <div className="text-[12px] text-danger line-through truncate">{w.userAnswer}</div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-accent font-semibold">{w.answer}</span>
                          <AudioBtn text={w.answer}/>
                        </div>
                      </div>
                    ) : (
                      <div key={i} className="flex items-center justify-between gap-3 px-3 py-3 rounded-md bg-danger/5 border border-danger/20">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-text">{w.verb}</div>
                          <div className="text-[11px] text-text-sub italic">{w.transl}</div>
                          <div className="text-[11px] text-text-sub font-mono-ui">{pLabel(w.pronounKey)} · {w.tense}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-accent font-semibold">{w.answer}</span>
                          <AudioBtn text={w.answer}/>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </Card>
            )}

          </Screen>
        </AnimatePresence>

        {/* Sticky actions — same pattern as play screen */}
        <div
          className="fixed bottom-0 left-0 right-0 z-20 flex justify-center p-4 bg-gradient-to-t from-bg via-bg/95 to-transparent pointer-events-none"
          style={{paddingBottom:"max(16px,env(safe-area-inset-bottom))"}}
        >
          <div className="w-full max-w-[480px] pointer-events-auto flex gap-3">
            <Button onClick={startGame} className="flex-1" size="lg">Play Again</Button>
            <Button variant="ghost" onClick={()=>setScreen("menu")} size="lg">Menu</Button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────── PLAY ───────────────────────
  const hasTense=card.mode==="conjugation" || (card.mode==="frases" && card.subMode==="sentence");
  const tenseLabel=!hasTense?(card.mode==="palavras"?(card.cat==="adjetivo"?"Adjetivo":"Substantivo"):"Expressão"):(card.tense==="presente"?"Presente":"Passado");
  const tenseVariant=!hasTense?"presente":(card.tense==="presente"?"presente":"passado");
  const isTextCard = card.mode!=="conjugation"; // palavras + frases both prompt English → type PT

  return (
    <div
      className="fixed left-0 right-0 top-0 overflow-y-auto bg-bg text-text"
      style={{height:"var(--vvh,100vh)"}}
    >
      <TopBar/>
      <Screen>
        {/* Progress + score + close */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1 rounded-full bg-surface border border-border overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={false}
              animate={{width:`${((idx+(result?1:0))/cards.length)*100}%`}}
              transition={{type:"spring",stiffness:200,damping:28}}
            />
          </div>
          <span className="text-[11px] font-mono-ui tabular-nums">
            <span className="text-accent">{score.correct}</span>
            <span className="text-text-sub mx-1">·</span>
            <span className="text-danger">{score.wrong}</span>
          </span>
          <button
            onClick={()=>setScreen("menu")}
            className="h-9 w-9 rounded-md border border-border bg-surface text-text-sub hover:text-danger hover:border-danger/60 transition-colors flex items-center justify-center"
          >
            <X size={15}/>
          </button>
        </div>

        {/* Card. mode="popLayout" so the new card mounts IMMEDIATELY (within
            the user-gesture window) while the old card animates out as an
            overlay — required so autoFocus can open the iOS keyboard. */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={idx}
            initial={{opacity:0,x:120,rotate:4}}
            animate={{
              opacity:1,
              rotate:0,
              x: result==="wrong" ? [0,8,-8,6,-6,0] : 0,
            }}
            exit={{opacity:0,x:-120,rotate:-4}}
            transition={{
              opacity:{duration:0.3,ease:"easeOut"},
              rotate:{duration:0.4,ease:[0.25,0.1,0.25,1]},
              x: result==="wrong"
                ? {duration:0.4,ease:"easeOut"}
                : {duration:0.4,ease:[0.25,0.1,0.25,1]},
            }}
          >
            <Card className="p-7 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <Badge variant={tenseVariant}>{tenseLabel}</Badge>
                <span className="text-[10px] font-mono-ui text-text-sub uppercase tracking-[0.12em]">
                  {card.mode==="conjugation"
                    ? (card.type==="irregular"?"Irregular":"Regular")
                    : card.mode==="palavras"
                      ? "Palavra"
                      : (card.subMode==="sentence" ? card.verb : "Frase")}
                </span>
              </div>

              {isTextCard ? (
                <div className="text-center py-2">
                  <div className="font-display text-[26px] leading-[1.15] tracking-tighter text-text">
                    {card.en}
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center py-2">
                    <div className="font-display text-[44px] leading-[1] tracking-tightest text-text">
                      {card.transl}
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <span className="text-base font-mono-ui text-primary italic">
                      {card.pronoun}
                    </span>
                    {result===null && (
                      <span className="text-text-sub text-base tracking-[4px]">· · ·</span>
                    )}
                  </div>
                </>
              )}

              <motion.div
                animate={result==="correct" && !accentNote ? {scale:[1,1.04,1]} : {}}
                transition={{duration:0.35}}
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={e=>setInput(e.target.value)}
                  placeholder={isTextCard?"Type translation...":"Type conjugation..."}
                  disabled={result!==null}
                  autoFocus={idx>0}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className={cn(
                    "text-base font-mono-ui",
                    result==="correct" && !accentNote && "border-accent bg-accent/5 focus:border-accent focus:ring-accent/30",
                    result==="correct" && accentNote && "border-warn bg-warn/5 focus:border-warn focus:ring-warn/30",
                    result==="wrong" && "border-danger bg-danger/5 focus:border-danger focus:ring-danger/30",
                  )}
                />
              </motion.div>

              {/* Feedback */}
              <AnimatePresence>
                {result==="correct" && (
                  <motion.div
                    initial={{opacity:0,y:6}}
                    animate={{opacity:1,y:0}}
                    transition={{duration:0.2}}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-center gap-2 text-accent">
                      <Check size={18} strokeWidth={3}/>
                      <span className="text-base font-semibold">Correto!</span>
                    </div>
                    {accentNote && (
                      <div className="text-center text-xs text-warn bg-warn/10 border border-warn/30 rounded-md py-2 px-3">
                        Watch the accent: <strong className="font-mono-ui">{accentNote}</strong>
                      </div>
                    )}
                    {card.mode==="conjugation" && <ConjugationTable card={card}/>}
                  </motion.div>
                )}

                {result==="wrong" && (
                  <motion.div
                    initial={{opacity:0,y:6}}
                    animate={{opacity:1,y:0}}
                    transition={{duration:0.2}}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-center gap-2 text-danger">
                      <X size={16} strokeWidth={3}/>
                      <strong className="font-mono-ui">{card.answer}</strong>
                    </div>
                    {card.mode==="conjugation" && <ConjugationTable card={card}/>}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </AnimatePresence>
      </Screen>

      {/* Sticky action button — bottom of screen, hidden when mobile keyboard is open */}
      {!keyboardOpen && (
        <div
          className="fixed bottom-0 left-0 right-0 z-20 flex justify-center p-4 bg-gradient-to-t from-bg via-bg/95 to-transparent pointer-events-none"
          style={{paddingBottom:"max(16px,env(safe-area-inset-bottom))"}}
        >
          <div className="w-full max-w-[480px] pointer-events-auto">
            {result===null
              ? <Button onClick={check} size="lg" className="w-full">Check</Button>
              : <Button onClick={next} size="lg" className="w-full">Next <ArrowRight size={16}/></Button>
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ── Conjugation table (used in correct/wrong feedback) ──
function ConjugationTable({card}){
  return (
    <div className="rounded-md border border-border overflow-hidden">
      {/* Header row: verb + audio */}
      <div className="flex items-center justify-between px-4 py-3 bg-bg/60 border-b border-border">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-display text-base text-text">{card.verb}</span>
          {card.prep!=="—" && (
            <span className="text-sm font-mono-ui font-semibold text-text">
              [{card.prep}]
            </span>
          )}
        </div>
        <AudioBtn text={card.verb}/>
      </div>
      {/* Pronoun rows */}
      <div className="divide-y divide-border">
        {PRONOUNS.map(p=>{
          const active=p===card.pronounKey;
          return (
            <div key={p} className="grid grid-cols-[110px_1fr_auto] items-center px-4 py-3 gap-3">
              <span className={cn(
                "text-xs font-mono-ui",
                active ? "text-text" : "text-text-sub italic"
              )}>
                {active ? card.pronoun : pLabel(p)}
              </span>
              <span className={cn(
                "text-sm",
                active ? "text-primary font-bold" : "text-text"
              )}>
                {card[card.tense][p]}
              </span>
              <AudioBtn text={card[card.tense][p]}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Mini on/off toggle pill (settings list) ──
function MiniToggle({on,onClick}){
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-7 w-12 rounded-full border transition-all flex items-center px-1",
        on ? "bg-primary/20 border-primary/50 justify-end" : "bg-surface border-border justify-start"
      )}
    >
      <motion.span
        layout
        transition={{type:"spring",stiffness:500,damping:32}}
        className={cn(
          "block h-5 w-5 rounded-full",
          on ? "bg-primary" : "bg-muted"
        )}
      />
    </button>
  );
}
