# KVKK Operasyon Rehberi

Bu rehber, Adakan Software iletişim taleplerinin yayımlanan KVKK aydınlatma metniyle uyumlu işletilmesi için hazırlanmıştır. Veri sorumlusu Özgür Erdem Adakan'dır. Başvuru kanalı `kvkk@adakansoftware.com` adresidir.

## Yayına alma kontrolü

1. Cloudflare Email Routing üzerinde `kvkk@adakansoftware.com` adresini `adakansoftwareinfo@gmail.com` hedefine yönlendirin.
2. Hedef Gmail hesabındaki doğrulama iletisini onaylayın ve yönlendirme kuralının etkin olduğunu kontrol edin.
3. Dışarıdan tek bir deneme iletisi gönderip Gmail gelen kutusunda veya spam klasöründe teslimi doğrulayın.
4. İlk yayın için yalnızca gelen posta yönlendirmesi yeterlidir. Kullanıcı ayrıca istemedikçe Gmail “Farklı gönder” ayarı oluşturmayın.
5. `/privacy`, `/en/privacy`, `/contact` ve `/en/contact` sayfalarını masaüstü ve mobil genişlikte kontrol edin.

## Aylık saklama temizliği

İlk çalıştırma daima ön izleme olmalıdır:

```powershell
npm run ops:kvkk:cleanup:dry
```

Çıktıda yalnızca silinmeye uygun kayıt sayısı, bekletilen kayıt sayısı ve en eski uygun tarih bulunmalıdır. Kişi adı, e-posta, telefon, proje metni veya kayıt kimliği görünmemelidir.

Toplamları kontrol ettikten ve silme işlemi için operasyon yetkisi aldıktan sonra:

```powershell
npm run ops:kvkk:cleanup:apply
```

İlk başarılı manuel çalıştırmadan sonra bu işlem ayda bir kez planlanmalıdır. Otomatik çalıştırma kurulurken önce kuru çalışma çıktısının izlenmesi ve başarısızlık bildirimlerinin tanımlanması gerekir.

## KVKK başvurusu işleme

Başvuru geldiğinde aşağıdaki operasyon kaydını kişisel iletişim kutusundan ayrı ve erişimi sınırlı bir yerde tutun:

- başvurunun alındığı tarih;
- kimlik doğrulaması için uygulanan orantılı adımlar;
- talep konusu ve verilen karar;
- yanıt tarihi;
- veri saklanmaya devam edecekse bunun hukuki nedeni ve gözden geçirme tarihi.

Kimlik belgesi kopyasını varsayılan yöntem olarak istemeyin. Başvurunun niteliği için gerekli en az bilgiyi talep edin. Başvuruyu mümkün olan en kısa sürede ve en geç otuz gün içinde yanıtlayın.

Aktif bir hukuki veya sözleşmesel süreç nedeniyle kayıt silinmemeliyse yönetim ekranındaki saklama bekletmesini açın. Gerekçe ortadan kalktığında bekletmeyi kaldırın. Bir kişinin talebi üzerine kalıcı silme gerekiyorsa yönetim ekranındaki onaylı silme işlemini kullanın; kişisel verileri yalnızca uygulama arayüzünden değil veritabanından da kaldırır.

## Hizmet sağlayıcıları ve yurt dışı aktarım

Cloudflare, Neon ve Resend hizmetlerinin işlem konumlarını, veri işleme sözleşmelerini ve yürürlükteki aktarım mekanizmalarını dönemsel olarak gözden geçirin. Bu inceleme tamamlanmadan “tam yurt dışı aktarım uyumu” veya doğrulanmamış bir güvence beyan etmeyin.

Yeni bir analiz, reklam, bülten, profilleme veya zorunlu olmayan takip aracı eklenmeden önce KVKK metnini, çerez/yerel depolama davranışını ve gerekiyorsa tercih mekanizmasını yeniden değerlendirin.

## Denetim ve olay yönetimi

Silme denetim kayıtları kişisel veri içermez; yalnızca çalıştırma kimliği, işlemi yapan rol, gerekçe, toplam sayı ve zaman bilgisi tutulur. Bu kayıtları üç yıl saklayın. Süresi dolan denetim kayıtları ayrı bir toplu bakım sorgusuyla silinmelidir:

```sql
delete from contact_deletion_audits where expires_at <= now();
```

Bir veri güvenliği olayı şüphesinde ilgili sistemlerin erişimini sınırlayın, olay zaman çizelgesini koruyun, hangi veri gruplarının etkilenmiş olabileceğini belirleyin ve yürürlükteki bildirim yükümlülüklerini gecikmeden değerlendirin. Uygulama loglarına kişisel veri veya sır eklemeyin.
