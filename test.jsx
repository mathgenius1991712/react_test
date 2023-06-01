/*modified by Alex*/

/*
1. The analysis on the original script
-At the original script, get the school data and legal guardian data several times and that is the redundancy
that we can reduce.
*/

import StudentsPicker from '../components/StudentsPicker';
import StudentsTable from '../components/StudentsTable';
import { fetchStudentData, fetchSchoolData, fetchLegalguardianData } from '../utils';
import { useState } from 'react';


const studentsDataComponent = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [schoolsData, setSchoolsData] = useState([]);
  const [legalguardiansData, setLegalguardiansData] = useState([]);

  const onStudentsPick = async (studentIds) => {
    var newStudnetsData = []; //new State students variable
    var newSchoolsData = [];  //new State schools variable
    var newLegalguardiansData = []; //new State legalguardians variable
    var allSchoolsData = {};    //store all school data for studentIds
    var allLegalguardiansData = {}; //store all legal guardian data for studentIds
    var newSchoolIds = [];  //store ids of schools in the order of students
    var newLegalguardianIds = []; //store ids of legalguardians in the order of students
    var allSchoolIds = [];  //store all school ids for studentsIds. i.e no duplicated ids
    var allLegalguardianIds = []; //store all guardian ids for studentsIds. i.e no duplicated ids
    for (const studentId of studentIds) {
      const studentData = await fetchStudentData(studentId);
      newStudnetsData = [...newStudnetsData, studentData]; 
      for (const student of studentData) {
        const { schoolId, legalguardianId } = student;
        newSchoolIds = [...newSchoolIds, schoolId]; //append schoolId
        newLegalguardianIds = [...newLegalguardianIds, legalguardianId]; //append legalguardianId
      } 
    }
    const allSchoolIds = newSchoolIds.filter((el, index, self) => self.indexOf(el) === index); //remove
    //duplicated ids to reduce the requests

    const allLegalguardianIds = newLegalguardiansData.filter((el, index, self) => self.indexOf(el) === index);
    //remove duplicated ids to reduce requests

    /*Get all school data*/
    for(const schoolId of allSchoolIds){
      const schoolData = await fetchSchoolData(schoolId);
      allSchoolsData = {
        ...allSchoolsData, 
        schoolId: schoolData
      };
    }

    /*Get all guardian data*/
    for(const legalguardianId of allLegalguardianIds){
      const legalguardianData = await fetchLegalguardianData(legalguardianId);
      allLegalguardiansData = {
        ...allLegalguardiansData, 
        legalguardianId: legalguardianData
      };
    }

    //preserve the original order
    for(const schoolId of newSchoolIds){
      newSchoolsData = [...newStudnetsData, allSchoolsData[schoolId]];
    }

    //preserve the original order
    for(const legalguardianId of newLegalguardianIds){
      newLegalguardiansData = [...newLegalguardiansData, allLegalguardiansData[legalguardianId]];
    }

    //update state and rerender 
    setStudentsData(newStudnetsData);
    setSchoolsData(newSchoolsData);
    setLegalguardiansData(newLegalguardiansData);
        
  };


  return (
    <>
      <StudentsPicker onPickHandler={onStudentsPick} />
      <StudentsTable
        studentsData={studentsData}
        schoolsData={schoolsData}
        LegalguardiansData={legalguardiansData}
      />
    </>
  );
};


export default studentsDataComponent;







