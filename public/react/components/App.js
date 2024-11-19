import React, { useEffect, useState } from "react";
//importing of components
import SingleItemView from "./SingleItemView.jsx";
import UpdateItemView from "./UpdateItemView.jsx"

// Prepend the API URL to any fetch calls.
import apiURL from "../api";

//variables for setting the onClick for the Single Page View
const mainView = 1; //main page view
const singleView = 2; //component made
const addView = 3; //component not made yet/someone else is making it
const updateView = 4; //component not made yet/someone else is making it



function App() {
  const [items, setItems] = useState([]);
  const [singleItem, setSingleItem] = useState();
  
  
  const [view,setView] = useState(mainView) //used to swtich between views

  const exampleData = ([
    {id:1, name:"Item A", description:"Desc", price:23, category:"Category 2"},
    {id:2, name:"Item B", description:"Amazing product", price:56, category:"Category 1", quantity:55}
  ])

  

  useEffect(() => {
    // Fetch the items
  }, []);


  return view == mainView ? ( //default main page load
    <>
      <h1>Inventory App</h1>
      <button onClick={() => setView(singleView)}> Single Item View</button>
      <button onClick={() => setView(addView)}> New Item</button>
    </>
  ) : view == singleView ? ( //loads the single page view when clicked
    <SingleItemView 
    goToMain={() => setView(mainView)}
    goToUpdate={() => setView(updateView)}
    item={exampleData[1]} //passes over the inventory item as an object
    url={"/"}/> //placeholder till URL is defined
  ) : view == addView ? ( //loads add new item view
    <h1>Add View</h1>
  ) : view == updateView ? ( //loads update page from single item view
    <UpdateItemView 
    goToMain={() => setView(mainView)}
    goToSingle={() => setView(singleView)}
    item={exampleData[1]}
    url={"/"}/>
  ) :  //error message displayed if nothing detected
    <h1>Error, please reload the page</h1>
  
}

export default App;
