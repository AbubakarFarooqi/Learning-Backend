import { useState, useEffect } from 'react'





function App() {
  console.log("Render")
  const [students, setStudents] = useState([])
  useEffect(() => {
    fetch("api/students")
      .then(res => {
        if (res.ok) {
          return res.json()
        }
      })
      .then(data => {
        console.log(data)
        setStudents(data)
        // return
      })
  }, [])
  return (
    <>
      <h1>Students</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
          </tr>
        </thead>
        <tbody>
          {

            students.map((student, index) => (
              <tr key={index}>
                <td>{student.name}</td>
                <td>{student.class}</td>
              </tr>
            ))

          }

        </tbody>
      </table>
    </>
  )
}

export default App
