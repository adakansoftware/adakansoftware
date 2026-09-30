# Adakan Software KVKK Uyum Katmanı Tasarımı

**Tarih:** 30 Eylül 2026  
**Durum:** Kullanıcı tarafından onaylandı  
**Kapsam:** Web sitesi iletişim formu, yasal metinler, saklama ve imha süreci

## Amaç

Adakan Software web sitesinde iletişim talebi gönderen kişilerin verilerinin neden, hangi hukuki sebeple, nerede ve ne kadar süre işlendiğini açıkça anlatmak; gerekli olmayan açık rıza kutularından kaçınmak; saklama süresi sona eren talepleri teknik olarak imha etmek ve ilgili kişi başvuruları için belirli bir kanal sunmak.

Bu çalışma sitenin mevcut görsel dilini korur. Yalnızca iletişim formuna kısa bir aydınlatma satırı ekler ve mevcut gizlilik sayfasını kapsamlı bir KVKK aydınlatma metnine dönüştürür.

## Veri sorumlusu ve başvuru kanalı

- Veri sorumlusu: **Özgür Erdem Adakan**
- Marka: **Adakan Software**
- Elektronik başvuru kanalı: **kvkk@adakansoftware.com**
- Site adresi: **https://adakansoftware.com**

`kvkk@adakansoftware.com` adresi yasal metinlerde yer alacak; posta kutusu veya yönlendirme bu çalışmada açılmayacak. Adres kullanılmadan önce kullanıcının ayrıca vereceği talimatla etkinleştirilecek.

## İşlenen veri kategorileri

İletişim formu aşağıdaki verileri toplar:

- Kimlik bilgisi: ad ve soyad
- İletişim bilgisi: e-posta adresi ve isteğe bağlı telefon numarası
- Talep bilgisi: proje açıklaması ve tercih edilen dil
- İşlem güvenliği bilgisi: istek zamanı, sınırlı bağlantı/rate-limit kayıtları ve istek kimliği

Özel nitelikli kişisel veri talep edilmez. Formun yakınında kullanıcıdan sağlık, kimlik belgesi, parola, ödeme bilgisi veya başka hassas veri paylaşmaması istenir.

## Amaçlar ve hukuki sebepler

Veriler şu amaçlarla işlenir:

- İletişim talebini almak ve yanıtlamak
- Proje ihtiyacını değerlendirmek ve teklif görüşmesini yürütmek
- Formun kötüye kullanımını, spam ve güvenlik olaylarını önlemek
- Uyuşmazlık veya resmî yükümlülük hâlinde kayıt bütünlüğünü korumak

İletişim ve proje talebi işleme faaliyeti açık rızaya dayandırılmaz. Talebin niteliğine göre 6698 sayılı Kanun'un 5/2-c bendindeki sözleşmenin kurulması veya ifasıyla doğrudan ilgili olma ve 5/2-f bendindeki meşru menfaat şartları esas alınır. Güvenlik kayıtları hukuki yükümlülük ve meşru menfaat kapsamında değerlendirilir.

Aydınlatma metni ile açık rıza ayrı tutulur. Pazarlama, bülten veya davranışsal analiz gibi ileride açık rıza gerektirebilecek yeni bir işlem eklenirse bunun için ayrı, isteğe bağlı ve geri alınabilir bir mekanizma tasarlanır.

## Veri alıcıları ve altyapı

Veriler işin gerektirdiği ölçüde aşağıdaki hizmet sağlayıcı kategorilerinde işlenebilir:

- Barındırma, DNS ve güvenlik altyapısı
- Veritabanı hizmeti
- E-posta iletim hizmeti
- Yasal yükümlülük hâlinde yetkili kamu kurumları

Mevcut teknik akış Cloudflare, Neon ve Resend hizmetlerini kullanır. Yasal metin, sağlayıcı adlarını ve bunların yurt dışında bulunan altyapılarında işleme ihtimalini anlaşılır biçimde açıklar. Metin, doğrulanmamış bir yeterlilik kararı veya aktarım güvencesi bulunduğunu iddia etmez. Yurt dışı aktarım mekanizması işletme tarafından ayrıca belgelenmeden “tam uyum” beyanı yapılmaz.

## Saklama ve imha

Sonuçlanmayan veya sözleşmeye dönüşmeyen iletişim talepleri, son güncelleme tarihinden itibaren en fazla **iki yıl** saklanır. Sözleşmeye dönüşen talepler ilgili sözleşme, vergi ve ticaret mevzuatındaki zorunlu süreler kapsamında ayrı değerlendirilir.

Teknik uygulama:

1. İletişim kayıtlarında saklama bitiş tarihi hesaplanabilir olmalıdır.
2. Aylık çalıştırılabilen bir temizlik komutu, süresi dolmuş ve aktif bir sözleşme/uyuşmazlık saklama sebebi bulunmayan kayıtları kalıcı olarak siler.
3. Komut varsayılan olarak önizleme modunda çalışır; gerçek silme ayrı bir açık parametre gerektirir.
4. İmha kaydı kişisel veri içermez; işlem zamanı, silinen kayıt sayısı, kapsam ve işlem sonucu tutulur.
5. İmha kayıtları en az üç yıl saklanır.
6. Yönetim panelindeki manuel silme davranışı, aynı kişisel alanları kalıcı olarak erişilemez hâle getirir ve kişisel veri içermeyen imha kaydı üretir.

## İlgili kişi hakları ve başvuru süreci

KVKK sayfası Kanun'un 11'inci maddesindeki hakları sade dille açıklar. Başvurular `kvkk@adakansoftware.com` adresine yönlendirilir. Metin, başvuruda ad-soyad, talebin konusu, iletişim bilgisi ve kimliği doğrulamaya yetecek sınırlı bilginin bulunmasını ister; gereksiz kimlik belgesi yüklemeyi teşvik etmez.

Başvurular en geç otuz gün içinde yanıtlanmak üzere operasyonel olarak takip edilir. Kimlik doğrulaması talebin riskine göre orantılı yapılır. Başvuru ve yanıt süreci yönetim panelindeki mevcut iletişim kayıtlarından ayrı ele alınır.

## Site yüzeyi

### KVKK ve gizlilik sayfası

Mevcut `/privacy` ve `/en/privacy` yolları korunur. Türkçe sayfa başlığı “KVKK Aydınlatma ve Gizlilik Politikası” olur. İngilizce sayfa, aynı veri akışını açıklar ve Türkçe metnin esas olduğunu belirtir.

Sayfa şu bölümleri içerir:

1. Veri sorumlusu
2. Toplanan veriler
3. İşleme amaçları ve hukuki sebepler
4. Toplama yöntemi
5. Alıcı grupları ve yurt dışı işleme
6. Saklama süreleri ve imha
7. Veri güvenliği
8. İlgili kişinin hakları
9. Başvuru yöntemi
10. Çerezler ve yerel depolama
11. Güncelleme tarihi

### İletişim formu

Gönder düğmesinin hemen üstünde kısa ve düşük görsel ağırlıklı bir bilgi satırı gösterilir:

> Bu formdaki kişisel verileriniz talebinizi yanıtlamak amacıyla işlenir. Ayrıntılar için KVKK Aydınlatma Metni'ni inceleyebilirsiniz.

Buradaki “KVKK Aydınlatma Metni” bağlantıdır. Bu bildirim bir kabul beyanı, açık rıza veya pazarlama izni değildir. Form gönderimi için zorunlu onay kutusu eklenmez.

### Footer ve arama motorları

- Türkçe footer bağlantısı “KVKK ve Gizlilik” olarak güncellenir.
- İngilizce bağlantı “Privacy” olarak kalır.
- Sayfalar sitemap içinde yer almaya devam eder ve içerik revizyon tarihi güncellenir.
- Yasal sayfalar arama motorlarına açık kalır ancak ticari anahtar kelime hedeflemez.

## Çerez ve yerel depolama kararı

Kod tabanında reklam, davranışsal analiz veya üçüncü taraf izleme çerezi bulunmamaktadır. Tema seçimi yalnızca tarayıcının `localStorage` alanında tutulur ve kullanıcı takibi için kullanılmaz. Bu nedenle çerez banner'ı eklenmez.

İleride analiz veya reklam sağlayıcısı eklenirse zorunlu olmayan araçlar kullanıcı tercihi alınmadan çalıştırılmayacak ve bu tasarım yeniden değerlendirilecektir.

## Güvenlik ve veri minimizasyonu

- Mevcut sunucu tarafı doğrulama, boyut sınırı, origin kontrolü, rate limiting ve spam alanı korunur.
- Veritabanındaki iletişim alanlarının mevcut şifreleme katmanı korunur.
- Loglara ad, e-posta, telefon veya proje metni yazılmaz.
- Yönetim erişimi mevcut yetkilendirme ve oturum kontrolleriyle sınırlı kalır.
- Başarısız e-posta teslim kayıtları gereğinden uzun tutulmaz.
- KVKK başvuru adresi açılana kadar başvuru mesajlarının kaybolmaması için yayın öncesi kontrol listesinde adresin etkinleştirilmesi zorunlu madde olur.

## Test ve kabul ölçütleri

- Türkçe ve İngilizce KVKK sayfaları doğru başlık, veri sorumlusu, başvuru adresi, veri kategorileri, hukuki sebepler, alıcı grupları, saklama süresi ve haklar bölümlerini içerir.
- İletişim formu KVKK bağlantısını doğru yerel yola yönlendirir ve zorunlu rıza kutusu içermez.
- Formun mevcut gönderim davranışı ve erişilebilirliği bozulmaz.
- Temizlik komutu önizlemede veri silmez; uygulama modunda yalnızca süresi dolan uygun kayıtları siler.
- İmha kaydı kişisel veri içermez ve testlerle doğrulanır.
- Lint, tip kontrolü, birim testleri, üretim derlemesi ve ilgili smoke testleri geçer.
- Canlı yayın öncesi `kvkk@adakansoftware.com` adresinin çalıştığı ayrıca doğrulanır.

## Sınırlar

Bu çalışma web sitesindeki iletişim sürecini kapsar. VERBİS kayıt yükümlülüğü, gerçek kişi veri sorumlusunun muafiyet durumu, çalışan/tedarikçi verileri, sözleşme arşivi ve yurt dışı aktarım belgeleri işletme düzeyinde ayrıca değerlendirilmelidir. Teknik uygulama hukuki danışman incelemesinin yerine geçmez.
