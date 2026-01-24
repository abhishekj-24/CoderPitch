import { useEffect, useState } from "react";
import { useNavigate } from "react-router";// Import for navigation
import axiosClient from "../utils/axios";

const UpdateList = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate(); // Hook for redirection

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            setLoading(true);
            // API ROUTE: Ensure this matches your backend route for fetching all problems
            const { data } = await axiosClient.get('/admin/allproblems'); 
            setProblems(data);
        } catch (error) {
            setError('Failed to load problems');
            console.error('Error in fetch problems: ' + error);
        } finally {
            setLoading(false);
        }
    };

    // This function handles the "Update" button click
    const handleUpdateRedirect = (id) => {
        // ROUTE NAME: Change "/admin/edit-problem/" to whatever your update page route is
        navigate(`/admin/edit-problem/${id}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

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

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Update Problems</h1>
            </div>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th className="w-1/12">#</th>
                            <th className="w-4/12">Title</th>
                            <th className="w-2/12">Difficulty</th>
                            <th className="w-3/12">Tags</th>
                            <th className="w-2/12">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {problems.map((prob, index) => (
                            <tr key={prob._id}>
                                <th>{index + 1}</th>
                                <td>{prob.title}</td>
                                <td>
                                    {/* Ensure variable name 'diffuclty' matches your DB (note the spelling typo in your previous code) */}
                                    <span className={`badge 
                                        ${prob.diffuclty === 'easy' ? 'badge-success' :
                                          prob.diffuclty === 'medium' ? 'badge-warning' :
                                          'badge-error'
                                        } w-16`}>
                                        {prob.diffuclty}
                                    </span>
                                </td>

                                <td>
                                    {/* VARIABLE NAME: Ensure 'tags' is the correct property name from your API response */}
                                    <span className="badge badge-outline w-16">
                                        {prob.tags}
                                    </span>
                                </td>

                                <td>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleUpdateRedirect(prob._id)}
                                            className="btn btn-sm btn-info" // Changed to btn-info (blue) for Update
                                        >
                                            Update
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UpdateList;