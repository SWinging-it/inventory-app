import React from "react";
import "../../style.css";

function SingleItemView({ goToMain, goToUpdate, item }) {
  if (!item) {
    return (
      <div>
        <h1>Error: Item not found</h1>
        <button onClick={goToMain}>Back to Main</button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        const response = await fetch(`/api/items/${item.id}`, { method: "DELETE" });
        if (response.ok) {
          alert(`${item.name} has been deleted.`);
          goToMain();
        } else {
          alert("Failed to delete the item.");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  return (
    <>
      <header className="header-container">
        <h1 onClick={goToMain} className="clickable-header">Inventory App</h1>
      </header>
      <main>
        <div className="singleViewContainer">
          <h2>{item.name}</h2>
          <img 
            className="singleViewImg" 
            src={item.image || "https://via.placeholder.com/250"} 
            alt={item.name} 
          />
          <p>{item.description}</p>
          <p>Price: £{(item.price).toFixed(2)}</p>
          <div className="button-group">
            <button onClick={goToUpdate}>Update</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </main>
    </>
  );
}

export default SingleItemView;
