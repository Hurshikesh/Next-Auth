'use client'
import React,{useEffect, useState} from 'react'
import axios from 'axios'
import {toast} from "react-hot-toast"
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage(){
    const router = useRouter()

    const[user,setUser] = useState({
        email:"",
        password:"",
    })

    const[buttonDisabled,setButtonDisabled] = useState(false)
    const[loading,setLoading] = useState(false)

    const onLogin = async () =>{
        try {
            setLoading(true)
            const response = await axios.post("/api/users/login",user)
            console.log("Login successs",response.data)
            router.push('/profile')
        } catch (error:any) {
            console.log("signup failed");
            toast.error(error.messsage)
        }
    }

    useEffect(()=>{
        if(user.email.length>0 && user.password.length>0){
            setButtonDisabled(false)
        }else{
            setButtonDisabled(true)
        }
    },[user])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
    <h1>{loading?"processing" : "Login"}</h1>
    <hr />
        <input
    className='p-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black' 
    id='email'
    value={user.email}
    onChange={(e)=> setUser({...user,email:e.target.value})}
    placeholder='email'
    type='email' />
        <input
    className='p-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black' 
    id='password'
    value={user.password}
    onChange={(e)=> setUser({...user,password:e.target.value})}
    placeholder='password'
    type='password' />
    <button onClick={onLogin} className='p-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'>
        {buttonDisabled ? "No Login" : "Login"}
    </button>
    <Link href="/Signup">visit Signup page</Link>
    </div>
  )
}
