let allStudents = [
    'A',
    'B-',
    1,
    4,
    5,
    2
  ]
  
let studentsWhoPass = [];

for (i = 0; i < allStudents.length; i++) {
    if (allStudents[i] <= 3) {
        studentsWhoPass.push(allStudents[i])
    }
    if ((allStudents[i] == 'A') || (allStudents == 'A-')) {
        studentsWhoPass.push(allStudents[i])
    }
}
  

console.log(allStudents)
console.log(studentsWhoPass)
