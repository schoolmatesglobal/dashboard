import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonGroup from "../buttons/button-group";
import GoBack from "../common/go-back";
import PageSheet from "../common/page-sheet";
import PageTitle from "../common/title";

const DetailView = ({
  onFormSubmit,
  pageTitle,
  cancelLink,
  isLoading,
  children,
  hasGoBack = true,
}) => {
  const navigate = useNavigate();
  return (
    <div>
      {hasGoBack && <GoBack />}
      <PageSheet>
        <PageTitle>{pageTitle}</PageTitle>
        <form
          className="form-wrapper"
          autoComplete="off"
          onSubmit={onFormSubmit}
        >
          {children}
          <div className="mb-5 d-flex justify-content-end">
            <ButtonGroup
              options={[
                {
                  title: "Cancel",
                  type: "button",
                  variant: "outline",
                  onClick: () => navigate(cancelLink || -1),
                },
                {
                  title: "Save",
                  type: "submit",
                  isLoading,
                  disabled: isLoading,
                },
              ]}
            />
          </div>
        </form>
      </PageSheet>
    </div>
  );
};

export default DetailView;
