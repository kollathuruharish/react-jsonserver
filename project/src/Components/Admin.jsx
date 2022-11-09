import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Admin = () => {
    const [user, setuser] = useState({ email: "", password: "" });
    const [districts, setdistricts] = useState([]);
    const [isAdmin, setisAdmin] = useState(false);
    const [isADD, setisADD] = useState(false);
    const [isAddcont, setisAddcont] = useState(false);
    const [districtName, setdistrictName] = useState("");
    const [constiency, setconstiency] = useState("");

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if(isAdmin){
            setisAdmin(isAdmin);
        }else{
          setisAdmin(false)
        }
        
        getDistrictDetails()
    }, []);

    const handleChange = (e) => {
        let newUser = { ...user };
        newUser[e.target.name] = e.target.value;
        setuser(newUser);
    }
    const handleSubmit = async () => {
        let allAdmin = await getAdmin();
        let admin = allAdmin.find((ad) => ad.email == user.email)
        if (admin) {
            localStorage.setItem('isAdmin', true)
            setisAdmin(true)
        }
    }

    const getDistrictDetails = () => {
        axios.get("http://localhost:3000/districts").then((info) => {
            console.log(info.data);
            setdistricts(info.data)
        })
    }
    const getAdmin = () => {
        return new Promise((resolve, reject) => {
            axios.get("http://localhost:3000/admin").then((res) => {
                res.data.forEach((dist)=>{
                    dist.isAddcont=false
                })
                console.log(res.data);
                resolve(res.data);

            });
        });
    };

    const handleDelete = (dist) => {
        axios.delete("http://localhost:3000/districts/" + dist.id).then(() => {
            getDistrictDetails()
        })

    }
    const handleAddDistrict = () => {
        let constituencies = [];
        let newDistrict = {
            districtName,
            constituencies,
        };
        axios.post("http://localhost:3000/districts/", newDistrict).then(() => {
            setisADD(false)
            getDistrictDetails()
        })
    }
    const getconstituencies = (constituencies) => {
        console.log(constituencies);
        return <ul>
            {constituencies.map((con, i) => {
                return <li key={i}>{con}</li>
            })}
        </ul>
    }
    const handleAddConst=(district,i)=>{
        setconstiency("")
        let allDistricts=[...districts]
        let newDistrict={ ...district}
        newDistrict.isAddcont=true
        allDistricts[i]=newDistrict
        setdistricts(allDistricts)
    }
    const addConstituency=(dist)=>{
        dist.constituencies.push(constiency)
        axios.put("http://localhost:3000/districts/"+dist.id,dist).then(()=>{
            getDistrictDetails()
        })
    }
    return (
        <div>
            {!isAdmin ? <div>
                <form>
                    <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input type="email" className="form-control" name='email' value={user.email}
                            onChange={(e) => { handleChange(e) }} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" name='password' value={user.password}
                            onChange={(e) => { handleChange(e) }} />
                    </div>

                    <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                </form>
            </div> : <div>
                <h2>Admin Area</h2>
                <button className='btn btn-primary' onClick={() => { setisADD(!isADD) }}>Add District</button>

                <br />

                {isADD && <form>
                    <label htmlFor="">District Name :</label>
                    <input type="text" name='districtName' onChange={(e) => { setdistrictName(e.target.value) }} />
                    <button type='button' className='btn btn-primary m-2' onClick={handleAddDistrict}>Add </button>
                </form>}
                {!isADD && (
                    <div>
                        <ul>
                            {districts.map(dist => {
                                return (
                                    <li>
                                        {dist.districtName} - {""}
                                        <button
                                            onClick={() => {
                                                handleDelete(dist);
                                            }}
                                            className='btn btn-danger m-2'
                                        >
                                            Delete
                                        </button>{" "}
                                    </li>
                                );
                            })}
                        </ul>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">District Name</th>
                                    <th scope="col">Constituencies</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {districts.map((dist, i) => {
                                    return <tr>
                                        <td>{i + 1}</td>
                                        <td>{dist.districtName}</td>
                                        <td>{getconstituencies(dist.constituencies)}</td>
                                        <td>
                                            {!dist.isAddcont ? <button className='btn btn-primary' onClick={()=>{handleAddConst(dist,i)}}>Add Constituencies</button>
                                            :<div>
                                                <input type="text" onChange={(e)=>{setconstiency(e.target.value)}} value={constiency}/>
                                                <button onClick={()=>{addConstituency(dist)}} className="btn btn-primary m-2">Add</button>
                                            </div>
                                            }
                                        </td>
                                    </tr>
                                })}

                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            }
        </div>
    );

};
