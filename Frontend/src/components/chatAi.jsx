import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axiosClient from '../utils/axios'
import { Send } from "lucide-react";

function chatAi({problem}){
    const [msg , setmsg] = useState([
        {role: 'model', content : 'hi, how are you' },
        {role: 'user', content: 'hi, I am fine'}
    ])

    const {register , handleSbumit, reset, formState: {error} } = useForm;
    const Endmessageref = useRef(null)

    useEffect(()=>{
        Endmessageref.current?.scrollIntoview({behavior : 'smooth'})
    },[msg])
}