import React, { useEffect, useState } from "react";
import PageSheet from "../../../../components/common/page-sheet";
import PageTitle from "../../../../components/common/title";
import Button from "../../../../components/buttons/button";
import Prompt from "../../../../components/modals/prompt";
import { useAcademicSession } from "../../../../hooks/useAcademicSession";
import AuthSelect from "../../../../components/inputs/auth-select";
import { useForm } from "react-formid";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  UncontrolledAccordion,
  Input,
} from "reactstrap";
import { usePreSchool } from "../../../../hooks/usePreSchool";
import ButtonGroup from "../../../../components/buttons/button-group";
import { Link, useNavigate } from "react-router-dom";

const SubjectsByPreSchool = () => {
  const [showSubjects, setShowSubjects] = useState(false);
  const [periodPrompt, setPeriodPrompt] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [check, setCheck] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [openAccordion, setOpenAccordion] = useState("0");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [preSchoolSubjectsByClassArray, setPreSchoolSubjectsByClassArray] =
    useState([]);
  const navigate = useNavigate();

  // console.log({check})

  const toggleAccordion = (id) => {
    if (openAccordion === id) {
      setOpenAccordion();
    } else {
      setOpenAccordion(id);
    }
  };

  function joinAndLowercase(word1, word2, word3) {
    // Remove spaces and concatenate the words
    const joinedString = `${word1.replace(/\s/g, "")}${word2.replace(
      /\s/g,
      ""
    )}${word3.replace(/\s/g, "")}`;

    // Convert the joined string to lowercase
    const lowercaseString = joinedString.toLowerCase();

    return lowercaseString;
  }

  const checkStyle = { fontWeight: "bolder", color: "red" };

  const chkstlye = (chk) => {
    if (chk) {
      return { fontWeight: "bolder", color: "red", cursor: "pointer" };
    } else {
      return { cursor: "pointer" };
    }
  };

  const onSelect = (subject, category, topic, checked) => {
    const uid = joinAndLowercase(subject, category, topic);
    if (!checked) {
      // const uid = `${subject+category+topic}`;

      const findSubject = selectedSubjects?.find((item) => item.id === uid);

      if (!findSubject) {
        return setSelectedSubjects([
          ...selectedSubjects,
          {
            id: uid,
            name: subject,
            category,
            topic: [{ name: topic }],
          },
        ]);
      }

      const topicExists = findSubject.topic?.some((t) => t.name === topic);

      const newSubject = {
        ...findSubject,
        topic: topicExists
          ? findSubject.topic.filter((t) => t.name !== topic)
          : [...findSubject.topic, { name: topic }],
      };
      const format = selectedSubjects.map((s) => {
        if (s.subject === newSubject.subject) return newSubject;
        return s;
      });

      setSelectedSubjects(format);
    } else {
      const objIndex = selectedSubjects?.findIndex((x) => x.id === uid);
      if (objIndex !== -1) {
        selectedSubjects.splice(objIndex, 1);
      }
    }
  };

  const onDeSelect = (subject, category, topic, checked) => {
    const uid = joinAndLowercase(subject, category, topic);
    if (checked) {
      const objIndex = selectedSubjects?.findIndex((x) => x.id === uid);
      if (objIndex !== -1) {
        selectedSubjects.splice(objIndex, 1);
      }
    }
  };

  const isChecked = (subject, category, topic) => {
    return selectedSubjects?.some(
      (item) =>
        item.name === subject &&
        item.category === category &&
        item.topic?.some((t) => t.name === topic)
    );
  };

  const checkedSubjects = () => {
    if (preSchoolSubjectsByClassArray?.length > 0) {
      return preSchoolSubjectsByClassArray[0]?.subjects?.filter((ps) => {
        let stat = false;
        preSchoolSubjects?.forEach((it) => {
          if (
            it.subject === ps?.name &&
            it.category === ps?.category &&
            it.topic?.some((t) => t.name === ps?.topic[0]?.name)
          ) {
            stat = true;
          }
        });
        return stat;

        // isChecked(ps.name, ps.category, ps.topic)
      });
    }
  };

  const isChecked2 = (subject, category, topic) => {
    if (preSchoolSubjectsByClassArray?.length > 0) {
      return preSchoolSubjectsByClassArray?.some(
        (item) =>
          item.name === subject &&
          item.category === category &&
          item.topic?.some((t) => t.name === topic)
      );
    }
  };

  const {
    setPeriod,
    preSchoolSubjects,
    isLoading,
    preSchool,
    postSubjectsByPreSchool,
    preSchoolSubjectsByClass,
    activatePreSchool,
    setActivatePreSchool,
    setActivatePreSchoolByClass,
  } = usePreSchool();

  const {
    handleChange: handlePeriodChange,
    inputs: periodInputs,
    errors: periodErrors,
    handleSubmit: handlePeriodSubmit,
  } = useForm({
    defaultValues: {
      period: "First Half",
      session: "",
      term: "First Term",
    },
    validation: {
      period: {
        required: true,
      },
      session: {
        required: true,
      },
      term: {
        required: true,
      },
    },
  });

  const { isLoading: loadingSessions, data: sessions } = useAcademicSession();

  const onPeriodSubmit = (data) => {
    setShowSubjects(true);
    setPeriodPrompt(false);
    setPeriod(data);
  };
  const onSave = () => {
    postSubjectsByPreSchool({
      ...periodInputs,
      class_id: preSchool?.id,
      class: preSchool?.name,
      subjects: selectedSubjects,
    });
    // console.log({
    //   ...periodInputs,
    //   class_id: preSchool?.id,
    //   class: preSchool?.name,
    //   subjects: selectedSubjects,
    // });
  };

  const clearSelect = () => {
    setActivatePreSchoolByClass(false);
    if (selectedSubjects?.length > 0) {
      // Remove the last object from the array
      selectedSubjects.pop();
    }
  };

  const removeSelect = (subject, category, topic, checked) => {
    if (checked) {
      const uid = joinAndLowercase(subject, category, topic);
      const objIndex = selectedSubjects?.findIndex((x) => x.id === uid);
      if (objIndex !== -1) {
        selectedSubjects.splice(objIndex, 1);
      }
    }
  };

  const clearSelectAll = () => {
    setActivatePreSchoolByClass(false);
    // setPreSchoolSubjectsByClass([]);
    setPreSchoolSubjectsByClassArray([]);
    setSelectedSubjects([]);
  };

  useEffect(() => {
    setActivatePreSchool(true);
    setActivatePreSchoolByClass(true);
  }, []);

  useEffect(() => {
    if (preSchoolSubjectsByClass?.length > 0) {
      setPreSchoolSubjectsByClassArray(preSchoolSubjectsByClass);
    }
  }, [preSchoolSubjectsByClass]);

  useEffect(() => {
    if (preSchoolSubjectsByClassArray?.length > 0) {
      setSelectedSubjects([...checkedSubjects()]);
      // setSelectedSubjects([...preSchoolSubjectsByClassArray[0]?.subjects]);
    }
  }, [preSchoolSubjectsByClassArray]);

  console.log({
    selectedSubjects,
    preSchoolSubjectsByClass,
    preSchoolSubjectsByClassArray,
    preSchoolSubjects,
    checkedSubjects: checkedSubjects(),
  });

  const assignError = () => {
    if (selectedSubjects?.length > 0) {
      if (selectedSubjects[0]?.id) {
        return "(Assigned)";
      } else {
        return "(Assign Error)";
      }
    }
  };

  return (
    <PageSheet>
      <PageTitle>
        <>{preSchool?.name} Subjects </>
        <>
          {" "}
          {selectedSubjects?.length > 0 && (
            <span style={{ color: "red" }}>{assignError()}</span>
          )}
        </>
      </PageTitle>

      <div
        className={`mt-3 mb-5 `}
        style={{
          display: "flex",
          justifyContent: "space-between",
          // width: "100%",
        }}
      >
        <Button onClick={() => setPeriodPrompt(true)}>Enter Period</Button>
        {preSchoolSubjects?.length && !isLoading ? (
          <Button onClick={clearSelectAll}>Clear Selections</Button>
        ) : null}
      </div>
      {showSubjects && (
        <div>
          {/* {!preSchoolSubjects?.length && !isLoading ? ( */}
          {!preSchoolSubjects?.length && !isLoading ? (
            <p className='text-center'>
              No data to display. Please create subjects{" "}
              <Link to='/app/pre-school/subjects/new'>here.</Link>
            </p>
          ) : null}
          <UncontrolledAccordion defaultOpen={["0"]} stayOpen>
            {preSchoolSubjects?.map((item, index) => {
              // let chk;
              return (
                <AccordionItem key={item.id}>
                  <AccordionHeader targetId={String(index)}>
                    {item.subject} - ({item.category}){" "}
                    {/* {`${chk === true ? "*" : ""}`} */}
                  </AccordionHeader>
                  <AccordionBody accordionId={String(index)}>
                    <div className='py-3'>
                      {item?.topic?.map((t, indx) => {
                        let chk = isChecked(
                          item.subject,
                          item.category,
                          t.name
                        );

                        const chk2 = isChecked2(
                          item.subject,
                          item.category,
                          t.name
                        );
                        // setChecked2(chk2)
                        // console.log({ chk, chk2 });
                        return (
                          <div
                            className='mb-4 d-flex gap-4 align-items-center'
                            key={t.name}
                          >
                            <div className='d-flex gap-4 align-items-center'>
                              <div
                                style={{
                                  cursor: "pointer",
                                }}
                                className='d-flex justify-content-center align-items-center'
                              >
                                <input
                                  type='checkbox'
                                  className='m-0'
                                  checked={chk}
                                  id={`option-${item.subject}-${item.category}-${t.name}`}
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  // checked={chk || chk2}
                                  onChange={() => {
                                    onSelect(
                                      item.subject,
                                      item.category,
                                      t.name,
                                      chk
                                    );
                                    setCheck((prev) => !prev);
                                    // onDeSelect(
                                    //   item.subject,
                                    //   item.category,
                                    //   t.name,
                                    //   chk
                                    // );
                                  }}
                                  // value={}
                                />
                              </div>
                              <label
                                htmlFor={`option-${item.subject}-${item.category}-${t.name}`}
                                // onClick={() => {
                                //   removeSelect(
                                //     item.subject,
                                //     item.category,
                                //     t.name,
                                //     chk
                                //   );
                                // }}
                                style={chkstlye(chk)}
                              >
                                {t.name}
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionBody>
                </AccordionItem>
              );
            })}
          </UncontrolledAccordion>
          {!!preSchoolSubjects?.length && (
            <div className='mb-5 mt-3 d-flex justify-content-end'>
              <ButtonGroup
                options={[
                  {
                    title: "Cancel",
                    type: "button",
                    variant: "outline",
                    onClick: () => navigate(-1),
                  },
                  {
                    title: "Save",
                    type: "button",
                    onClick: onSave,
                    isLoading,
                    disabled: isLoading,
                  },
                ]}
              />
            </div>
          )}
        </div>
      )}
      <Prompt
        isOpen={periodPrompt}
        toggle={() => setPeriodPrompt(false)}
        singleButtonProps={{
          type: "button",
          isLoading: loadingSessions,
          disabled: loadingSessions,
          onClick: handlePeriodSubmit(onPeriodSubmit),
        }}
        singleButtonText='Continue'
        promptHeader='Academic Period'
      >
        <div className='form-group mb-4'>
          <AuthSelect
            label='Period'
            value={periodInputs.period}
            name='period'
            hasError={!!periodErrors.period}
            onChange={handlePeriodChange}
            options={[
              { value: "First Half", title: "First Half/Mid Term" },
              { value: "Second Half", title: "Second Half/End of Term" },
            ]}
          />
          {!!periodErrors.period && (
            <p className='error-message'>{periodErrors.period}</p>
          )}
        </div>
        <div className='form-group mb-4'>
          <AuthSelect
            label='Term'
            value={periodInputs.term}
            name='term'
            hasError={!!periodErrors.term}
            onChange={handlePeriodChange}
            options={[
              { value: "First Term", title: "First Term" },
              { value: "Second Term", title: "Second Term" },
              { value: "Third Term", title: "Third Term" },
            ]}
          />
          {!!periodErrors.term && (
            <p className='error-message'>{periodErrors.term}</p>
          )}
        </div>
        <div className='form-group mb-4'>
          <AuthSelect
            label='Session'
            value={periodInputs.session}
            name='session'
            hasError={!!periodErrors.session}
            onChange={handlePeriodChange}
            options={(sessions || [])?.map((session) => ({
              value: session?.academic_session,
              title: session?.academic_session,
            }))}
          />
          {!!periodErrors.session && (
            <p className='error-message'>{periodErrors.session}</p>
          )}
        </div>
      </Prompt>
    </PageSheet>
  );
};

export default SubjectsByPreSchool;
