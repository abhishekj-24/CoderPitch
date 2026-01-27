import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { useNavigate, useParams } from "react-router"; // Added useParams
import axiosClient from "../utils/axios";

// Keep schema identical to ensure validation matches creation
const problemSchema = z.object({
    title: z.string().min(1, 'title is required'),
    description: z.string().min(5, 'description is required'),
    diffuclty: z.enum(['easy', 'medium', 'hard']),
    tags: z.enum(['array', 'linklist', 'dp', 'graph', 'tree']),
    visibiletastcase: z.array(
        z.object({
            input: z.string().min(1, "input is required"),
            output: z.string().min(1, 'output is required'),
            explanation: z.string().min(3, "explanation is required")
        })
    ).min(1, "At least one testcase is required"),
    hiddentastcase: z.array(
        z.object({
            input: z.string().min(1, 'input is required'),
            output: z.string().min(1, 'output is required')
        })
    ).min(1, 'At least one hidden testcase is required'),
    startcode: z.array(
        z.object({
            language: z.enum(['C++', 'Java', 'JavaScript']),
            initialcode: z.string().min(1, 'initialcode is required')
        })
    ).min(1, 'start code is required'),
    referencesol: z.array(
        z.object({
            language: z.enum(['C++', 'Java', 'JavaScript']),
            completeCode: z.string().min(1, 'completecode is required')
        })
    ).min(3, 'All three languages are required')
});

export default function AdminUpdateForm() {
    const { _id } = useParams(); // Get ID from URL
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [submitError, setSubmitError] = useState('');

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(problemSchema),
        mode: 'onBlur' // Only validate on blur to be less strict
    });

    const { fields: Visiblefields, append: appendVisible, remove: removeVisible } = useFieldArray({
        control,
        name: "visibiletastcase"
    });

    const { fields: hiddenfields, append: appendhidden, remove: removehidden } = useFieldArray({
        control,
        name: "hiddentastcase"
    });

    // 1. Fetch existing data on load
    useEffect(() => {
        const fetchProblemData = async () => {
            try {
                // API ROUTE: Change this to your "Get Single Problem" endpoint
                const { data } = await axiosClient.get(`/admin/getproblem/${_id}`);
                reset(data); // This fills the form with fetched data
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching problem:", error);
                alert("Failed to load problem data");
                navigate('/admin/update'); // Redirect back if failed
            }
        };
        fetchProblemData();
    }, [_id, reset, navigate]);

    const onSubmit = async (data) => {
        setSubmitError('');
        try {
            console.log("Form data being sent:", data);
            console.log("Update URL:", `/admin/update/${_id}`);
            const response = await axiosClient.put(`/admin/update/${_id}`, data);
            console.log("Update response:", response.data);
            alert('Problem updated successfully');
            navigate('/admin/update'); // Redirect to the list page
        } catch (error) {
            console.error("Update error details:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error message:", error.message);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to update problem';
            setSubmitError(errorMsg);
            alert(`Error: ${errorMsg}`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-ring loading-lg text-primary"></span>
            </div>
        );
    }

    // Debug: Log validation errors
    if (Object.keys(errors).length > 0) {
        console.warn("Form validation errors:", errors);
    }

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="btn btn-circle btn-outline btn-sm">✕</button>
                <h1 className="text-3xl font-bold">Update Problem</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Error Alert */}
                {submitError && (
                    <div className="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m8-8v2m0 4v2m0 4v2" /></svg>
                        <span>{submitError}</span>
                    </div>
                )}
                {/* Section 1: Basic Info */}
                <section className="card bg-base-200 shadow-xl overflow-visible">
                    <div className="card-body">
                        <h2 className="card-title text-primary border-b border-base-300 pb-2 mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="form-control">
                                <label className="label font-semibold">Title</label>
                                <input
                                    {...register('title')}
                                    className={`input input-bordered w-full ${errors.title && 'input-error'}`}
                                    placeholder="e.g. Two Sum"
                                />
                                {errors.title && <span className="text-error text-sm mt-1">{errors.title.message}</span>}
                            </div>

                            <div className="form-control">
                                <label className="label font-semibold">Description</label>
                                <textarea
                                    {...register('description')}
                                    className={`textarea textarea-bordered h-40 ${errors.description && 'textarea-error'}`}
                                    placeholder="Write the problem statement here..."
                                />
                                {errors.description && <span className="text-error text-sm mt-1">{errors.description.message}</span>}
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="form-control flex-1">
                                    <label className="label font-semibold">Difficulty</label>
                                    <select {...register('diffuclty')} className="select select-bordered">
                                        <option value='easy'>Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                                <div className="form-control flex-1">
                                    <label className="label font-semibold">Tags</label>
                                    <select {...register('tags')} className="select select-bordered">
                                        <option value='array'>Array</option>
                                        <option value="linklist">Link List</option>
                                        <option value="dp">Dynamic Programming</option>
                                        <option value="graph">Graph</option>
                                        <option value="tree">Tree</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Test Cases */}
                <section className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-secondary border-b border-base-300 pb-2 mb-4">Test Cases</h2>
                        
                        {/* Visible Cases */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">Visible Cases</h3>
                                <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="btn btn-sm btn-outline btn-secondary">
                                    + Add Case
                                </button>
                            </div>
                            <div className="space-y-4">
                                {Visiblefields.map((field, index) => (
                                    <div key={field.id} className="p-4 bg-base-100 rounded-xl border border-base-300 relative">
                                        <button type="button" onClick={() => removeVisible(index)} className="btn btn-xs btn-circle btn-error absolute top-2 right-2">✕</button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                            <input {...register(`visibiletastcase.${index}.input`)} placeholder="Input" className="input input-sm input-bordered" />
                                            <input {...register(`visibiletastcase.${index}.output`)} placeholder="Output" className="input input-sm input-bordered" />
                                            <textarea {...register(`visibiletastcase.${index}.explanation`)} placeholder="Explanation" className="textarea textarea-sm textarea-bordered col-span-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hidden Cases */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">Hidden Cases</h3>
                                <button type="button" onClick={() => appendhidden({ input: '', output: '' })} className="btn btn-sm btn-outline">
                                    + Add Hidden
                                </button>
                            </div>
                            <div className="space-y-4">
                                {hiddenfields.map((field, index) => (
                                    <div key={field.id} className="p-4 bg-base-300 rounded-xl flex gap-4 items-center">
                                        <input {...register(`hiddentastcase.${index}.input`)} placeholder="Input" className="input input-sm input-bordered flex-1" />
                                        <input {...register(`hiddentastcase.${index}.output`)} placeholder="Output" className="input input-sm input-bordered flex-1" />
                                        <button type="button" onClick={() => removehidden(index)} className="btn btn-xs btn-error">Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Code Templates */}
                <section className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-accent border-b border-base-300 pb-2 mb-4">Code Templates & Solutions</h2>
                        <div className="space-y-8">
                            {['C++', 'Java', 'JavaScript'].map((lang, index) => (
                                <div key={lang} className="collapse collapse-arrow bg-base-100 border border-base-300">
                                    <input type="checkbox" defaultChecked /> 
                                    <div className="collapse-title text-md font-bold text-accent">
                                        {lang} Configuration
                                    </div>
                                    <div className="collapse-content space-y-4">
                                        <div>
                                            <label className="label text-xs font-bold uppercase opacity-60">Initial Starter Code</label>
                                            <textarea 
                                                {...register(`startcode.${index}.initialcode`)} 
                                                className="textarea textarea-bordered w-full font-mono text-sm h-32 bg-neutral text-neutral-content"
                                            />
                                        </div>
                                        <div>
                                            <label className="label text-xs font-bold uppercase opacity-60">Reference Solution (Complete Code)</label>
                                            <textarea 
                                                {...register(`referencesol.${index}.completeCode`)} 
                                                className="textarea textarea-bordered w-full font-mono text-sm h-48 bg-neutral text-neutral-content"
                                            />
                                        </div>
                                        {/* Hidden inputs to maintain the language value in the array */}
                                        <input type="hidden" {...register(`startcode.${index}.language`)} value={lang} />
                                        <input type="hidden" {...register(`referencesol.${index}.language`)} value={lang} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="flex gap-4 pb-10">
                    <button type="button" onClick={() => navigate(-1)} className="btn btn-outline flex-1">Cancel</button>
                    <button type="submit" className="btn btn-primary flex-[2]">Update Problem</button>
                </div>
            </form>
        </div>
    );
}