# سامانه هوشمند بازرسی و تشخیص عیوب قطعات

## ⚡ راهنمای سریع ساخت APK با GitHub Actions

### پیش‌نیازها
- **کلید API Gemini** ([دریافت از Google AI Studio](https://aistudio.google.com/app/apikey))

---

## 📱 مراحل ساخت APK (قدم به قدم)

### ۱. تنظیم کلید API در GitHub Secrets

1. وارد repository شو: `https://github.com/amirsoleymanpoor/APP`
2. روی **Settings** (بالای صفحه) بزن
3. منوی سمت چپ: **Secrets and variables** → **Actions**
4. **New repository secret** بزن
5. Name: `GEMINI_API_KEY`
6. Secret: کلید API خودت
7. **Add secret**

### ۲. اجرای خودکار ساخت APK

1. تب **Actions** را باز کن
2. workflow "Build Android APK" را انتخاب کن
3. روی **Run workflow** → **Run workflow** بزن
4. صبر کن (۵-۱۰ دقیقه) ⏳

### ۳. دانلود APK

1. وقتی workflow سبز شد (✅)، رویش کلیک کن
2. پایین صفحه، بخش **Artifacts**
3. روی `app-debug-apk` کلیک کن تا ZIP دانلود شود
4. ZIP را Extract کن — APK آماده است!

---

## 🚀 اجرای سرور بک‌اند (لوکال)

```bash
npm install
# .env.local بساز و GEMINI_API_KEY را بگذار
npm run dev
```

---

## ✅ تغییرات نسخه Flat

- همه فایل‌ها در **ریشه (root)** repository هستند
- نیازی به پوشه `src/` نیست
- GitHub Actions به طور خودکار APK می‌سازد
- بدون نیاز به Android Studio روی کامپیوتر

---

## 🔐 نکات امنیتی

- هرگز `GEMINI_API_KEY` را در کد قرار نده
- فقط در GitHub Secrets ذخیره کن
