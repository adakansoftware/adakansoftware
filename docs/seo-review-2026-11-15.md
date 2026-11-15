# SEO teslim notu — 15 Kasım 2026

## İkinci çalışma: marka ve Van arama niyeti

İlk SEO sürümünün (`94113f6`) CI çalışması başarılı. Canlı kontrolde Türkçe/İngilizce Van sayfaları ve web fiyat sayfası HTTP 200 ve beklenen başlıklarla açıldı. İkinci çalışma da commit ve push kapsamına alındı; bu sürümün canlı dağıtım sonucu ayrıca doğrulanmalıdır.

- `components/studio-home.tsx`: Adakan adı ve yazılım şirketi konumlandırması TR/EN görünür metinde netleştirildi. Mevcut hizmet başlıklarına ilgili hizmet sayfası bağlantıları eklendi.
- `lib/route-metadata-content.ts`: Türkçe ana sayfa başlığı “Yazılım Şirketi ve Özel Yazılım Geliştirme” oldu; ortak metadata üreticisi Adakan Software adını ekler.
- `lib/van-service-page.ts`: Başlık “Van Yazılım Şirketi ve Web Tasarım”; geliştirici seçimi, ihtiyacı tarif etme ve teklif kapsamını karşılaştırmaya ilişkin TR/EN içerik eklendi. İstanbul sayfasına ilgili bağlantı eklendi. Mevcut URL korundu.
- `lib/local-service-page.ts`: İstanbul sayfasından Van'a iki dilde bağlantı eklendi.
- `lib/shell-content.ts`: Türkçe footer bağlantısının görünen adı “Van Yazılım Şirketi” oldu.
- `lib/public-routes.ts`: İçeriği değişen İstanbul sayfasının tarihi güncellendi.
- `lib/local-service-page.test.mjs`: İlgili bağlantılar, hedef dildeki kayıtlı rota adresine göre doğrulanıyor.
- `docs/seo-review-2026-11-15.md`: İkinci çalışma kapsamı ve yayın durumu kaydedildi.

Yeni stil, görsel bileşen veya bağımlılık yok. Değişen metinler ve eklenen ilgili bağlantılar mevcut düzeni kullanır. Mevcut Organization/WebSite şemalarında zaten bulunan “Adakan” alternatif adı korundu; doğrulanmamış adres, değerlendirme veya sıralama iddiası eklenmedi.

Hedef sorguların sayfa eşleştirmesi: “Adakan” ve “yazılım şirketi” ana sayfa; “Van yazılım şirketi”, “Van yazılım firması” ve “Van yazılımcı” aynı kapsamlı Van sayfası. Bu eşleştirme sıralama garantisi değildir. Google'ın [açık başlık](https://developers.google.com/search/docs/appearance/title-link) ve [anlamlı iç bağlantı](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) rehberleri esas alındı. Yazım hataları için ayrı sayfa veya görünmez kelime listesi oluşturulmadı.

Hedef: Van ve İstanbul öncelikli; Türkiye geneli ve yurt dışı için Türkçe/İngilizce hizmet anlatımı.

## Uygulanan değişiklikler

- Ana sayfa başlıkları ve açıklamaları özel yazılım, web sitesi ve iş otomasyonuna odaklandı.
- Van için özgün TR/EN hizmet içeriği eklendi. Uzaktan çalışma, kapsam, veri aktarımı ve bakım sorumlulukları anlatılıyor. Yeni fiziksel ofis veya müşteri referansı iddiası eklenmedi.
- Mevcut şehir sayfası bileşeni yeniden kullanıldı; şehir bazlı Service.areaServed, canonical, hreflang, sitemap ve footer bağlantıları tamamlandı.
- İstanbul ve Van sayfalarının dil menüsü doğru yerelleştirilmiş adrese gider.
- Logo, web ve yazılım fiyat sayfalarının metadata kaydı ayrıldı; sayfalar ve metadata testi aynı kayıtları kullanıyor.
- CI'daki eski dört blog yazısı beklentisi, kayıtlı tüm yazıların iki dilde bulunmasını ve tarih tutarlılığını doğrulayacak şekilde düzeltildi. İçerik uzunluğu ve SSS kontrolleri korundu.

## Dosya listesi

- `app/van-yazilim-firmasi/page.tsx`: Türkçe Van sayfası ve metadata.
- `app/[locale]/van-software-company/page.tsx`: İngilizce Van sayfası, locale kontrolü ve karşılıklı dil URL'leri.
- `lib/van-service-page.ts`: Van için özgün iki dilli hizmet, süreç açıklamaları, SSS ve ilgili bağlantılar.
- `lib/local-service-page.ts`: Mevcut İstanbul verisini koruyarak şehir seçimi; ortak hizmetler ve süreç verilerinin yeniden kullanımı.
- `components/local-software-page.tsx`: Mevcut düzen içinde şehir verisi seçimi, şehir başlığı ve Service şeması.
- `components/studio-home.tsx`: TR/EN giriş, ana başlık ve açıklama metinleri.
- `lib/shell-content.ts`: Footer hizmet bağlantılarına Van sayfaları.
- `lib/i18n.ts`: İstanbul ve Van için iki yönlü dil geçişi.
- `lib/public-routes.ts`: Van rotası, sitemap dil eşleştirmesi, içerik tarihi ve ayrı fiyat metadata anahtarları.
- `lib/route-metadata-content.ts`: Ana sayfa, Van ve üç fiyat kategorisinin ayrı TR/EN metadata içerikleri.
- `lib/metadata.ts`: Kayıtlı yerelleştirilmiş yolların metadata üretiminde kullanılması.
- `lib/site-config.ts`: Varsayılan başlık, açıklama, OG ve Twitter metinlerinin ana sayfa kaydıyla eşitlenmesi.
- `lib/structured-data.ts`: Hizmet şemasında isteğe bağlı şehir kapsamı.
- `app/pricing/[category]/page.tsx`: Fiyat kategorisinin merkezi metadata kaydını kullanır.
- `app/[locale]/pricing/[category]/page.tsx`: Yerelleştirilmiş fiyat kategorisinin merkezi metadata kaydını kullanır.
- `lib/local-service-page.test.mjs`: Mevcut İstanbul testine ek Van içeriği, bağlantı ve dil geçişi kontrolleri.
- `lib/metadata.test.mjs`: Van rotası ve tekrar eden başlıklarda açıklayıcı hata kontrolü.
- `lib/public-routes.test.mjs`: Beklenen rota listesine Van eklendi.
- `lib/seo-routes.test.mjs`: Değişen ana sayfanın gerçek içerik tarihi.
- `lib/blog-posts.test.mjs`: Kayıtlı yazıların iki dilde eksiksizliği ve tarih sırası.
- `docs/seo-review-2026-11-15.md`: Bu teslim ve doğrulama notu.

## Tasarım sınırı

Yeni görsel bileşen, kütüphane veya stil eklenmedi. Mevcut dosyalardaki literal Tailwind sınıfları HEAD ile karşılaştırıldı; değişmedi. Metin uzunlukları ve footer'a eklenen Van bağlantısı görünen içeriği değiştirir. Van sayfaları mevcut şehir sayfası düzenini kullanır.

## Doğrulama ve yayın durumu

- 251 birim/regresyon testi geçti; lint ve TypeScript kontrolü temiz.
- Son değişikliklerle `npm run build` başarılı.
- Tarayıcıda 12 TR/EN sayfa: HTTP 200, tek H1, canonical, hreflang; şehirlerde Service/FAQ JSON-LD doğrulandı. 390 px genişlikte yatay taşma yok.
- Yerel sitemap iki Van URL'sini içeriyor.
- Canlı sitede denetim sırasında `/pricing/web` 404 dönüyordu. Son fiyat commit'inin GitHub CI çalışması test aşamasında başarısızdı: https://github.com/adakansoftware/adakansoftware/actions/runs/43647906904
- Doğrulama yerel ortamda yapıldı. Yayın Git push sonrasında otomatik dağıtım akışına bağlıdır. Canlı indekslenme ve sıralama sonucu ölçülmedi; Search Console verisi bağlı değil.

## Yayından sonraki ölçüm

Search Console'da sitemap ve yeni URL'lerin indeks durumunu kontrol edin. Van/İstanbul sorgularını ve ülke bazlı TR/EN gösterim, tıklama ve dönüşümleri ayrı izleyin. Google Business Profile bilgilerini yalnızca gerçek işletme adresi ve hizmet modeliyle güncelleyin; profil değişikliği bu çalışmada yapılmadı.

Google kaynakları: [Arama temelleri](https://developers.google.com/search/docs/essentials), [yararlı içerik](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [dil sürümleri](https://developers.google.com/search/docs/specialty/international/localized-versions), [doorway politikası](https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse).
