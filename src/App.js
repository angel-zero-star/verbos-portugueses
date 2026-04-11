import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart, ReferenceLine, Cell } from "recharts";
import { Play, Trophy, Settings as SettingsIcon, X, Volume2, Sun, Moon, ArrowLeft, ArrowRight, Check, Sparkles, RotateCcw, Layers, MessageCircle, BookOpen, SlidersHorizontal, Search, User, Mic, ArrowUp, Globe } from "lucide-react";
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
const SK_LANG="verbos-lang";
const SK_USER="verbos-username"; // "" = skipped, any string = name

const STRINGS={
  en:{
    home_title:"Flashcards", home_sub:"Choose a topic to practice.",
    onboarding_title:"What's your name?", onboarding_sub:"We'll use it to greet you. You can skip this.",
    onboarding_placeholder:"Your name", onboarding_continue:"Continue", onboarding_skip:"Skip",
    name_label:"Name", name_placeholder:"Your name", name_save:"Save",
    settings_title:"Settings", settings_sub:"Appearance and global training filters.",
    theme:"Theme", dark:"Dark", light:"Light",
    language:"UI Language",
    tense:"Tense", verb_type:"Verb Type",
    nav_play:"Play", nav_score:"Score", nav_settings:"Settings",
    check:"Check", next:"Next", placeholder_translation:"Type translation...", placeholder_conjugation:"Type conjugation...",
    correct_label:"Correto!", accent_warn:"Watch the accent:", near_warn:"Small typo — correct form:", also:"Also:",
    conjugations:"Conjugations",
    all_verbs:"All Verbs", modal:"Modal", state:"State", movement:"Movement", action:"Action",
    people_jobs:"People & Jobs", food_drink:"Food & Drink",
    home_objects:"Home & Objects", nature_world:"Nature & World", adjetivos:"Adjetivos",
    expressions:"Expressions", verb_sentences:"Verb Sentences",
    sessions:"sessions", avg:"avg",
    verbs_label:"Verbs", palavras_label:"Palavras", frases_label:"Frases",
    regular:"Regular", irregular:"Irregular", example:"example", all:"All",
    play_again:"Play Again",
    history_empty:"No sessions yet. Play a round first.",
  },
  pt:{
    home_title:"Flashcards", home_sub:"Escolhe um tópico para praticar.",
    onboarding_title:"Qual é o teu nome?", onboarding_sub:"Vamos usá-lo para te cumprimentar. Podes saltar este passo.",
    onboarding_placeholder:"O teu nome", onboarding_continue:"Continuar", onboarding_skip:"Saltar",
    name_label:"Nome", name_placeholder:"O teu nome", name_save:"Guardar",
    settings_title:"Definições", settings_sub:"Aparência e filtros de treino.",
    theme:"Tema", dark:"Escuro", light:"Claro",
    language:"Idioma UI",
    tense:"Tempo", verb_type:"Tipo de Verbo",
    nav_play:"Jogar", nav_score:"Pontuação", nav_settings:"Definições",
    check:"Verificar", next:"Seguinte", placeholder_translation:"Escreve a tradução...", placeholder_conjugation:"Escreve a conjugação...",
    correct_label:"Correto!", accent_warn:"Atenção ao acento:", near_warn:"Pequeno erro — forma correta:", also:"Também:",
    conjugations:"Conjugações",
    all_verbs:"Todos", modal:"Modal", state:"Estado", movement:"Movimento", action:"Ação",
    people_jobs:"Pessoas e Profissões", food_drink:"Comida e Bebida",
    home_objects:"Casa e Objetos", nature_world:"Natureza e Mundo", adjetivos:"Adjetivos",
    expressions:"Expressões", verb_sentences:"Frases com Verbos",
    sessions:"sessões", avg:"méd",
    verbs_label:"Verbos", palavras_label:"Palavras", frases_label:"Frases",
    regular:"Regular", irregular:"Irregular", example:"exemplo", all:"Todos",
    play_again:"Jogar Novamente",
    history_empty:"Ainda sem sessões. Joga uma ronda primeiro.",
  },
};

function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function stripAccents(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function norm(s){return s.trim().toLowerCase().replace(/\s+/g," ");}
const ARTICLE_RE=/^(o|a|os|as|um|uma|uns|umas)\s+/i;
function stripArticle(s){return s.replace(ARTICLE_RE,"").trim();}
function levenshtein(a,b){const m=a.length,n=b.length;const dp=Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i===0?j:j===0?i:0));for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);return dp[m][n];}
function cmpAns(i,c){
  const ni=norm(i),nc=norm(c);
  if(ni===nc)return"exact";
  const sia=stripAccents(ni),sca=stripAccents(nc);
  if(sia===sca)return"accent";
  // Article tolerance: strip leading article from both sides then compare
  const nia=stripArticle(sia),nca=stripArticle(sca);
  if(nia===nca)return"accent";
  // Small typo tolerance: 1 edit for words up to 8 chars, 2 for longer — but NOT an accent issue
  const maxDist=Math.max(...nca.split(" ").map(w=>w.length))>8?2:1;
  if(levenshtein(sia,sca)<=maxDist||levenshtein(nia,nca)<=maxDist)return"near";
  return"wrong";
}
// For Palavras/Frases: split answer on "/" (e.g. "casado / casada") and accept either form.
// Returns "exact" | "accent" | "wrong".
function cmpMulti(input, answer){
  const parts = answer.split("/").map(s=>s.trim()).filter(Boolean);
  let best="wrong";
  for(const p of parts){
    const r=cmpAns(input,p);
    if(r==="exact")return"exact";
    if(r==="accent")best="accent"; // accent beats near
    if(r==="near"&&best==="wrong")best="near";
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
function ToggleSwitch({checked,onChange}){
  return(
    <button role="switch" aria-checked={checked} onClick={onChange}
      className={cn("relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0",checked?"bg-primary":"bg-secondary/20")}
    >
      <motion.div
        className="absolute top-[2px] left-[2px] w-5 h-5 rounded-full bg-white shadow-sm"
        animate={{x:checked?16:0}}
        transition={{type:"spring",stiffness:500,damping:30}}
      />
    </button>
  );
}

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
// rows: array of {label?, items:[{key,label}]} — each entry renders an optional section label + flex row
function FilterSheet({open, onClose, title, rows, selected, onToggle, count, countLabel}){
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
            <div className="w-full max-w-[480px] mx-4 bg-surface border border-secondary/25 rounded-lg shadow-[0_4px_8px_0_rgba(0,0,0,0.4)] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-text tracking-tight">{title}</h3>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-md border border-border bg-secondary/05 text-text-sub hover:text-text flex items-center justify-center"
                >
                  <X size={14}/>
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {rows.map((row,ri)=>(
                  <div key={ri} className="flex flex-col gap-2">
                    {row.label && (
                      <span className="text-[10px] font-mono-ui text-text-sub uppercase tracking-[0.12em]">{row.label}</span>
                    )}
                    <div className="flex gap-2">
                      {(row.items||row).map(opt=>(
                        <TogglePill
                          key={opt.key}
                          active={!!selected[opt.key]}
                          onClick={()=>onToggle(opt.key)}
                        >
                          {opt.label}
                        </TogglePill>
                      ))}
                    </div>
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

// ── Per-mode progress stats (computed from history) ──
function modeStats(history,mode,subcat=null){
  let s=history.filter(h=>h.mode===mode||(mode==="frases"&&h.mode==="sentences"));
  if(subcat&&subcat!=="all") s=s.filter(h=>h.subcat===subcat);
  if(!s.length)return{count:0,avgPct:0,mastered:false};
  const avgPct=Math.round(s.reduce((a,b)=>a+b.pct,0)/s.length);
  return{count:s.length,avgPct,mastered:avgPct>=80&&s.length>=5};
}

// ── Progress arc ring ──
function ProgressRing({pct,mastered,size=40}){
  const r=(size-6)/2;
  const circ=2*Math.PI*r;
  const dash=(pct/100)*circ;
  return(
    <svg width={size} height={size} className="absolute inset-0 -rotate-90" style={{overflow:"visible"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={3}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={mastered?"hsl(var(--accent))":"hsl(var(--secondary))"}
        strokeOpacity={mastered?1:0.5}
        strokeWidth={3} strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{transition:"stroke-dasharray 0.6s ease"}}
      />
    </svg>
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

// ── Home screen subcategory structure ──
const MENU_SECTIONS=[
  {mode:"conjugation",tk:"conjugations",icon:Layers,subcats:[
    {key:"all",      tk:"all_verbs"},
    {key:"modal",    tk:"modal"},
    {key:"state",    tk:"state"},
    {key:"movement", tk:"movement"},
    {key:"action",   tk:"action"},
  ]},
  {mode:"palavras",tk:"palavras_label",icon:BookOpen,subcats:[
    {key:"people",   tk:"people_jobs"},
    {key:"food",     tk:"food_drink"},
    {key:"home",     tk:"home_objects"},
    {key:"nature",   tk:"nature_world"},
    {key:"adjetivo", tk:"adjetivos"},
  ]},
  {mode:"frases",tk:"frases_label",icon:MessageCircle,subcats:[
    {key:"expressoes",tk:"expressions"},
    {key:"frases",    tk:"verb_sentences"},
  ]},
];

// ── Library browse screen — per mode, shows all items grouped ──
const PAL_GROUPS=[
  {key:"people",   tk:"people_jobs"},
  {key:"food",     tk:"food_drink"},
  {key:"home",     tk:"home_objects"},
  {key:"nature",   tk:"nature_world"},
  {key:"adjetivo", tk:"adjetivos"},
];

const VERB_PRONOUN_KEYS=["eu","tu","ele/ela","nós","eles(as)/vocês"];
const REG_EXAMPLES={ar:"tomar",er:"comer",ir:"partir"};

// Pill toggle button used in LibraryScreen sub-headers
function LibPill({active,onClick,children}){
  return(
    <button onClick={onClick}
      className={cn("h-8 px-3 rounded-md text-sm font-medium border whitespace-nowrap transition-colors",
        active?"bg-secondary/10 border-secondary/25 text-text":"bg-transparent border-border text-text-sub hover:text-text"
      )}>
      {children}
    </button>
  );
}

// Conjugation grid shared between example and irregular cards
function ConjGrid({verb,tenses}){
  return(
    <div className={cn("grid gap-4 pt-3 border-t border-border",tenses.length>1?"grid-cols-2":"grid-cols-1")}>
      {tenses.map(tense=>(
        <div key={tense} className="flex flex-col gap-1">
          <span className="text-[10px] font-mono-ui text-text-sub uppercase tracking-[0.1em] mb-1">{tense}</span>
          {VERB_PRONOUN_KEYS.map(pk=>{
            const form=verb[tense]?.[pk];
            if(!form)return null;
            return(
              <div key={pk} className="flex gap-2 items-baseline">
                <span className="text-xs text-text-sub font-mono-ui w-24 shrink-0 leading-tight">{PRONOUN_LABELS[pk]||pk}</span>
                <span className="text-sm text-text font-mono-ui leading-tight font-medium">{form}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function VerbCard({v,tenses,note}){
  return(
    <div className="flex flex-col gap-3 px-4 py-4 rounded-lg bg-surface border border-border">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base font-semibold text-text">{v.verb}</span>
            {v.prep!=="—"&&<span className="text-sm font-mono-ui text-text-sub">{v.prep}</span>}
            {note&&<span className="text-xs font-mono-ui text-text-sub">{note}</span>}
          </div>
          <div className="text-sm text-text-sub italic mt-0.5">{v.transl}</div>
        </div>
        <AudioBtn text={v.verb} className="shrink-0"/>
      </div>
      <ConjGrid verb={v} tenses={tenses}/>
    </div>
  );
}

function LibraryScreen({mode,onBack,conjFilter,t=k=>k}){
  const modeLabel=t(mode==="conjugation"?"verbs_label":mode==="palavras"?"palavras_label":"frases_label");
  const [search,setSearch]=useState("");
  const [searchOpen,setSearchOpen]=useState(false);
  const searchRef=useRef(null);
  const q=search.toLowerCase().trim();
  const [verbType,setVerbType]=useState("regular");
  const [palCat,setPalCat]=useState("all");
  const [frasCat,setFrasCat]=useState("all");

  const tenses=["presente",...(conjFilter?.passado?["passado"]:[])];

  const openSearch=()=>{setSearchOpen(true);setTimeout(()=>searchRef.current?.focus(),50);};
  const closeSearch=()=>{setSearchOpen(false);setSearch("");};

  return(
    <div className="min-h-screen bg-bg text-text flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-bg/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-[480px] mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="h-9 w-9 shrink-0 rounded-md bg-secondary/05 border border-border text-text-sub hover:text-text flex items-center justify-center">
            <ArrowLeft size={16} strokeWidth={2.25}/>
          </button>
          {searchOpen?(
            <>
              <input
                ref={searchRef}
                value={search}
                onChange={e=>setSearch(e.target.value)}
                placeholder={`Search ${modeLabel.toLowerCase()}…`}
                className="flex-1 h-9 px-3 rounded-md bg-secondary/5 border border-border text-sm text-text placeholder:text-text-sub outline-none focus:border-secondary/40"
              />
              <button onClick={closeSearch} className="h-9 w-9 shrink-0 rounded-md bg-secondary/05 border border-border text-text-sub hover:text-text flex items-center justify-center">
                <X size={15} strokeWidth={2.25}/>
              </button>
            </>
          ):(
            <>
              <span className="flex-1 font-display text-lg text-text tracking-tight">{modeLabel}</span>
              <button onClick={openSearch} className="h-9 w-9 shrink-0 rounded-md bg-secondary/05 border border-border text-text-sub hover:text-text flex items-center justify-center">
                <Search size={15} strokeWidth={2.25}/>
              </button>
            </>
          )}
        </div>

        {/* Sub-header toggles */}
        {mode==="conjugation"&&(
          <div className="max-w-[480px] mx-auto px-4 pb-3 flex gap-2">
            <LibPill active={verbType==="regular"}   onClick={()=>setVerbType("regular")}>{t("regular")}</LibPill>
            <LibPill active={verbType==="irregular"} onClick={()=>setVerbType("irregular")}>{t("irregular")}</LibPill>
          </div>
        )}
        {mode==="palavras"&&(
          <div className="max-w-[480px] mx-auto px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
            <LibPill active={palCat==="all"} onClick={()=>setPalCat("all")}>{t("all")}</LibPill>
            {PAL_GROUPS.map(g=>(
              <LibPill key={g.key} active={palCat===g.key} onClick={()=>setPalCat(g.key)}>{t(g.tk)}</LibPill>
            ))}
          </div>
        )}
        {mode==="frases"&&(
          <div className="max-w-[480px] mx-auto px-4 pb-3 flex gap-2">
            <LibPill active={frasCat==="all"}        onClick={()=>setFrasCat("all")}>{t("all")}</LibPill>
            <LibPill active={frasCat==="frases"}     onClick={()=>setFrasCat("frases")}>{t("verb_sentences")}</LibPill>
            <LibPill active={frasCat==="expressoes"} onClick={()=>setFrasCat("expressoes")}>{t("expressions")}</LibPill>
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[480px] mx-auto px-4 py-4 pb-16 flex flex-col gap-8">

          {/* ── Conjugation — Regular ── */}
          {mode==="conjugation"&&verbType==="regular"&&["ar","er","ir"].map(ending=>{
            const exId=REG_EXAMPLES[ending];
            const exVerb=ALL_VERBS.find(v=>v.id===exId);
            const exMatch=!q||(exVerb&&(exVerb.verb.includes(q)||exVerb.transl.toLowerCase().includes(q)));
            const others=ALL_VERBS
              .filter(v=>v.type===`regular-${ending}`&&v.id!==exId)
              .filter(v=>!q||v.verb.includes(q)||v.transl.toLowerCase().includes(q))
              .sort((a,b)=>a.verb.localeCompare(b.verb));
            if(!exMatch&&!others.length)return null;
            return(
              <div key={ending} className="flex flex-col gap-3">
                <span className="text-[10px] font-mono-ui text-text-sub uppercase tracking-[0.12em]">Regular — {ending}</span>
                {exMatch&&exVerb&&<VerbCard v={exVerb} tenses={tenses} note="example"/>}
                {others.length>0&&(
                  <Card className="overflow-hidden divide-y divide-border">
                    {others.map(v=>(
                      <div key={v.id} className="flex items-center justify-between px-4 py-3 gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-base font-semibold text-text">{v.verb}</span>
                            {v.prep!=="—"&&<span className="text-sm font-mono-ui text-text-sub">{v.prep}</span>}
                          </div>
                          <div className="text-sm text-text-sub italic">{v.transl}</div>
                        </div>
                        <AudioBtn text={v.verb}/>
                      </div>
                    ))}
                  </Card>
                )}
              </div>
            );
          })}

          {/* ── Conjugation — Irregular ── */}
          {mode==="conjugation"&&verbType==="irregular"&&(()=>{
            const verbs=ALL_VERBS
              .filter(v=>v.type==="irregular")
              .filter(v=>!q||v.verb.includes(q)||v.transl.toLowerCase().includes(q))
              .sort((a,b)=>a.verb.localeCompare(b.verb));
            if(!verbs.length)return null;
            return(
              <div className="flex flex-col gap-3">
                {verbs.map(v=><VerbCard key={v.id} v={v} tenses={tenses}/>)}
              </div>
            );
          })()}

          {/* ── Palavras ── */}
          {mode==="palavras"&&PAL_GROUPS
            .filter(g=>palCat==="all"||g.key===palCat)
            .map(g=>{
              const allWords=g.key==="adjetivo"
                ?PALAVRAS.filter(p=>p.cat==="adjetivo")
                :PALAVRAS.filter(p=>p.ctx===g.key);
              const words=allWords.filter(p=>!q||p.en.toLowerCase().includes(q)||p.pt.toLowerCase().includes(q));
              if(!words.length)return null;
              return(
                <div key={g.key} className="flex flex-col gap-2">
                  <span className="text-[10px] font-mono-ui text-text-sub uppercase tracking-[0.12em]">{g.label}</span>
                  <Card className="overflow-hidden divide-y divide-border">
                    {words.map((p,i)=>(
                      <div key={i} className="flex items-center justify-between px-4 py-3 gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-text-sub italic">{p.en}</div>
                          <div className="text-base font-mono-ui text-text">{p.pt}</div>
                        </div>
                        <AudioBtn text={p.pt}/>
                      </div>
                    ))}
                  </Card>
                </div>
              );
            })
          }

          {/* ── Frases ── */}
          {mode==="frases"&&(()=>{
            const showF=frasCat==="all"||frasCat==="frases";
            const showE=frasCat==="all"||frasCat==="expressoes";
            const filtS=SENTENCES.filter(s=>!q||s.en.toLowerCase().includes(q)||s.pt.toLowerCase().includes(q));
            const filtE=EXPRESSOES.filter(e=>!q||e.en.toLowerCase().includes(q)||e.pt.toLowerCase().includes(q));
            return(
              <>
                {showF&&filtS.length>0&&(
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono-ui text-text-sub uppercase tracking-[0.12em]">Verb Sentences</span>
                    <Card className="overflow-hidden divide-y divide-border">
                      {filtS.map(s=>(
                        <div key={s.id} className="flex items-start justify-between px-4 py-3 gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-text-sub italic">{s.en}</div>
                            <div className="text-base font-mono-ui text-text">{s.pt}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-mono-ui text-text-sub">{s.verb}</span>
                              <Badge variant={s.tense==="passado"?"passado":"presente"}>{s.tense}</Badge>
                            </div>
                          </div>
                          <AudioBtn text={s.pt} className="shrink-0 mt-1"/>
                        </div>
                      ))}
                    </Card>
                  </div>
                )}
                {showE&&filtE.length>0&&(
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono-ui text-text-sub uppercase tracking-[0.12em]">Expressões</span>
                    <Card className="overflow-hidden divide-y divide-border">
                      {filtE.map((e,i)=>(
                        <div key={i} className="flex items-start justify-between px-4 py-3 gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-text-sub italic">{e.en}</div>
                            <div className="text-base font-mono-ui text-text">{e.pt}</div>
                          </div>
                          <AudioBtn text={e.pt} className="shrink-0 mt-1"/>
                        </div>
                      ))}
                    </Card>
                  </div>
                )}
              </>
            );
          })()}

        </div>
      </div>
    </div>
  );
}

export default function App(){
  const {theme,toggle:toggleTheme}=useTheme();
  const [screen,setScreen]=useState("menu");
  const [cards,setCards]=useState([]);
  const [idx,setIdx]=useState(0);
  const [input,setInput]=useState("");
  const [result,setResult]=useState(null);
  const [accentNote,setAccentNote]=useState(null);
  const [isListening,setIsListening]=useState(false);
  const [isSpeaking,setIsSpeaking]=useState(false);
  const [inputFocused,setInputFocused]=useState(false);
  const recRef=useRef(null);
  const [score,setScore]=useState({correct:0,wrong:0,accentMisses:0});
  const [wrongOnes,setWrongOnes]=useState([]);
  const [history,setHistory]=useState([]);
  const inputRef=useRef(null);
  const lastEnterRef=useRef(0);
  const subcatRef=useRef(null); // subcat of the current session
  const [keyboardOpen,setKeyboardOpen]=useState(false);
  const [gameMode,setGameMode]=useState("conjugation"); // "conjugation" | "palavras" | "frases"
  const [showSplash,setShowSplash]=useState(true);

  // Per-mode category filters (multi-select). All ON by default.
  const [conjFilter,setConjFilter]=useState({irregular:true,regular:true,modal:true,movement:true,state:true,action:true,presente:true,passado:false});
  const [palFilter,setPalFilter]=useState({substantivo:true,adjetivo:true,people:true,food:true,home:true,nature:true});
  const [fraFilter,setFraFilter]=useState({frases:true,expressoes:true});
  const [filterSheet,setFilterSheet]=useState(null); // null | "conjugation" | "palavras" | "frases"
  const [libraryMode,setLibraryMode]=useState(null); // "conjugation" | "palavras" | "frases"
  const [uiLang,setUiLang]=useState("en"); // "en" | "pt"
  const t=key=>STRINGS[uiLang]?.[key]??STRINGS.en[key]??key;
  const [username,setUsername]=useState(null); // null=not yet asked, ""=skipped, string=name
  const [nameEditVal,setNameEditVal]=useState(""); // for inline edit in settings
  const [nameEditing,setNameEditing]=useState(false);

  useEffect(()=>{
    window.speechSynthesis?.getVoices();
    sDel(SK_CONF); sDel(SK_FILTERS); // clean up legacy per-verb config
    const h=sGet(SK_HIST);if(h&&Array.isArray(h))setHistory(h);
    const m=sGet(SK_MODE);
    if(m==="conjugation"||m==="palavras"||m==="frases")setGameMode(m);
    else if(m==="sentences")setGameMode("frases"); // migrate old key
    const fc=sGet(SK_FILTER_CONJ);if(fc&&typeof fc==="object")setConjFilter(f=>({...f,...fc}));
    const fp=sGet(SK_FILTER_PAL);if(fp&&typeof fp==="object")setPalFilter(f=>({...f,...fp}));
    const ff=sGet(SK_FILTER_FRA);if(ff&&typeof ff==="object")setFraFilter(f=>({...f,...ff}));
    const lg=sGet(SK_LANG);if(lg==="en"||lg==="pt")setUiLang(lg);
    const un=sGet(SK_USER);if(un!==null)setUsername(un); // null means key absent → show onboarding
  },[]);

  useEffect(()=>{sSet(SK_MODE,gameMode);},[gameMode]);
  useEffect(()=>{sSet(SK_FILTER_CONJ,conjFilter);},[conjFilter]);
  useEffect(()=>{sSet(SK_FILTER_PAL,palFilter);},[palFilter]);
  useEffect(()=>{sSet(SK_FILTER_FRA,fraFilter);},[fraFilter]);
  useEffect(()=>{sSet(SK_LANG,uiLang);},[uiLang]);
  useEffect(()=>{if(username!==null)sSet(SK_USER,username);},[username]);

  useEffect(()=>{
    const t=setTimeout(()=>setShowSplash(false),1300);
    return()=>clearTimeout(t);
  },[]);


  // Filtered pools (for counts shown in filter sheets AND for startGame)
  const activeConjVerbs=()=>{
    const keys=Object.entries(conjFilter).filter(([k,v])=>v&&CONJUGATE_CAT_KEYS.includes(k)).map(([k])=>k);
    const active=keys.length?keys:CONJUGATE_CAT_KEYS;
    return ALL_VERBS.filter(v=>v.categories.some(c=>active.includes(c)));
  };
  const CTX_KEYS=["people","food","home","nature"];
  const activePalavras=()=>{
    const activeCats=["substantivo","adjetivo"].filter(k=>palFilter[k]);
    const cats=activeCats.length?activeCats:["substantivo","adjetivo"];
    const activeCtx=CTX_KEYS.filter(k=>palFilter[k]);
    return PALAVRAS.filter(p=>{
      if(!cats.includes(p.cat))return false;
      if(p.cat==="adjetivo")return true;
      return activeCtx.length===0||activeCtx.length===CTX_KEYS.length||activeCtx.includes(p.ctx);
    });
  };
  const activeFrases=()=>{
    const keys=Object.entries(fraFilter).filter(([,v])=>v).map(([k])=>k);
    const active=keys.length?keys:["frases","expressoes"];
    const pool=[];
    if(active.includes("frases")){
      for(const s of SENTENCES){
        if(s.tense==="presente"&&!conjFilter.presente)continue;
        if(s.tense==="passado"&&!conjFilter.passado)continue;
        pool.push({kind:"sentence",id:s.id,verb:s.verb,tense:s.tense,en:s.en,pt:s.pt,alternatives:s.alternatives||[]});
      }
    }
    if(active.includes("expressoes")){
      for(const e of EXPRESSOES){pool.push({kind:"expressao",en:e.en,pt:e.pt});}
    }
    return pool;
  };

  const startGame=(modeOverride,subcat=null)=>{
    const gm=modeOverride??gameMode;
    subcatRef.current=subcat;
    setGameMode(gm);
    if(gm==="palavras"){
      let pool;
      if(!subcat||subcat==="all")       pool=PALAVRAS;
      else if(subcat==="adjetivo")      pool=PALAVRAS.filter(p=>p.cat==="adjetivo");
      else                              pool=PALAVRAS.filter(p=>p.ctx===subcat);
      if(pool.length===0){alert("No palavras match your filters!");return;}
      const picked=shuffle(pool).slice(0,10).map(p=>({mode:"palavras",en:p.en,answer:p.pt,cat:p.cat}));
      setCards(picked);setIdx(0);setInput("");setResult(null);setAccentNote(null);
      setScore({correct:0,wrong:0,accentMisses:0});setWrongOnes([]);setScreen("play");
      return;
    }
    if(gm==="frases"){
      const pool=[];
      if(!subcat||subcat==="all"||subcat==="frases"){
        for(const s of SENTENCES){
          if(s.tense==="presente"&&!conjFilter.presente)continue;
          if(s.tense==="passado"&&!conjFilter.passado)continue;
          pool.push({kind:"sentence",id:s.id,verb:s.verb,tense:s.tense,en:s.en,pt:s.pt,alternatives:s.alternatives||[]});
        }
      }
      if(!subcat||subcat==="all"||subcat==="expressoes"){
        for(const e of EXPRESSOES)pool.push({kind:"expressao",en:e.en,pt:e.pt,alternatives:e.alternatives||[]});
      }
      if(pool.length===0){alert("No frases match your filters!");return;}
      const picked=shuffle(pool).slice(0,5).map(p=>p.kind==="sentence"?({
        mode:"frases",subMode:"sentence",id:p.id,verb:p.verb,tense:p.tense,en:p.en,answer:p.pt,alternatives:p.alternatives,
      }):({mode:"frases",subMode:"expressao",en:p.en,answer:p.pt,alternatives:p.alternatives||[]}));
      setCards(picked);setIdx(0);setInput("");setResult(null);setAccentNote(null);
      setScore({correct:0,wrong:0,accentMisses:0});setWrongOnes([]);setScreen("play");
      return;
    }
    // Conjugation — subcat filters by semantic category; global type filter still applies
    let verbs=ALL_VERBS;
    if(subcat&&subcat!=="all") verbs=verbs.filter(v=>v.categories.includes(subcat));
    verbs=verbs.filter(v=>(v.type==="irregular"&&conjFilter.irregular)||(v.type!=="irregular"&&conjFilter.regular));
    const gen=[];
    for(const v of verbs){
      const tenses=[];
      if(conjFilter.presente)tenses.push("presente");
      if(conjFilter.passado)tenses.push("passado");
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
      const allAns=[c.answer,...(c.alternatives||[])];
      let r="wrong";
      for(const ans of allAns){const cr=cmpMulti(input,ans);if(cr==="exact"){r="exact";break;}if(cr==="accent")r="accent";else if(cr==="near"&&r==="wrong")r="near";}
      if(r==="exact"){setResult("correct");setAccentNote(null);setScore(s=>({...s,correct:s.correct+1}));}
      else if(r==="accent"){setResult("correct");setAccentNote({form:c.answer,type:"accent"});setScore(s=>({...s,correct:s.correct+1,accentMisses:s.accentMisses+1}));}
      else if(r==="near"){setResult("correct");setAccentNote({form:c.answer,type:"near"});setScore(s=>({...s,correct:s.correct+1,accentMisses:s.accentMisses+1}));}
      else{setResult("wrong");setAccentNote(null);setScore(s=>({...s,wrong:s.wrong+1}));setWrongOnes(w=>[...w,{...c,userAnswer:input}]);}
      return;
    }
    if(c.mode==="frases" && c.subMode==="sentence"){
      const {result:er,note}=evaluateSentence(input,c.answer,c.alternatives);
      if(er==="correct"){
        setResult("correct");setAccentNote(note?{form:c.answer,type:"accent"}:null);
        setScore(s=>({...s,correct:s.correct+1,accentMisses:s.accentMisses+(note?1:0)}));
      }else if(er==="close"){
        setResult("correct");setAccentNote({form:c.answer,type:"near"});
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
    else if(r==="accent"){setResult("correct");setAccentNote({form:c.answer,type:"accent"});setScore(s=>({...s,correct:s.correct+1,accentMisses:s.accentMisses+1}));}
    else if(r==="near"){setResult("correct");setAccentNote({form:c.answer,type:"near"});setScore(s=>({...s,correct:s.correct+1,accentMisses:s.accentMisses+1}));}
    else{setResult("wrong");setAccentNote(null);setScore(s=>({...s,wrong:s.wrong+1}));setWrongOnes(w=>[...w,c]);}
  };

  const next=()=>{if(idx+1>=cards.length){const sess={date:new Date().toISOString(),mode:gameMode,subcat:subcatRef.current||"all",correct:score.correct,wrong:score.wrong,accentMisses:score.accentMisses,total:cards.length,pct:Math.round((score.correct/cards.length)*100)};const nh=[...history,sess];setHistory(nh);sSet(SK_HIST,nh);setScreen("results");}else{setIdx(i=>i+1);setInput("");setResult(null);setAccentNote(null);}};
  // Auto-focus hidden input when on play screen and awaiting answer.
  useEffect(()=>{
    if(screen==="play" && result===null){
      const t=setTimeout(()=>inputRef.current?.focus({preventScroll:true}), idx>0?220:50);
      return()=>clearTimeout(t);
    }
  },[result,idx,screen]);

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
      const kh=Math.max(0,window.innerHeight-h);
      document.documentElement.style.setProperty("--vvh",`${h}px`);
      document.documentElement.style.setProperty("--keyboard-h",`${kh}px`);
      setKeyboardOpen(kh>150);
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


  const toggleMic=()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR)return;
    if(isListening){recRef.current?.stop();setIsListening(false);setIsSpeaking(false);return;}
    const rec=new SR();
    rec.lang="pt-PT";rec.continuous=false;rec.interimResults=true;
    rec.onspeechstart=()=>setIsSpeaking(true);
    rec.onspeechend=()=>setIsSpeaking(false);
    rec.onresult=(e)=>{
      const t=Array.from(e.results).map(r=>r[0].transcript).join("");
      setInput(t);
      if(e.results[e.results.length-1].isFinal){setIsListening(false);setIsSpeaking(false);}
    };
    rec.onerror=()=>{setIsListening(false);setIsSpeaking(false);};
    rec.onend=()=>{setIsListening(false);setIsSpeaking(false);};
    recRef.current=rec;rec.start();setIsListening(true);
  };

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


  // (TopBar removed — theme toggle now lives in Settings, version shown on menu footer)
  const TopBar=()=>null;

  // ── Bottom navigation with sliding pill ──
  const NavBar=()=>{
    const items=[
      {key:"menu",icon:Play,label:t("nav_play")},
      {key:"history",icon:Trophy,label:t("nav_score")},
      {key:"settings",icon:SettingsIcon,label:t("nav_settings")},
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
          Flashcards
        </motion.h1>
      </div>
    );
  }

  // ─────────────────────── ONBOARDING ───────────────────────
  if(username===null){
    const [nameInput,setNameInput]=[nameEditVal,setNameEditVal]; // reuse state
    const commit=(val)=>{setUsername(val.trim());setNameEditVal("");};
    return(
      <div className="fixed inset-0 bg-bg text-text flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-[480px] flex flex-col gap-6">
          <FlagPT className="w-14 h-auto rounded-sm shadow-[0_0_0_1px_hsl(var(--border))]"/>
          <div>
            <h1 className="font-display text-[28px] tracking-tighter text-text">{t("onboarding_title")}</h1>
            <p className="text-sm text-text-sub mt-2">{t("onboarding_sub")}</p>
          </div>
          <Input
            value={nameInput}
            onChange={e=>setNameInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&nameInput.trim())commit(nameInput);}}
            placeholder={t("onboarding_placeholder")}
            autoFocus
            autoComplete="given-name"
            autoCapitalize="words"
            className="text-base"
          />
          <div className="flex flex-col gap-2">
            <Button size="lg" className="w-full" disabled={!nameInput.trim()} onClick={()=>commit(nameInput)}>
              {t("onboarding_continue")}
            </Button>
            <button onClick={()=>commit("")} className="text-sm text-text-sub hover:text-text transition-colors py-2">
              {t("onboarding_skip")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────── MENU ───────────────────────
  if(screen==="menu"){
    return (
      <div className="min-h-screen bg-bg text-text">
        <TopBar/>
        <AnimatePresence mode="wait">
          <Screen key="menu">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-[28px] tracking-tighter text-text">{t("home_title")}</h1>
                <p className="text-sm text-text-sub mt-1">{username?`Hey, ${username}!`:t("home_sub")}</p>
              </div>
              <button className="mt-1 h-9 w-9 rounded-full overflow-hidden shadow-[0_0_0_1px_hsl(var(--border))] hover:shadow-[0_0_0_2px_hsl(var(--muted))] transition-shadow shrink-0" title="Language: Portuguese">
                <FlagPT className="h-full w-auto -translate-x-2"/>
              </button>
            </div>

            {MENU_SECTIONS.map((section,si)=>{
              const Icon=section.icon;
              return (
                <motion.div
                  key={section.mode}
                  initial={{opacity:0,y:8}}
                  animate={{opacity:1,y:0}}
                  transition={{duration:0.22,ease:"easeOut",delay:si*0.06}}
                  className="flex flex-col gap-2"
                >
                  {/* Section header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-md bg-secondary/10 border border-secondary/25 flex items-center justify-center text-text">
                        <Icon size={14} strokeWidth={2.25}/>
                      </div>
                      <span className="font-display text-base text-text tracking-tight">{t(section.tk)}</span>
                    </div>
                    <button
                      onClick={()=>{setLibraryMode(section.mode);setScreen("library");}}
                      title="Browse library"
                      className="h-8 w-8 rounded-md bg-secondary/05 border border-border text-text-sub hover:text-text flex items-center justify-center"
                    ><BookOpen size={14} strokeWidth={2.25}/></button>
                  </div>

                  {/* Subcategory rows */}
                  <Card className="overflow-hidden divide-y divide-border">
                    {section.subcats.map(sc=>{
                      const stats=modeStats(history,section.mode,sc.key);
                      return (
                        <div key={sc.key} className="flex items-center justify-between px-4 py-3 hover:bg-secondary/5 transition-colors">
                          <div>
                            <span className="text-sm font-medium text-text">{t(sc.tk)}</span>
                            {stats.count>0&&(
                              <div className="text-[10px] font-mono-ui text-text-sub">
                                {stats.count} {t("sessions")} · {stats.avgPct}%{stats.mastered?" ✓":""}
                              </div>
                            )}
                          </div>
                          <Button size="sm" onClick={()=>startGame(section.mode,sc.key)}>
                            <Play size={12} className="mr-1"/>{t("nav_play")}
                          </Button>
                        </div>
                      );
                    })}
                  </Card>
                </motion.div>
              );
            })}

            <div className="mt-auto pt-8 text-center text-[10px] font-mono-ui text-text-sub uppercase tracking-[0.15em]">
              verbos · v{packageInfo.version}
            </div>
          </Screen>
        </AnimatePresence>
        <NavBar/>
      </div>
    );
  }

  // ─────────────────────── LIBRARY ───────────────────────
  if(screen==="library"){
    return <LibraryScreen
      mode={libraryMode}
      onBack={()=>setScreen("menu")}
      conjFilter={conjFilter}
      t={t}
    />;
  }

  // ─────────────────────── SETTINGS ───────────────────────
  if(screen==="settings"){
    return (
      <div className="min-h-screen bg-bg text-text">
        <TopBar/>
        <AnimatePresence mode="wait">
          <Screen key="settings">
            <div>
              <h1 className="font-display text-[28px] tracking-tighter text-text">{t("settings_title")}</h1>
              <p className="text-sm text-text-sub mt-1">{t("settings_sub")}</p>
            </div>

            {/* Name — top of list */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-md bg-secondary/5 border border-border">
              <div className="flex items-center gap-2 text-sm text-text">
                <User size={15}/>
                <span>{t("name_label")}</span>
              </div>
              {nameEditing?(
                <div className="flex items-center gap-2">
                  <input
                    value={nameEditVal}
                    onChange={e=>setNameEditVal(e.target.value)}
                    onKeyDown={e=>{
                      if(e.key==="Enter"){setUsername(nameEditVal.trim());setNameEditing(false);}
                      if(e.key==="Escape")setNameEditing(false);
                    }}
                    placeholder={t("name_placeholder")}
                    autoFocus
                    autoComplete="given-name"
                    autoCapitalize="words"
                    style={{fontSize:"16px"}}
                    className="h-8 px-3 rounded-md border border-border bg-bg text-text font-mono-ui outline-none focus:border-primary w-36"
                  />
                  <button onClick={()=>{setUsername(nameEditVal.trim());setNameEditing(false);}}
                    className="text-[11px] font-mono-ui text-primary hover:brightness-90 transition-colors"
                  >{t("name_save")}</button>
                </div>
              ):(
                <button onClick={()=>{setNameEditVal(username||"");setNameEditing(true);}}
                  className="text-[11px] font-mono-ui text-text-sub hover:text-text transition-colors border border-border rounded-sm px-3 py-1 bg-surface"
                >{username||"—"}</button>
              )}
            </div>

            {/* Theme */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-md bg-secondary/5 border border-border">
              <div className="flex items-center gap-2 text-sm text-text">
                {theme==="dark"?<Moon size={15}/>:<Sun size={15}/>}
                <span>{t("theme")}</span>
              </div>
              <div className="flex gap-1 p-1 rounded-md bg-secondary/5 border border-border">
                {[{key:"dark",label:t("dark")},{key:"light",label:t("light")}].map(({key,label})=>(
                  <button key={key}
                    onClick={()=>key!==theme&&toggleTheme()}
                    className={cn(
                      "px-3 py-1 rounded-sm text-[11px] font-mono-ui uppercase tracking-[0.12em] transition-colors",
                      theme===key?"bg-secondary/15 border border-secondary/25 text-text":"text-text-sub hover:text-text"
                    )}
                  >{label}</button>
                ))}
              </div>
            </div>

            {/* UI Language */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-md bg-secondary/5 border border-border">
              <div className="flex items-center gap-2 text-sm text-text">
                <Globe size={15}/>
                <span>{t("language")}</span>
              </div>
              <div className="flex gap-1 p-1 rounded-md bg-secondary/5 border border-border">
                {[{key:"en",flag:"🇬🇧"},{key:"pt",flag:"🇵🇹"}].map(({key:lang,flag})=>(
                  <button key={lang}
                    onClick={()=>setUiLang(lang)}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1 rounded-sm text-[11px] font-mono-ui uppercase tracking-[0.12em] transition-colors",
                      uiLang===lang?"bg-secondary/15 border border-secondary/25 text-text":"text-text-sub hover:text-text"
                    )}
                  ><span className="text-sm leading-none">{flag}</span>{lang}</button>
                ))}
              </div>
            </div>

            {/* Tense */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono-ui text-text-sub uppercase tracking-[0.12em]">{t("tense")}</span>
              <Card className="overflow-hidden divide-y divide-border">
                {[{key:"presente",label:"Presente"},{key:"passado",label:"Passado"}].map(({key,label})=>(
                  <div key={key} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-text">{label}</span>
                    <ToggleSwitch checked={conjFilter[key]} onChange={()=>setConjFilter(f=>({...f,[key]:!f[key]}))}/>
                  </div>
                ))}
              </Card>
            </div>

            {/* Verb Type */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono-ui text-text-sub uppercase tracking-[0.12em]">{t("verb_type")}</span>
              <Card className="overflow-hidden divide-y divide-border">
                {[{key:"irregular",label:t("irregular")},{key:"regular",label:t("regular")}].map(({key,label})=>(
                  <div key={key} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-text">{label}</span>
                    <ToggleSwitch checked={conjFilter[key]} onChange={()=>setConjFilter(f=>({...f,[key]:!f[key]}))}/>
                  </div>
                ))}
              </Card>
            </div>
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
                  ? t("history_empty")
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
            <Button onClick={()=>startGame(gameMode,subcatRef.current)} className="flex-1" size="lg">{t("play_again")}</Button>
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
    <>
    {/* ── Hidden real input — pinned to top so iOS doesn't scroll ── */}
    <input
      ref={inputRef}
      value={input}
      onChange={e=>setInput(e.target.value)}
      onFocus={()=>setInputFocused(true)}
      onBlur={()=>setInputFocused(false)}
      lang="pt"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      className="fixed top-0 left-0 w-full opacity-0 pointer-events-none"
      style={{fontSize:"16px",height:1,zIndex:0}}
      tabIndex={-1}
    />

    {/* ── Layer 1: Card — completely static ── */}
    <div className="fixed inset-0 bg-bg text-text overflow-hidden pointer-events-none" style={{zIndex:10}}>
      <TopBar/>
      <div className="px-6 pt-6">
        <div className="max-w-[480px] mx-auto flex flex-col gap-4 pointer-events-auto">
        {/* Progress bar top bar — Figma design */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 font-mono-ui text-xs tracking-[0.04em] font-medium">
              <p className="tabular-nums">
                <span className="text-text">{idx+1}</span>
                <span className="text-text-sub"> / {cards.length}</span>
              </p>
              <span className="text-accent tabular-nums">({score.correct})</span>
            </div>
            <button
              onClick={()=>setScreen("menu")}
              className="h-6 w-6 text-text-sub hover:text-danger transition-colors flex items-center justify-center"
            >
              <X size={16}/>
            </button>
          </div>
          <div className="h-1 rounded-sm bg-surface overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-sm"
              initial={false}
              animate={{width:`${((idx+(result?1:0))/cards.length)*100}%`}}
              transition={{type:"spring",stiffness:200,damping:28}}
            />
          </div>
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
                    <span className="text-base font-mono-ui text-primary italic">{card.pronoun}</span>
                    {result===null && <span className="text-text-sub text-base tracking-[4px]">· · ·</span>}
                  </div>
                </>
              )}

              {/* Feedback (shown inside card after validation) */}
              <AnimatePresence>
                {result==="correct" && (
                  <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:0.2}} className="flex flex-col gap-3">
                    <div className="flex items-center justify-center gap-2 text-accent">
                      <Check size={18} strokeWidth={3}/>
                      <span className="text-base font-semibold">{t("correct_label")}</span>
                      {card.mode!=="conjugation" && <AudioBtn text={card.answer}/>}
                    </div>
                    {accentNote && (
                      <div className="text-center text-xs text-warn bg-warn/10 border border-warn/30 rounded-md py-2 px-3">
                        {accentNote.type==="accent"?t("accent_warn"):t("near_warn")} <strong className="font-mono-ui">{accentNote.form}</strong>
                      </div>
                    )}
                    {card.alternatives?.length>0 && (
                      <div className="text-xs text-text-sub bg-secondary/5 border border-border rounded-md py-2 px-3">
                        <span className="font-mono-ui uppercase tracking-wider text-[10px]">{t("also")} </span>
                        {card.alternatives.join(" · ")}
                      </div>
                    )}
                    {card.mode==="conjugation" && <ConjugationTable card={card}/>}
                  </motion.div>
                )}
                {result==="wrong" && (
                  <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:0.2}} className="flex flex-col gap-3">
                    <div className="flex items-center justify-center gap-2 text-danger">
                      <X size={16} strokeWidth={3}/>
                      <strong className="font-mono-ui">{card.answer}</strong>
                      {card.mode!=="conjugation" && <AudioBtn text={card.answer}/>}
                    </div>
                    {card.alternatives?.length>0 && (
                      <div className="text-xs text-text-sub bg-secondary/5 border border-border rounded-md py-2 px-3">
                        <span className="font-mono-ui uppercase tracking-wider text-[10px]">{t("also")} </span>
                        {card.alternatives.join(" · ")}
                      </div>
                    )}
                    {card.mode==="conjugation" && <ConjugationTable card={card}/>}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </AnimatePresence>
        </div>
      </div>
    </div>

    {/* ── Layer 2: Input bar — separate fixed container ── */}
    <div
      className="fixed left-0 right-0 flex justify-center"
      style={{bottom:"var(--keyboard-h,0px)",zIndex:20}}
    >
      <div className="w-full max-w-[480px]">
          {/* Article picker chips — above the bar */}
          {card.mode==="palavras" && result===null && (()=>{
            const first=card.answer.split('/')[0].trim().toLowerCase();
            const isPlural=first.startsWith('os ')||first.startsWith('as ');
            const isSingular=first.startsWith('o ')||first.startsWith('a ');
            if(!isPlural&&!isSingular)return null;
            const arts=isPlural?['Os','As']:['O','A'];
            const pick=(art)=>{
              const rest=input.trim().replace(/^(os|as|o|a)\s+/i,'');
              setInput(art+' '+rest);
              setTimeout(()=>inputRef.current?.focus({preventScroll:true}),0);
            };
            return(
              <div className="flex gap-2 px-4 pb-2">
                {arts.map(art=>(
                  <button key={art} onMouseDown={e=>{e.preventDefault();pick(art);}}
                    className="h-8 px-4 rounded-full border border-border bg-surface/90 backdrop-blur text-sm font-mono-ui text-text-sub hover:text-text transition-colors shadow-sm"
                  >{art}</button>
                ))}
              </div>
            );
          })()}

          {/* Main bar */}
          <AnimatePresence mode="wait">
            {result===null ? (
              /* Input state */
              <motion.div
                key="input-bar"
                initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}
                transition={{duration:0.18}}
                className="flex items-center gap-3 px-4 py-3 bg-surface/95 backdrop-blur border-t border-border"
                style={{paddingBottom:"max(12px,env(safe-area-inset-bottom))"}}
              >
                {/* Mic */}
                <button
                  onMouseDown={e=>e.preventDefault()}
                  onClick={toggleMic}
                  className={cn(
                    "h-11 w-11 shrink-0 rounded-full border flex items-center justify-center transition-colors",
                    isListening
                      ? "bg-danger/10 border-danger/40 text-danger"
                      : "bg-secondary/5 border-border text-text-sub hover:text-text"
                  )}
                >
                  <motion.div animate={isListening?{scale:[1,1.15,1]}:{scale:1}} transition={isListening?{repeat:Infinity,duration:0.8}:{}}>
                    <Mic size={18}/>
                  </motion.div>
                </button>

                {/* Visual input pill — tapping focuses hidden input */}
                <div
                  onClick={()=>inputRef.current?.focus({preventScroll:true})}
                  className={cn(
                    "flex-1 relative flex items-center h-11 rounded-2xl border bg-secondary/5 px-4 transition-colors cursor-text",
                    isListening&&!input ? "border-danger/40"
                      : inputFocused ? "border-secondary/40"
                      : "border-border"
                  )}
                >
                  {isListening && !input ? (
                    /* Waveform bars */
                    <div className="flex items-center gap-[3px] flex-1 h-full py-3">
                      {[0.6,1,0.75,1,0.5,0.85,0.65].map((amp,i)=>(
                        <motion.div
                          key={i}
                          className="w-[3px] rounded-full bg-danger/60 origin-center"
                          animate={isSpeaking
                            ? {scaleY:[amp*0.4,amp,amp*0.3,amp*0.9,amp*0.4]}
                            : {scaleY:0.15}
                          }
                          transition={isSpeaking
                            ? {duration:0.7+i*0.07,repeat:Infinity,ease:"easeInOut",delay:i*0.08}
                            : {duration:0.3}
                          }
                          style={{height:"100%"}}
                        />
                      ))}
                    </div>
                  ) : input ? (
                    <span className="flex-1 text-base font-mono-ui text-text truncate">{input}</span>
                  ) : (
                    <span className="flex-1 text-base font-mono-ui text-text-sub">{isTextCard?t("placeholder_translation"):t("placeholder_conjugation")}</span>
                  )}
                  {input.length>0 && (
                    <button onMouseDown={e=>e.preventDefault()} onClick={(e)=>{e.stopPropagation();setInput("");inputRef.current?.focus({preventScroll:true});}}
                      className="ml-2 text-text-sub hover:text-text transition-colors shrink-0"
                    ><X size={15}/></button>
                  )}
                </div>

                {/* Submit */}
                <button
                  onClick={check}
                  disabled={!input.trim()}
                  className={cn(
                    "h-11 w-11 shrink-0 rounded-full flex items-center justify-center transition-all",
                    input.trim()
                      ? "bg-primary text-white hover:brightness-90 active:scale-95"
                      : "bg-secondary/10 text-text-sub cursor-not-allowed"
                  )}
                >
                  <ArrowUp size={18} strokeWidth={2.5}/>
                </button>
              </motion.div>
            ) : (
              /* Next state */
              <motion.div
                key="next-bar"
                initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}
                transition={{duration:0.18}}
                className="flex items-center gap-3 px-4 py-3 bg-surface/95 backdrop-blur border-t border-border"
                style={{paddingBottom:"max(12px,env(safe-area-inset-bottom))"}}
              >
                <Button onClick={next} size="lg" className="w-full">
                  {t("next")} <ArrowRight size={16}/>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
    </>
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

