import { useState, useEffect, useRef } from "react";
import axiosClient from "../utils/axios";
import { useForm } from "react-hook-form";
import { Editor } from "@monaco-editor/react";
import { useParams } from "react-router";
import SubmissionHistory from "../components/submissionhis";
import ChatAi from "../components/chatAi";


const ProblemPage = ()=>{
    
    const [problem , setProblem] = useState(null);
    const [selectedLanguage , setSelectedLanguage] = useState('javascript');
    const [loading , setLoading] = useState(false);
    const [code, setcode] = useState('');
    const [runresult , setRunResult] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);
    const [activeLeftTab , setActiveLeftTab] = useState('description');
    const [activeRightTab, setActiveRightTab] = useState('code');
    const editorRef = useRef(null);

    let {problemid} = useParams();
    const {handleSubmit} = useForm();
    // console.log(problemid)

    //fetch Problem Data
    useEffect(()=>{
        const fetchproblem = async ()=>{
            setLoading(true)

            try{
                
                const response = await axiosClient.get(`/admin/getproblem/${problemid}`)
                console.log(response.data)
                const initialcode = await response.data.startcode.find((sc)=>{
                    if(sc.language == 'C++' && selectedLanguage == 'cpp')
                        return true
                    else if(sc.language == 'Java' && selectedLanguage == 'java')
                        return true
                    else if(sc.language == 'Javascript' && selectedLanguage == 'javascript')
                        return true;
    
                    return false;
                })?.initialcode || 'hello'

                setProblem(response.data)

                setcode(initialcode)

                setLoading(false)
            }
            catch(error){
                console.error('error in fetch problem'+error.message)
                setLoading(false)
            }
        };

        fetchproblem();
    
    },[problemid])

    //update code when language is change 
    useEffect(()=>{
        if(problem){
            const initialCode = problem.startcode.find(sc => sc.language === selectedLanguage)?.initialCode || '';
            setcode(initialCode)
        }
    },[selectedLanguage, problem])

    const handleEditorChange = (value)=>{
        setcode(value || '')
    }

    const handleEditorDidMount = (editor)=>{
        editorRef.current = editor;
    }

    const handlelanguaheChange = (language)=>{
        setSelectedLanguage(language)
    }

    const handlerun = async () =>{
        setLoading(true)
        setRunResult(null)

        try{
            const response = await axiosClient.post(`/submission/run/${problemid}`,{
                code,
                language : selectedLanguage
            });

            setRunResult(response.data);
            setLoading(false);
            setActiveRightTab('testcase')

        }
        catch(error){
            console.error('error running code '+ error)
            setRunResult({
                success : false,
                error: 'internal server error'
            });
            setLoading(false)
            setActiveRightTab('testcase')
        }
    }

    const handlesubmitCode = async ()=>{
        setLoading(true)
        setSubmitResult(null)

        try{
            const response = await axiosClient.post(`/submission/submit/${problemid}`,{
                code: code,
                language: selectedLanguage
            });

            setSubmitResult(response.data)
            setLoading(false)
            setActiveRightTab('result')
        }
        catch(error){
            console.error('error in submitting code', code)
            setSubmitResult(null)
            setLoading(false)
            setActiveRightTab('result')
        }
    };

    const getLanguageForMonaco = (lan)=>{
        switch(lan){
            case 'javascript': return 'javascript';
            case 'cpp' : return 'cpp';
            case 'java': return 'java';
            default: return 'cpp' ;
        }
    };

    const getDifficultyColor = (diff) =>{
        switch(diff){
            case 'easy': return 'text-green-500';
            case 'medium': return 'text-yellow-500';
            case 'hard': return 'text-red-500';
            default : return 'text-gray-500'
        }
    }

    if(loading && !problem){
        return(
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-lg loading-spinner"></span>
            </div>
        )
    }


    return(
      <div className="h-screen flex bg-base-100">
        {/* left Panel */}
        <div className="w-1/2 flex flex-col border-r border-base-300">
          {/* left Tabs */}
          <div className="tabs tabs-bordered bg-base-200 px-4">
            <button 
            className={`tab ${activeLeftTab === 'description' ? 'tab-active' : ''}`}
            onClick={()=> setActiveLeftTab('description')}>
              Description  
            </button>

            <button className={`tab ${activeLeftTab === 'editorial' ? 'tab-active': ''}`}
            onClick={()=> setActiveLeftTab('editorial')}>
              Editorial
            </button>

            <button className={`tab ${activeLeftTab === 'submissions' ? 'tab-active': ''}`}
            onClick={()=> setActiveLeftTab('submissions')}>
              Submissions
            </button>

            <button className={`tab ${activeLeftTab === 'solution' ? 'tab-active': ''}`}
            onClick={()=> setActiveLeftTab('solution')}>
              Solutions
            </button> 

            <button className={`tab ${activeLeftTab === 'ChatAi' ? 'tab-active': ''}`}
            onClick={()=> setActiveLeftTab('ChatAi')}>
              AiBot
            </button> 

          </div>

          {/* Left Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {problem && (
              <>
              {activeLeftTab === 'description' && (
                <div>
                   <div className="flex items-center gap-4 mb-6">
                     <h1 className="text-2xl font-bold">{problem.title}</h1>
                     <div className={`badge badge-outline ${getDifficultyColor(problem.diffuclty)}`}>
                       {problem.diffuclty.charAt(0).toUpperCase() + problem.diffuclty.slice(1)}
                     </div>
                     <div className="badge badge-outline">{problem.tags}</div>
                   </div> 
                   <div className="prose max-w-none">
                     <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {problem.description}
                     </div>
                   </div>

                   <div className="mt-8">
                     <h3 className="text-lg font-semibold mb-4">Expamples:</h3>
                     <div className="space-y-4">
                       {problem.visibiletastcase.map((exmp, index)=>(
                        <div key={index} className="bg-base-200 p-4 rounded-lg">
                         <h4 className="font-semibold mb-2">Expample {index+1} :</h4>
                         <div><strong>Input: </strong>{exmp.input}</div>
                         <div><strong>Output: </strong>{exmp.output}</div>
                         <div><strong>Explanation: </strong>{exmp.explanation}</div>
                        </div>
                       ))}
                     </div>
                   </div>
                </div>
              )}

              {activeLeftTab === 'editorial' && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-4">Editorial</h2>  
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {'Editorial is here for the problem'}
                  </div>
                </div>
              )}

              {activeLeftTab === 'solution' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Solutions</h2>
                  <div className="space-y-6">
                    {problem.referencesol?.map((solution, index) => (
                      <div key={index} className="border border-base-300 rounded-lg">
                        <div className="bg-base-200 px-4 py-2 rounded-t-lg">
                          <h3 className="font-semibold">{problem?.title} - {solution?.language}</h3>
                        </div>
                        <div className="p-4">
                          <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
                            <code>{solution?.completeCode}</code>
                          </pre>
                        </div>
                      </div>
                    )) || <p className="text-gray-500">Solutions will be available after you solve the problem.</p>}
                  </div>
                </div>
              )}

              {activeLeftTab === 'submissions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">My Submissions</h2>
                  <div className="text-gray-500">
                    <SubmissionHistory problemId = {problemid}/>
                  </div>
                </div>
              )} 

              {activeLeftTab === 'ChatAi' && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-4">Chat With Ai</h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {/* <ChatAi></ChatAi> */}
                  </div>
                </div>
              )}
              </>  
            )}
          </div>
        </div>

        {/* RIGHT PANNEL */}
        <div className="w-1/2 flex flex-col">
          {/* Right tabs   */}
          <div className="tabs tabs-bordered bg-base-200 px-4">
            <button 
              className={`tab ${activeRightTab === 'code' ? 'tab-active' : ''}`}
              onClick={() => setActiveRightTab('code')}
            >
              Code
            </button>
            <button 
              className={`tab ${activeRightTab === 'testcase' ? 'tab-active' : ''}`}
              onClick={() => setActiveRightTab('testcase')}
            >
              Testcase
            </button>
            <button 
              className={`tab ${activeRightTab === 'result' ? 'tab-active' : ''}`}
              onClick={() => setActiveRightTab('result')}
            >
              Result
            </button>
          </div>

          {/* Right Contect */}
          <div className="flex-1 flex flex-col">
            {activeRightTab === 'code' && (
              <div className="flex-1 flex flex-col">
                {/* language selector */}
                <div className="flex justify-between items-center p-4 border-b border-base-300">
                  <div className="flex gap-2">
                    {['javascript', 'java', 'cpp'].map((lang)=>(
                      <button key={lang} 
                      className={`btn btn-sm ${selectedLanguage === lang? 'btn-primary': 'btn-ghost'}`}
                      onClick={() => handlelanguaheChange(lang)}>
                        {lang === 'cpp' ? 'C++': lang=== 'javascript' ? 'JavaScript' : 'Java'}
                        {/* {console.log(lang)} */}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Monoco Editor */}
                <div className="flex-1">
                  <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    renderLineHighlight: 'line',
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: 'line',
                    mouseWheelZoom: true,
                  }}                 
                  />  
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-base-300 flex justify-between">
                 <div className="flex gap-2">
                   <button
                   className="btn btn-ghost btn-sm"
                   onClick={()=> setActiveLeftTab('testcase')}>
                    Console
                   </button>
                 </div>
                <div className="flex gap-2">
                  <button
                    className={`btn btn-outline btn-sm ${loading ? 'loading' : ''}`}
                    onClick={handlerun}
                    disabled={loading}
                  >
                    Run
                  </button>
                  <button
                    className={`btn btn-primary btn-sm ${loading ? 'loading' : ''}`}
                    onClick={handlesubmitCode}
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>   
                </div>
              </div>
            )}

          {activeRightTab === 'testcase' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Test Results</h3>
              {runresult ? (
                <div className={`alert ${runresult.success ? 'alert-success' : 'alert-error'} mb-4`}>
                  <div>
                    {runresult.success ? (
                      <div>
                        <h4 className="font-bold">✅ All test cases passed!</h4>
                        <p className="text-sm mt-2">Runtime: {runresult.runtime+" sec"}</p>
                        <p className="text-sm">Memory: {runresult.memory+" KB"}</p>
                        
                        <div className="mt-4 space-y-2">
                          {runresult.TestcasesPass.map((tc, i) => (
                            <div key={i} className="bg-base-100 p-3 rounded text-xs">
                              <div className="font-mono">
                                <div><strong>Input:</strong> {tc.stdin}</div>
                                <div><strong>Expected:</strong> {tc.expected_output}</div>
                                <div><strong>Output:</strong> {tc.stdout}</div>
                                <div className={'text-green-600'}>
                                  {'✓ Passed'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold">❌ Error</h4>
                        <div className="mt-4 space-y-2">
                          {runresult.TestcasesPass.map((tc, i) => (
                            <div key={i} className="bg-base-100 p-3 rounded text-xs">
                              <div className="font-mono">
                                <div><strong>Input:</strong> {tc.stdin}</div>
                                <div><strong>Expected:</strong> {tc.expected_output}</div>
                                <div><strong>Output:</strong> {tc.stdout}</div>
                                <div className={tc.status_id==3 ? 'text-green-600' : 'text-red-600'}>
                                  {tc.status_id==3 ? '✓ Passed' : '✗ Failed'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  Click "Run" to test your code with the example test cases.
                </div>
              )}
            </div>
          )}

          {activeRightTab === 'result' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">submission Result</h3>
              {submitResult ? (
                <div className={`alert ${submitResult.accepted ? 'alert-success': 'alert-error'}`}>
                  <div>
                    {submitResult.accepted? (
                      <div>
                        <h4 className="font-bold text-lg">🎉 Accepted</h4>
                        <div className="mt-4 space-y-2">
                          <p>Test Cases Passed : {submitResult.passedcases} / {submitResult.TestcasesTotal}</p>
                          <p>Runtime: {submitResult.runtime +' sec'}</p>
                          <p>Memory: {submitResult.memory + "kb"}</p>
                        </div>
                      </div>
                    ):(
                      <div>
                        <h4 className="font-bold text-lg">❌ {submitResult.error}</h4>
                        <div className="mt-4 space-y-2">
                          <p>Test Cases Passed: {submitResult.passedcases} / {submitResult.TestcasesTotal}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ):(
                <div className="text-gray-500">
                  Click 'submit' to submit your solution for evaluation.
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    )

//     return (
//     <div className="h-screen flex relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
//         {/* Background effects */}
//         <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>

//         {/* left Panel */}
//         <div className="w-1/2 flex flex-col border-r border-gray-700 bg-gray-900/60 backdrop-blur-md">
//             {/* left Tabs */}
//             <div className="tabs bg-gray-800/80 border-b border-gray-700 px-4 pt-2">
//                 <button 
//                     className={`tab tab-bordered text-white transition-all duration-300 ${
//                         activeLeftTab === 'description' 
//                             ? 'tab-active text-indigo-400 border-indigo-400' 
//                             : 'border-gray-600 hover:text-indigo-300'
//                     }`}
//                     onClick={()=> setActiveLeftTab('description')}
//                 >
//                     📝 Description  
//                 </button>

//                 <button className={`tab tab-bordered text-white transition-all duration-300 ${
//                         activeLeftTab === 'editorial' 
//                             ? 'tab-active text-indigo-400 border-indigo-400' 
//                             : 'border-gray-600 hover:text-indigo-300'
//                     }`}
//                     onClick={()=> setActiveLeftTab('editorial')}
//                 >
//                     📖 Editorial
//                 </button>

//                 <button className={`tab tab-bordered text-white transition-all duration-300 ${
//                         activeLeftTab === 'submissions' 
//                             ? 'tab-active text-indigo-400 border-indigo-400' 
//                             : 'border-gray-600 hover:text-indigo-300'
//                     }`}
//                     onClick={()=> setActiveLeftTab('submissions')}
//                 >
//                     📋 Submissions
//                 </button>

//                 <button className={`tab tab-bordered text-white transition-all duration-300 ${
//                         activeLeftTab === 'solution' 
//                             ? 'tab-active text-indigo-400 border-indigo-400' 
//                             : 'border-gray-600 hover:text-indigo-300'
//                     }`}
//                     onClick={()=> setActiveLeftTab('solution')}
//                 >
//                     💡 Solutions
//                 </button>            
//             </div>

//             {/* Left Content */}
//             <div className="flex-1 overflow-y-auto p-6">
//                 {problem && (
//                     <>
//                         {activeLeftTab === 'description' && (
//                             <div>
//                                 <div className="flex items-center gap-4 mb-6">
//                                     <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
//                                     <div className={`badge px-4 py-3 font-bold text-white border-0 shadow-lg ${getDifficultyColor(problem.diffuclty)}`}>
//                                         {problem.diffuclty === 'easy' && '🟢 '}
//                                         {problem.diffuclty === 'medium' && '🟡 '}
//                                         {problem.diffuclty === 'hard' && '🔴 '}
//                                         {problem.diffuclty.charAt(0).toUpperCase() + problem.diffuclty.slice(1)}
//                                     </div>
//                                     <div className="badge badge-info px-4 py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-600 border-0 shadow-lg">
//                                         🏷️ {problem.tags}
//                                     </div>
//                                 </div> 
//                                 <div className="prose max-w-none">
//                                     <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
//                                         {problem.description}
//                                     </div>
//                                 </div>

//                                 <div className="mt-8">
//                                     <h3 className="text-lg font-semibold mb-4 text-white">📚 Examples:</h3>
//                                     <div className="space-y-4">
//                                         {problem.visibiletastcase.map((exmp, index)=>(
//                                             <div key={index} className="bg-gray-800/60 backdrop-blur-md border border-gray-700 p-4 rounded-xl shadow-lg">
//                                                 <h4 className="font-semibold mb-2 text-indigo-400">Example {index+1}:</h4>
//                                                 <div className="text-gray-300"><strong>Input: </strong>{exmp.input}</div>
//                                                 <div className="text-gray-300"><strong>Output: </strong>{exmp.output}</div>
//                                                 <div className="text-gray-300"><strong>Explanation: </strong>{exmp.explanation}</div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {activeLeftTab === 'editorial' && (
//                             <div className="prose max-w-none">
//                                 <h2 className="text-xl font-bold mb-4 text-white">📖 Editorial</h2>  
//                                 <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
//                                     {'Editorial is here for the problem'}
//                                 </div>
//                             </div>
//                         )}

//                         {activeLeftTab === 'solution' && (
//                             <div>
//                                 <h2 className="text-xl font-bold mb-4 text-white">💡 Solutions</h2>
//                                 <div className="space-y-6">
//                                     {problem.referencesol?.map((solution, index) => (
//                                         <div key={index} className="border border-gray-700 rounded-xl bg-gray-800/60 backdrop-blur-md shadow-lg">
//                                             <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-4 py-3 rounded-t-xl">
//                                                 <h3 className="font-semibold text-white">{problem?.title} - {solution?.language}</h3>
//                                             </div>
//                                             <div className="p-4">
//                                                 <pre className="bg-gray-900 p-4 rounded-lg text-gray-300 text-sm overflow-x-auto border border-gray-700">
//                                                     <code>{solution?.completeCode}</code>
//                                                 </pre>
//                                             </div>
//                                         </div>
//                                     )) || <p className="text-gray-400">🔒 Solutions will be available after you solve the problem.</p>}
//                                 </div>
//                             </div>
//                         )}

//                         {activeLeftTab === 'submissions' && (
//                             <div>
//                                 <h2 className="text-xl font-bold mb-4 text-white">📋 My Submissions</h2>
//                                 <div className="text-gray-400">
//                                     📊 Your submission history will appear here.
//                                 </div>
//                             </div>
//                         )} 
//                     </>  
//                 )}
//             </div>
//         </div>

//         {/* RIGHT PANNEL */}
//         <div className="w-1/2 flex flex-col bg-gray-900/60 backdrop-blur-md">
//             {/* Right tabs   */}
//             <div className="tabs bg-gray-800/80 border-b border-gray-700 px-4 pt-2">
//                 <button 
//                     className={`tab tab-bordered text-white transition-all duration-300 ${
//                         activeRightTab === 'code' 
//                             ? 'tab-active text-indigo-400 border-indigo-400' 
//                             : 'border-gray-600 hover:text-indigo-300'
//                     }`}
//                     onClick={() => setActiveRightTab('code')}
//                 >
//                     💻 Code
//                 </button>
//                 <button 
//                     className={`tab tab-bordered text-white transition-all duration-300 ${
//                         activeRightTab === 'testcase' 
//                             ? 'tab-active text-indigo-400 border-indigo-400' 
//                             : 'border-gray-600 hover:text-indigo-300'
//                     }`}
//                     onClick={() => setActiveRightTab('testcase')}
//                 >
//                     🧪 Testcase
//                 </button>
//                 <button 
//                     className={`tab tab-bordered text-white transition-all duration-300 ${
//                         activeRightTab === 'result' 
//                             ? 'tab-active text-indigo-400 border-indigo-400' 
//                             : 'border-gray-600 hover:text-indigo-300'
//                     }`}
//                     onClick={() => setActiveRightTab('result')}
//                 >
//                     📊 Result
//                 </button>
//             </div>

//             {/* Right Contect */}
//             <div className="flex-1 flex flex-col">
//                 {activeRightTab === 'code' && (
//                     <div className="flex-1 flex flex-col">
//                         {/* language selector */}
//                         <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800/40">
//                             <div className="flex gap-2">
//                                 {['javascript', 'java', 'cpp'].map((lang)=>(
//                                     <button key={lang} 
//                                         className={`btn px-4 py-2 font-semibold transition-all duration-300 ${
//                                             selectedLanguage === lang 
//                                                 ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg border-0 transform -translate-y-0.5' 
//                                                 : 'bg-gray-700/80 text-gray-300 border-gray-600 hover:bg-gray-600/80'
//                                         }`}
//                                         onClick={() => handlelanguaheChange(lang)}
//                                     >
//                                         {lang === 'cpp' ? 'C++' : lang=== 'javascript' ? 'JavaScript' : 'Java'}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Monaco Editor */}
//                         <div className="flex-1">
//                             <Editor
//                                 height="100%"
//                                 language={getLanguageForMonaco(selectedLanguage)}
//                                 value={code}
//                                 onChange={handleEditorChange}
//                                 onMount={handleEditorDidMount}
//                                 theme="vs-dark"
//                                 options={{
//                                     fontSize: 14,
//                                     minimap: { enabled: false },
//                                     scrollBeyondLastLine: false,
//                                     automaticLayout: true,
//                                     tabSize: 2,
//                                     insertSpaces: true,
//                                     wordWrap: 'on',
//                                     lineNumbers: 'on',
//                                     glyphMargin: false,
//                                     folding: true,
//                                     lineDecorationsWidth: 10,
//                                     lineNumbersMinChars: 3,
//                                     renderLineHighlight: 'line',
//                                     selectOnLineNumbers: true,
//                                     roundedSelection: false,
//                                     readOnly: false,
//                                     cursorStyle: 'line',
//                                     mouseWheelZoom: true,
//                                 }}                 
//                             />  
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="p-4 border-t border-gray-700 flex justify-between bg-gray-800/40">
//                             <div className="flex gap-2">
//                                 <button
//                                     className="btn bg-gray-700/80 border-gray-600 text-gray-300 hover:bg-gray-600/80 hover:text-white transition-all duration-300"
//                                     onClick={()=> setActiveRightTab('testcase')}
//                                 >
//                                     🖥️ Console
//                                 </button>
//                             </div>
//                             <div className="flex gap-2">
//                                 <button
//                                     className={`btn px-6 py-2 font-semibold border-gray-600 transition-all duration-300 ${
//                                         loading 
//                                             ? 'loading bg-gray-600 text-gray-400' 
//                                             : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-lg hover:shadow-amber-500/30 transform hover:-translate-y-0.5'
//                                     }`}
//                                     onClick={handlerun}
//                                     disabled={loading}
//                                 >
//                                     🚀 Run
//                                 </button>
//                                 <button
//                                     className={`btn px-6 py-2 font-semibold border-0 transition-all duration-300 ${
//                                         loading 
//                                             ? 'loading bg-gray-600 text-gray-400' 
//                                             : 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:from-indigo-400 hover:to-cyan-400 shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5'
//                                     }`}
//                                     onClick={handlesubmitCode}
//                                     disabled={loading}
//                                 >
//                                     📨 Submit
//                                 </button>
//                             </div>   
//                         </div>
//                     </div>
//                 )}

//                 {activeRightTab === 'testcase' && (
//                     <div className="flex-1 p-4 overflow-y-auto bg-gray-800/20">
//                         <h3 className="font-semibold mb-4 text-white text-lg">🧪 Test Results</h3>
//                         {runresult ? (
//                             <div className={`p-6 rounded-xl border shadow-lg backdrop-blur-md ${
//                                 runresult.success 
//                                     ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30' 
//                                     : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30'
//                             }`}>
//                                 <div>
//                                     {runresult.success ? (
//                                         <div>
//                                             <h4 className="font-bold text-white text-xl mb-4">✅ All test cases passed!</h4>
//                                             <div className="flex gap-6 mb-4">
//                                                 <div className="bg-gray-800/60 px-4 py-2 rounded-lg">
//                                                     <p className="text-gray-300 text-sm">Runtime</p>
//                                                     <p className="text-white font-bold">{runresult.runtime} sec</p>
//                                                 </div>
//                                                 <div className="bg-gray-800/60 px-4 py-2 rounded-lg">
//                                                     <p className="text-gray-300 text-sm">Memory</p>
//                                                     <p className="text-white font-bold">{runresult.memory} KB</p>
//                                                 </div>
//                                             </div>
                                            
//                                             <div className="mt-4 space-y-2">
//                                                 {runresult.TestcasesPass.map((tc, i) => (
//                                                     <div key={i} className="bg-gray-800/60 p-4 rounded-lg border border-gray-700">
//                                                         <div className="font-mono text-sm">
//                                                             <div className="text-gray-300"><strong>Input:</strong> {tc.stdin}</div>
//                                                             <div className="text-gray-300"><strong>Expected:</strong> {tc.expected_output}</div>
//                                                             <div className="text-gray-300"><strong>Output:</strong> {tc.stdout}</div>
//                                                             <div className="text-green-400 font-semibold">
//                                                                 {'✓ Passed'}
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <div>
//                                             <h4 className="font-bold text-white text-xl mb-4">❌ Error</h4>
//                                             <div className="mt-4 space-y-2">
//                                                 {runresult.TestcasesPass.map((tc, i) => (
//                                                     <div key={i} className="bg-gray-800/60 p-4 rounded-lg border border-gray-700">
//                                                         <div className="font-mono text-sm">
//                                                             <div className="text-gray-300"><strong>Input:</strong> {tc.stdin}</div>
//                                                             <div className="text-gray-300"><strong>Expected:</strong> {tc.expected_output}</div>
//                                                             <div className="text-gray-300"><strong>Output:</strong> {tc.stdout}</div>
//                                                             <div className={tc.status_id==3 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
//                                                                 {tc.status_id==3 ? '✓ Passed' : '✗ Failed'}
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="text-gray-400 bg-gray-800/40 p-6 rounded-xl border border-gray-700 text-center">
//                                 🎯 Click "Run" to test your code with the example test cases.
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {activeRightTab === 'result' && (
//                     <div className="flex-1 p-4 overflow-y-auto bg-gray-800/20">
//                         <h3 className="font-semibold mb-4 text-white text-lg">📊 Submission Result</h3>
//                         {submitResult ? (
//                             <div className={`p-6 rounded-xl border shadow-lg backdrop-blur-md ${
//                                 submitResult.accepted 
//                                     ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30' 
//                                     : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30'
//                             }`}>
//                                 <div>
//                                     {submitResult.accepted? (
//                                         <div>
//                                             <h4 className="font-bold text-white text-xl mb-4">🎉 Accepted</h4>
//                                             <div className="grid grid-cols-3 gap-4 mb-4">
//                                                 <div className="bg-gray-800/60 px-4 py-3 rounded-lg text-center">
//                                                     <p className="text-gray-300 text-sm">Test Cases</p>
//                                                     <p className="text-white font-bold">{submitResult.passedcases} / {submitResult.TestcasesTotal}</p>
//                                                 </div>
//                                                 <div className="bg-gray-800/60 px-4 py-3 rounded-lg text-center">
//                                                     <p className="text-gray-300 text-sm">Runtime</p>
//                                                     <p className="text-white font-bold">{submitResult.runtime} sec</p>
//                                                 </div>
//                                                 <div className="bg-gray-800/60 px-4 py-3 rounded-lg text-center">
//                                                     <p className="text-gray-300 text-sm">Memory</p>
//                                                     <p className="text-white font-bold">{submitResult.memory} KB</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ):(
//                                         <div>
//                                             <h4 className="font-bold text-white text-xl mb-4">❌ {submitResult.error}</h4>
//                                             <div className="bg-gray-800/60 px-4 py-3 rounded-lg text-center max-w-xs">
//                                                 <p className="text-gray-300 text-sm">Test Cases Passed</p>
//                                                 <p className="text-white font-bold">{submitResult.passedcases} / {submitResult.TestcasesTotal}</p>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ):(
//                             <div className="text-gray-400 bg-gray-800/40 p-6 rounded-xl border border-gray-700 text-center">
//                                 📨 Click 'Submit' to submit your solution for evaluation.
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     </div>
// )
}

export default ProblemPage