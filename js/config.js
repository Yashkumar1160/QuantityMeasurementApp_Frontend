// Stores data that every other file needs 

// Base URL of backend server 
var API_BASE = "http://localhost:5098/api/v1";

// Js object for dropdown
var UNITS = {
    Length:      ["Feet", "Inch", "Yard", "Centimeter"],
    Weight:      ["Kilogram", "Gram", "Pound"],
    Volume:      ["Litre", "Millilitre", "Gallon"],
    Temperature: ["Celsius", "Fahrenheit", "Kelvin"]
};

// Array to store measurement types
var MEASUREMENT_TYPES = ["Length", "Weight", "Volume", "Temperature"];

// Array to store operations
var OPERATIONS = ["Compare", "Convert", "Add", "Subtract", "Divide"];
