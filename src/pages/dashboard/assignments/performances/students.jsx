import React, { useEffect, useState } from "react";
import { MdOutlineLibraryBooks } from "react-icons/md";
import AuthSelect from "../../../../components/inputs/auth-select";
import styles from "../../../../assets/scss/pages/dashboard/assignment.module.scss";
import { useAssignments } from "../../../../hooks/useAssignments";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Spinner } from "reactstrap";
import queryKeys from "../../../../utils/queryKeys";
import SubmissionTable from "../../../../components/tables/submission-table";
import {
  addQuestionMarkTotal,
  addSumMark,
  analyzeQuestions,
  convertToPercentage,
  countCorrectAnswers,
} from "../constant";
import Prompt from "../../../../components/modals/prompt";
import { toast } from "react-toastify";
import { useSubject } from "../../../../hooks/useSubjects";
import LineChart from "../../../../components/charts/line-chart";
import LineChart2 from "../../../../components/charts/line-chart2";
import { recreateArray } from "./constant";

const Performances2 = ({ markedQ, setMarkedQ, studentSubjects }) => {
  const {
    classSubjects,
    apiServices,
    errorHandler,
    permission,
    user,
    createdQuestion,
    myStudents,
    updatePreviewAnswerFxn,
  } = useAssignments();

  const { question_type, subject, subject_id, student_id, week, student } =
    markedQ;

  const [newSubjects, setNewSubjects] = useState([]);
  const { subjects, isLoading: subjectLoading } = useSubject();

  const [showLoading, setShowLoading] = useState(false);

  const [loginPrompt, setLoginPrompt] = useState(false);

  const queryClient = useQueryClient();

  const newStudents = [
    { value: "all students", title: "All Students", id: 999 },
    ...myStudents,
  ];

  const activateRetrieve = () => {
    if (subject !== "") {
      return true;
    } else {
      return false;
    }
  };

  /////// FETCH PERFORMANCE /////
  const {
    isLoading: performanceLoading,
    refetch: refetchPerformance,
    data: performance,
  } = useQuery(
    [
      queryKeys.GET_PERFORMANCE,
      user?.period,
      user?.term,
      user?.session,
      subject_id,
      user?.id,
    ],
    () =>
      apiServices.getStudentPerformance(
        user?.period,
        user?.term,
        user?.session,
        subject_id,
        user?.id
      ),
    {
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      // enabled: permission?.read || permission?.readClass,
      enabled: activateRetrieve(),
      select: (data) => {
        const pp = data?.data[0]?.students;

        const pp2 = recreateArray(pp);

        const newP = pp2?.map((p) => {
          return Number(p.total_score);
        });

        // console.log({ pp, pp2, data, newP });

        return newP;
      },

      onSuccess(data) {},
      onError(err) {
        errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

  const buttonOptions = [
    {
      title: "Cancel",
      onClick: () => setLoginPrompt(false),
      variant: "outline",
    },
    {
      title: "Yes Submit",
      //   disabled: activatePreview(),
      // isLoading: `${activeTab === "2" ? isLoading : isLoading}`,
      //
      // variant: "outline",
    },
  ];

  const allLoading = showLoading || performanceLoading;

  const data = [65, 70, 68, 72, 75, 80, 85, 82, 78, 75];

  const studentData = [
    { name: "Lukaku Romelu", scores: [65, 70, 68, 72, 75, 80, 85, 82, 78, 75] },
    { name: "Adammu Adam", scores: [70, 72, 75, 78, 80, 82, 85, 88, 90, 92] },
    { name: "Jobs Steven", scores: [60, 65, 68, 70, 72, 75, 78, 80, 82, 85] },
    { name: "Alex Job", scores: [30, 44, 32, 64, 81, 65, 58, 70, 62, 75] },
  ];

  useEffect(() => {
    const sbb = subjects?.map((sb) => {
      return {
        value: sb.subject,
        // value: sb.id,
        title: sb.subject,
      };
    });

    if (sbb?.length > 0) {
      setNewSubjects(sbb);
    } else {
      setNewSubjects([]);
    }
  }, [subjects]);

  // console.log({
  //   subject_id,
  //   student_id: user?.id,
  //   performance,
  //   user,
  // });

  return (
    <div>
      <div className={styles.created}>
        <div className='d-flex flex-column gap-4 flex-lg-row justify-content-lg-between'>
          <div className='d-flex flex-column gap-4 flex-sm-row flex-grow-1'>
            <AuthSelect
              sort
              options={studentSubjects}
              value={subject}
              // defaultValue={subject && subject}
              onChange={({ target: { value } }) => {
                const fId = () => {
                  const ff = subjects?.find((opt) => opt.subject === value);
                  if (ff) {
                    return ff?.id?.toString();
                  }
                };

                setMarkedQ((prev) => {
                  return { ...prev, subject: value, subject_id: fId() };
                });
              }}
              placeholder='Select Subject'
              wrapperClassName='w-50'
              // label="Subject"
            />
          </div>
        </div>

        {allLoading && (
          <div className={styles.spinner_container}>
            <Spinner /> <p className='fs-3'>Loading...</p>
          </div>
        )}

        {!allLoading && (
          <div className='mt-5'>
            <LineChart
              chartTitle={`${
                performance?.length > 0 ? "Chart for" : "No Chart Result"
              } ${user?.firstname} ${user?.surname}`}
              data={performance}
            />
          </div>
        )}
      </div>
      {/* <div className="d-flex justify-content-center ">
      <ButtonGroup options={buttonOptions2} />
    </div> */}
      <Prompt
        isOpen={loginPrompt}
        toggle={() => setLoginPrompt(!loginPrompt)}
        hasGroupedButtons={true}
        groupedButtonProps={buttonOptions}
        singleButtonText='Preview'
        promptHeader={` CONFIRM RESULT SUBMISSION `}
      ></Prompt>
    </div>
  );
};

export default Performances2;
