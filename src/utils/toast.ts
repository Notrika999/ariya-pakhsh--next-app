import { toast } from "react-toastify";

export const notify = {
  success: (message: string) =>
    toast.success(message),

  error: (message: string) =>
    toast.error(message),

  warning: (message: string) =>
    toast.warning(message),

  info: (message: string) =>
    toast.info(message),

  
    loading(message: string) {
      return toast.loading(message);
    },
  
    update(id: string | number, message: string) {
      toast.update(id, {
        render: message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    },
};