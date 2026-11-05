# Adakan Software E-posta İmzası Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `info@adakansoftware.com` ve `proje@adakansoftware.com` için seçilen C tasarımını Gmail imzası olarak uygulamak ve uçtan uca doğrulamak.

**Architecture:** Her Gmail hesabında ayrı bir HTML imza oluşturulacak. İmzalar tablo tabanlı, satır içi stilli ve uzak HTTPS logo kaynaklı olacak; Gmail yeni ileti ve yanıt varsayılanları ilgili imzaya bağlanacak. Son doğrulama, her adresten kendi yönlendirildiği Gmail kutusuna test iletisi gönderilip gerçek gönderen adresi ve görsel düzen kontrol edilerek yapılacak.

**Tech Stack:** Gmail web arayüzü, Resend SMTP, Cloudflare Email Routing, tablo tabanlı HTML e-posta.

## Global Constraints

- Seçilen tasarım **C — Renk vurgulu** olacak.
- Logo kaynağı `https://adakansoftware.com/adakan-logo.png` olacak.
- Harici CSS ve JavaScript kullanılmayacak.
- Telefon ve sosyal medya bağlantıları eklenmeyecek.
- Yeni iletiler ve yanıtlar için otomatik imza seçilecek.
- Gmail imza ayırıcısı kullanılmayacak.

---

### Task 1: Genel iletişim imzasını uygula

**Files:**
- Reference: `docs/superpowers/specs/2026-09-30-email-signature-design.md`
- Modify: Gmail hesabı `adakansoftware@gmail.com` ayarları

**Interfaces:**
- Consumes: `info@adakansoftware.com` doğrulanmış gönderen adresi ve Resend SMTP bağlantısı
- Produces: Gmail imza adı `Adakan Software — info`, yeni ileti ve yanıtlarda varsayılan imza

- [ ] **Step 1: Gmail Genel ayarlarını aç**

`https://mail.google.com/mail/u/0/#settings/general` adresine git ve İmza bölümünü bul.

- [ ] **Step 2: İmzayı oluştur**

`Adakan Software — info` adlı imza oluştur. İmza gövdesine gerçek logo, `Adakan Software`, `Yazılım · Web Tasarım · Dijital Çözümler`, `adakansoftware.com`, `info@adakansoftware.com` ve `Genel bilgi, teklif ve yeni iş talepleri` içeren tablo tabanlı HTML'yi ekle.

- [ ] **Step 3: Varsayılanları ayarla**

`info@adakansoftware.com` için yeni iletilerde ve yanıtlarda `Adakan Software — info` imzasını seç. Yanıtlarda imzayı alıntıdan önce yerleştir ve standart `--` ayırıcısını kaldır.

- [ ] **Step 4: Ayarları kaydet ve yeniden açarak doğrula**

İmza editöründe logo, renk şeridi, bağlantılar ve metinlerin korunduğunu kontrol et.

### Task 2: Proje iletişimi imzasını uygula

**Files:**
- Reference: `docs/superpowers/specs/2026-09-30-email-signature-design.md`
- Modify: Gmail hesabı `projeleradakansoftware@gmail.com` ayarları

**Interfaces:**
- Consumes: `proje@adakansoftware.com` doğrulanmış gönderen adresi ve Resend SMTP bağlantısı
- Produces: Gmail imza adı `Adakan Software — proje`, yeni ileti ve yanıtlarda varsayılan imza

- [ ] **Step 1: Gmail Genel ayarlarını aç**

`https://mail.google.com/mail/u/1/#settings/general` adresine git ve İmza bölümünü bul.

- [ ] **Step 2: İmzayı oluştur**

`Adakan Software — proje` adlı imza oluştur. İmza gövdesine gerçek logo, `Adakan Software`, `Proje ve Müşteri İletişimi`, `adakansoftware.com`, `proje@adakansoftware.com` ve `Aktif projeler, revizyonlar ve teslim süreçleri` içeren tablo tabanlı HTML'yi ekle.

- [ ] **Step 3: Varsayılanları ayarla**

`proje@adakansoftware.com` için yeni iletilerde ve yanıtlarda `Adakan Software — proje` imzasını seç. Yanıtlarda imzayı alıntıdan önce yerleştir ve standart `--` ayırıcısını kaldır.

- [ ] **Step 4: Ayarları kaydet ve yeniden açarak doğrula**

İmza editöründe logo, renk şeridi, bağlantılar ve metinlerin korunduğunu kontrol et.

### Task 3: Uçtan uca doğrulama

**Files:**
- Test: Gmail gelen kutuları ve Resend teslimat yolu

**Interfaces:**
- Consumes: Task 1 ve Task 2'de kaydedilen Gmail imzaları
- Produces: Her iki adres için gönderim, teslimat ve imza görünümü kanıtı

- [ ] **Step 1: info testini gönder**

`info@adakansoftware.com` adresinden `adakansoftware@gmail.com` adresine `İmza doğrulama — info@adakansoftware.com` başlıklı test iletisi gönder.

- [ ] **Step 2: info testini doğrula**

Gelen iletide gönderenin `info@adakansoftware.com` olduğunu; logo, başlık, renk şeridi ve bağlantıların göründüğünü doğrula.

- [ ] **Step 3: proje testini gönder**

`proje@adakansoftware.com` adresinden `projeleradakansoftware@gmail.com` adresine `İmza doğrulama — proje@adakansoftware.com` başlıklı test iletisi gönder.

- [ ] **Step 4: proje testini doğrula**

Gelen iletide gönderenin `proje@adakansoftware.com` olduğunu; logo, başlık, renk şeridi ve bağlantıların göründüğünü doğrula.

- [ ] **Step 5: Son durumu raporla**

İki adresin imza adı, varsayılan gönderici eşlemesi ve test teslimatı sonucunu kullanıcıya bildir.

