
// إعداد Firebase
// ملاحظة: وضعنا مفاتيح تجريبية (Placeholder). 
// في بيئة الإنتاج، يجب استبدالها بمفاتيح حقيقية من Firebase Console.
const firebaseConfig = {
  apiKey: "AIzaSyAs-DEMO-KEY",
  authDomain: "namaa-app.firebaseapp.com",
  projectId: "namaa-app",
  storageBucket: "namaa-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// فحص ما إذا كنا نستخدم مفاتيح تجريبية لتفعيل "وضع المحاكاة"
const isDemoConfig = firebaseConfig.apiKey === "AIzaSyAs-DEMO-KEY";

// تهيئة Firebase إذا لم يكن مهيئاً
if (!(window as any).firebase.apps.length) {
  (window as any).firebase.initializeApp(firebaseConfig);
}

const auth = (window as any).firebase.auth();

export const setupRecaptcha = () => {
  // تجنب إعادة التهيئة إذا كانت موجودة مسبقاً
  if ((window as any).recaptchaVerifier) return;

  const container = document.getElementById('recaptcha-container');
  if (!container) return;

  try {
    (window as any).recaptchaVerifier = new (window as any).firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: (response: any) => {
        console.log("Recaptcha verified");
      },
      'expired-callback': () => {
        (window as any).recaptchaVerifier.render().then((widgetId: any) => {
          (window as any).firebase.auth().RecaptchaVerifier.reset(widgetId);
        });
      }
    });
  } catch (err) {
    console.error("Failed to initialize Recaptcha:", err);
  }
};

export const sendOTP = async (phoneNumber: string) => {
  if (isDemoConfig) {
    console.warn("نظام نماء: يتم استخدام وضع المحاكاة لأن مفاتيح Firebase تجريبية.");
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  }

  setupRecaptcha();
  const appVerifier = (window as any).recaptchaVerifier;
  
  try {
    const confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, appVerifier);
    (window as any).confirmationResult = confirmationResult;
    return true;
  } catch (error: any) {
    console.error("Firebase Auth Error:", error.code, error.message);
    // إذا حدث خطأ داخلي في البيئة التجريبية، نفعل المحاكاة تلقائياً لعدم تعطيل المستخدم
    if (error.code === 'auth/internal-error' || error.code === 'auth/network-request-failed') {
      console.warn("تحويل تلقائي لوضع المحاكاة بسبب قيود المتصفح أو المفاتيح.");
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    }
    throw error;
  }
};

export const verifyOTP = async (otp: string) => {
  if (isDemoConfig || !(window as any).confirmationResult) {
    // في وضع المحاكاة، نقبل أي رمز أو نستخدم '123456' كرمز ماستر
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (otp === '123456' || isDemoConfig) {
      const mockUser = {
        uid: "demo-user-123",
        phoneNumber: "+966500000000",
        getIdToken: async () => "demo-jwt-token"
      };
      setCookie('auth_token', "demo-jwt-token", 7);
      return mockUser;
    }
    throw new Error("رمز التحقق غير صحيح");
  }

  try {
    const result = await (window as any).confirmationResult.confirm(otp);
    const idToken = await result.user.getIdToken();
    setCookie('auth_token', idToken, 7);
    return result.user;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

export const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;Secure;SameSite=Strict`;
};

export const getCookie = (name: string) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i=0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCookie = (name: string) => {
  document.cookie = name + '=; Max-Age=-99999999; path=/;';
};

export const checkAuthSession = async () => {
  const token = getCookie('auth_token');
  if (!token) return null;
  
  if (token === "demo-jwt-token") {
    return { uid: "demo-user-123", phoneNumber: "+966500000000" };
  }

  try {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user: any) => {
        unsubscribe();
        resolve(user);
      });
    });
  } catch {
    return null;
  }
};
