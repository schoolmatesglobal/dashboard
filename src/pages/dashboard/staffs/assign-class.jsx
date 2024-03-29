import React, { useEffect, useState } from "react";
import { useForm } from "react-formid";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";
import AuthSelect from "../../../components/inputs/auth-select";
import DetailView from "../../../components/views/detail-view";
import { useClasses } from "../../../hooks/useClasses";
import { useStaff } from "../../../hooks/useStaff";
import { useSubject } from "../../../hooks/useSubjects";
import CustomTable2 from "../../../components/tables/table2";
import { useQuery } from "react-query";
import queryKeys from "../../../utils/queryKeys";

const AssignClass = () => {
  const {
    classes,
    checkedSubjects,
    setCheckedSubjects,
    isLoading: promoteIsLoading,
    // subjectData2,
    // subjects: subjectsByClass,
    // subjectsByClass2,
  } = useClasses();

  const [currentSubjects, setCurrentSubjects] = useState([]);

  const {
    assignClass,
    isLoading: staffIsLoading,
    staffData,
    apiServices,
  } = useStaff();

  const { handleSubmit, errors, inputs, setInputs } = useForm({
    defaultValues: {
      class_assigned: "",
      // sub_class: "",
    },
    validation: {
      class_assigned: { required: true },
      // sub_class: { required: true },
    },
  });

  const findId = () => {
    const find = classes.find((sb) => sb.class_name === inputs.class_assigned);
    if (find) {
      return find.id;
    } else {
      return "";
    }
  };

  // const [classId, setclassId] = useState("");

  // const { id } = useParams();

  const { isLoading: subjectsByClassLoading3, data: subjectsByClass3 } =
    useQuery(
      [queryKeys.GET_SUBJECTS_BY_CLASS2, findId()],
      () => apiServices.getSubjectByClass2(findId()),
      {
        enabled: !!findId(),
        select: apiServices.formatData,
        onError: apiServices.errorHandler,
      }
    );

  // const { classes } = useClasses();

  const {
    subjects,

    isLoading: subjectIsLoading,
    // subjectData,
    // assignSubjectsToClass,
  } = useSubject();

  const convertSubjectsArray = () => {
    if (subjectsByClass3?.length > 0) {
      const st = subjectsByClass3[0]?.subject.map((sg) => {
        let sub = {};
        subjects.forEach((fe) => {
          if (fe.subject === sg.name) {
            sub = fe;
          }
        });
        return sub;
      });

      // return st;
      return st.map((sub, index) => {
        const newArray = { ...sub };
        newArray.class = inputs?.class_assigned || "All";
        return newArray;
      });
    } else {
      return [];
    }
  };

  const assignSubjectValue = () => {
    return checkedSubjects?.map((rowId) => {
      const findSubject = subjects?.find((ns) => ns.id === rowId);
      // return { name: rowId };
      return { name: findSubject?.subject };
    });
  };

  const assignSubjectValue2 = () => {
    return currentSubjects?.map((rowId) => {
      const findSubject = subjects?.find((ns) => ns.id === rowId);
      // return { name: rowId };
      return { name: findSubject?.subject };
    });
  };

  const onSubmit = async (data) => {
    if (staffData.designation_id !== "4")
      return toast.error("Staff is not a teacher");

    if (!staffData.teacher_type) {
      toast.error("Please update the teacher type of this staff");
      return;
    }

    if (assignSubjectValue2()?.length === 0) {
      toast.error("Please ensure subject(s) is assigned");
      return;
    }
    // console.log({dc: data.class_assigned})

    assignClass({
      body: {
        class_id: findId(),
        class_assigned: data.class_assigned,
        subjects: assignSubjectValue2(),
      },
      id: staffData.id,
    });
  };

  // const subjectArray = subjectsByClass3?.subject || subjects;

  useEffect(() => {
    if (staffData) {
      let name;
      setInputs({
        ...inputs,
        class_assigned: staffData.class_assigned,
        // sub_class: staffData.sub_class,
      });
      const dataIds = staffData?.subjects?.map((x) => {
        subjects?.forEach((sb) => {
          if (sb.subject === x.name) {
            name = sb.id;
          }
        });
        // if (x.name === )
        return name;
      });
      // setCheckedSubjects([]);
      setCheckedSubjects(dataIds);
      // console.log({ dataIds, sd: staffData.subjects, checkedSubjects });
    }
  }, [staffData, subjects]);

  const isLoading =
    promoteIsLoading ||
    staffIsLoading ||
    subjectIsLoading ||
    subjectsByClassLoading3;

  console.log({
    staffData,
    currentSubjects,
    checkedSubjects,
    //   // subjects,
    //   // checkedSubjects,
    // assignSubjectValue: assignSubjectValue(),
  });

  return (
    <DetailView
      isLoading={isLoading}
      cancelLink={`/app/staffs/edit/${staffData?.id}`}
      pageTitle='Assign Class / Subject'
      onFormSubmit={handleSubmit(onSubmit)}
    >
      <Row className='my-5'>
        <Col sm='6' className='mb-4 mb-sm-0'>
          <AuthSelect
            label='Class'
            value={inputs.class_assigned}
            name='class_assigned'
            hasError={!!errors.class_assigned}
            onChange={(e) => {
              setInputs({
                ...inputs,
                class_assigned: e.target.value,
                // sub_class: "",
              });
            }}
            options={(classes || []).map((x) => ({
              value: x?.class_name,
              title: x?.class_name,
            }))}
          />
          {!!errors.class_assigned && (
            <p className='error-message'>{errors.class_assigned}</p>
          )}
        </Col>
        {/* <Col sm="6" className="mb-4 mb-sm-0">
          <AuthSelect
            label="Sub_class"
            value={inputs.sub_class}
            name="sub_class"
            hasError={!!errors.sub_class}
            onChange={handleChange}
            options={classes
              ?.find((x) => x.class_name === inputs.class_assigned)
              ?.sub_class?.split(",")
              ?.map((x) => ({
                value: x,
                title: x,
              }))}
          />
          {!!errors.sub_class && (
            <p className="error-message">{errors.sub_class}</p>
          )}
        </Col> */}
      </Row>

      {!isLoading && (
        <CustomTable2
          hasCheckBox
          checkedRows={checkedSubjects}
          centered
          setCheckedRows={setCheckedSubjects}
          setCurrentSubjects={setCurrentSubjects}
          currentSubjects={currentSubjects}
          isLoading={isLoading}
          columns={[
            // {
            //   Header: "s/n",
            //   accessor: "new_id",
            // },
            {
              Header: "Subject",
              accessor: "subject",
            },
            {
              Header: "Class",
              accessor: "class",
            },
          ]}
          data={convertSubjectsArray()}
        />
      )}
    </DetailView>
  );
};

export default AssignClass;
