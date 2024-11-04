// import React, { useEffect,useState } from 'react'; 
// import { useCart } from './CartContext';
// import { Grid, Typography, Button, Divider, Box, IconButton, ButtonGroup, Card, CardContent } from '@mui/material';
// import RemoveIcon from '@mui/icons-material/Remove';
// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { useUser } from '../user/UserContext';
// import { useOwner } from '../owner/OwnerContext';
// import axios from 'axios';

// const Cart = () => {
//   const {
//     cartItems = [],
//     removeFromCart,
//     increaseQuantity,
//     decreaseQuantity,
//     clearCart,
//   } = useCart();
//   const [restaurantDetails, setRestaurantDetails] = useState({});

//   const { user } = useUser(); // Access the user from the UserContext
//   const userEmail = user ? user.emailId : '';

//   const { owner } = useOwner();
//   const ownerEmail=owner ? owner.restaurantEmailId: '';

//   // Function to fetch restaurant details based on restaurantEmailId
//   const fetchRestaurantDetails = async (restaurantEmailId) => {
//     try {
//       const response = await axios.get(`http://localhost:8081/api/restaurants/${restaurantEmailId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
//         },
//       });
//       return response.data; // Adjust based on your actual API response
//     } catch (error) {
//       console.error('Error fetching restaurant details:', error);
//       return null; // Handle error accordingly
//     }
//   };

//   // Fetch restaurant details for each cart item
//   useEffect(() => {
//     const fetchDetails = async () => {
//       const details = {};
//       for (const item of cartItems) {
//         if (!details[item.restaurantEmailId]) { // Avoid duplicate fetch
//           const restaurant = await fetchRestaurantDetails(item.restaurantEmailId);
//           if (restaurant) {
//             details[item.restaurantEmailId] = restaurant; // Store restaurant details
//           }
//         }
//       }
//       setRestaurantDetails(details); // Update local state with all restaurant details
//     };

//     if (cartItems.length > 0) {
//       fetchDetails();
//     }
//   }, [cartItems]);

//   // Check cartItems structure
//   useEffect(() => {
//     console.log('Cart Items:', cartItems); // Check if cartItems have restaurantName and foodImage
//   }, [cartItems]);

//   const handleRemoveFromCart = (id) => {
//     removeFromCart(id);
//   };

//   const handleIncreaseQuantity = (id) => {
//     increaseQuantity(id);
//   };

//   const handleDecreaseQuantity = (id) => {
//     decreaseQuantity(id);
//   };

//   const handleClearCart = () => {
//     clearCart(userEmail); // Ensure 'userEmail' is a string, not an object
//   };

//   // Safely calculate totalAmount
//   const totalAmount = cartItems.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );

//   const handlePayment = () => {
//     const options = {
//       key: 'rzp_test_3XcOKgGRSriIB1', // Replace with your Razorpay key
//       amount: totalAmount * 100, // Razorpay expects the amount in paisa, hence multiply by 100
//       currency: 'INR',
//       name: 'Your Food Delivery App',
//       description: 'Thank you for your purchase!',
//       image: 'https://your-logo-url.com/logo.png', // Add your logo URL
//       handler: function (response) {
//         alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
//         clearCart(); // Clear the cart after successful payment
//       },
//       prefill: {
//         name: 'Customer Name', // Optionally prefill customer's details
//         email: 'customer@example.com',
//         contact: '9999999999',
//       },
//       theme: {
//         color: '#F9A01A',
//       },
//     };

//     const paymentObject = new window.Razorpay(options);
//     paymentObject.open();
//   };

//   return (
//     <Box padding={3}>
//       <Typography sx={{ fontFamily: 'cursive' }} variant="h3" gutterBottom>Food Cart</Typography>
//       {cartItems.length === 0 ? (
//         <Typography>Your cart is empty.</Typography>
//       ) : (
//         <>
//           <Grid container spacing={1} sx={{ marginBottom: 2, padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
//             <Grid item xs={1.5}><Typography variant="subtitle1">Products</Typography></Grid>
//             <Grid item xs={1.8}><Typography variant="subtitle1">Restaurant Name</Typography></Grid>
//             <Grid item xs={1.3}><Typography variant="subtitle1">Title</Typography></Grid>
//             <Grid item xs={1.5}><Typography variant="subtitle1">Price</Typography></Grid>
//             <Grid item xs={1.45}><Typography variant="subtitle1">Quantity</Typography></Grid>
//             <Grid item xs={2.1}><Typography variant="subtitle1">Total</Typography></Grid>
//             <Grid item><Typography variant="subtitle1">Remove</Typography></Grid>
//           </Grid>
//           <Divider />
//           {cartItems.map(item => (
//             <Card key={item.itemId} sx={{ marginY: 2 }}>
//               <CardContent>
//                 <Grid container spacing={2} alignItems="center">
//                   <Grid item xs={1.5}>
//                     {/* Check if foodImage exists */}
//                     <img 
//                         src={item.menuImageFileName 
//                           ? `http://localhost:8081/api/images/menu/${item.restaurantEmailId}/${item.menuImageFileName}`
//                           : 'default-image-url'} 
//                         alt={item.itemName} 
//                         style={{ width: '60px', height: '60px', borderRadius: '8px' }} 
//                       />
//                   </Grid>
//                   <Grid item xs={1.5}>
//                     {/* Check if restaurantName exists */}
//                     <Typography variant="body1">{restaurantDetails[item.restaurantEmailId]?.restaurantName || 'Unknown Restaurant'}</Typography>
//                   </Grid>
//                   <Grid item xs={1.5}><Typography variant="body1">{item.itemName}</Typography></Grid>
//                   <Grid item xs={1.5}><Typography variant="body1">${item.price.toFixed(2)}</Typography></Grid>
//                   <Grid item xs={1.5}>
//                     <ButtonGroup size="small" variant="outlined">
//                       <IconButton onClick={() => handleDecreaseQuantity(item.itemId)} color="primary">
//                         <RemoveIcon />
//                       </IconButton>
//                       <Typography sx={{ marginTop: 1 }}>{item.quantity}</Typography>
//                       <IconButton onClick={() => handleIncreaseQuantity(item.itemId)} color="primary">
//                         <AddIcon />
//                       </IconButton>
//                     </ButtonGroup>
//                   </Grid>
//                   <Grid item xs={2}>
//                     <Typography variant="body1">${(item.price * item.quantity).toFixed(2)}</Typography>
//                   </Grid>
//                   <Grid item xs={2}>
//                     <Button
//                       variant="outlined"
//                       color="secondary"
//                       startIcon={<DeleteIcon />}
//                       onClick={() => handleRemoveFromCart(item.itemId)}
//                     >
//                       Remove
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>
//           ))}

//           <Box sx={{ marginTop: 3 }}>
//             <Typography variant="h5" gutterBottom>Cart Totals</Typography>
//             <Box sx={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
//               <Grid container spacing={2}>
//                 <Grid item xs={6}><Typography>Subtotal</Typography></Grid>
//                 <Grid item xs={6}><Typography>${totalAmount.toFixed(2)}</Typography></Grid>
//               </Grid>
//               <Divider sx={{ my: 1 }} />
//               <Grid container spacing={2}>
//                 <Grid item xs={6}><Typography>Delivery fee</Typography></Grid>
//                 <Grid item xs={6}><Typography>Free</Typography></Grid>
//               </Grid>
//               <Divider sx={{ my: 1 }} />
//               <Grid container spacing={2}>
//                 <Grid item xs={6}><Typography variant="h6">Total</Typography></Grid>
//                 <Grid item xs={6}><Typography variant="h6">${totalAmount.toFixed(2)}</Typography></Grid>
//               </Grid>
//             </Box>
//             <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2, backgroundColor: '#F9A01A', boxShadow: 'none' }} onClick={handlePayment}>
//               ORDER NOW!!
//             </Button>
//             <Button variant="contained" color="error" fullWidth sx={{ marginTop: 2 }} onClick={handleClearCart}>
//               Clear Cart
//             </Button>
//           </Box>
//         </>
//       )}
//     </Box>
//   );
// };

// export default Cart;

import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import { Grid, Typography, Button, Divider, Box, IconButton, ButtonGroup, Card, CardContent } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUser } from '../user/UserContext';
import { useOwner } from '../owner/OwnerContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelectedRestaurant } from "../landing_page/SelectedRestaurantContext"

const Cart = (restaurent) => {
  const { cartItems = [], removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useCart();
  const { user } = useUser();
  const userEmail = user ? user.emailId : '';
  const { owner } = useOwner();
  const ownerEmail = owner ? owner.restaurantEmailId : '';
  const navigate = useNavigate(); 
  const Ownertoken = localStorage.getItem("OwnerJwtToken"); 

  const { selectedRestaurant } = useSelectedRestaurant();

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePayment = () => {
    // Redirect to order form page, pass cart details
    navigate('/orderForm', { state: { cartItems, totalAmount } });
  };

  const handleClearCart = () => {
        clearCart(userEmail); // Ensure 'userEmail' is a string, not an object
      };

  return (
    <Box padding={3}>
      <Typography sx={{ fontFamily: 'cursive' }} variant="h3" gutterBottom>Food Cart</Typography>
      {cartItems.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          <Grid container spacing={1} sx={{ marginBottom: 2, padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <Grid item xs={1.5}><Typography variant="subtitle1">Products</Typography></Grid>
            <Grid item xs={1.8}><Typography variant="subtitle1">Restaurant Name</Typography></Grid>
            <Grid item xs={1.3}><Typography variant="subtitle1">Title</Typography></Grid>
            <Grid item xs={1.5}><Typography variant="subtitle1">Price</Typography></Grid>
            <Grid item xs={1.45}><Typography variant="subtitle1">Quantity</Typography></Grid>
            <Grid item xs={2.1}><Typography variant="subtitle1">Total</Typography></Grid>
            <Grid item><Typography variant="subtitle1">Remove</Typography></Grid>
          </Grid>
          <Divider />
          {cartItems.map(item => (
            <Card key={item.itemId} sx={{ marginY: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={1.5}>
                    <img 
                      src={item.menuImageFileName 
                        ? `http://localhost:8081/api/images/menu/${item.restaurantEmailId}/${item.menuImageFileName}`
                        : 'default-image-url'} 
                      alt={item.itemName} 
                      style={{ width: '60px', height: '60px', borderRadius: '8px' }} 
                    />
                  </Grid>
                  <Grid item xs={1.5}>
                    <Typography variant="body1">{selectedRestaurant}</Typography>
                  </Grid>
                  <Grid item xs={1.5}><Typography variant="body1">{item.itemName}</Typography></Grid>
                  <Grid item xs={1.5}><Typography variant="body1">${item.price.toFixed(2)}</Typography></Grid>
                  <Grid item xs={1.5}>
                    <ButtonGroup size="small" variant="outlined">
                      <IconButton onClick={() => decreaseQuantity(item.itemId)} color="primary">
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ marginTop: 1 }}>{item.quantity}</Typography>
                      <IconButton onClick={() => increaseQuantity(item.itemId)} color="primary">
                        <AddIcon />
                      </IconButton>
                    </ButtonGroup>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body1">${(item.price * item.quantity).toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<DeleteIcon />}
                      onClick={() => removeFromCart(item.itemId)}
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}

          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h5" gutterBottom>Cart Totals</Typography>
            <Box sx={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <Grid container spacing={2}>
                <Grid item xs={6}><Typography>Subtotal</Typography></Grid>
                <Grid item xs={6}><Typography> ₹{totalAmount.toFixed(2)}</Typography></Grid>
              </Grid>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}><Typography>Delivery fee</Typography></Grid>
                <Grid item xs={6}><Typography>Free</Typography></Grid>
              </Grid>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}><Typography variant="h6">Total</Typography></Grid>
                <Grid item xs={6}><Typography variant="h6"> ₹{totalAmount.toFixed(2)}</Typography></Grid>
              </Grid>
              <Box mt={2}>
              <Button 
  variant="contained" 
  onClick={handlePayment} 
  sx={{ backgroundColor: '#F9A01A', '&:hover': { backgroundColor: '#d88706' } }}
>
  Proceed to Payment
</Button>

<Button 
  variant="outlined" 
  color="error" 
  onClick={handleClearCart } 
  sx={{ marginLeft: 2, color: '#F9A01A', borderColor: '#F9A01A', '&:hover': { backgroundColor: '#F9A01A', color: '#fff' } }}
>
  Clear Cart
</Button>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Cart;

