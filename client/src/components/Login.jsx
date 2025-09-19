import { useState } from "react";

export default function Login(){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()

    };
    
    return(
        <form onSubmit={handleSubmit}>
            <label>
                Username: 
                <input type="text" value = {username} onChange = {(e)=> setUsername(e.target.value)}/>
            </label>
            <label>
                Password:
                <input type="text" value = {password} onChange={(e)=> setPassword(e.target.value)}/>
            </label>
            <input type="submit" value="Submit"/>
        </form>
    )
}