import { useState, useEffect } from "react"; 
import axios from 'axios';
import About from "../components/landing_page/About";
import Main_container from "../components/landing_page/Main_container";
import Restaurent_card_manager from "../components/landing_page/Restaurent_card_manager";

export default function Home() {
    const [restaurants, setRestaurants] = useState([]); // Stores all restaurant data
    const [searchTerm, setSearchTerm] = useState(""); // Track search input
    const [filterData, setFilterData] = useState('all');  // Stores filter category value
    const [displayData, setDisplayData] = useState([]); // Filtered restaurant data to display

    // Function to filter restaurants based on category
    const filterItems = (restaurants, restaurantCategory) => {
        if (!restaurantCategory || restaurantCategory === 'all') return restaurants;
        return restaurants.filter(r => r.category === restaurantCategory);
    };

    // Function to perform a combined search (by name, type, and menu item)
    const searchRestaurants = async (term) => {
        try {
            const nameSearch = axios.get(`http://localhost:8081/api/guest/restaurant/name?name=${term}`);
            const typeSearch = axios.get(`http://localhost:8081/api/guest/restaurant/type?type=${term}`);
            const menuSearch = axios.get(`http://localhost:8081/api/guest/search-by-menu-item?itemName=${term}`);

            const [nameResponse, typeResponse, menuResponse] = await Promise.all([nameSearch, typeSearch, menuSearch]);

            const allResults = [
                ...nameResponse.data,
                ...typeResponse.data,
                ...menuResponse.data,
            ];

            // Remove duplicates based on restaurantEmailId
            const uniqueResults = Array.from(new Set(allResults.map((res) => res.restaurantEmailId)))
                .map((id) => allResults.find((res) => res.restaurantEmailId === id));

            return uniqueResults; // Return the filtered restaurant data
        } catch (error) {
            console.error("Error fetching search results", error);
            return []; // Clear results in case of error
        }
    };

    // Backend URL for approved restaurants
    const jsonurl = "http://localhost:8081/api/guest/approved";

    // Fetch data on component mount
    useEffect(() => {
        axios.get(jsonurl)
        .then((response) => {
            setRestaurants(response.data);  // Store fetched restaurant data
            setDisplayData(response.data);  // Set initial display data
        })
        .catch(error => {
            console.error("Error fetching the restaurant data!", error);  // Handle error
        });
    }, []);

    // Trigger search when the search term or filter changes
    useEffect(() => {
        const updateDisplayData = async () => {
            let result = restaurants;
            if (searchTerm.trim() !== "") {
                result = await searchRestaurants(searchTerm); // Call search function
            }

            const filteredData = filterItems(result, filterData); // Apply category filtering
            setDisplayData(filteredData); // Set the final display data
        };

        updateDisplayData(); // Call the function to update display data
    }, [searchTerm, filterData, restaurants]);

    return (
        <div>
            <Main_container searchTerm={searchTerm} setSearchTerm={setSearchTerm} setFilterData={setFilterData} /> {/* Main banner or main section */}
            <Restaurent_card_manager 
                restaurants={displayData} 
                setFilterData={setFilterData}  // Passing filter function to update category
            />
            <About /> {/* About section */}
        </div>
    );
}
