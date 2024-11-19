import React, { useEffect, useState } from "react";
import ItemFrame from "./itemFrames"; 
import apiURL from "../api"; 

function App() {
  const [items, setItems] = useState([]); 

  // Use useEffect to fetch items when the component mounts
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${apiURL}/items`); 
        const data = await response.json(); 
        
       // console.log("Fetched items:", data); // Log the data to see what is being returned
        
        if (Array.isArray(data)) {
          setItems(data); 
        } else {
          console.error("Fetched data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems(); 
  }, []); 

  return (
    <div>
      <div class = "header-container">
        <h1>Inventory App</h1>
      </div>
      <div className="inventory-container">
        {/* Loop through the items state and pass each item to ItemFrame */}
        {items.map((item) => (
          <ItemFrame key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default App;