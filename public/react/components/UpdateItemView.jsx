import React, {useState} from "react";

function UpdateItemView({goToMain, goToSingle, item, url}){
    const[formData, setFormData] = useState(item);

    function handleClickEdit(){
        if(confirm(`Are you sure you want to edit ${item.name}?`)){
            updateRequest(); //runs update request if true
        }
        else{ //runs if FALSE is returned from the confirm box
            goToSingle() //goes back to single item view
            alert(`${item.name} has not been edited`) //gives alert message to user
        }
    }

    async function updateRequest(){
        try{
            const response = await fetch(url, {
                method: 'PATCH',
                body: JSON.stringify({
                    formData
                })
              })
              return(
                alert("Item has been updated", goToMain()) //returns to main page once DB has been updated
            )
        }
        catch(error){ //error catching
            alert("Error! Item failed to edit" + error)
            console.error(error)
        }
    }

    //controlled inputs to update state data
    const onNameChange = e => setFormData({...formData, name: e.target.value})
    const onDescChange = e => setFormData({...formData, description: e.target.value})
    const onPriceChange = e => setFormData({...formData, price: e.target.value})
    const onCategoryChange = e => setFormData({...formData, category: e.target.value})
    const onImageChange = e => setFormData({...formData, image: e.target.value})
    
    return(
        <>
            <header>
                <button onClick={goToMain}>Home</button>
            </header>
            <body>
                <h1>Editing {item.name}</h1>
                <form className="singleViewContainer">
                    <input placeholder="Name" value={formData.name} onChange={onNameChange}></input>
                    <br></br>
                    <input placeholder="Description" value={formData.description} onChange={onDescChange}></input>
                    <br></br>
                    <input placeholder="Price" value={formData.price} onChange={onPriceChange}></input>
                    <br></br>
                    <input placeholder="Category" value={formData.category} onChange={onCategoryChange}></input>
                    <br></br>
                    <input placeholder="Image" value={formData.image} onChange={onImageChange}></input>
                    <br></br>
                    <button type="submit" onClick={() => handleClickEdit()}>Confirm Edit</button>
                </form>
            </body>
        </>
    )

}

module.exports = UpdateItemView;