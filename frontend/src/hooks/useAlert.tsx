import Swal from "sweetalert2";

export const useSweetAlert = () => {
  const showAlert = async (options: any) => {
    try {
      const result = await Swal.fire(options);
      return result;
    } catch (error) {
      console.error("Error showing SweetAlert:", error);
      throw error;
    }
  };

  return {
    showAlert,
  };
};
