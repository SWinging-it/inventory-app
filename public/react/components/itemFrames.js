import React from "react";
import "../../style.css";

const ItemFrame = ({ item, onClick }) => {
  return (
    
    <div className="inventory-frame" onClick={onClick}>
      <div className="image-container">
        <img 
          src={item.image || "https://via.placeholder.com/250"} 
          alt={item.name} 
          className="item-image" 
        />
      </div>
      <div className = "textForFrame">

      <h3>{item.name}</h3>
      <p>Category: {item.category}</p>
      <p className = "price">Price: £{(item.price).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ItemFrame;