import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Button from "../buttons/button";
import ButtonGroup from "../buttons/button-group";

const Prompt = ({
  isOpen,
  toggle,
  singleButtonProps,
  singleButtonText,
  groupedButtonProps,
  children,
  hasGroupedButtons = false,
  promptHeader = "",
  showFooter = true,
}) => {
  return (
    <Modal centered isOpen={isOpen} toggle={toggle}>
      {promptHeader && (
        <ModalHeader>
          <p className='fs-3 fw-bold text-center w-100'>{promptHeader}</p>
        </ModalHeader>
      )}
      <ModalBody className='p-5'>{children}</ModalBody>
      {showFooter && (
        <ModalFooter>
          {hasGroupedButtons ? (
            <ButtonGroup options={groupedButtonProps} />
          ) : (
            <Button {...singleButtonProps}>{singleButtonText}</Button>
          )}
        </ModalFooter>
      )}
    </Modal>
  );
};

export default Prompt;
