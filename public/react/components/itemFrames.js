import React from "react";
import "../../style.css";// Imported CSS file


const ItemFrame = ({ item }) => {
  return (
    <div className="inventory-frame">
        {/* the entire frame is clickable by wrapping it in a link */}
        <a href={`?itemId=${item.id}`} className="item-link"> {/* Pass clicked item id (you can see it in the url when clicked) through to the single item view page to display that particular item*/}
        <div className="image-container">
        <img 
          src="https://via.placeholder.com/150" 
          alt={item.name} 
          className="item-image" 
        />
      </div>
      {/* Display the item's name */}
      <h3>{item.name}</h3>

      {/* Display the item's quantity */}
      <p>Category: {item.category}</p>

      {/* Display the item's price */}
      <p>Price: {item.price}</p>
    </a>
    </div>
  );
};

export default ItemFrame;