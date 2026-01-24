import {Routes, Route , Navigate} from "react-router";
import Homepage from "./pages/homepage";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import {checkUser} from './authSlice'
import { useDispatch,useSelector} from "react-redux";
import { useEffect } from "react";
import AdminPanel from './components/AdminPanel'
import ProblemPage from "./pages/ProblemPage";
import Admin from './pages/Admin'
import Admindelete from "./components/Admindelete";
import UpdateList from "./components/UpdateList";
import AdminUpdateForm from "./components/AdminUpdate";


export default function App(){

  const {isAuthenticated, loading, user} = useSelector((state)=> state.auth)
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(checkUser())
  },[dispatch])  //we can remain the dependency array empty but it is good habit to write somthing
 

  if(loading){
    return(
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }


  return(
    <Routes>
      <Route path="/" element={isAuthenticated?<Homepage></Homepage>:<Navigate to="/signup"/> }/>
      <Route path="/login" element={isAuthenticated?<Navigate to="/"/>:<Login></Login>}/>
      <Route path="/signUp" element={isAuthenticated?<Navigate to="/"/>:<SignUp></SignUp>}/>
      <Route path="/admin" element={isAuthenticated && user?.role === "admin" ? <Admin></Admin> : <Navigate to="/"/>}/>
      <Route path="/admin/create" element={isAuthenticated && user.role==='admin' ? <AdminPanel/>: <Navigate to='/'/>}></Route>
      <Route path="/admin/delete" element={isAuthenticated && user.role === 'admin' ? <Admindelete/> : <Navigate to='/'/>}/>
      <Route path="/admin/update" element={isAuthenticated && user.role === 'admin' ? <UpdateList/> : <Navigate to='/'/>}/>
      <Route path="/admin/edit-problem/:_id" element={isAuthenticated && user.role === 'admin' ? <AdminUpdateForm/> : <Navigate to='/'/>}/>
      <Route path="/problem/:problemid" element={<ProblemPage></ProblemPage>}></Route>
    </Routes>
  )
}