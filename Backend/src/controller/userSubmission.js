const Problem = require('../models/problem')
const Submission = require('../models/submission')
const { getlanguageId, batchsubmission, submitToken } = require('../utils/problemutil')


const submitedcode = async (req,res)=>{

    try{
        //check the feilds
        const userId = req.result._id
        const problemId= req.params.id

        const {code, language} = req.body

        if(!userId || !problemId || !code || !language)
            res.status(400).send('some feids are missing')

        //fetch the problem from database 
        const dsaproblem =await Problem.findById(problemId)

        //create the submission in database (update it latter when user submit his code)
        const submittedCode = await Submission.create({
            userId,problemId,
            code,
            language,
            status:'pending',
            totletestcases: dsaproblem.hiddentastcase.length
        })

        //now submit user sol. code to judge0
        const languageId = getlanguageId(language)

        const submissions = dsaproblem.hiddentastcase.map((testcases)=>({
            source_code: code,
            language_id: languageId,
            stdin: testcases.input,
            expected_output: testcases.output
        }))

        const submit_result = await batchsubmission(submissions)

        const result_Token = await submit_result.map(value => value.token)

        const test_Result = await submitToken(result_Token)

        //now database ke sumission ko update karna hai
        //first add remaining feilds

        let runtime = 0
        let memory =0
        let errorMessage = null
        let TestcasesPass = 0
        let status = 'accepted'

        for(const test of test_Result){
            if(test.status_id ==3){
                TestcasesPass++;
                runtime = runtime + parseFloat(test.time);
                memory = Math.max(memory,test.memory);
            }
            else{
                if(test.status_id==4){
                    status = 'error'
                    errorMessage = test.stderr
                }
                else{
                    status ='wrong';
                    errorMessage = test.stderr
                }
            }
        }

        //store the remain updated submission in database
        submittedCode.status = status;
        submittedCode.runtime = runtime;
        submittedCode.memory = memory;
        submittedCode.TestcasesPass= TestcasesPass;
        submittedCode.errorMessage = errorMessage;

        await submittedCode.save()

        //now insert the solved problem to the user profile
        if(!req.result.problemsolved.includes(problemId))
            req.result.problemsolved.push(problemId)

        await req.result.save()

        // res.status(200).send('code submited') //here change in backend

        const accepted = (status == 'accepted')
        res.status(201).json({
            accepted,
            runtime,
            memory,
            passedcases : TestcasesPass,
            TestcasesTotal: submit_result.totletestcases
        })

    }
    catch(error){
        res.status(500).send('Error'+error)
    }
}

const runcode = async(req,res)=>{
    try{

        const userId = req.result._id
        const problemId= req.params.id

        const {code, language} = req.body

        if(!userId || !problemId || !code || !language)
            return res.status(400).json({success: false, error: 'some fields are missing'})

        //fetch the problem from database 
        const dsaproblem = await Problem.findById(problemId)
        if(!dsaproblem)
            return res.status(404).json({success: false, error: 'problem not found'})

        //now submit user sol. code to judge0
        const languageId = getlanguageId(language)
        if(!languageId)
            return res.status(400).json({success: false, error: 'unsupported language'})

        const submissions = dsaproblem.visibiletastcase.map((testcases)=>({
            source_code: code,
            language_id: languageId,
            stdin: testcases.input,
            expected_output: testcases.output
        }))
        
        const submit_result = await batchsubmission(submissions)
        if(!submit_result || !Array.isArray(submit_result))
            return res.status(500).json({success: false, error: 'judge server error'})

        const result_Token = submit_result.map(value => value.token)

        const test_Result = await submitToken(result_Token)

        // const final_result = await test_Result.map((ans)=>({
        //     status:ans.status.description
        // }))

        // res.status(201).send(final_result)

        let runtime = 0
        let memory = 0;
        let errorMessage = null;
        let status = true;
        let TestcasesPass = 0

        for(const test of test_Result){
            if(test.status_id ==3){
                TestcasesPass++;
                runtime = runtime + parseFloat(test.time);
                memory = Math.max(memory,test.memory);
            }
            else{
                status = false;
                if(test.status_id==4){
                    errorMessage = test.stderr
                }
                else{
                    errorMessage = test.stderr
                }
            }
        }

        res.status(201).json({
            memory,
            runtime,
            TestcasesPass : test_Result,
            success: status,
            passedCases: TestcasesPass,
            totalCases: test_Result.length,
            errorMessage: errorMessage
        })

    }
    catch(err){
        console.error('Error in runcode:', err)
        res.status(500).json({
            success: false,
            error: 'Server error',
            TestcasesPass: [],
            passedCases: 0,
            totalCases: 0,
            errorMessage: err.message || 'Unknown error'
        })
    }
}

module.exports = {submitedcode, runcode }