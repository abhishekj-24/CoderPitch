signup.jsx add svg
app.jsx add loder
make home page
make admin page


bugs in my project: 
when i submet or run c++ code it give error
boilerplate code not show




return (
  <div className="min-h-screen flex justify-center items-center relative overflow-hidden">
    {/* Background gradient with stars */}
    <div className="absolute inset-0 bg-gradient-to-b from-purple-700 via-purple-900 to-gray-900"></div>
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>

    {/* Silhouette mountains/trees effect */}
    <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-purple-950 via-purple-900/90 to-transparent"></div>

    {/* Card */}
    <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 z-10">
      <h2 className="text-center text-3xl font-bold text-white mb-2">Create Account</h2>
      <p className="text-center text-gray-300 mb-8">Start your coding journey</p>

      <form onSubmit={handleSubmit(submitdata)} className="space-y-6">
        {/* First Name */}
        <div>
          <input
            type="text"
            placeholder="First Name"
            className={`w-full px-4 py-3 rounded-lg bg-transparent border-b text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 transition ${
              errors.firstname ? "border-red-500" : "border-gray-400/40"
            }`}
            {...register("firstname")}
          />
          {errors.firstname && <span className="text-sm text-red-400 mt-1">{errors.firstname.message}</span>}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            className={`w-full px-4 py-3 rounded-lg bg-transparent border-b text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 transition ${
              errors.emailid ? "border-red-500" : "border-gray-400/40"
            }`}
            {...register("emailid")}
          />
          {errors.emailid && <span className="text-sm text-red-400 mt-1">{errors.emailid.message}</span>}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="Password"
            className={`w-full px-4 py-3 rounded-lg bg-transparent border-b text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 transition ${
              errors.password ? "border-red-500" : "border-gray-400/40"
            }`}
            {...register("password")}
          />
          {errors.password && <span className="text-sm text-red-400 mt-1">{errors.password.message}</span>}
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between text-sm text-gray-300">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="checkbox checkbox-xs border-gray-400/50" />
            <span>Remember me</span>
          </label>
          <a href="#" className="hover:underline hover:text-purple-300">Forgot Password?</a>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-white text-purple-800 font-semibold text-lg shadow-md hover:bg-purple-200 transition"
          >
            Sign Up
          </button>
        </div>

        {/* Already account */}
        <p className="text-center text-gray-300 text-sm mt-4">
          Already have an account?{" "}
          <a href="#" className="text-purple-300 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  </div>
);


admin paenl css

<!-- //     return (
//   <div className="min-h-screen bg-gradient-to-b from-[#1e1e2f] via-[#23233a] to-[#141421] text-gray-200 flex justify-center p-10">
//     <div className="w-full max-w-5xl space-y-10">
//       <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
//         Create New Problem
//       </h1>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
//         {/* Basic Information */}
//         <div className="bg-[#1c1c2b]/70 backdrop-blur-md rounded-2xl p-8 shadow-[0_0_20px_rgba(139,92,246,0.15)] border border-gray-700">
//           <h2 className="text-2xl font-semibold mb-6 text-purple-300">Basic Information</h2>
//           <div className="space-y-5">

//             {/* Title */}
//             <div className="form-control">
//               <label className="label flex flex-col items-start space-y-2">
//                 <span className="label-text text-gray-300">Title</span>
//                 <input
//                   {...register('title')}
//                   placeholder="Enter problem title"
//                   className={`input w-full bg-[#2a2a3d] text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${errors.title && 'border-red-500'}`}
//                 />
//                 {errors.title && <span className="text-sm text-red-400">{errors.title.message}</span>}
//               </label>
//             </div>

//             {/* Description */}
//             <div className="form-control">
//               <label className="label flex flex-col items-start space-y-2">
//                 <span className="label-text text-gray-300">Description</span>
//                 <textarea
//                   {...register('description')}
//                   placeholder="Write problem description..."
//                   className={`textarea w-full h-40 bg-[#2a2a3d] text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${errors.description && 'border-red-500'}`}
//                 />
//                 {errors.description && <span className="text-sm text-red-400">{errors.description.message}</span>}
//               </label>
//             </div>

//             {/* Difficulty + Tags */}
//             <div className="flex flex-col md:flex-row gap-6">
//               <div className="form-control w-full">
//                 <label className="label flex flex-col items-start space-y-2">
//                   <span className="label-text text-gray-300">Difficulty</span>
//                   <select
//                     {...register('diffuclty')}
//                     className={`select w-full bg-[#2a2a3d] text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.diffuclty && 'border-red-500'}`}
//                   >
//                     <option value='easy'>Easy</option>
//                     <option value="medium">Medium</option>
//                     <option value="hard">Hard</option>
//                   </select>
//                 </label>
//               </div>

//               <div className="form-control w-full">
//                 <label className="label flex flex-col items-start space-y-2">
//                   <span className="label-text text-gray-300">Tags</span>
//                   <select
//                     {...register('tags')}
//                     className={`select w-full bg-[#2a2a3d] text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.tags && 'border-red-500'}`}
//                   >
//                     <option value='array'>Array</option>
//                     <option value="linklist">Linked List</option>
//                     <option value="dp">Dynamic Programming</option>
//                     <option value="graph">Graph</option>
//                     <option value="tree">Tree</option>
//                   </select>
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Test Cases */}
//         <div className="bg-[#1c1c2b]/70 backdrop-blur-md rounded-2xl p-8 shadow-[0_0_20px_rgba(59,130,246,0.15)] border border-gray-700">
//           <h2 className="text-2xl font-semibold mb-6 text-blue-300">Test Cases</h2>

//           {/* Visible Test Cases */}
//           <div className="space-y-4 mb-8">
//             <div className="flex justify-between items-center">
//               <h3 className="font-medium text-gray-200">Visible Test Cases</h3>
//               <button
//                 type="button"
//                 onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
//                 className="btn btn-sm bg-gradient-to-r from-purple-600 to-blue-600 border-none text-white hover:opacity-90 transition"
//               >
//                 + Add Visible Case
//               </button>
//             </div>

//             {Visiblefields.map((field, index) => (
//               <div key={field.id} className="border border-gray-700 bg-[#2a2a3d] p-5 rounded-lg space-y-3">
//                 <div className="flex justify-end">
//                   <button type="button" onClick={() => removeVisible(index)} className="btn btn-xs bg-red-500 border-none hover:bg-red-600">Remove</button>
//                 </div>
//                 <input {...register(`visibiletastcase.${index}.input`)} placeholder="Input" className="input input-bordered w-full bg-[#1e1e2f] text-gray-100 border-gray-600" />
//                 <input {...register(`visibiletastcase.${index}.output`)} placeholder="Output" className="input input-bordered w-full bg-[#1e1e2f] text-gray-100 border-gray-600" />
//                 <textarea {...register(`visibiletastcase.${index}.explanation`)} placeholder="Explanation" className="textarea textarea-bordered w-full bg-[#1e1e2f] text-gray-100 border-gray-600" />
//               </div>
//             ))}
//           </div>

//           {/* Hidden Test Cases */}
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h3 className="font-medium text-gray-200">Hidden Test Cases</h3>
//               <button
//                 type="button"
//                 onClick={() => appendhidden({ input: '', output: '' })}
//                 className="btn btn-sm bg-gradient-to-r from-blue-600 to-teal-600 border-none text-white hover:opacity-90 transition"
//               >
//                 + Add Hidden Case
//               </button>
//             </div>

//             {hiddenfields.map((field, index) => (
//               <div key={field.id} className="border border-gray-700 bg-[#2a2a3d] p-5 rounded-lg space-y-3">
//                 <div className="flex justify-end">
//                   <button type="button" onClick={() => removehidden(index)} className="btn btn-xs bg-red-500 border-none hover:bg-red-600">Remove</button>
//                 </div>
//                 <input {...register(`hiddentastcase.${index}.input`)} placeholder="Input" className="input input-bordered w-full bg-[#1e1e2f] text-gray-100 border-gray-600" />
//                 <input {...register(`hiddentastcase.${index}.output`)} placeholder="Output" className="input input-bordered w-full bg-[#1e1e2f] text-gray-100 border-gray-600" />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Code Templates */}
//         <div className="bg-[#1c1c2b]/70 backdrop-blur-md rounded-2xl p-8 shadow-[0_0_20px_rgba(139,92,246,0.15)] border border-gray-700">
//           <h2 className="text-2xl font-semibold mb-6 text-purple-300">Code Templates</h2>
//           <div className="space-y-8">
//             {[0, 1, 2].map((index) => (
//               <div key={index} className="space-y-3">
//                 <h3 className="font-medium text-blue-300">
//                   {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
//                 </h3>

//                 {/* Initial Code */}
//                 <div className="form-control">
//                   <label className="label flex flex-col items-start space-y-2">
//                     <span className="label-text text-gray-300">Initial Code</span>
//                     <textarea
//                       {...register(`startcode.${index}.initialcode`)}
//                       className="w-full bg-[#1e1e2f] text-gray-100 border border-gray-700 rounded-lg p-3 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
//                       rows={5}
//                     />
//                   </label>
//                 </div>

//                 {/* Reference Solution */}
//                 <div className="form-control">
//                   <label className="label flex flex-col items-start space-y-2">
//                     <span className="label-text text-gray-300">Reference Solution</span>
//                     <textarea
//                       {...register(`referencesol.${index}.completeCode`)}
//                       className="w-full bg-[#1e1e2f] text-gray-100 border border-gray-700 rounded-lg p-3 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       rows={5}
//                     />
//                   </label>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="btn w-full py-3 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 text-white text-lg font-semibold rounded-full shadow-lg hover:opacity-90 transition-all"
//         >
//           🚀 Create Problem
//         </button>
//       </form>
//     </div>
//   </div>
// ); -->
