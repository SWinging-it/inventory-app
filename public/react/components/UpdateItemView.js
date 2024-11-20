import React, { useState } from "react";
import apiURL from "../api";
import "../../style.css";

function UpdateItemView({ goToMain, goToSingle, item }) {
  const [formData, setFormData] = useState({
    name: item.name || "",
    description: item.description || "",
    price: item.price || "",
    category: item.category || "",
    image: item.image || "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  async function updateRequest2() {
    setLoading(true);
    try {
      const response = await fetch(`${apiURL}/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Item has been updated successfully!");
        console.log("Updated item:", data);
        goToSingle();
      } else {
        const errorData = await response.json();
        alert(`Failed to edit item: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error editing item:", error);
      alert("An error occurred while editing the item.");
    } finally {
      setLoading(false);
    }
  }

  const handleExit = (callback) => {
    if (JSON.stringify(item) === JSON.stringify(formData)) {
      callback();
    } else if (confirm("Unsaved changes, are you sure you want to exit?")) {
      callback();
    }
  };

  return (
    <>
      <header>
        <button onClick={() => handleExit(goToMain)}>Home</button>
      </header>
      <main>
        <h1 onClick={() => handleExit(goToSingle)}>Editing {item.name}</h1>
        <form className="singleViewContainer">
          <input
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange("name")}
          />
          <br />
          <input
            placeholder="Price"
            value={formData.price}
            onChange={handleInputChange("price")}
          />
          <br />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange("description")}
          />
          <br />
          <input
            placeholder="Category"
            value={formData.category}
            onChange={handleInputChange("category")}
          />
          <br />
          <input
            placeholder="Image"
            value={formData.image}
            onChange={handleInputChange("image")}
          />
          <br />
          <button
            type="button"
            onClick={() => {
              if (confirm(`Are you sure you want to edit ${item.name}?`)) {
                updateRequest2();
              } else {
                alert(`${item.name} has not been edited`);
              }
            }}
            disabled={loading}
          >
            {loading ? "Updating..." : "Confirm Edit"}
          </button>
        </form>
      </main>
    </>
  );
}

export default UpdateItemView;
