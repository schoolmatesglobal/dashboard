import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonGroup from "../buttons/button-group";
import CreateWrapper from "../common/create-wrapper";
import PageSheet from "../common/page-sheet";
import Search from "../inputs/search";
import CustomTable from "../tables/table";
import illustrationImage from "../../assets/images/illustration.png";
import PageTitle from "../common/title";
import AuthSelect from "../inputs/auth-select";
import PaginationComponent from "../tables/pagination";
import Button from "../buttons/button";
import {
  faEye,
  faPlusCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GoBack from "../common/go-back";
import { Spinner } from "reactstrap";
import ButtonGroup2 from "../buttons/button-group2";
import { useMediaQuery } from "react-responsive";
import AuthInput from "../inputs/auth-input";

const PageView = ({
  useBtn2,
  onStatusToggle,
  onDelete,
  groupedButtonOptions = [],
  hasSortOptions = false,
  hasSearch,
  hasDateSort,
  dateSortLabel,
  dateSortValue,
  clearDateSortValue,
  onDateSortChange,
  onSearch,
  pagination,
  searchPlaceholder,
  isLoading,
  allLoading,
  onSearchClear,
  canCreate = true,
  extraButton,
  extraLink,
  extraButtonTitle,
  extraButtonOnclick = () => {},
  createLink,
  showIllustration = false,
  hideTable = false,
  showTableTitle = false,
  pageTitle,
  selectOptions,
  searchSelectOptions,
  selectValue,
  onSelectChange,
  hasSelect = false,
  isSessionSearch = false,
  illustrationBanner,
  searchIsSelect = false,
  svgIllustrationBanner: SvgIllustrationBanner,
  hasGoBack = false,
  footer = null,
  header = null,
  ...rest
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDesktop = useMediaQuery({ query: "(min-width: 992px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px, max-width: 991px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <div className=''>
      {hasGoBack && <GoBack />}
      <PageSheet>
        {!allLoading && (
          <>
            {canCreate && (
              <div className='d-flex gap-3 justify-content-end'>
                <CreateWrapper
                  link={createLink || `${location.pathname}/new`}
                />
                {extraButton && (
                  <div className='mb-5 d-flex justify-content-end'>
                    <Button
                      type='button'
                      onClick={() => {
                        extraLink && navigate(extraLink);
                        extraButtonOnclick();
                      }}
                    >
                      {extraButtonTitle}
                    </Button>
                  </div>
                  // <CreateWrapper link={createLink || `app/classes`} />
                )}
              </div>
            )}

            {hasSortOptions && (
              <div className='mb-5 d-md-flex'>
                {groupedButtonOptions.length ? (
                  <div className={`w-100 `}>
                    {useBtn2 ? (
                      <ButtonGroup2
                        className='mb-3'
                        options={groupedButtonOptions}
                      />
                    ) : (
                      <ButtonGroup
                        className='mb-3'
                        options={groupedButtonOptions}
                      />
                    )}
                  </div>
                ) : null}
                {hasSelect && (
                  <div className='me-2 d-flex align-items-center mb-3 mb-sm-0'>
                    <AuthSelect
                      sort
                      options={selectOptions}
                      value={selectValue}
                      onChange={onSelectChange}
                    />
                  </div>
                )}
                {hasSearch && (
                  <Search
                    searchIsSelect={searchIsSelect}
                    isLoading={isLoading}
                    placeholder={searchPlaceholder}
                    onSearch={onSearch}
                    isSessionSearch={isSessionSearch}
                    onClear={onSearchClear}
                    searchSelectOptions={searchSelectOptions}
                  />
                )}
              </div>
            )}

            {showIllustration ? (
              SvgIllustrationBanner ? (
                <div
                  style={{ width: `${isDesktop ? "30%" : "50%"}` }}
                  className='svg-banner mx-auto my-5 h-100 d-flex align-items-center justify-content-center'
                >
                  <SvgIllustrationBanner className='w-100 h-100' />
                </div>
              ) : (
                <div className='w-50 mx-auto h-100'>
                  <img
                    src={illustrationBanner || illustrationImage}
                    alt=''
                    className='w-100 h-100'
                  />
                </div>
              )
            ) : null}
            {!hideTable && (
              <div>
                {showTableTitle && <PageTitle>{pageTitle}</PageTitle>}

                {hasDateSort && (
                  <div className='d-flex align-items-center gap-3'>
                    <div
                      className=''
                      style={{
                        width: "200px",
                      }}
                    >
                      <AuthInput
                        // label={dateSortLabel}
                        // required
                        type='date'
                        //  hasError={!!errors.dob}
                        value={dateSortValue}
                        onChange={onDateSortChange}
                        style={{
                          width: "200px",
                        }}
                        //  {...getFieldProps("dob")}
                      />
                    </div>

                    {dateSortValue && (
                      <FontAwesomeIcon
                        icon={faXmark}
                        style={{
                          cursor: "pointer",
                          color: "red",
                          fontSize: "20px",
                        }}
                        onClick={clearDateSortValue}
                      />
                    )}
                  </div>
                )}

                <CustomTable
                  centered
                  isLoading={isLoading}
                  onRowStatusToggle={async (data) => await onStatusToggle(data)}
                  onRowUpdate={(id) =>
                    navigate(`${location.pathname}/edit/${id}`)
                  }
                  onRowDelete={async (data) => await onDelete(data)}
                  {...rest}
                />
                {pagination && rest?.data?.length ? (
                  <PaginationComponent pagination={pagination} />
                ) : null}
              </div>
            )}
          </>
        )}
        {allLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              padding: "50px 0px",
            }}
          >
            {/* <p className='' style={{ fontSize: "16px" }}>
                No records
              </p> */}
            <Spinner />
          </div>
        )}

        {footer && footer}
      </PageSheet>
    </div>
  );
};

export default PageView;
