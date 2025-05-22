
# Operasyon Yönetim Sistemi

## 🚀 Proje Hakkında

Bu proje, şirket içi operasyonların yönetimini kolaylaştırmak amacıyla geliştirilmiş modern bir web uygulamasıdır. Next.js 14, TypeScript, Tailwind CSS, Supabase ve PostgreSQL kullanılarak inşa edilmiştir.

## 🔥 Özellikler

- 🔐 **Güvenli Kimlik Doğrulama Sistemi:** Kullanıcıların güvenli bir şekilde sisteme erişimini sağlar.
- 📊 **Operasyon İstatistikleri Dashboard:** Operasyonel verilerin görselleştirilmesi ve analizi için etkileşimli paneller sunar.
- 📋 **Operasyon Türleri Yönetimi:** Farklı operasyon türlerinin tanımlanması ve yönetilmesine olanak tanır.
- 👥 **Kullanıcı Yönetimi:** Kullanıcıların eklenmesi, düzenlenmesi ve yetkilendirilmesi işlemlerini destekler.
- 🌓 **Koyu/Açık Tema Desteği:** Kullanıcı tercihine göre tema seçimi yapabilme imkanı sunar.
- 📱 **Responsive Tasarım:** Farklı cihaz ve ekran boyutlarına uyumlu tasarım ile mobil deneyimi optimize eder.

## 🛠️ Teknolojiler

- **Frontend Framework:** [Next.js 14](https://nextjs.org/)
- **Programlama Dili:** [TypeScript](https://www.typescriptlang.org/)
- **Stil:** [Tailwind CSS](https://tailwindcss.com/)
- **State Yönetimi:** React Context API
- **Form Yönetimi:** [React Hook Form](https://react-hook-form.com/)
- **Validasyon:** [Zod](https://zod.dev/)
- **UI Bileşenleri:** [Shadcn/ui](https://ui.shadcn.dev/)
- **İkonlar:** [React Icons](https://react-icons.github.io/react-icons/)
- **HTTP İstemcisi:** [Axios](https://axios-http.com/)
- **Kimlik Doğrulama:** JWT & Çerezler
- **Backend Hizmeti:** [Supabase](https://supabase.com/)
- **Veritabanı:** [PostgreSQL](https://www.postgresql.org/)

## 📦 Kurulum

1. **Projeyi klonlayın:**

   ```bash
   git clone https://github.com/kullaniciadi/proje-adi.git
   ```

2. **Bağımlılıkları yükleyin:**

   ```bash
   npm install
   # veya
   yarn install
   ```

3. **Geliştirme sunucusunu başlatın:**

   ```bash
   npm run dev
   # veya
   yarn dev
   ```

   Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini ziyaret edin.

## 🌐 Canlı Demo

[https://pulse-erp-nextjs-project.vercel.app/auth/login](https://pulse-erp-nextjs-project.vercel.app/auth/login)

## 📁 Proje Yapısı

```plaintext
src/
├── app/          # Next.js 14 uygulama yönlendiricisi
├── components/   # Yeniden kullanılabilir bileşenler
│   ├── ui/       # Temel UI bileşenleri
│   └── shared/   # Paylaşılan bileşenler
├── contexts/     # React Context dosyaları
├── hooks/        # Özel React Hook'ları
├── lib/          # Yardımcı fonksiyonlar
├── services/     # API servisleri
├── styles/       # Global stil dosyaları
└── types/        # TypeScript tip tanımlamaları
```

## 🔒 Ortam Değişkenleri

Projeyi çalıştırmak için `.env.local` dosyanızda aşağıdaki ortam değişkenlerini tanımlamanız gerekmektedir:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Bu bilgileri Supabase projenizin ayarlarından temin edebilirsiniz. ([supabase.com](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs?utm_source=chatgpt.com))

## 🚀 Dağıtım

Bu proje Vercel üzerinde barındırılmaktadır. `main` branch'ine yapılan her push işlemi otomatik olarak production ortamına dağıtılır.

## 🧪 Test

- **Birim Testleri:**

  ```bash
  npm run test
  ```

- **Uçtan Uca (E2E) Testleri:**

  ```bash
  npm run test:e2e
  ```

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin.
2. Özellik branch'inizi oluşturun (`git checkout -b feature/AmazingFeature`).
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`).
4. Branch'inize push edin (`git push origin feature/AmazingFeature`).
5. Bir Pull Request oluşturun.

## 📜 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](./LICENSE) dosyasını inceleyebilirsiniz.

## 👥 İletişim

Proje Sahibi - [Oğuzhan Yavaş](https://www.linkedin.com/in/oguzhanyavass/)
             - [Baran Yalçın](https://www.linkedin.com/in/baranyalcinn/)

Proje Linki: [Demo Inceleme Web Sitesi Linki](https://pulse-erp-nextjs-project.vercel.app/)

Giriş Bilgileri: kullanıcı adı: PulseERP - şifre: 123123
