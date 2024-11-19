import React, { useEffect, useState } from "react";
import ItemFrame from "./itemFrames"; // Passed from itemFrames for each individual frame to be created for the landing page

// Prepend the API URL to any fetch calls.
import apiURL from "../api";
// orignially pass data as item (object) and reference to that 

function App() {
  const [items, setItems] = useState([]); // items is the array, set items is used to update 

  {/*useEffect(() => {
    // Fetch the items ---------------------- Needs to be in place when data is implemented -------- (look line 15-19 down for recommended logic)
  }, []);*/}

  // useEffect(() => {
  //   const fetchItems = async () => {
  //     const data = await fetch('https://api.example.com/items').then(res => res.json()); // link will be to object fetched
  //     setItems(data); // Update the items with the fetched data
  //   };
  
  const exampleItems = [
    { id: 1, name: "Sample Item A", category: "Category 1", price: "£15.00" }, // dummy data just for testing, will be deleted when data is implemented
    { id: 2, name: "Sample Item B", category: "Category 2", price: "£25.00" },
    { id: 3, name: "Sample Item C", category: "Category 3", price: "£5.00" },
    { id: 4, name: "Sample Item D", category: "Category 4", price: "£30.00" },
    { id: 5, name: "Sample Item E", category: "Category 5", price: "£30.00" }
  ];

  return (
    <div>
      <h1>Inventory App</h1>
      {/* <div> for inventory-container can act as the frame that refreshes*/}
      <div className="inventory-container">
        {/* Render the static frames, for every item in the object */}
        {exampleItems.map((item) => ( 
          <ItemFrame key={item.id} item={item} /> 
        ))}
      </div>
    </div>
  );
}

export default App;
