# Adakan Software E-posta İmzası Tasarımı

## Amaç

`info@adakansoftware.com` ve `proje@adakansoftware.com` adreslerinden gönderilen iletilere sade, kurumsal ve aynı marka dilini taşıyan HTML imzalar eklemek.

## Seçilen yön

Kullanıcı, önizlemedeki **C — Renk vurgulu** tasarımı seçti. İmza beyaz bir kart üzerinde gerçek Adakan Software logosunu, marka adını, kullanım amacını, web sitesini ve ilgili e-posta adresini gösterecek. Marka gradyanı yalnızca üstteki ince vurgu çizgisinde kullanılacak.

## Varyantlar

### Genel iletişim

- Gönderen: `info@adakansoftware.com`
- Başlık: `Adakan Software`
- Alt başlık: `Yazılım · Web Tasarım · Dijital Çözümler`
- Açıklama: `Genel bilgi, teklif ve yeni iş talepleri`
- Bağlantılar: `adakansoftware.com`, `info@adakansoftware.com`

### Proje iletişimi

- Gönderen: `proje@adakansoftware.com`
- Başlık: `Adakan Software`
- Alt başlık: `Proje ve Müşteri İletişimi`
- Açıklama: `Aktif projeler, revizyonlar ve teslim süreçleri`
- Bağlantılar: `adakansoftware.com`, `proje@adakansoftware.com`

## Teknik yapı

- Gmail ve yaygın e-posta istemcileri için tablo tabanlı HTML kullanılacak.
- Tüm stiller satır içi olacak; harici CSS ve JavaScript kullanılmayacak.
- Logo, canlı sitenin HTTPS adresinden `https://adakansoftware.com/adakan-logo.png` olarak yüklenecek.
- Gradyan yerine üç bitişik renk hücresi kullanılacak; böylece Gmail ve Outlook uyumluluğu artacak.
- Kartın beyaz zemini sabit tutulacak; koyu temada logo ve metin renkleri bozulmayacak.
- İmza yaklaşık 470 piksel genişliğinde ve mobilde okunabilir olacak.
- Telefon ve sosyal medya bağlantıları eklenmeyecek; imza kısa ve güvenilir kalacak.

## Gmail davranışı

- Her Gmail hesabında ilgili imza oluşturulacak.
- Yeni iletilerde otomatik kullanılacak.
- Yanıtlarda da kullanılacak.
- İmza ayırıcısı olan `--` çizgisi kullanılmayacak.

## Doğrulama

- Her hesaptan kendine bir test iletisi gönderilecek.
- Gelen iletide gerçek gönderen adresi, logo, bağlantılar ve düzen kontrol edilecek.
- Açık ve koyu görünümde metinlerin okunabilir olduğu doğrulanacak.

