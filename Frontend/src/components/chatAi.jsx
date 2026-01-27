import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axiosClient from '../utils/axios'
import { Send } from "lucide-react";

export default function ChatAi({problem}) {
    const [message , setmessage] = useState([
        {role: 'model', content : 'hi, how are you' },
        {role: 'user', content: 'hi, I am fine'}
    ])

    const {register , handleSubmit, reset, formState: {errors} } = useForm();
    const Endmessageref = useRef(null)

    useEffect(()=>{
        Endmessageref.current?.scrollIntoView({behavior : 'smooth'})
    },[message])

    const onSubmit = async (data) => {
        setmessage( (prev) => [...prev ,{role: 'user', content: data.message}])
        reset();

        try{
            const response = await axiosClient.post('/chat/ai', {
                message: data.message ,
                title: problem?.title,
                description: problem?.description,
                startcode: problem?.startcode,
                visibiletastcase: problem?.visibiletastcase
            });

            setmessage((prev) => [...prev, {
                role: 'model',
                content: response.data.message || response.data.content
            }])
        }
        catch(error){
            console.error('error occured');
            setmessage((prev) => [...prev, {
                role:'model',
                content: error || 'sorry , i encounterd an error'
            }])
        }
    }

    return(
        <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {message.map((msg, index) => (
                <div key={index}
                className={`chat ${msg.role === 'user' ? "chat-end" : "chat-start"}`}
                >
                  <div className="chat-bubble text-base-content bg-base-200">
                    {msg.content}
                  </div>
                </div>
            ))}
            <div ref={Endmessageref}/>

          </div>

            <form onSubmit={handleSubmit(onSubmit)}
            className="sticky bottom-0 p-4 bg-base-100 border-t"
            >
               <div className="flex items-center">

                  <input 
                  placeholder="Ask me anything"
                  className="input input-bordered flex-1"
                  {...register("message", {required: true, minLength: 2})}
                />
                <button type="submit" className="btn btn-ghost ml-2" disabled = {errors.message} >
                   <Send size={20}></Send>
                </button>
            
               </div>
            </form>

        </div>
    );
}