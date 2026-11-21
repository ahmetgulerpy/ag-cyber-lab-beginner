import { q } from "../../helpers";
import type { Question } from "../../types";

/** Genel değerlendirme: 20 soru. Her soru bir derse bağlıdır ve yanlış yapılırsa ilgili ders önerilir. */
export const finalExam: Question[] = [
  // Ders 01
  q("f01", "Dijital varlık nedir?", "Bir şirketin güvenlik envanteri çıkarılırken ilk yapılması gereken doğru adım hangisidir?", [
    "Önce en pahalı güvenlik ürününü satın almak",
    "Şirketin sahip olduğu veri, sistem, hizmet ve hesapları belirleyip değerlerini anlamak",
    "Yalnızca bilgisayarları saymak",
    "Çalışanların kişisel telefonlarını toplamak",
  ], 1, "Ne korunacağını bilmeden doğru koruma seçilemez. Envanter, risk değerlendirmesinin temelidir.", 1),
  q("f02", "Neden siber güvenliğe ihtiyaç duyulur?", "Bir kurumda yayımlanmış güvenlik yaması aylardır kurulmadı ve bir saldırı bu açık üzerinden gerçekleşti. Bu durumda en uygun çıkarım hangisidir?", [
    "Saldırgan çok güçlü olduğu için önlem alınamazdı",
    "Yama yönetimi, bilinen zafiyetlerin kapatılması açısından kritik bir savunmadır",
    "Yamalar hiçbir zaman işe yaramaz",
    "Sadece yeni sistemler risk altındadır",
  ], 1, "Bilinen ve düzeltmesi yayınlanmış açıkların kapatılmaması en yaygın ihmal örneklerindendir (WannaCry örneğinde olduğu gibi).", 1),
  q("f03", "Bireysel ve kurumsal güvenlik", "Aşağıdakilerden hangisi kurumsal güvenliği bireysel güvenlikten ayıran en belirgin özelliktir?", [
    "Parola kullanılmaması",
    "Politika, rol-yetki yönetimi, izleme ve olay müdahale planı gibi koordine edilen bileşenlerin bulunması",
    "Sadece antivirüs kullanılması",
    "İnternet bağlantısının olmaması",
  ], 1, "Kurumsal güvenlik, birçok kişiyi, sistemi ve süreci kapsadığı için organizasyon ve koordinasyon gerektirir.", 1),

  // Ders 02
  q("f04", "İlk bilgisayar ağları ve ilk solucanlar", "1988 Morris Solucanı'nın siber güvenlik tarihindeki en önemli sonuçlarından biri hangisidir?", [
    "Antivirüs ürünlerinin yasaklanması",
    "İnternetin kapatılması",
    "Olay müdahale koordinasyonu için ilk CERT merkezinin kurulması",
    "Parola kullanımının sona ermesi",
  ], 2, "Olay, bağlantılı sistemlerin koordineli müdahaleye ihtiyacı olduğunu gösterdi ve ilk CERT Koordinasyon Merkezi'nin kurulmasına yol açtı.", 2),
  q("f05", "Modern siber tehditler", "Tedarik zinciri saldırılarında saldırganın temel stratejisi nedir?", [
    "Hedefe doğrudan ve gürültülü şekilde saldırmak",
    "Hedefin güvendiği bir yazılım veya tedarikçi üzerinden içeri girmek",
    "Sadece fiziksel erişim kullanmak",
    "Yalnızca bireysel kullanıcıları hedeflemek",
  ], 1, "SolarWinds örneğinde olduğu gibi, güvenilen bir yazılımın güncelleme sürecine zararlı kod yerleştirilmesi birçok kurumu aynı anda etkileyebilir.", 2),

  // Ders 03
  q("f06", "Siber güvenlik ekosistemi nedir?", "Bir araştırmacı bir açığı bildirdi, üretici yama yayınladı, ancak bir kurum yamayı uygulamadı ve saldırıya uğradı. Ekosistem açısından en doğru değerlendirme hangisidir?", [
    "Ekosistem tek başına araştırmacının sorumluluğundadır",
    "Zincirin en zayıf halkası, tüm ekosistemin etkinliğini sınırlayabilir",
    "Yama yayınlamak yeterlidir, uygulamak kullanıcıya kalmıştır ve önemli değildir",
    "Üretici sorumlu olduğu için kurumun sorumluluğu yoktur",
  ], 1, "Bir zafiyetin bulunması, düzeltilmesi ve uygulanması farklı aktörlerin sorumluluğundadır; hepsi gerçekleşmezse koruma tamamlanmaz.", 3),
  q("f07", "Tehdit aktörleri", "Hangi tehdit aktörü türü öncelikle finansal kazanç hedefler?", [
    "Siber suçlular",
    "Hacktivistler",
    "Araştırmacılar",
    "Savunma analistleri",
  ], 0, "Siber suçlular fidye, dolandırıcılık ve veri satışı gibi yöntemlerle maddi kazanç peşindedir. Hacktivistlerin amacı ise genellikle ideolojiktir.", 3),

  // Ders 04
  q("f08", "Log analizi", "Bir uyarıda bir kullanıcının normal mesai saatleri dışında, farklı bir ülkeden başarılı giriş yaptığı görülüyor. Aşağıdakilerden hangisi doğru ilk yaklaşımdır?", [
    "Doğrudan çalışanı işten çıkarmak",
    "Uyarıyı görmezden gelmek",
    "Bağlamı doğrulamak (kullanıcı seyahatte mi?), logları ve girişin davranışını incelemek, gerekirse hesabı kısıtlamak",
    "Tüm sunucuları kapatmak",
  ], 2, "Uyarı ne kesin saldırı ne de zararsız kabul edilir. Doğrulama ve orantılı müdahale esastır.", 4),
  q("f09", "Olay müdahalesi", "Olay müdahale sürecinde “sınırlama (containment)” aşamasının amacı nedir?", [
    "Olayı hemen kamuoyuna duyurmak",
    "Saldırının yayılmasını durdurmak",
    "Tüm logları silmek",
    "Sadece rapor yazmak",
  ], 1, "Sınırlama, hasarın büyümesini engellemek için etkilenen hesap veya sistemi izole etmektir; kanıtlar korunur.", 4),
  q("f10", "Güvenlik denetimi ve risk değerlendirmesi", "Risk değerlendirmesinde olasılığı düşük ama etkisi çok yüksek bir risk için hangi karar mantıklı olabilir?", [
    "Risk düşük olduğu için tamamen yok saymak",
    "Etkisi ve olasılığı birlikte değerlendirip azaltma, devretme veya bilinçli kabul kararlarından birini gerekçeli şekilde seçmek",
    "Sadece en kolay riskleri ele almak",
    "Riski gizlemek",
  ], 1, "Risk; olasılık ve etkinin birleşimidir. Karar, kurumun risk iştahına göre bilinçli ve belgeli verilmelidir.", 4),

  // Ders 05
  q("f11", "Purple Team nedir?", "Red Team'in uyguladığı bir teknik için SIEM'de alarm oluşmadı. Purple Team yaklaşımında bir sonraki adım nedir?", [
    "Raporu bir sonraki yıla ertelemek",
    "Birlikte analiz edip tespit kuralı yazmak ve tekniği tekrar test etmek",
    "Red Team'i suçlamak",
    "Blue Team'i kapatmak",
  ], 1, "Purple yaklaşımının değeri, boşluğu aynı çalışma içinde kapatıp doğrulamaktır.", 5),
  q("f12", "Saldırı simülasyonu, savunma operasyonları ve güvenlik testleri", "Bir hastane sızma testi yaptırıyor ve hasta kayıt sistemini kapsam dışı bırakıyor. Bunun temel nedeni nedir?", [
    "Testi yapacak kişinin sistemi bilmemesi",
    "Kesinti riskinin kabul edilemez olması nedeniyle kapsamın bilinçli olarak sınırlandırılması",
    "Sistemin zaten güvenli olması",
    "Kapsam belirlemenin gereksiz olması",
  ], 1, "Kapsam, testin hem etkili hem güvenli olmasını sağlar. Kritik sistemlerde kesinti riski yönetilmelidir.", 5),

  // Ders 06
  q("f13", "Gizlilik (Confidentiality)", "Bir çalışan dizüstü bilgisayarını taksiye unuttu. Diskin şifrelenmiş olması hangi ilkeyi korumaya yardımcı olur?", [
    "Gizlilik; cihaza ulaşan kişinin veriyi okuyamaması",
    "Erişilebilirlik; cihaz tekrar bulunacaktır",
    "Hız; cihaz daha hızlı çalışır",
    "Hiçbiri",
  ], 0, "Şifreleme, cihazı ele geçiren kişinin veriyi okumasını engeller; bu gizliliğin temel kontrollerinden biridir.", 6),
  q("f14", "Bütünlük (Integrity)", "Bir e-faturadaki IBAN bilgisi, ödeme öncesi saldırgan tarafından değiştirildi. Bu durum hangi CIA ilkesinin ihlalidir?", [
    "Gizlilik",
    "Erişilebilirlik",
    "Bütünlük",
    "Hiçbiri; çünkü veri çalınmadı",
  ], 2, "Bilginin doğruluğu bozulduğu için bu bir bütünlük ihlalidir. Veri çalınmasa bile ağır sonuçlar doğabilir.", 6),
  q("f15", "Erişilebilirlik (Availability)", "Aşağıdaki önlemlerden hangisi erişilebilirliğe hizmet etmez?", [
    "Düzenli yedekleme",
    "Yedek sunucu kullanmak",
    "DDoS koruması",
    "Tüm veriyi herkese açık hale getirmek",
  ], 3, "Veriyi herkese açmak erişilebilirliği değil, gizliliği ortadan kaldırır. Erişilebilirlik, yetkili kişilerin ihtiyaç anında ulaşabilmesidir.", 6),

  // Ders 07
  q("f16", "İzleme ve savunma rolleri", "Gece vardiyasında uyarıları inceleyen, olağan dışı olayları doğrulayıp üst seviyeye devreden rol hangisidir?", [
    "GRC Specialist",
    "SOC Analyst",
    "Malware Analyst",
    "Security Researcher",
  ], 1, "SOC analisti, kurumun güvenlik uyarılarını izleyen ve ilk değerlendirmeyi yapan roldür.", 7),
  q("f17", "Mühendislik ve yönetişim rolleri", "Bir kurumun politikalarını, risk değerlendirmelerini ve yasal uyumunu yönetmeye en yakın rol hangisidir?", [
    "GRC Specialist",
    "Penetration Tester",
    "Malware Analyst",
    "Red Team Specialist",
  ], 0, "GRC (Governance, Risk, Compliance) uzmanı politika, risk ve uyum konularına odaklanır.", 7),

  // Ders 08
  q("f18", "Yetkilendirme ve izinsiz erişim", "Bir sızma testi ile izinsiz erişim arasındaki en temel fark nedir?", [
    "Kullanılan araçların farklı olması",
    "Test ekibinin daha fazla kişiden oluşması",
    "Yazılı yetkilendirme ve net kapsamın bulunması",
    "Testin gece yapılması",
  ], 2, "Teknik faaliyet aynı olabilir; fark yetkiden gelir. Yazılı izin ve kapsam meşruiyeti belirler.", 8),
  q("f19", "Kişisel verilerin korunması ve KVKK", "Bir kurumda kişisel verileri etkileyen bir ihlal yaşandığında güvenlik uzmanının en doğru davranışı nedir?", [
    "Olayı gizli tutmak",
    "Yalnızca kendi arkadaşlarına söylemek",
    "Olayı yöneticiye ve ilgili sorumlulara (hukuk/KVKK sorumlusu) hızlıca bildirmek ki yasal yükümlülükler zamanında değerlendirilsin",
    "Olay hakkında hiç kayıt tutmamak",
  ], 2, "Veri ihlallerinde bildirim süreleri vardır. Doğru ve hızlı bilgilendirme, kurumun yasal yükümlülüklerini yerine getirebilmesi için gereklidir.", 8),
  q("f20", "Sorumlu güvenlik araştırması, Responsible Disclosure ve Bug Bounty", "Bug bounty programında kapsam dışı bir sistemde açık olabileceğini düşünüyorsun. En doğru yaklaşım hangisidir?", [
    "Hemen test etmek; aynı şirkettir",
    "Test etmeden, gözlemini programa iletip kapsam hakkında netlik istemek",
    "Açığı satmak",
    "Sosyal medyada paylaşmak",
  ], 1, "Kapsam, yasal güvencenin sınırıdır. Kapsam dışına çıkmak yerine iletişim kurmak sorumlu yaklaşımdır.", 8),
];
