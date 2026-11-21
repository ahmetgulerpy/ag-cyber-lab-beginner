export type LessonMeta = {
  slug: string;
  no: string;
  title: string;
  sub: string;
  min: number;
  lab: string;
  guides: string[];
};

export const LESSONS: LessonMeta[] = [
  { slug: "virtualization-nedir", no: "01", title: "Virtualization Nedir?", sub: "Host, guest ve paylaşılan kaynaklar", min: 20, lab: "Etkileşimli sanallaştırma mimarisi", guides: [] },
  { slug: "hypervisor-mantigi", no: "02", title: "Hypervisor Mantığı", sub: "Type 1 ve Type 2 hypervisor", min: 20, lab: "Type 1 / Type 2 karşılaştırma şeması", guides: [] },
  { slug: "virtualbox", no: "03", title: "VirtualBox", sub: "İndir, kur, ilk arayüzü tanı", min: 35, lab: "VirtualBox arayüz turu + kurulum rehberi", guides: ["vbox-install"] },
  { slug: "vmware", no: "04", title: "VMware", sub: "Workstation Pro kurulumu ve karşılaştırma", min: 35, lab: "Hypervisor seçim aracı + kurulum rehberi", guides: ["vmware-install"] },
  { slug: "sanal-makine-kurulumu", no: "05", title: "Sanal Makine Kurulumu", sub: "Sıfırdan sanal makine sihirbazı", min: 40, lab: "Kaynak planlama sihirbazı", guides: ["vm-create"] },
  { slug: "snapshot-ve-clone", no: "06", title: "Snapshot ve Clone", sub: "Geri dönüş noktaları ve kopyalar", min: 25, lab: "Snapshot simülasyonu + klon görselleştirmesi", guides: [] },
  { slug: "nat-ve-bridged", no: "07", title: "NAT ve Bridged Network", sub: "Sanal ağ modlarını incele", min: 30, lab: "Sanal ağ modu laboratuvarı", guides: [] },
  { slug: "izole-laboratuvar", no: "08", title: "İzole Laboratuvar Kurulumu", sub: "Güvenli laboratuvar topolojisi tasarla", min: 35, lab: "Sürükle-bırak laboratuvar tasarım aracı", guides: [] },
  { slug: "kali-linux-kurulumu", no: "09", title: "Kali Linux Kurulumu", sub: "Hazır imaj veya ISO ile kurulum", min: 60, lab: "SHA256 doğrulama + iki kurulum yöntemi", guides: ["kali-a", "kali-b"] },
  { slug: "ubuntu-kurulumu", no: "10", title: "Ubuntu Kurulumu", sub: "ISO ile kurulum ve alternatifler", min: 50, lab: "Kali / Ubuntu seçim aracı + kurulum rehberi", guides: ["ubuntu-a"] },
  { slug: "laboratuvar-guvenligi", no: "11", title: "Temel Laboratuvar Güvenliği", sub: "Hatalı laboratuvarı bul ve düzelt", min: 30, lab: "Laboratuvar güvenlik denetimi", guides: [] },
];

export const LINKS = {
  vboxDownload: "https://www.virtualbox.org/wiki/Downloads",
  vboxDocs: "https://docs.oracle.com/en/virtualization/virtualbox/7.2/user/installation.html",
  vmwareHome: "https://www.vmware.com/",
  vmwareBroadcom: "https://knowledge.broadcom.com/external/article/368667/download-and-license-vmware-desktop-hype.html",
  kaliGet: "https://www.kali.org/get-kali/",
  kaliVbox: "https://www.kali.org/docs/virtualization/install-virtualbox-guest-vm/",
  kaliVmware: "https://www.kali.org/docs/virtualization/install-vmware-guest-vm/",
  kaliDocs: "https://www.kali.org/docs/",
  kaliVerify: "https://www.kali.org/docs/introduction/download-images-securely/",
  kaliPremadeVbox: "https://www.kali.org/docs/virtualization/import-premade-virtualbox/",
  ubuntuDownload: "https://ubuntu.com/download/desktop",
  ubuntuVbox: "https://ubuntu.com/tutorials/how-to-run-ubuntu-desktop-on-a-virtual-machine-using-virtualbox",
  ubuntuInstall: "https://documentation.ubuntu.com/desktop/en/latest/tutorial/install-ubuntu-desktop/",
  multipass: "https://canonical.com/multipass",
  instagram: "https://www.instagram.com/agcyberlab/",
  founder: "https://www.instagram.com/ahmetgulerpy/",
};
