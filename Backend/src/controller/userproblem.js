const Problem = require('../models/problem')
const User = require('../models/user')
const submissions = require('../models/submission')
const {getlanguageId, batchsubmission,submitToken} = require('../utils/problemutil')

const creatPorblem = async (req,res)=>{
    console.log("submit_result")
    
    const {title,description,diffuclty,tags,
    visibiletastcase,hiddentastcase,
    startcode,referencesol,probcreater} = req.body

    try{

        for(const {language,completeCode} of referencesol){

            const languageId = getlanguageId(language)

            //creating batch submission
            const submissions = visibiletastcase.map((tastcase)=>({
                source_code: completeCode,
                language_id: languageId,
                stdin: tastcase.input,
                expected_output: tastcase.output
            }))

            //give the batch to judge0
            const submit_result = await batchsubmission(submissions)
            // console.log(submission)


            //make array of tokens given by batchsubmission(submit_result)
            const result_Token = submit_result.map((vlaue)=> vlaue.token)

            const test_Result = await submitToken(result_Token)

            for(const test of test_Result){
                
                if(test.status_id !=3)
                    res.send('Error occured')
            }

        }

        const userproblem = await Problem.create({
            ...req.body,
            probcreater:req.result._id
        })
        res.send("problem created")
    }
    catch(err){
        res.send('Error'+err.message)
    }
}

const updateproblem = async (req,res)=>{
    const {id} = req.params
    const {title,diffuclty,tags,description,
        visibiletastcase,hiddentastcase,
        referencesol,startcode} = req.body

        try{

            if(!id)
                res.send("id is missing")

            const dsaproblem = await Problem.findById(id)
            if(!dsaproblem)
                res.send("problem not exist")

            for(const {language,completeCode} of referencesol){

                const languageId = await getlanguageId(language)

                const submissions = visibiletastcase.map((testcases)=>({
                    source_code:completeCode,
                    language_id: languageId,
                    stdin:testcases.input,
                    expected_output:testcases.output
                }))

                const submit_result = await batchsubmission(submissions)

                const result_Token = await submit_result.map(value => value.token)

                const test_Result = await submitToken(result_Token)

                for(const test of test_Result){
                    if(test.status_id!= 3)
                        return res.send('error occured')
                }
            }

            const update = await Problem.findByIdAndUpdate(id, {...req.body}, {runValidators:true,new:true})

            res.status(200).send(update)
        }
        catch(err){
            res.status(500).send("ERROR"+err)
        }
}

const deleteproblem = async (req,res)=>{
    const {id} = req.params

    try{
        if(!id)
            res.send('id is missing')

        const deleteP = await Problem.findByIdAndDelete(id)

        if(!deleteP)
            res.send('problm not exist')

        res.send('problem deleted')
    }
    catch(error){
        res.send('Error'+error)
    }
}

const getproblembyid = async (req,res)=>{
    const {id} = req.params

    try{
        if(!id)
            res.send("id is missing")
        
        const Dsaproblem = await Problem.findById(id).select('-hiddentastcase -probcreater -createdAt -updatedAt -__v')

        if(!Dsaproblem)
            res.send('problem is not available')

        res.send(Dsaproblem)
    }
    catch(error){
        res.send('error '+error)
    }
}

const getallproblem = async (req,res)=>{
    try{
        const problems = await Problem.find({}).select('_id title diffuclty tags')

        if(problems.length==0)
            res.send('no problems')

        res.send(problems)
    }
    catch(error){
        res.send("error "+error)
    }
}

const allsolvedproblem = async (req,res)=>{
    try{
        //add how many problems user solved
        // const count = req.result.problemsolved.length
        // res.status(200).send(count)

        const userId = req.result._id 
        // const user = await User.findById(userId).populate('problemsolved') //this give wholw problme./
        const user = await User.findById(userId).populate({
            path:'problemsolved',
            select:'_id title tags diffuclty'
        })

        res.status(200).send(user.problemsolved)
    }
    catch(err){
        res.status(500).send('Error'+err)
    }
}

const submissionofprob = async (req,res) =>{
    try{
        const userId = req.result._id
        const problemId = req.params.pid

        // console.log(userId,problemId)

        const ans = await submissions.find({userId,problemId})
        // console.log(ans)

        if(ans.length === 0)
            res.status(200).send('submissions is not present')

        res.status(200).send(ans)
    }
    catch(err){
        res.status(500).send('Internal server error'+err)
    }
}

module.exports = {creatPorblem,updateproblem,deleteproblem,getproblembyid,getallproblem,allsolvedproblem,submissionofprob}