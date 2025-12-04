import { useState, useEffect } from "react";
import axiosClient from "../utils/axios";

const SubmissionHistory = ({problemId}) =>{
    const [submissions , setsubmissions] = useState([]);
    const [loading , setloading] = useState(true)
    const [error , seterror] = useState(null)
    const [selectSubmission , setselectSubmission] = useState(null)

    useEffect(() => {
        const fetchsubmission = async ()=>{
            try{
                setloading(true)
                const response = await axiosClient.get(`/admin/submitedproblem/${problemId}`)
                setsubmissions(response.data)
                seterror(null)
            }
            catch(err){
                seterror('error occured in fetch')
                console.error('Error'+ err)
            }
            finally{
                setloading(false)
            }
        }
        fetchsubmission()
    },[problemId])

    const getStatuscolor = (status) => {
        switch(status) {
            case 'accepted': return 'badge-success'
            case 'wrong' : return 'badge-error'
            case 'error' : return 'badge-warning'
            case 'pending' : return 'badge-info';
            default: return 'badge-neutral'
        }
    }

    const formateMemory = (memory) =>{
        if(memory < 1024)
            return `${memory} kb`
        return `${memory/1024 .toFixed(2)} mb`
    }

    const formatDate = (datestirng)=>{
        return new Date(datestirng).toLocaleString()
    }

    if(loading)
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loasing loading-spinner loading-lg"></span>
            </div>
        )

    if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return(
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Submission history</h2>

      {submissions.length ===0 ? (
        <div className="alert alert-info shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>No submission found for this problem</span>
          </div>
        </div>
      ):(
        <>
         <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Language</th>
                <th>Status</th>
                <th>Runtime</th>
                <th>Memory</th>
                <th>Testcases</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, index)=>(
                <tr key={sub._id}>
                  <td>{index +1}</td>
                  <td className="font-mono">{sub.language}</td>
                  <td>
                    <span className={`badge ${getStatuscolor(sub.status)} w-16`}>
                      {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                    </span>
                  </td>
                  <td className="font-mono">{sub.runtime}</td>
                  <td>{formateMemory(sub.memory)}</td>
                  <td>{sub.TestcasesPass}</td>
                  <td>{formatDate(sub.createdAt)}</td>
                  <td>
                    <button className="btn btn-sm btn-outline" onClick={() => setselectSubmission(sub)}>
                      Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
         </div>
         <p className="text-sm mt-4 text-gray-500">
          showing {submissions.length} submissions
         </p>
        </>
      )}

      {/* Code view Mode */}.
      {selectSubmission && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="text-lg font-bold mb-2">
              Submission Details : {selectSubmission.language}
            </h3>

            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`badge ${getStatuscolor(selectSubmission.status)}`}>
                  {selectSubmission.status}
                </span>
                <span className="badge badge-outline">
                  Runtime : {selectSubmission.runtime}
                </span>
                <span className="badge badge-outline">
                  Memory : {formateMemory(selectSubmission.memory)}
                </span>
                <span className="badge badge-outline">
                  Passed : {selectSubmission.TestcasesPass}/{selectSubmission.Testcasestotel}
                </span>
              </div>

              {selectSubmission.errorMessage && (
                <div className="alert alert-error mt-2">
                  <div>
                    <span>
                      Error : {selectSubmission.errorMessage}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <pre className="p-4 bg-gray-900 text-gray-300 rounded overflow-auto">
              <code>{selectSubmission.code}</code>
            </pre>

            <div className="modal-action">
              <button className="btn"
              onClick={()=> setselectSubmission(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

}

export default SubmissionHistory