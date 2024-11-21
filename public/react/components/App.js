import React, { useEffect, useState } from "react";
import ItemFrame from "./itemFrames";
import SingleItemView from "./SingleItemView.js";
import AddItemForm from "./AddItem.js";
import UpdateItemView from "./UpdateItemView.js";
import apiURL from "../api";

const mainView = 1; // Main page view
const singleView = 2; // Single item view
const addView = 3; // Add new item view
const updateView = 4; // Update item view

function App() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]); // To store the filtered items
  const [selectedItem, setSelectedItem] = useState(null); // To track the clicked item
  const [view, setView] = useState(mainView); // Used to switch between views
  const [categories, setCategories] = useState([]); // To store categories
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category for filtering
  const [searchQuery, setSearchQuery] = useState(""); // Search input


  // Use useEffect to fetch items and categories when the component mounts
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${apiURL}/items`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setItems(data);
          setFilteredItems(data); // Initially, show all items

          // Extract unique categories from the items
          const uniqueCategories = [...new Set(data.map(item => item.category))];
          setCategories(uniqueCategories); // Set categories
        } else {
          console.error("Fetched data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  // Function to handle item click and navigate to single view
  const handleItemClick = (item) => {
    setSelectedItem(item); // Store the clicked item
    setView(singleView); // Navigate to SingleItemView
  };

  // Function to handle category selection and filter items
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);

    if (category === "") {
      // If no category is selected, show all items
      setFilteredItems(items);
    } else {
      // Filter items by the selected category
      setFilteredItems(items.filter(item => item.category === category));
    }
  };

  // Function to handle search input
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter items by name and category
    setFilteredItems(items.filter(item => {
      const matchesName = item.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = item.category.toLowerCase().includes(query.toLowerCase());
      return matchesName || matchesCategory;
    }));
  
    const handleNewItemAdded = (newItem) => {
      setItems((prevItems) => [...prevItems, newItem]);
      setFilteredItems((prevItems) => [...prevItems, newItem]);
    };
    
  };

  return (
    <>
      {view === mainView ? (
        <>
          <div className="header-container">
            <h1 data-testid="mainTitle">Inventory App</h1>
          </div>

          <div className="navBar">
            {/* Category Dropdown */}
            <div className="category-filter">
              <label htmlFor="category">Filter by Category: </label>
              <select 
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Search Bar in the middle */}
            <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search for items or categories..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            </div>  

            <button className="addItemButton" onClick={() => setView(addView)}>New Item</button>
          </div>

          <div className="inventory-container">
            {/* Loop through filteredItems state and pass each item to ItemFrame */}
            {filteredItems.map((item) => (
              <ItemFrame 
                key={item.id} 
                item={item} 
                onClick={() => handleItemClick(item)} // Handle item click
              />
            ))}
          </div>
        </>
      ) : view === singleView ? (
        <SingleItemView 
          goToMain={() => setView(mainView)} // Function to go back to main view
          goToUpdate={() => setView(updateView)} // Placeholder for update view
          item={selectedItem} // Pass the selected item to SingleItemView
        />
      ) : view === addView ? (
        <AddItemForm
          categories={categories}
          goToMain={() => setView(mainView)} // Function to go back to the main view
        />
      ) : view === updateView ? (
        <UpdateItemView 
          goToMain={() => setView(mainView)}
          goToSingle={() => setView(singleView)}
          item={selectedItem}
          url={apiURL}
          categories={categories}
        />
      ) : (
        <h1>Error: Invalid View</h1>
      )}
    </>
  );
}

export default App;
