import React, {useEffect, useState} from'react';

const FilterReadingList = (props)=>{
    const [selectedCreators,setSelectedCreators] = useState([]);
    const [checkedCreatorsStates, setCheckedCreatorsStates] = useState([]);
    const  tags= ["Biographies",
        "Creatures",
        "Nature",
        "Myths and Legends",
        "Me and my life",
        "Poetry",
        "Feelings",
        "Science and math",
        "Friends and family",
        "Fun and funny",
        "Seasons",
        "World cultures",
        "Social studies",
        "Holidays and celebrations",
        ]; // TODO update it base on db data
    const [selectedTags,setSelectedTags] = useState([]);
    const [checkedTagsStates, setCheckedTagsStates] = useState([]);

    useEffect(()=>{
        setCheckedCreatorsStates( new Array(props.creators.length).fill(false)); 
    },[props.creators.length])

    useEffect(()=>{
        setCheckedTagsStates( new Array(tags.length).fill(false)); 
    },[tags.length])
    
    const handleOnSelectedCreatorsChange = (position) => {
        props.setPageNumState(0);
        const updatedCheckedStates = checkedCreatorsStates.map((item, index) =>index === position ? !item : item);
        setCheckedCreatorsStates(updatedCheckedStates);
        let selected = [];
        updatedCheckedStates.forEach((value,index)=>{
            if(value===true){
                selected.push(props.creators[index]);
            }
        })
        setSelectedCreators(selected);
    }  
    const handleOnSelectedTagsChange = (position) => {
        props.setPageNumState(0);
        const updatedCheckedStates = checkedTagsStates.map((item, index) =>index === position ? !item : item);
        setCheckedTagsStates(updatedCheckedStates);
        let selected = [];
        updatedCheckedStates.forEach((value,index)=>{
            if(value===true){
                selected.push(tags[index]);
            }
        })
        setSelectedTags(selected);
    }  

    const onClearFilter =()=>{
        setCheckedTagsStates( new Array(tags.length).fill(false));  
        setCheckedCreatorsStates( new Array(props.creators.length).fill(false)); 
        setSelectedCreators([]);
        setSelectedTags([]);
    }
    return(
        <>  
         <div className="row">
                  <div className="col-sm-4">
                    by topics
                    <div className="stories-checkbox-div">
                        <ul>
                        {checkedTagsStates.length>0 && tags.sort().map((name, index)=>
                                <li key={index}>
                                    <div > 
                                    <input 
                                        type="checkbox"
                                        id={`custom-checkbox-story-tag${index}`}
                                        name={name}
                                        value={name}
                                        checked={checkedTagsStates[index]}
                                        onChange={() => handleOnSelectedTagsChange(index)}
                                    />
                                    &nbsp;
                                    <label htmlFor={`custom-checkbox-story-tag${index}`}>{name}</label>
                                    </div> 
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="col-sm-2 ">
                    <button className="btn btn-sm btn-outline-primary" onClick={onClearFilter}>  clear filter </button>
                </div> 
            </div>
        </>
    )
}

export default FilterReadingList;