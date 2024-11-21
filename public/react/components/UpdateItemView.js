import React, {useState} from "react";
import apiURL from "../api";
import "../../style.css";
import { json } from "sequelize";
//http://localhost:3000/api/items/:id

function UpdateItemView({goToMain, goToSingle, item, url}){
    const[formData, setFormData] = useState(item);
    //formData will be the changed data that is sent to the database
    //item is the original data being passed into the component

    function handleClickEdit(){
        if(confirm(`Are you sure you want to edit ${item.name}?`)){
            updateRequest(); //runs update request if true
        }
        else{ //runs if FALSE is returned from the confirm box
            //goToSingle() //goes back to single item view
            alert(`${item.name} has not been edited`) //gives alert message to user
            return;
        }
    }

    async function updateRequest() {
        try {
            const response = await fetch(`${apiURL}/items/${item.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(formData),
            });
      
            if (response.ok) {
              const data = await response.json();
              alert("Item has been updated");
              console.log("Item edited:", data); // Log the new item
              goToSingle(); // Navigate back to the single item view
            } else {
              const errorData = await response.json();
              alert(`Failed to edit item: ${errorData.error}`);
            }
          } catch (error) {
            console.error("Error editing item:", error);
            alert("An error occurred while editing the item.");
          }
        }
    

    //controlled inputs to update state data
    const onNameChange = e => setFormData({...formData, name: e.target.value})
    const onDescChange = e => setFormData({...formData, description: e.target.value})
    const onPriceChange = e => setFormData({...formData, price: e.target.value})
    const onCategoryChange = e => setFormData({...formData, category: e.target.value})
    const onImageChange = e => setFormData({...formData, image: e.target.value})

    function handleClickHomeButton(){
        if(JSON.stringify(item) == JSON.stringify(formData)){
            goToMain();
        }
        else if(confirm("Unsaved changes, are you sure you want to exit?")){
            goToMain();
        }
        else{
            return;
        }
    }

    function handleClickH1(){
        if(JSON.stringify(item) == JSON.stringify(formData)){
            goToSingle();
        }
        else if(confirm("Unsaved changes, are you sure you want to exit?")){
            goToSingle();
        }
        else{
            return;
        }
    }
    
    return(
        <>
            <header>
                <button onClick={() => handleClickHomeButton()}>Home</button>
            </header>
            <body>
                <h1 onClick={() => handleClickH1()}>Editing {item.name}</h1>
                <form className="singleViewContainer">
                    <input placeholder="Name" value={formData.name} onChange={onNameChange}></input>
                    <br></br>
                    <input placeholder="Price" value={formData.price} onChange={onPriceChange}></input>
                    <br></br>
                    <input placeholder="Description" value={formData.description} onChange={onDescChange}></input>
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