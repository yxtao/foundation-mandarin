import React ,{useState, useEffect} from 'react';
import { useRecoilState, useRecoilValue } from "recoil";
import { firebaseState,
        usernameState,
        userIdState,
        isTeacherState,} from "../../store/AuthAtoms"
import { codeliststate} from '../../store/storyWordsAtoms';
import "./AccessCode.css";

const AccessCode = ()=>{
    const [codes, setCodes] = useState([]);
    const [error, setError] = useState("");
    const userId = useRecoilValue(userIdState);
    const user = useRecoilValue(usernameState);
    const firebase = useRecoilValue(firebaseState);
    const [accessCodes,setAccessCodes] = useRecoilState(codeliststate);

    useEffect(()=>{
        let arrayForSort = [...accessCodes]
        arrayForSort.sort((a,b)=>(b.code).localeCompare(a.code));
        setAccessCodes(arrayForSort);
    }, [])

    const repaceDeleteCode = async (code)=>{        
        try{
            const userRef = firebase.firestore().collection("users").doc(userId);
            const codeRef = firebase.firestore().collection("codes").doc(code.codeId);
            const userDoc = await userRef.get();
            const codeDoc = await codeRef.get();
            console.log("doc",codeDoc.data())
            if(codeDoc.exists){
                await codeRef.delete();
            }else{
                setError("not found")
            }
            if(userDoc.exists){
                const oldCodes = [...userDoc.data().accessCode]
                let newCodes = [];
                oldCodes.forEach((access,index)=>{
                    if(access === code.code){
                        newCodes.push("Delete");
                    }else{
                        newCodes.push(access);
                    }
                })
                //TODO CHANGE TO accessCodes
                await userRef.update({accessCode: newCodes})
            }else{
                setError("User not found")
            }
        }catch(err){
            setError(err.message);
            console.log(err);
        }
    }
    return(
        <div id="code" className= "container-wrapper">
        {error}choose the set and copy paste the code to share it with your student
        <ul>
        {accessCodes.filter((access)=> access.creator===user).map((code,index)=>
            <li key={index} className="border-bottom border-primary ">
            <p> code: {code.codeId}</p> 
            <div>{code.words.map((word, i)=>
                    <span key={i}> {word.name +","}</span> 
            )}
            </div>
            <div>{code.passages.map((passage, i)=>
                    <span key={i}> {passage.name +","}</span> 
            )}
            </div>
            <div className="pull-right ">
                <button 
                    className="btn btn-outline-danger m-2 "
                    onClick={async()=> await repaceDeleteCode(code)}>
                    delete
                </button>
            </div>
            </li>)}
        </ul>
        </div>
    )
}

export default AccessCode;