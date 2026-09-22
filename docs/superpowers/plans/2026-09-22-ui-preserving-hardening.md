# UI korunarak sunucu sağlamlaştırma

Amaç: Mevcut tasarımı ve başarılı isteklerin yanıt sözleşmesini koruyarak doğrulanmış sunucu hatalarını gidermek.

- [x] İletişim, yönetici giriş ve içerik API'larında JSON gövdesini akış sırasında byte sınırıyla oku. Sınır aşımında okumayı iptal et ve 413 döndür; bozuk/kesilen gövdelerde 400 döndür. JSON medya türünü tam eşleştir. Önce regresyon testlerinde mevcut hatayı göster.
- [x] Yerel JSON deposunda başarısız bir işlemin yazma kuyruğunu kalıcı olarak kilitlemesini önle. Geçici dosyaya yazıp aynı dizinde yeniden adlandırarak eski veriyi koru. Gerçek geçici dosyalarla başarısız işlem sonrası toparlanmayı ve sıralı güncellemeleri test et.
- [x] Tüm birim testlerini tek komutla ve CI'da çalıştırılacak şekilde bağla. İç içe worktree dizinlerini lint ve TypeScript taramasından çıkar.
- [x] Lint, tüm birim testleri, üretim derlemesi ve uygun smoke kontrollerini çalıştır; sonuçları ve kapsam sınırlarını raporla.

Kapsam: UI, stiller, içerik ve animasyonlar değişmeyecek. Başlangıçtaki next-env.d.ts değişikliği ve takip edilmeyen eski planlar korunacak. Canlı veritabanına test kaydı veya dağıtım yapılmayacak.
