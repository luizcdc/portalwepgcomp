"use client";

import LoadingPage from "@/components/LoadingPage";
import { ReactNode } from "react";

import "./style.scss";

interface ModalComponentProps {
  id: string;
  loading: boolean;
  children: ReactNode[] | ReactNode;
  labelConfirmButton?: string;
  colorButtonConfirm?: string;
  disabledConfirmButton?: boolean;
  isShortModal?: boolean;
  idCloseModal?: string;
  onConfirm?: () => void;
  onClose?: () => void;
}

export default function ModalComponent({
  id,
  loading,
  labelConfirmButton,
  colorButtonConfirm,
  onConfirm,
  disabledConfirmButton,
  isShortModal,
  idCloseModal,
  onClose,
  children,
}: Readonly<ModalComponentProps>) {
  return (
    <div
      className={`modal fade ${
        isShortModal ? "modal-sm" : "modal-lg"
      } modal-component`}
      id={id}
      tabIndex={-1}
      onBlur={onClose}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          {loading && <LoadingPage />}
          {!loading && (
            <>
              <div className="modal-header header-modal-component">
                <button
                  id={idCloseModal ?? "close-modal"}
                  type="button"
                  className="btn-close close-button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body content-modal-component">
                {children}
              </div>

              {onConfirm && labelConfirmButton && (
                <div className={`modal-footer content-modal-component`}>
                  <button
                    type="button"
                    className="btn btn-primary button-modal-component"
                    onClick={() => onConfirm()}
                    disabled={disabledConfirmButton}
                    style={{ backgroundColor: colorButtonConfirm }}
                  >
                    {labelConfirmButton}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
