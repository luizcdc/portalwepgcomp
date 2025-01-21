import Swal from "sweetalert2";

export const useSweetToast = () => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-start',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  })
  const showToast = async (options: any) => {
    try {
      const result = await Toast.fire(options);
      return result;
    } catch (error) {
      console.error("Error showing SweetToast:", error);
      throw error;
    }
  };

  return {
    showToast,
  };
};
