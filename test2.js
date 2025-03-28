{
    <div className='first-half-result-table second-half-result-table'>
      <div style={{ display: "flex" }}>
        <div
          className='table-data'
          style={{ width: "25%" }}
        ></div>
        {!hasOneAssess && (
          <div
            className='table-data'
            style={{ flex: "1", textAlign: "center" }}
          >
            <h4
              style={{
                color: "green",
                fontSize: "14px",
                lineHeight: "16px",
              }}
            >
              First Assessment
            </h4>
          </div>
        )}
        {!hasOneAssess && (
          <div
            className='table-data'
            style={{ flex: "1", textAlign: "center" }}
          >
            <h4
              style={{
                color: "green",
                fontSize: "14px",
                lineHeight: "16px",
              }}
            >
              Second Assessment
            </h4>
          </div>
        )}
        {!!hasOneAssess && (
          <div
            className='table-data'
            style={{ flex: "1", textAlign: "center" }}
          >
            <h4
              style={{
                color: "green",
                fontSize: "15px",
                lineHeight: "16px",
              }}
            >
              Assessment
            </h4>
          </div>
        )}
        <div
          className='table-data'
          style={{ flex: "1", textAlign: "center" }}
        >
          <h4
            style={{
              color: "green",
              fontSize: "15px",
              lineHeight: "16px",
            }}
          >
            Exam
          </h4>
        </div>
        <div
          className='table-data'
          style={{ flex: "1", textAlign: "center" }}
        >
          <h4
            style={{
              color: "green",
              fontSize: "15px",
              lineHeight: "16px",
            }}
          >
            Total Score
          </h4>
        </div>
        <div
          className='table-data'
          style={{ flex: "1", textAlign: "center" }}
        >
          <h4
            style={{
              color: "green",
              fontSize: "15px",
              lineHeight: "16px",
            }}
          >
            Grade
          </h4>
        </div>
        <div
          className='table-data'
          style={{ flex: "1", textAlign: "center" }}
        >
          <h4
            style={{
              color: "green",
              fontSize: "15px",
              lineHeight: "16px",
            }}
          >
            Remark
          </h4>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <div className='table-data' style={{ width: "25%" }}>
          <h4
            style={{
              color: "green",
              fontSize: "15px",
              lineHeight: "16px",
            }}
          >
            Max Score Obtainable
          </h4>
        </div>
        {!hasOneAssess && (
          <div
            className='table-data'
            style={{ flex: "1", textAlign: "center" }}
          >
            <h4
              style={{
                fontSize: "15px",
                lineHeight: "16px",
              }}
            >
              {maxScores?.first_assessment ?? "--"}
            </h4>
          </div>
        )}
        {!hasOneAssess && (
          <div
            className='table-data'
            style={{ flex: "1", textAlign: "center" }}
          >
            <h4
              style={{
                fontSize: "15px",
                lineHeight: "16px",
              }}
            >
              {maxScores?.second_assessment ?? "--"}
            </h4>
          </div>
        )}
        {!!hasOneAssess && (
          <div
            className='table-data'
            style={{ flex: "1", textAlign: "center" }}
          >
            <h4
              style={{
                fontSize: "15px",
                lineHeight: "16px",
              }}
            >
              {maxScores?.midterm ?? "--"}
            </h4>
          </div>
        )}
        <div
          className='table-data'
          style={{ flex: "1", textAlign: "center" }}
        >
          <h4
            style={{
              fontSize: "15px",
              lineHeight: "16px",
            }}
          >
            {maxScores?.exam ?? "--"}
          </h4>
        </div>
        <div
          className='table-data'
          style={{ flex: "1", textAlign: "center" }}
        >
          <h4
            style={{
              fontSize: "15px",
              lineHeight: "16px",
            }}
          >
            {maxScores?.total ?? "--"}
          </h4>
        </div>
        <div
          className='table-data'
          style={{ flex: "1", textAlign: "center" }}
        >
          <h4
            style={{
              color: "white",
              fontSize: "15px",
              lineHeight: "16px",
            }}
          >
            A+
          </h4>
        </div>
        <div
          className='table-data'
          style={{ flex: "1", textAlign: "center" }}
        >
          <h4
            style={{
              color: "white",
              fontSize: "15px",
              lineHeight: "16px",
            }}
          >
            Excellent
          </h4>
        </div>
      </div>

      {removeZeroExam()?.map((s, index) => {
        // let cumtotal = [];
        const fAssess = removeZeroFirstAssess()?.find(
          (x) => x.subject === s.subject
        )?.score;

        const sAssess = removeZeroSecondAssess()?.find(
          (x) => x.subject === s.subject
        )?.score;

        const mAssess = removeZeroMidterm()?.find(
          (x) => x.subject === s.subject
        )?.score;

        const totalScores = !hasOneAssess
          ? (
              Number(fAssess ?? 0) +
              Number(sAssess ?? 0) +
              Number(s.score ?? 0)
            ).toFixed(2)
          : (Number(mAssess ?? 0) + Number(s.score ?? 0)).toFixed(
              2
            );

        // cumtotal.push(totalScores);
        // if (totalScores === 0) {
        //   return;
        // }

        return (
          <div className='' key={index}>
            {
              <div style={{ display: "flex" }}>
                <div
                  className='table-data'
                  style={{ width: "25%" }}
                >
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: "16px",
                      fontWeight: "bold",
                      // textAlign: "justify",
                      // padding: "0px 10px",
                      // fontStyle: "italic"
                    }}
                  >
                    {s?.subject ?? "--"}
                  </p>
                </div>
                {!hasOneAssess && (
                  <div
                    className='table-data'
                    style={{ flex: "1", textAlign: "center" }}
                  >
                    <p
                      style={{
                        fontSize: "15px",
                        lineHeight: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      {fAssess}
                    </p>
                  </div>
                )}
                {!hasOneAssess && (
                  <div
                    className='table-data'
                    style={{ flex: "1", textAlign: "center" }}
                  >
                    <p
                      style={{
                        fontSize: "15px",
                        lineHeight: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      {sAssess}
                    </p>
                  </div>
                )}
                {hasOneAssess && (
                  <div
                    className='table-data'
                    style={{ flex: "1", textAlign: "center" }}
                  >
                    <p
                      style={{
                        fontSize: "15px",
                        lineHeight: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      {parseInt(mAssess, 10)}
                    </p>
                  </div>
                )}
                <div
                  className='table-data'
                  style={{ flex: "1", textAlign: "center" }}
                >
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    {parseInt(s.score, 0)}
                  </p>
                </div>
                <div
                  className='table-data'
                  style={{ flex: "1", textAlign: "center" }}
                >
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    {totalScores}
                  </p>
                </div>
                <div
                  className='table-data'
                  style={{ flex: "1", textAlign: "center" }}
                >
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    {maxScores?.has_two_assessment === 1
                      ? getScoreRemark(totalScores)?.grade
                      : getScoreRemark(totalScores)?.grade}
                  </p>
                </div>
                <div
                  className='table-data'
                  style={{ flex: "1", textAlign: "center" }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "16px",
                      fontWeight: "bold",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {maxScores?.has_two_assessment === 1
                      ? getScoreRemark(
                          Number(
                            studentFirstAssess?.find(
                              (x) => x.subject === s.subject
                            )?.score ?? 0
                          ) +
                            Number(
                              studentSecondAssess?.find(
                                (x) => x.subject === s.subject
                              )?.score ?? 0
                            ) +
                            Number(s.score)
                        )?.remark
                      : getScoreRemark(
                          Number(
                            newStudentMidterm?.find(
                              (x) => x.subject === s.subject
                            )?.score ?? 0
                          ) + Number(s.score)
                        )?.remark}
                  </p>
                </div>
              </div>
            }
          </div>
        );
      })}
    </div>
  }