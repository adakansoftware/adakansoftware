import type { Locale } from "@/lib/i18n"

export type PrivacySection = {
  id: string
  title: string
  paragraphs: readonly string[]
  bullets?: readonly string[]
}

export type PrivacyPageCopy = {
  title: string
  gradientText: string
  description: string
  effectiveDate: string
  primaryHref: string
  primaryLabel: string
  sections: readonly PrivacySection[]
}

export const kvkkContactEmail = "kvkk@adakansoftware.com" as const

export const privacyPageContent = {
  tr: {
    title: "Kişisel verileriniz",
    gradientText: "açık ve sınırlı amaçlarla işlenir.",
    description:
      "Bu aydınlatma metni, Adakan Software ile iletişime geçtiğinizde hangi verilerin neden ve ne kadar süreyle işlendiğini açıklar.",
    effectiveDate: "Yürürlük tarihi: 30 Eylül 2026",
    primaryHref: `mailto:${kvkkContactEmail}`,
    primaryLabel: "KVKK başvurusu yap",
    sections: [
      {
        id: "controller",
        title: "1. Veri sorumlusu",
        paragraphs: [
          `6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu, Adakan Software markasıyla faaliyet gösteren Özgür Erdem Adakan'dır. Sorularınız ve KVKK kapsamındaki başvurularınız için ${kvkkContactEmail} adresini kullanabilirsiniz.`,
        ],
      },
      {
        id: "data",
        title: "2. İşlenen kişisel veriler",
        paragraphs: ["İletişim kurduğunuz kanala göre aşağıdaki veriler işlenebilir:"],
        bullets: [
          "Adınız ve soyadınız, e-posta adresiniz ve isteğe bağlı telefon numaranız.",
          "Proje ihtiyacınız, talebiniz ve bizimle paylaştığınız mesaj içeriği.",
          "Dil tercihi, başvuru zamanı ve talebin sistem içindeki benzersiz kayıt numarası.",
          "Form güvenliği için sınırlı bağlantı, istek ve kötüye kullanım önleme kayıtları.",
        ],
      },
      {
        id: "purposes",
        title: "3. İşleme amaçları",
        paragraphs: ["Verileriniz yalnızca aşağıdaki amaçlarla işlenir:"],
        bullets: [
          "Talebinizi yanıtlamak ve sizinle iletişim kurmak.",
          "Proje ihtiyacını değerlendirmek, teklif ve çalışma planı hazırlamak.",
          "İletişim formunu kötüye kullanıma karşı korumak ve teknik güvenliği sağlamak.",
          "Hukuki yükümlülükleri yerine getirmek ve olası uyuşmazlıklarda hakları korumak.",
        ],
      },
      {
        id: "grounds",
        title: "4. Hukuki sebepler",
        paragraphs: [
          "İletişim ve proje değerlendirme süreçleri, KVKK'nın 5/2-c maddesindeki bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olma ve 5/2-f maddesindeki meşru menfaat hukuki sebeplerine dayanır. Kanuni yükümlülüklerin yerine getirilmesi gereken durumlarda ilgili diğer hukuki sebepler uygulanabilir.",
          "İletişim formunun işlenmesi pazarlama iznine veya açık rızaya dayandırılmaz. İleride ticari elektronik ileti gönderilmek istenirse bunun için ayrıca uygun bir tercih mekanizması sunulur.",
        ],
      },
      {
        id: "collection",
        title: "5. Toplama yöntemi",
        paragraphs: [
          "Kişisel verileriniz internet sitesindeki iletişim formu, e-posta yazışmaları ve bu taleplerin güvenli biçimde işlenmesini sağlayan teknik sistemler üzerinden elektronik olarak toplanır.",
        ],
      },
      {
        id: "recipients",
        title: "6. Hizmet sağlayıcılar ve yurt dışı işleme",
        paragraphs: [
          "Site güvenliği ve içerik dağıtımı için Cloudflare, veritabanı hizmeti için Neon ve e-posta teslimi için Resend altyapılarından yararlanılabilir. Bu sağlayıcılar hizmetin niteliğine göre barındırma, güvenlik, veri tabanı ve ileti teslimi işlevlerini yerine getirir. Veriler ayrıca kanunen yetkili kamu kurumlarıyla yalnızca hukuki zorunluluk halinde paylaşılabilir.",
          "Bu hizmetlerin teknik altyapısı Türkiye dışındaki sistemlerde çalışabilir ve veriler yurt dışında işlenebilir. Kullanılan hizmet, sözleşme ve aktarım mekanizmaları düzenli olarak değerlendirilir; bu metin doğrulanmamış bir aktarım güvencesi vermez.",
        ],
      },
      {
        id: "retention",
        title: "7. Saklama süresi",
        paragraphs: [
          "Sözleşmeye dönüşmeyen iletişim ve proje talepleri, son güncellemeden itibaren en fazla iki yıl saklanır. Sözleşmeye veya hukuki bir yükümlülüğe konu olan kayıtlar, ilgili yasal süreler boyunca ayrı şekilde saklanabilir. Süresi dolan veriler silinir, yok edilir veya anonim hale getirilir.",
        ],
      },
      {
        id: "security",
        title: "8. Bilgi güvenliği",
        paragraphs: [
          "İletişim alanları şifreli biçimde saklanır. Yönetim erişimi sınırlandırılır; girdiler doğrulanır, form istekleri hız sınırına tabi tutulur ve uygulama kayıtlarında kişisel veya gizli bilgiler maskelenir.",
        ],
      },
      {
        id: "rights",
        title: "9. KVKK madde 11 kapsamındaki haklarınız",
        paragraphs: ["KVKK kapsamında veri sorumlusuna başvurarak aşağıdaki hakları kullanabilirsiniz:"],
        bullets: [
          "Kişisel verilerinizin işlenip işlenmediğini öğrenme ve işlenmişse bilgi isteme.",
          "İşleme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme.",
          "Verilerin aktarıldığı yurt içindeki veya yurt dışındaki üçüncü kişileri bilme.",
          "Eksik veya yanlış işlenen verilerin düzeltilmesini isteme.",
          "Şartları oluştuğunda verilerin silinmesini veya yok edilmesini ve bu işlemlerin aktarılan kişilere bildirilmesini isteme.",
          "Otomatik sistem analizinin aleyhinize sonuç doğurmasına itiraz etme ve hukuka aykırı işleme nedeniyle zararın giderilmesini isteme.",
        ],
      },
      {
        id: "application",
        title: "10. Başvuru yöntemi",
        paragraphs: [
          `Başvurunuzu ${kvkkContactEmail} adresine gönderebilirsiniz. Başvuruda adınızı, talebinizi ve size yanıt verilebilecek bir iletişim kanalını belirtin. Kimlik doğrulaması için yalnızca talep ile orantılı ek bilgi istenebilir; kimlik belgesi kopyasını baştan göndermeyin. Başvurular niteliğine göre ve en geç otuz gün içinde ücretsiz olarak yanıtlanır; işlemin ayrıca maliyet gerektirmesi halinde mevzuattaki tarife uygulanabilir.`,
        ],
      },
      {
        id: "storage",
        title: "11. Çerezler ve yerel depolama",
        paragraphs: [
          "Bu sitede reklam, davranışsal profil oluşturma veya üçüncü taraf analiz araçları kullanılmaz. Yalnızca açık/koyu tema tercihiniz cihazınızdaki yerel depolamada tutulur. Gelecekte zorunlu olmayan takip teknolojileri eklenirse ayrıca açık bir tercih sunulur.",
        ],
      },
      {
        id: "updates",
        title: "12. Metin güncellemeleri",
        paragraphs: [
          "Bu metin 30 Eylül 2026 tarihinde yürürlüğe girmiştir. Süreç veya hizmet sağlayıcı değişikliklerinde güncellenebilir. Türkçe ve İngilizce metinler arasında farklılık olması halinde Türkçe metin esas alınır.",
        ],
      },
    ],
  },
  en: {
    title: "Your personal data",
    gradientText: "is handled for clear, limited purposes.",
    description:
      "This notice explains what data is processed, why it is processed, and how long it is kept when you contact Adakan Software.",
    effectiveDate: "Effective date: 30 September 2026",
    primaryHref: `mailto:${kvkkContactEmail}`,
    primaryLabel: "Submit a privacy request",
    sections: [
      {
        id: "controller",
        title: "1. Data controller",
        paragraphs: [
          `The data controller under Turkish Personal Data Protection Law No. 6698 (KVKK) is Özgür Erdem Adakan, operating under the Adakan Software brand. Send questions and data-subject requests to ${kvkkContactEmail}.`,
        ],
      },
      {
        id: "data",
        title: "2. Personal data processed",
        paragraphs: ["Depending on how you contact us, we may process:"],
        bullets: [
          "Your name, email address, and optional phone number.",
          "Your project needs, request, and message content.",
          "Language preference, submission time, and the request's internal identifier.",
          "Limited connection, request, and anti-abuse records used to secure the form.",
        ],
      },
      {
        id: "purposes",
        title: "3. Purposes",
        paragraphs: ["We process this data only to:"],
        bullets: [
          "Respond to your inquiry and communicate with you.",
          "Evaluate project needs and prepare a proposal or work plan.",
          "Protect the contact form from abuse and maintain technical security.",
          "Meet legal obligations and protect rights in a possible dispute.",
        ],
      },
      {
        id: "grounds",
        title: "4. Legal grounds",
        paragraphs: [
          "Contact and project evaluation rely on Article 5/2-c of KVKK, where processing is directly related to establishing or performing a contract, and Article 5/2-f, legitimate interests. Other applicable legal grounds may apply when a statutory duty must be met.",
          "Contact-form processing is not based on marketing consent or explicit consent. A separate and appropriate choice will be provided before any future commercial electronic communication.",
        ],
      },
      {
        id: "collection",
        title: "5. Collection method",
        paragraphs: [
          "Data is collected electronically through the website contact form, email correspondence, and the technical systems used to process those requests securely.",
        ],
      },
      {
        id: "recipients",
        title: "6. Providers and overseas processing",
        paragraphs: [
          "Cloudflare may provide site security and content delivery, Neon may provide database services, and Resend may provide email delivery. Data may also be disclosed to competent public authorities where legally required.",
          "These providers may operate systems outside Türkiye, so data may be processed overseas. Services, contracts, and transfer mechanisms are reviewed as applicable; this notice does not claim an unverified transfer safeguard.",
        ],
      },
      {
        id: "retention",
        title: "7. Retention",
        paragraphs: [
          "Contact and project inquiries that do not become a contract are kept for no more than two years after their last update. Contractual or legally required records may be kept separately for the applicable statutory period. Expired data is deleted, destroyed, or anonymized.",
        ],
      },
      {
        id: "security",
        title: "8. Security",
        paragraphs: [
          "Contact fields are stored in encrypted form. Administrative access is restricted, inputs are validated, form requests are rate limited, and personal or secret information is redacted from application logs.",
        ],
      },
      {
        id: "rights",
        title: "9. Your Article 11 rights",
        paragraphs: ["You may contact the controller to:"],
        bullets: [
          "Learn whether your personal data is processed and request information about that processing.",
          "Learn the purpose of processing and whether the data is used consistently with that purpose.",
          "Learn the third parties in Türkiye or abroad to whom data is transferred.",
          "Request correction of incomplete or inaccurate data.",
          "Request deletion or destruction where the conditions apply and notification of those actions to recipients.",
          "Object to an adverse result produced solely by automated analysis and claim compensation for unlawful processing.",
        ],
      },
      {
        id: "application",
        title: "10. How to apply",
        paragraphs: [
          `Email ${kvkkContactEmail} with your name, request, and a channel for our reply. We may request only proportionate information needed to verify identity; do not send an identity-card copy by default. Applications are answered free of charge as soon as possible and within thirty days, subject to any official fee tariff where a response creates additional cost.`,
        ],
      },
      {
        id: "storage",
        title: "11. Cookies and local storage",
        paragraphs: [
          "The site does not use advertising, behavioral profiling, or third-party analytics. Only your light or dark theme preference is stored in your device's local storage. A separate choice will be provided before any future non-essential tracking technology is introduced.",
        ],
      },
      {
        id: "updates",
        title: "12. Updates",
        paragraphs: [
          "This notice is effective from 30 September 2026 and may be updated when processes or providers change. If the Turkish and English texts differ, the Turkish text prevails.",
        ],
      },
    ],
  },
} as const satisfies Record<Locale, PrivacyPageCopy>
