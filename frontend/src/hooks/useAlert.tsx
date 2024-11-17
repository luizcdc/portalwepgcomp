import Swal from 'sweetalert2';

export const useSweetAlert = () => {

  const showAlert = async (options: any) => {
    try {
      await Swal.fire(options);
    } catch (error) {
      console.error('Error showing SweetAlert:', error);
    }
  };

  return {
    showAlert
  };
};