import { useState } from 'react';
import Swal from 'sweetalert2';

export const useSweetAlert = () => {
  const [isOpen, setIsOpen] = useState(false);

  const showAlert = async (options: any) => {
    try {
      await Swal.fire(options);
    } catch (error) {
      console.error('Error showing SweetAlert:', error);
    }
  };

  const closeAlert = () => {
    setIsOpen(false);
  };

  return {
    showAlert,
    closeAlert
  };
};