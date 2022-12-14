import axios from 'axios';
import React,{useState} from 'react';
import { useParams, useNavigate } from "react-router-dom";

export const Login = () => {
    let navigate = useNavigate();
    const [user, setuser] = useState({
        email:"",
        password:""
    });
    const handleChange=(e)=>{
        let newUser={...user };
        newUser[e.target.name]=e.target.value;
        setuser(newUser)

    };
    const handleSubmit=async ()=>{
       let users=await getAllUsers();
          if(users.length == 0){
              alert("you are not register...please register and login again")
          }else{
              let loggedInUser=users.find((myUser)=>user.email==myUser.email && user.password==myUser.password)
              if(loggedInUser){
                localStorage.setItem("loggedInUser",JSON.stringify(loggedInUser))
                navigate("/");
               
              }else{
                alert("you are not register...please register and login again");
                navigate("/register")
              }
          }
         
    };
    const getAllUsers=()=>{
        return new Promise((resolve,reject)=>{
            axios.get("http://localhost:3000/users").then((res)=>{
                resolve(res.data);
            });
        });
    };
    return <div>
        <form>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">
                    Email address
                </label>
                <input
                    type="email"
                    class="form-control"
                    value={user.email}
                    name="email"
                    onChange={(e)=>{handleChange(e)}}
                   
                />

            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">
                    Password
                </label>
                <input
                    type="password"
                    class="form-control"
                    value={user.password}
                    name='password'
                    onChange={(e)=>{
                        handleChange(e);
                    }}
                />
            </div>

            <button type="button" class="btn btn-primary" onClick={handleSubmit}>
                Submit
            </button>
        </form>
    </div>;
};
