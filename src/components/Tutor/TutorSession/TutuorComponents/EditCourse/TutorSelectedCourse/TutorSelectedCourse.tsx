import React, {  useState } from "react";
import { useSelector } from "react-redux";
import { Course } from "../../../../../../dtos/Course";
import { RootState } from "../../../../../../redux/store";
import PlayList from "../../../../../Student/StudentSelectedCourse/PlayList/PlayList";

const TutorSelectedCourse: React.FC = () => {
  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  const course = useSelector(
    (state: RootState) => state.userReducer.selectedCourse
  );

  return (
    <div className="flex flex-col md:flex-row justify-center items-center w-full h-full overflow-hidden bg-white">
      <div className="flex w-full h-full flex-col overflow-y-scroll">
        <div className="flex flex-col justify-center items-center w-full py-5 h-fit ">
          <div className="flex w-full flex-col lg:flex-row h-full px-10 gap-5 mb-7">
            <div className="flex flex-col justify-start items-center w-full lg:w-2/3  h-full gap-3 text-medium ">
              <div className="flex  border w-full h-full">
                <video
                  className="w-full h-full"
                  src={`${process.env.REACT_APP_BUCKET_BASE_URL as string}/${
                    course?.chapters?.[selectedChapter]?.url as string
                  }`}
                  autoPlay
                  controls
                  controlsList="nodownload"
                ></video>
              </div>
              <div className="flex flex-col  w-full h-full gap-5">
                <div className="flex w-full  justify-start items-center h-fit text-lg font-medium ">
                  {course?.chapters?.[selectedChapter]?.title}
                </div>
                <div className="flex w-full  justify-start items-center h-fit text-sm ">
                  {course?.chapters?.[selectedChapter]?.description}
                </div>
              </div>
            </div>
            <PlayList
              course={course as Course}
              selectedChapter={selectedChapter}
              setSelectedChapter={setSelectedChapter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorSelectedCourse;
