import React, { useState } from "react";
import apiURL from "../api";
import "../../style.css";

function UpdateItemView({ goToMain, goToSingle, item , categories}) {
  const [name, setName] = useState(item.name || "");
  const [category, setCategory] = useState(item.category || "");
  const [price, setPrice] = useState(item.price || "");
  const [imageUrl, setImageUrl] = useState(item.image || "");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState(item.description || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!name || (!category && !customCategory) || !price || !description) {
      alert("Please fill out all fields.");
      return;
    }

    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    const finalCategory = customCategory.trim() ? customCategory : category;

    const updatedItem = {
      name,
      price: parseFloat(price).toFixed(2),
      description,
      category: finalCategory,
      image: imageUrl,
    };

    setLoading(true);

    try {
      const response = await fetch(`${apiURL}/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Item updated successfully!");
        console.log("Updated item:", data);
        goToSingle();
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Failed to update item: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating item:", error);
      alert("An error occurred while updating the item.");
    } finally {
      setLoading(false);
    }
  };

  const handleExit = (callback) => {
    const hasChanges =
      name !== item.name ||
      description !== item.description ||
      price !== item.price ||
      category !== item.category;
      // imageUrl !== item.image;

    if (!hasChanges || confirm("Unsaved changes will be lost. Continue?")) {
      callback();
    }
  };

  return (
    <>
      <h1 
        onClick={() => handleExit(goToSingle)} 
        className="clickable-header">
        Inventory App
      </h1>
      <div className="form-container">
        <h2>Update Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter item price"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter item description"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={customCategory.trim() !== ""}
            >
              <option value="">Select a category</option>
              {/* You may add options dynamically here */}
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
              
            </select>
            <input
              type="text"
              placeholder="Or add a new category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              disabled={category !== ""}
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Image URL:</label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Item"}
          </button>
          <button type="button" onClick={() => handleExit(goToSingle)}>
            Cancel
          </button>
        </form>
      </div>
    </>
  );
}

export default UpdateItemView;
