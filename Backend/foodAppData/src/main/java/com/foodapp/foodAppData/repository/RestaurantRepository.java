package com.foodapp.foodAppData.repository;

import com.foodapp.foodAppData.model.Restaurant;
import com.foodapp.foodAppData.model.RestaurantMenu;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RestaurantRepository extends MongoRepository<Restaurant,String> {
    Restaurant findByRestaurantEmailId(String restaurantEmailID);
    List<Restaurant> findByIsApproved(Restaurant.Approval isApproved);

    // Search restaurants by name (case-insensitive)
    List<Restaurant> findByRestaurantNameContainingIgnoreCase(String restaurantName);

    // Search restaurants by type (e.g., vegetarian, non-vegetarian)
    List<Restaurant> findByTypeContainingIgnoreCase(String restaurantType);

    @Query("SELECT r FROM Restaurant r JOIN r.restaurantMenuList m WHERE LOWER(m.itemName) LIKE LOWER(CONCAT('%', :itemName, '%'))")
    List<Restaurant> findRestaurantsByMenuItemName(@Param("itemName") String itemName);



}
