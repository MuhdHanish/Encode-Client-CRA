import React, { useCallback, useState, useEffect } from 'react'
import { PiRocketLaunchLight, PiShootingStarLight } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { Course } from '../../../dtos/Course';
import { getCourseOfStudents, removeStudent } from '../../../utils/courseUtils';
import Pagination from '../../Common/Pagination/Pagination';
import SideCard from './SideCard/SideCard';
import HeadCard from './HeadCard/HeadCard';
import CourseFilterByPrice from '../../Common/CourseFilterByPrice/CourseFilterByPrice';
import CourseFilterByLevel from '../../Common/CourseFilterByLevel/CourseFilterByLevel';
import Loader from '../../Common/Loader/Loader';
import noProgressImage from "../../../assets/progressPage/progressPage.png";

const StudentProgress: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[] | []>([]);
  const fetchDatas = useCallback(() => {
    getCourseOfStudents().then((res) => setCourses(res as Course[])).catch(err => console.log(err));
  }, []);
  useEffect(() => {
    fetchDatas();
  }, [fetchDatas]);
  const [selectedOption, setSelectedOption] = useState<string>("option1");
  const [selectedLevel, setSelectedLevel] = useState<string>("option1");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredCourseList, setFilteredCourseList] = useState<Course[] | []>(
    []
  );
  useEffect(() => {
    const filteredList = courses?.filter((course) => {
      const coursenameMatch = course?.coursename
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const descriptionMatch = course?.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const languageMatch = course?.language
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const courseTypeMatch =
        selectedOption === "option1" ||
        (selectedOption === "option2" && !course.isPaid) ||
        (selectedOption === "option3" && course.isPaid);

      const levelMatch =
        selectedLevel === "option1" ||
        (selectedLevel === "option2" && course.level === "Beginner") ||
        (selectedLevel === "option3" && course.level === "Intermediate") ||
        (selectedLevel === "option4" && course.level === "Expert");

      return (
        (coursenameMatch || descriptionMatch || languageMatch) &&
        courseTypeMatch &&
        levelMatch
      );
    });
    setFilteredCourseList(filteredList);
  }, [searchQuery, courses, selectedOption, selectedLevel]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postPerPage = 6;
  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const [currentPosts, setCurrentPosts] = useState<Course[] | []>([]);
  const handleRemoveStudent = (courseId: string) => { removeStudent(courseId).then((res) => { if (res) { fetchDatas() } }).catch(err => console.error(err)) };
  useEffect(() => {
    setCurrentPosts(filteredCourseList?.slice(firstPostIndex, lastPostIndex));
  }, [filteredCourseList, firstPostIndex, lastPostIndex]);
  const [loading, setLoading] = useState<boolean>(true);
  setTimeout(() => {
    setLoading(false);
  }, 60);
  return (
    <div className="bg-white flex flex-col w-full h-full p-5 gap-8 overflow-x-hidden  ">
      <div className="flex w-full h-fit justify-between items-center ">
        <div className="flex flex-col justify-start items-start">
          <span className="font-bold text-2xl">Learn New Skills</span>
          <span className="text-[13px] text-gray-400 ">
            Simple price, unlimited skills
          </span>
        </div>
        <div
          className="flex w-fit h-fit py-2 bg-primary text-shadow-black text-[14px] text-white px-4 gap-2 items-center justify-center cursor-pointer"
          onClick={() => navigate("/catalog")}
        >
          <span>Explore More</span>
          <span>
            <PiRocketLaunchLight style={{ color: "white", fontSize: "15px" }} />
          </span>
        </div>
      </div>
      {!loading && courses?.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 ">
            {courses?.slice(0, 4)?.map((course, idx) => (
              <HeadCard
                course={course}
                key={idx}
                handleRemoveStudent={handleRemoveStudent}
              />
            ))}
          </div>
          <div className="flex w-full font-medium text-[15px] items-center  gap-3 flex-col md:flex-row ">
            <div className="flex w-full h-fit gap-3">
              <div className="flex w-full h-fit gap-3">
                <CourseFilterByPrice
                  setSelectedOption={setSelectedOption}
                  selectedOption={selectedOption}
                />
                <CourseFilterByLevel
                  setSelectedLevel={setSelectedLevel}
                  selectedLevel={selectedLevel}
                />
              </div>
            </div>
            <div className="flex w-full h-fit bg-white ">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search"
                className="appearance-none bg-white border w-full border-gray-300  text-[14px] rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="flex w-full h-fit   justify-center">
            <div className=" p-5 gap-5 grid sm:grid-cols-3">
              {currentPosts.length > 0 ? (
                currentPosts?.map((course, idx) => (
                  <SideCard
                    course={course}
                    key={idx}
                    handleRemoveStudent={handleRemoveStudent}
                  />
                ))
              ) : (
                <span>No course found !</span>
              )}
            </div>
          </div>
        </>
      )} { !loading && !courses?.length  &&  (
        <>
          <div className="flex w-full flex-col md:flex-row h-screen justify-center items-center  p-5 overflow-hidden">
            <div className="flex w-full h-full justify-center items-center flex-col">
              <span className="flex w-fit h-fit font-bold text-3xl">
                No Course Found !
              </span>
              <span className="text-gray-500 font-normal text-sm flex gap-1 items-center ">
                select course, start grow{" "}
                <span className="text-primary">
                  <PiShootingStarLight />
                </span>
              </span>
            </div>
            <div className="flex w-full  h-full justify-center items-center">
              <img src={noProgressImage} className="" alt="" />
            </div>
          </div>
        </>
      )}
      {
        loading && <Loader/>
      }
      {filteredCourseList?.length > postPerPage && (
        <div className="flex w-full  justify-end items-end ">
          <Pagination
            postsPerPage={postPerPage}
            totalPosts={filteredCourseList?.length}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
}

export default StudentProgress