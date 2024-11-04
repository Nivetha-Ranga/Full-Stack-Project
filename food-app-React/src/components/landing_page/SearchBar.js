import React from "react";
import { styled, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "20px",
  backgroundColor: "white",
  color: "black",
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 20, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function SearchBar({ searchTerm, setSearchTerm,setFilterData }) {
  return (
    <Search>
      <StyledInputBase
        placeholder="Search restaurants"
        inputProps={{ "aria-label": "search" }}
        value={searchTerm} // Bind input value to searchTerm state
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
      />
      <IconButton sx={{ p: "10px" }}>
        <SearchIcon />
      </IconButton>
    </Search>
  );
}
