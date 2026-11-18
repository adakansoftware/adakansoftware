# Müşteri edinimi odaklı SEO — 18 Kasım 2026

## Denetim sonucu

Canlı sitemap'teki 60 URL tarandı. Tamamı HTTP 200, bir H1, title ve canonical içeriyor. Bu sayfalarda noindex veya yinelenen title bulunmadı. Her sitemap sayfasına taranan sayfalardan en az bir iç bağlantı var. Bu kontroller Google'ın sayfaları indekslediği veya sıralamalarının yükseldiği anlamına gelmez.

Kullanıcı Search Console'un kurulu olduğunu doğruladı. Hesap verisi bu çalışmada okunmadı. Google İşletme Profili henüz yok. Kullanıcı müşterilerin adresine gittiklerini, bazen kafede görüştüklerini belirtti.

## Yapılan iyileştirmeler

- Otomasyon rehberindeki TR/EN dil geçişi yanlış adrese gidiyordu. Eksik rota eşleştirmesi eklendi; tüm kayıtlı sayfaların iki yönlü dil geçişleri test edildi.
- Altı hizmet sayfasının mevcut bağlantı alanları ilgili fiyat sayfasına, rehbere veya proje örneklerine yönlendirildi. Web sitesi hizmetinden gerçek Z Grup vaka çalışmasına doğrudan bağlantı eklendi.
- Özel yazılım sayfasına hazır ürün/özel geliştirme seçimi ve teklif için gerekli bilgiler eklendi.
- Web sitesi sayfasına paket fiyatları, ödeme, revizyon ve ilk ay destek açıklandı. Her pakette aynı SEO kapsamı varmış gibi görünen anlatım düzeltildi. Analitik kurulumu bütün paketlerde dahilmiş gibi sunulmuyor.
- Değişiklikler TR/EN birlikte yapıldı. Mevcut CSS, sınıflar, fontlar ve bileşen düzeni korunuyor; yeni stil veya bağımlılık yok. SSS içeriği ve mevcut bağlantı metinleri değişti.

## Değişen dosyalar

- `lib/localized-route-map.ts`: Eksik otomasyon rehberi dil çifti.
- `lib/blog-routes.test.mjs`: Tüm kayıtlı rotalarda karşılıklı dil geçişi kontrolü.
- `lib/service-pages.ts`: Hizmetlerin ilgili bağlantıları, web projesi örneği ve TR/EN satın alma soruları.
- `components/service-seo-page.tsx`: Mevcut iki bağlantı alanında hizmete özel verileri kullanır.
- `lib/service-pages.test.mjs`: Fiyat/rehber/proje bağlantılarının hedef dilde geçerli olduğunu doğrular.
- `lib/public-routes.ts`: İçeriği değişen altı hizmet sayfasının lastModified tarihi.
- `docs/seo-review-2026-11-18.md`: Denetim ve sonraki ölçüm adımları.

## Doğrulama

- 253 test geçti; lint, TypeScript ve üretim derlemesi başarılı.
- Yerel üretim sunucusunda 12 TR/EN hizmet sayfası ve iki otomasyon rehberi kontrol edildi. İlgili bağlantılar HTTP 200; dil geçişleri karşılıklı doğru; SSS JSON-LD görünen sorularla eşleşiyor. 390 px genişlikte yatay taşma yok.
- Üretim proxy'si HTTPS başlığı beklediğinden yerel tarayıcı kontrolü `x-forwarded-proto: https` ile yapıldı. İlk başlıksız deneme zaman aşımına uğradı; uygulama kodunda bu kontrolü atlayan değişiklik yapılmadı.
- Mevcut hizmet bileşeninin CSS sınıfları önceki commit ile karşılaştırıldı; değişmedi.

## Hesap tarafındaki sonraki adımlar

1. Google İşletme Profili: Müşterinin adresine fiziksel hizmet veren işletme olarak gerçek faaliyet bilgileriyle oluşturun. Müşteri kabul etmeyen adresi gizleyin; görüşülen kafeyi ofis adresi olarak kaydetmeyin. İsim yalnızca Adakan Software olmalı. Hizmet bölgeleri gerçekten gidilen bölgeler olmalı; aramada hedeflenen her şehir otomatik olarak hizmet bölgesi sayılmaz. Doğrulamayı işletme sahibi tamamlar.
2. Search Console: `https://adakansoftware.com/sitemap.xml` gönderiminin başarılı olduğunu kontrol edin. Ana sayfa, Van, İstanbul ve iki ana hizmet URL'sini URL Denetimi ile inceleyin. İndekslenmeme nedeni varsa önce o nedeni çözün.
3. Performans raporu: Son 28 gün ile önceki 28 günü sorgu, sayfa, ülke ve cihaz bazında karşılaştırın. Adakan marka sorguları ile yazılım şirketi, Van yazılımcı, Van yazılım şirketi ve İstanbul hizmet sorgularını ayrı değerlendirin. Gösterim, tıklama, CTR ve ortalama konumu kaydedin. Düşük veri hacminde küçük değişimlerden sonuç çıkarmayın.
4. Gerçek proje kanıtı: Müşterinin onayıyla proje anlatımlarını ve gerçek referansları geliştirin. Sahte yorum, satın alınmış bağlantı veya doğrulanmamış başarı oranı kullanılmamalı.

Profil oluşturulmadı, Search Console'a veri gönderilmedi, hesaplar değiştirilmedi. Kod değişiklikleri commit ve push kapsamına alındı. Otomatik dağıtımın sonucu ayrıca doğrulanmalıdır.

## Kaynaklar

- [Google: yararlı içerik](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: iç bağlantılar](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google: yerelleştirilmiş sayfalar](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google İşletme Profili uygunluğu](https://support.google.com/business/answer/7039811)
