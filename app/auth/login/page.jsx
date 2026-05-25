import LoginPage from "./LoginPage";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  //   const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // const handleLogin = async (data) => {
  //   try {
  //     setErrorMessage(null);
  //     await apiClient.post('/login', data);
  //   } catch (err) {
  //     if (err instanceof ApiError) {
  //       // اینجا هوشمندانه عمل می‌کنیم:
  //       switch (err.status) {
  //         case 422:
  //           setErrorMessage("نام کاربری یا رمز عبور اشتباه است");
  //           break;
  //         case 429:
  //           setErrorMessage("تعداد درخواست‌ها زیاد است، لطفا ۱ دقیقه صبر کنید");
  //           break;
  //         default:
  //           setErrorMessage("خطایی در اتصال به سرور رخ داد");
  //       }
  //     }
  //   }
  // };

  return <LoginPage />;
}
