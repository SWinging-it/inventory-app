import React from "react";

function SingleItemView({goToMain, goToUpdate, url, item}){
    
    if (item == null){ //fail safe for when the item is deleted / not there
        return(
            goToMain()
        )
    }

    let params = 1;

    function handleClickDelete(){ //the box will automatically return TRUE if "Ok" is clicked
        if(confirm(`Are you sure you want to delete ${item.name}?`)){
            deleteRequest();
        }
        else{ //runs if FALSE is returned from the confirm box
            alert(`${item.name} has not been deleted`)
        }
    }

    async function deleteRequest(){
        //deletes the entry of the url given to the component
        const response = await fetch(url, {
            method: "DELETE"
          });
        //const data = await response.json();
        return(
            alert("Item has been deleted", goToMain())
        )
    }

    return(
        <>
            <header>
                <button onClick={goToMain}>Home</button>
            </header>
            <body>
            <h1>Inventory App - Single Item View</h1>
                <div className="singleViewContainer">
                    <h2>{item.name}</h2>
                    <img className="singleViewImg" src="https://via.placeholder.com/250"></img>
                    <p>Description: {item.description}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: £{item.price}</p>
                    <button onClick={goToUpdate}>Update</button>
                    <br></br>
                    {/* creates a confirmation pop up with "Ok" or "Cancel" */}
                    <button onClick={() => handleClickDelete()}>
                        Delete
                    </button>
                </div>
            </body>
        </>
    )
}


module.exports = SingleItemView;