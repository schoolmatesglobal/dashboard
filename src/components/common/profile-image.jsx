import React from "react";
import defaultImage from "../../assets/images/placeholder.png";
import allImage from "../../assets/images/allStudents.png";
import femaleImage from "../../assets/images/femalePlaceholder.png";

const ProfileImage = ({ src, alt, wrapperClassName, gender, teacher }) => {
  const img =
    gender === "male"
      ? defaultImage
      : gender === "female"
      ? femaleImage
      : gender === "all"
      ? allImage
      : defaultImage;

    const allSrc = !!teacher ? allImage : img
  return (
    <div className={`profile-image-wrapper ${wrapperClassName || ""}`}>
      <img src={src || img} alt={alt || ""} />
    </div>
  );
};

export default ProfileImage;
