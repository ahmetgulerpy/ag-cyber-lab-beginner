"use client";

import { LabBox } from "@/components/ui";
import { ChoiceLab, type ChoiceItem } from "./ChoiceLab";

const OPT = ["PAN", "LAN", "MAN", "WAN"];

const items: ChoiceItem[] = [
  { prompt: "🏠 Evdeki tüm cihazların aynı Wi-Fi router'ına bağlanması. Bu hangi ağ türüdür?", options: OPT, answer: 1, why: "Ev ağı tek bir bina ile sınırlıdır ve kullanıcının kendisi tarafından yönetilir. Kapsama alanı küçük, hız yüksektir: LAN. PAN kişinin kendi cihazları (birkaç metre) için, MAN şehir ölçeği için, WAN ise ülkeler arası içindir." },
  { prompt: "🎧 Telefonunuzun Bluetooth ile kablosuz kulaklığa bağlanması.", options: OPT, answer: 0, why: "Birkaç metre menzilli ve kişiye ait cihazlar arasındaki bağlantı PAN (Personal Area Network) olarak adlandırılır. LAN bir bina ölçeğindedir, kulaklık bağlantısı bu kadar geniş değildir." },
  { prompt: "🏫 Bir okulun binalarındaki bilgisayar laboratuvarı, öğretmenler odası ve Wi-Fi ağı.", options: OPT, answer: 1, why: "Okul kampüsü sınırlı bir alandadır ve tek kurum tarafından yönetilir; bu bir LAN'dır. Eğer okul ağı farklı şehirlerdeki okulları da bağlasaydı WAN olurdu." },
  { prompt: "🏙️ Belediyenin şehir genelindeki trafik kameralarını ve ışıklarını fiber ağla merkeze bağlaması.", options: OPT, answer: 2, why: "Bir şehir veya metropol bölgesini kapsayan ağ MAN'dır (Metropolitan Area Network). LAN tek bina ölçeğindedir; WAN ülkeler/kıtalar arasıdır." },
  { prompt: "🌍 İstanbul, Berlin ve New York'ta ofisleri olan bir şirketin şubelerini birbirine bağlaması.", options: OPT, answer: 3, why: "Farklı ülkelerdeki şubeler arası bağlantı operatör altyapısı üzerinden kurulan geniş alan ağıdır (WAN). Her ofisin kendi içi LAN'dır ama ofisleri birleştiren yapı WAN'dır." },
  { prompt: "🌐 İnternetin kendisi hangi ağ türünün en büyük örneğidir?", options: OPT, answer: 3, why: "İnternet, dünya çapında birbirine bağlı ağların birleşimidir; en büyük WAN örneğidir." },
  { prompt: "📱 Telefonunuzun internet paylaşımı (hotspot) ile dizüstü bilgisayarınızı bağlamanız, aynı masada.", options: OPT, answer: 0, why: "Kişisel cihazlarınızın kısa mesafede birbirine bağlanması PAN'dır. Telefonun kendisi operatörün WAN altyapısını kullanır ama aranızdaki bağlantı PAN'dır." },
  { prompt: "🎓 Bir üniversitenin şehir içindeki 4 farklı kampüsünü özel fiber hatla birleştirmesi.", options: OPT, answer: 2, why: "Kampüsler aynı şehir içindedir; şehir ölçeğinde bir bağlantı MAN olarak sınıflandırılır. Her kampüsün kendi içi LAN'dır." },
];

export default function Lab02() {
  return (
    <LabBox title="Ağ Türü Belirleme">
      <ChoiceLab id={2} items={items} intro="Her senaryoyu oku ve doğru ağ türünü seç. Cevabından sonra nedenini öğreneceksin." />
    </LabBox>
  );
}
