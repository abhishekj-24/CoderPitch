import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from 'zod'
import { useNavigate } from "react-router";
import axiosClient from "../utils/axios";

const problemSchema = z.object({
    title: z.string().min(1,'title is required'),
    description: z.string().min(5, 'discription is required'),
    diffuclty: z.enum(['easy', 'medium', 'hard']),
    tags: z.enum(['array', 'linklist','dp', 'graph','tree']),
    visibiletastcase: z.array(
        z.object({
            input: z.string().min(1, "input is required"),
            output: z.string().min(1, 'output is required'),
            explanation:z.string().min(3, "explanation is required")
        })
    ).min(1,"Atleste one testcase is required"),
    hiddentastcase:z.array(
        z.object({
            input: z.string().min(1, 'input is required'),
            output: z.string().min(1, 'output is required')
        })
    ).min(1, 'Atleste one hiddentestcase is required'),
    startcode:z.array(
        z.object({
            language: z.enum(['C++', 'Java', 'JavaScript']),
            initialcode: z.string().min(1, 'initialcode is required')
        })
    ).min(1, 'start code is required'),
    referencesol: z.array(
        z.object({
            language: z.enum(['C++', 'Java', 'JavaScript']),
            completeCode: z.string().min(1,'conpletecode is required')
        })
    ).min(3, 'All three language is required')
})

export default function AdminPanel(){
    const nevigate = useNavigate

    const { register, control, handleSubmit, formState:{ errors } } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues:{
            startcode:[
                {language:'C++', initialcode:''},
                {language: 'Java', initialcode:''},
                {language:'JavaScript', initialcode: ''}
            ],
            referencesol:[
                {language: 'C++', completeCode: ''},
                {language: 'Java', completeCode: ''},
                {language: 'JavaScript', completeCode: ''}
            ]
        }
    })

    const {
        fields: Visiblefields,
        append: appendVisible,
        remove: removeVisible
    } = useFieldArray({
        control,
        name: "visibiletastcase"
    })

    const {
        fields: hiddenfields,
        append: appendhidden,
        remove: removehidden
    } = useFieldArray({
        control,
        name: "hiddentastcase"
    })

    const onSubmit = async (data) =>{
        try{
            console.log('hello axios')
            await axiosClient.post('/admin/create', data)
            alert('problem created succesfully')
            nevigate('/')
        }
        catch(error){
            alert(`Error ${error.response?.data?.message}` || error.message)
        }
    }

    return(
        <div className="container mx-auto p-6">
           <h1 className="text-3xl font-bold mb-6">Create New Problem</h1>
           
           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* basic Information */}
             <div className="card bg-gray-800 shadow-lg p-6">
               <h2 className="text-xl font-semibold mb-6">Basic Information</h2> 
               <div className="space-y-4">

                {/* Title */}
                 <div className="form-control">
                    <label className="label">
                      <span className="label-text mr-3">Title</span>
                      <input
                      {...register('title')}
                      className={`input input-bordered ${errors.title && 'input-error'}`}
                      />
                      {errors.title && (<span className="text-error">{errors.title.message}</span>)}
                    </label>
                 </div> 
                 
                 {/* Description */}
                 <div className="form-control">
                   <label className="label">
                     <span className="label-text mr-3">Description</span>
                   </label>
                   <textarea
                   {...register('description')}
                   className={`textarea textarea-bordered h-32 ${errors.description && 'textarea-error'}`}
                   />
                   {errors.description && (<span className="text-error">{errors.description.message}</span>)}
                 </div>

                 {/* Difficulty */}
                 <div className="flex gap-4">
                   <div className="form-control w-1/2">
                      <label className="label">
                        <span className="label-text mb-2 mr-2">Difficulty</span>
                      </label>
                      <select
                      {...register('diffuclty')}
                      className={`select select-bordered ${errors.diffuclty && 'select-error'}`}
                      >
                      <option value='easy'>Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      </select>
                   </div>

                   {/* tags */}
                   <div className="form-control w-1/2">
                      <label className="label">
                        <span className="label-text mb-2 mr-2">Tags</span>
                      </label>
                      <select
                      {...register('tags')}
                      className={`select select-bordered ${errors.tags && 'select-error'}`}
                      >
                      <option value='array'>array</option>
                      <option value="linklist">Link List</option>
                      <option value="dp">DP</option>
                      <option value="graph">Graph</option>
                      <option value="tree">Tree</option>
                      </select>
                   </div>  
                 </div>
               </div>
             </div>

             {/* Test cases */}
             <div className="card bg-gray-800 shadow-lg p-6">
               <h2 className="text-xl font-semibold mb-4">Test Cases</h2>

               {/* Visible test cases */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Visible Test Cases</h3>
                    <button type="button"
                    onClick={()=> appendVisible({input:'', output: '', explanation: ''})}
                    className="btn btn-sm border-y-stone-950">
                       Add Visible Case
                    </button>
                  </div>
                  {Visiblefields.map((field, index)=>(
                    <div key={field.id} className="border p-4 rounded-lg space-y-2">
                       <div className="flex justify-end">
                         <button type="button" onClick={()=>removeVisible(index)}
                            className="btn btn-xs btn-error">
                            Remove 
                         </button>
                       </div>
                       <input
                       {...register(`visibiletastcase.${index}.input`)}
                       placeholder="Input"
                       className="input input-bordered w-full"
                       />
                       <input 
                       {...register(`visibiletastcase.${index}.output`)}
                       placeholder="Output"
                       className="input input-bordered w-full"
                       />
                       <textarea
                       {...register(`visibiletastcase.${index}.explanation`)}
                       placeholder="Explanation"
                       className="textarea textarea-bordered w-full"
                       />                       
                    </div>
                  ))}
                </div>

                {/* Hidden tast cases */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Hidden Test Cases</h3>
                    <button type="button"
                    onClick={()=> appendhidden({input:'', output: ''})}
                    className="btn btn-sm border-y-stone-950">
                       Add Hidden Case
                    </button>
                  </div>
                  {hiddenfields.map((field, index)=>(
                    <div key={field.id} className="border p-4 rounded-lg space-y-2">
                       <div className="flex justify-end">
                         <button type="button" onClick={()=>removehidden(index)}
                            className="btn btn-xs btn-error">
                            Remove 
                         </button>
                       </div>
                       <input
                       {...register(`hiddentastcase.${index}.input`)}
                       placeholder="Input"
                       className="input input-bordered w-full"
                       />
                       <input 
                       {...register(`hiddentastcase.${index}.output`)}
                       placeholder="Output"
                       className="input input-bordered w-full"
                       />                     
                    </div>
                  ))}
                </div>                
             </div>

             {/* Code tamplates */}
             <div className="card bg-gray-800 shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Code Templates</h2>
                <div className="space-y-6">
                  {[0 , 1, 2].map((index)=>(
                    <div key={index} className="space-y-2">
                      <h3 className="font-medium">
                        {index === 0 ? 'C++' : index === 1 ? 'Java' : 'Javascript'}
                      </h3>
                      {/* initila code */}
                      <div className="form-control">
                        <label className="label">
                           <span className="label-text mb-1">Initial Code</span>
                        </label>
                        <pre className="bg-base-300 p-4 rounded-lg">
                          <textarea
                          {...register(`startcode.${index}.initialcode`)}
                          className="w-full bg-transparent font-mono"
                          rows={5}/>
                        </pre>
                      </div>

                      {/* Rafrence solution */}
                      <div className="form-control">
                        <label className="label">
                           <span className="label-text mb-1">Reference Solution</span>
                        </label>
                        <pre className="bg-base-300 p-4 rounded-lg">
                          <textarea
                          {...register(`referencesol.${index}.completeCode`)}
                          className="w-full bg-transparent font-mono"
                          rows={5}/>
                        </pre>
                      </div>                     
                    </div>
                  ))}
                </div>
             </div>
             <button type="submit" className="btn btn-primary w-full">Create Problem</button>
           </form>
        </div>
    )


}