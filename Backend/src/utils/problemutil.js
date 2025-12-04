const axios = require('axios')

const getlanguageId = (lang)=>{
    const language = {
        "c++": 54,
        "java":62,
        "javascript":63
    }

    return language[lang.toLowerCase()]
}


const batchsubmission = async (submissions)=>{

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': 'eb2ae9e987msh651646b46d43907p12846ejsn90b0e4bce3a8',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
   submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		// console.error(error);
    return error
	}
}
 return await fetchData();
}


const waiting = async(timer)=>{
  setTimeout(()=>{
    return 1;
  },timer);
}



const submitToken = async (result_Token)=>{

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: result_Token.join(","),
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': 'eb2ae9e987msh651646b46d43907p12846ejsn90b0e4bce3a8',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} 
  catch (error) {
	    console.error("error is"+error);
	}
}



while(true){
  
    const result = await fetchData();
    
    const isObtained = result.submissions.every((r)=>r.status_id>2)
    
    if(isObtained){
      return result.submissions
    }
      await waiting(1000)

}

}


module.exports = {getlanguageId,batchsubmission, submitToken}