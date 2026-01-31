// src/services/authService.ts


// لا نحتاج لـ import هنا لأننا نعتمد على المكتبات الموجودة في index.html
// هذا يمنع تضارب الأكواد ويضمن عمل الموقع بسرعة

const firebaseConfig = {
  apiKey: "AIzaSyCktLGTaXFdbnqEzX0_lzEa_YIEfT2tTKc",
  authDomain: "namaapp-e6178.firebaseapp.com",
  projectId: "namaapp-e6178",
  storageBucket: "namaapp-e6178.firebasestorage.app",
  messagingSenderId: "372537900190",
  appId: "1:372537900190:web:846e0ba706cf6c0c2bcf8f"
};

// تهيئة Firebase بأمان (تستخدم النسخة الموجودة في المتصفح)
if ((window as any).firebase && !(window as any).firebase.apps.length) {
  (window as any).firebase.initializeApp(firebaseConfig);
}

// تعريف المتغير auth للاستخدام في باقي الملف
const auth = (window as any).firebase ? (window as any).firebase.auth() : null;

if (auth) {
    auth.languageCode = 'ar'; // لجعل رسالة SMS تصل باللغة العربية
}

export const setupRecaptcha = () => {
  if (!(window as any).firebase || (window as any).recaptchaVerifier) return;

  const container = document.getElementById('recaptcha-container');
  if (!container) return;

  try {
    (window as any).recaptchaVerifier = new (window as any).firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: (response: any) => {
        console.log("Recaptcha verified");
      },
      'expired-callback': () => {
        // إعادة تعيين Recaptcha إذا انتهت صلاحيته
        if((window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier.clear();
            (window as any).recaptchaVerifier = null;
        }
      }
    });
  } catch (err) {
    console.error("Failed to initialize Recaptcha:", err);
  }
};

export const sendOTP = async (phoneNumber: string) => {
  if (!auth) {
      console.error("Firebase not initialized");
      return false;
  }

  setupRecaptcha();
  const appVerifier = (window as any).recaptchaVerifier;
  
  try {
    // إرسال رسالة حقيقية
    const confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, appVerifier);
    (window as any).confirmationResult = confirmationResult;
    return true;
  } catch (error: any) {
    console.error("Firebase Auth Error:", error);
    
    // إذا ظهر خطأ، نعيد تهيئة Recaptcha للمحاولة القادمة
    if ((window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier.clear();
      (window as any).recaptchaVerifier = null;
    }
    
    throw new Error(getArabicErrorMessage(error.code));
  }
};

export const verifyOTP = async (otp: string) => {
  if (!(window as any).confirmationResult) {
    throw new Error("يرجى طلب رمز التحقق أولاً");
  }

  try {
    const result = await (window as any).confirmationResult.confirm(otp);
    const idToken = await result.user.getIdToken();
    setCookie('auth_token', idToken, 7);
    return result.user;
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    throw new Error("رمز التحقق غير صحيح");
  }
};

// دوال مساعدة للكوكيز وإدارة الجلسة
export const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;Secure;SameSite=Strict`;
};

export const deleteCookie = (name: string) => {
  document.cookie = name + '=; Max-Age=-99999999; path=/;';
};

export const checkAuthSession = async () => {
  if (!auth) return null;
  // فحص حالة المستخدم الحالية من Firebase مباشرة
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// دالة لترجمة أخطاء Firebase للعربية
const getArabicErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case 'auth/invalid-phone-number':
      return 'رقم الهاتف غير صحيح.';
    case 'auth/quota-exceeded':
      return 'تجاوزت الحد المسموح من الرسائل لهذا اليوم.';
    case 'auth/too-many-requests':
      return 'محاولات كثيرة جداً، يرجى الانتظار قليلاً.';
    default:
      return 'حدث خطأ في الإرسال، تأكد من الاتصال بالإنترنت.';
  }
};
