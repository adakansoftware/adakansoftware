# Hatay Merkezli Türkiye Geneli SEO Tasarımı

## Amaç

Adakan Software'ın gerçek konumunu Hatay olarak göstermek, ana sayfadaki görünür İstanbul merkezli tanımı kaldırmak ve arama görünürlüğünü Türkiye geneline taşıyan dürüst bir SEO mimarisi kurmak. Mevcut görsel tasarım, bileşen yapısı, renkler, hareketler, boşluklar ve sayfa düzeni korunacaktır.

## Konumlandırma

Ana marka anlatısı “Hatay merkezli, Türkiye genelindeki işletmelere uzaktan hizmet veren yazılım şirketi” olacaktır. Ana sayfanın kahraman alanındaki konum tanımı tamamen kaldırılacaktır; başlık ve mevcut görsel hiyerarşi değişmeyecektir. Footer konumu Türkçede `Hatay, Türkiye`, İngilizcede `Hatay, Türkiye` olarak gösterilecektir.

Site genelindeki kurumsal açıklamalar, Open Graph metinleri ve yapılandırılmış veriler İstanbul merkezli olma iddiası taşımayacaktır. Organization şemasındaki `addressLocality` değeri Hatay olacaktır. Türkiye çapındaki hizmet iddiası, yalnızca gerçekten sunulan uzaktan çalışma ve teslim süreçleriyle açıklanacaktır.

## Arama Mimarisi

Ana sayfa geniş ulusal niyeti hedefleyecektir: yazılım şirketi, özel yazılım geliştirme, web uygulaması, kurumsal web sitesi, Next.js geliştirme, UI/UX ve iş otomasyonu. Başlık ve açıklamalar anahtar kelime tekrarına dönüşmeden Türkiye geneli hizmet kapsamını açıklayacaktır.

İki yeni iki dilli arama sayfası oluşturulacaktır:

- `/turkiye-yazilim-sirketi` ve `/en/turkey-software-company`: Türkiye genelindeki yazılım ve web geliştirme ihtiyaçlarını, uzaktan proje sürecini ve hizmet kapsamını açıklayan ulusal sayfa.
- `/hatay-yazilim-sirketi` ve `/en/hatay-software-company`: Hatay'daki işletmeler için yerel keşif, iletişim ve hizmet kapsamını açıklayan yerel sayfa.

Mevcut `/istanbul-yazilim-sirketi` ve `/en/istanbul-software-company` rotaları kaldırılmayacaktır. İçerik, Adakan Software'ın İstanbul merkezli olduğu izlenimini vermeden, Hatay merkezli ekibin İstanbul'daki işletmelere uzaktan hizmet verebildiğini açıklayacak biçimde güncellenecektir. Böylece mevcut URL değerleri ve bölgesel arama kapsamı korunur.

## İçerik ve Dahili Bağlantılar

Yeni sayfalar mevcut `LocalSoftwarePage` görsel dilini ve sayfa kabuğunu kullanacaktır. Ortak bir yerel/ulusal hizmet veri modeliyle ayrı başlık, açıklama, içerik, sık sorular ve ilgili bağlantılar üretilecektir. Her sayfa kendi arama niyetine özgü içerik taşıyacak; yalnızca şehir adı değiştirilmiş kopyalar oluşturulmayacaktır.

Footer'daki mevcut “İstanbul Yazılım Şirketi” bağlantısı ulusal sayfaya yönlendirilecek ve “Türkiye Yazılım Şirketi” olarak adlandırılacaktır. Hatay ve İstanbul sayfalarına ulusal sayfadan bağ verilecek; hizmet sayfalarından ulusal sayfaya bağ kurularak arama motorlarının konu ilişkisini anlaması sağlanacaktır.

## Teknik SEO

Yeni rotalar `publicRoutes`, sitemap, hreflang, canonical, metadata ve JSON-LD üretimine eklenecektir. Türkçe ve İngilizce eş rotalar karşılıklı bağlanacaktır. `lastModified` tarihi değişen içerikler için `2026-10-05` olacaktır. Yapılandırılmış verilerde uydurma değerlendirme, müşteri sayısı veya doğrulanmamış fiziksel ofis bilgisi kullanılmayacaktır.

İstanbul odaklı kalan anahtar kelimeler yalnızca İstanbul hizmet sayfasında bulunacaktır. Ana sayfa, site yapılandırması, kurumsal açıklamalar, iletişim ve genel hizmet metadata'sı Türkiye/Hatay konumlandırmasına geçirilecektir. Saat dilimi gibi teknik `Europe/Istanbul` değerleri konum iddiası olmadığı için değiştirilmeyecektir.

## Görsel Kısıtlar

- Mevcut UI bileşenleri yeniden tasarlanmayacaktır.
- Renkler, tipografi, grid, animasyon ve spacing değerleri değişmeyecektir.
- Ana sayfada yalnızca istenen intro satırı kaldırılacaktır.
- Footer'da yalnızca konum ve ulusal SEO bağlantısı metni değişecektir.
- Yeni sayfalar mevcut sayfa kabuğunu birebir kullanacaktır.

## Doğrulama

Kaynak sınırı testleri ana sayfada İstanbul intro metninin bulunmadığını, footer konumunun Hatay olduğunu ve genel metadata'nın İstanbul merkezli iddia taşımadığını doğrulayacaktır. Rota testleri yeni Türkçe/İngilizce URL çiftlerini, canonical ve hreflang değerlerini, sitemap girişlerini ve eski İstanbul rotalarının korunmasını kontrol edecektir.

Lint, TypeScript, tam birim testleri, üretim derlemesi ve smoke testleri çalıştırılacaktır. Ana sayfa, footer ve yeni sayfalar masaüstü/mobil tarayıcı kontrolünden geçirilecek; mevcut UI yapısında görsel sapma olmadığı doğrulanacaktır.
