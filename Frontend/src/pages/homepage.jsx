import { useState, useEffect } from "react"
import { NavLink } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import axiosClient from "../utils/axios"
import { logoutUser } from '../authSlice'

export default function Homepage() {

    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const [Problems, setProblems] = useState([])
    const [SolveProblems, setSolveProblems] = useState([])
    const [filter, setFilter] = useState({
        diff: 'all',
        tag: 'all',
        status: 'all'
    })

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const { data } = await axiosClient.get('/admin/allproblems')
                setProblems(data)
            } catch (error) {
                console.error('fetching error: ' + error)
            }
        }

        const fetchsolveproblem = async () => {
            try {
                const { data } = await axiosClient('/admin/solved')
                setSolveProblems(data)
            } catch (error) {
                console.error('fetching error: ' + error)
            }
        }

        fetchProblems()
        if (user) fetchsolveproblem()
    }, [user])

    const handleLogout = () => {
        dispatch(logoutUser());
        setSolveProblems([]) //clear all solved problems after logout
    }

    const filterproblem = Problems.filter(Problems => {
        const diffucltymatch = filter.diff === 'all' || Problems.diffuclty === filter.diff
        const tagmatch = filter.tag === 'all' || Problems.tags === filter.tag
        const statusmatch = filter.status === 'all' || SolveProblems.some(sp => sp._id === Problems._id)
        return diffucltymatch && tagmatch && statusmatch;
    })

    // return (
    //     <div className="min-h-screen bg-base-200">

    //         {/* navigation bar */}
    //         <nav className="navbar bg-base-100 shadow-lg px-4">
    //             <div className="flex-1">
    //                 <NavLink to="/" className="btn btn-ghost text-xl">LeetCode</NavLink>
    //             </div>

    //             <div className="flex-none gap-4">
    //                 <div className="dropdown dropdown-end">
    //                     <div tabIndex={1} className="btn btn-ghost">
    //                         {user?.firstname}
    //                     </div>
    //                     <ul className="mt-3 p-2 menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
    //                         <li><button onClick={handleLogout}>Logout</button></li>
    //                         {user.role == 'admin' && <li><NavLink to='/admin'>Admin</NavLink></li>}
    //                     </ul>
    //                 </div>
    //             </div>
    //         </nav>

    //         {/* main content  */}
    //         <div className="container mx-auto p-4">
    //             {/* Filters */}
    //             <div className="flex flex-wrap gap-4 mb-6">
    //                 <select className="select select-borderd" value={filter.status}
    //                     onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
    //                     <option value='all'>All Problems</option>
    //                     <option value="solved">Solved Problmes</option>
    //                 </select>

    //                 <select className="select select-borderd" value={filter.diff}
    //                     onChange={(e) => setFilter({ ...filter, diff: e.target.value })}>
    //                     <option value='all'>All</option>
    //                     <option value='easy'>Easy</option>
    //                     <option value="medium">Medium</option>
    //                     <option value="hard">Hard</option>
    //                 </select>

    //                 <select className="select select-borderd" value={filter.tag}
    //                     onChange={(e) => setFilter({ ...filter, tag: e.target.value })}>
    //                     <option value='all'>All</option>
    //                     <option value='array'>Array</option>
    //                     <option value='linkedlist'>LinkedList</option>
    //                     <option value='graph'>Graph</option>
    //                     <option value='dp'>DP</option>
    //                 </select>
    //             </div>

    //             {/* problem list */}
    //             <div className="grid gap-4">
    //                 {filterproblem.map(problem => (
    //                     <div key={problem._id} className="card bg-base-100 shadow-xl">
    //                         <div className="card-body">
    //                             <div className="flex items-center justify-between">
    //                                 <h2 className="card-title">
    //                                     <NavLink to={`/problem/${problem._id}`} className="hover:text-primary">
    //                                         {problem.title}
    //                                     </NavLink>
    //                                 </h2>
    //                                 {SolveProblems.some(sp => sp._id === problem._id) && (
    //                                     <div className="badge badge-success gap-2">
    //                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    //                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    //                                         </svg>
    //                                         Solved
    //                                     </div>
    //                                 )}
    //                             </div>

    //                             <div className="flex gap-2">
    //                                 <div className={`badge ${Diffucltybadgecolor(problem.diffuclty)}`}>
    //                                     {problem.diffuclty}
    //                                 </div>
    //                                 <div className="badge badge-info">
    //                                     {problem.tags}
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 ))}
    //             </div>
    //         </div>
    //     </div>
    // )
    
return (
    <div className="min-h-screen flex justify-center items-start relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        {/* Background effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>

        {/* navigation bar */}
        <nav className="navbar bg-gray-900/80 backdrop-blur-md border-b border-gray-700 shadow-lg px-4 fixed top-0 w-full z-50">
            <div className="flex-1">
                <NavLink to="/" className="btn btn-ghost text-xl text-white hover:text-indigo-400 transition-all duration-300">CoderPitch</NavLink>
            </div>

            <div className="flex-none gap-4">
                <div className="dropdown dropdown-end">
                    <div tabIndex={1} className="btn bg-gray-800/80 border-gray-700 text-white hover:bg-gray-700/80 hover:border-indigo-500 transition-all duration-300">
                        👤 {user?.firstname}
                    </div>
                    <ul className="mt-3 p-2 menu menu-sm dropdown-content bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-box w-52 shadow-2xl">
                        <li><button onClick={handleLogout} className="text-white hover:bg-red-500/20 hover:text-red-400 transition-colors">🚪 Logout</button></li>
                        {user?.role == 'admin' && <li><NavLink to='/admin' className="text-white hover:bg-indigo-500/20 hover:text-indigo-400 transition-colors">⚙️ Admin</NavLink></li>}
                    </ul>
                </div>
            </div>
        </nav>

        {/* main content  */}
        <div className="container mx-auto p-4 mt-16 z-10">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
                <select className="select bg-gray-800/80 border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 backdrop-blur-md transition-all duration-300 hover:bg-gray-700/80 hover:border-indigo-400 rounded-xl"
                    value={filter.status}
                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                    <option value='all'>📋 All Problems</option>
                    <option value="solved">✅ Solved Problems</option>
                </select>

                <select className="select bg-gray-800/80 border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 backdrop-blur-md transition-all duration-300 hover:bg-gray-700/80 hover:border-indigo-400 rounded-xl"
                    value={filter.diff}
                    onChange={(e) => setFilter({ ...filter, diff: e.target.value })}>
                    <option value='all'>🎯 All Difficulty</option>
                    <option value='easy'>🟢 Easy</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="hard">🔴 Hard</option>
                </select>

                <select className="select bg-gray-800/80 border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 backdrop-blur-md transition-all duration-300 hover:bg-gray-700/80 hover:border-indigo-400 rounded-xl"
                    value={filter.tag}
                    onChange={(e) => setFilter({ ...filter, tag: e.target.value })}>
                    <option value='all'>🏷️ All Tags</option>
                    <option value='array'>📊 Array</option>
                    <option value='linkedlist'>🔗 LinkedList</option>
                    <option value='graph'>🕸️ Graph</option>
                    <option value='dp'>🧠 DP</option>
                </select>
            </div>

            {/* problem list */}
            <div className="grid gap-6">
                {filterproblem.map(problem => (
                    <div key={problem._id} className="card bg-gray-900/60 backdrop-blur-md border border-gray-700 shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="card-body p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="card-title text-white text-xl font-bold">
                                    <NavLink to={`/problem/${problem._id}`} className="hover:text-indigo-400 transition-colors duration-300 flex items-center gap-2">
                                        <span>💻</span>
                                        {problem.title}
                                    </NavLink>
                                </h2>
                                {SolveProblems.some(sp => sp._id === problem._id) && (
                                    <div className="badge badge-success gap-2 px-4 py-3 text-white font-semibold bg-gradient-to-r from-green-500 to-emerald-600 border-0 shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Solved
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-4">
                                <div className={`badge px-4 py-3 font-bold text-white border-0 shadow-lg ${Diffucltybadgecolor(problem. diffuclty)}`}>
                                    {problem. diffuclty === 'easy'}
                                    {problem. diffuclty === 'medium'}
                                    {problem. diffuclty === 'hard'}
                                    {problem. diffuclty?.charAt(0).toUpperCase() + problem. diffuclty?.slice(1)}
                                </div>
                                <div className="badge badge-info px-4 py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-600 border-0 shadow-lg">
                                    🏷️ {problem.tags}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)
}

const Diffucltybadgecolor = (diffuclty) => {
    
    switch (diffuclty) {
        case 'easy': return 'badge-success'
        case 'medium': return 'badge-warning';
        case 'hard': return 'badge-error';
        default: return 'badge-neutral';
    }
}