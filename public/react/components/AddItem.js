import React, { useState } from "react";
import apiURL from "../api";

const AddItemForm = ({ categories, goToMain }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Image URL input is still present, but validation removed
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs (except imageUrl)
    if (!name || (!category && !customCategory) || !price || !description) {
      alert("Please fill out all fields.");
      return;
    }

    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    // Determine the category (custom or selected)
    const finalCategory = customCategory.trim() ? customCategory : category;

    const newItem = {
      name,
      price: parseFloat(price).toFixed(2), // Convert to a valid price format
      description, // Include description in the new item data
      category: finalCategory,
      image: imageUrl || null, // Allow empty image URLs by setting them to null
    };

    try {
      const response = await fetch(`${apiURL}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Item added successfully!");
        console.log("New item added:", data); // Log the new item
        goToMain(); // Navigate back to the main view
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Failed to add item: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("An error occurred while adding the item.");
    }
  };

  return (
    <>
      <h1 onClick={goToMain} className="clickable-header">Inventory App</h1>
      <div className="form-container">
        <h2>Add New Item</h2>
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
              placeholder="Enter image URL (optional)"
            />
          </div>

          <button type="submit">Add Item</button>
          <button type="button" onClick={goToMain}>
            Cancel
          </button>
        </form>
      </div>
    </>
  );
};

export default AddItemForm;
