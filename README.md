# SpeciesDex

A simple web application that shows the top 100 most observed species in a specific city using the iNaturalist API. It also marks species that a specific user has already observed in that city, creating a real-life Pokédex experience.

## Features

- Search for species by city
- View top 100 most observed species in the selected city
- Mark species that you've already observed
- Beautiful card-based interface
- Responsive design

## How to Use

1. Open `index.html` in your web browser
2. Enter a city name (e.g., "New York", "London", "Tokyo")
3. Enter your iNaturalist username
4. Click the "Search" button
5. View the results! Species you've observed will be marked with a green border and checkmark

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- Uses the iNaturalist API to fetch bird data
- No external dependencies required
- Responsive design that works on all devices

## API Usage

The application uses the following iNaturalist API endpoints:

- `/observations` - To fetch user observations
- `/observations/species_counts` - To fetch top observed species

## Note

Make sure you have an active internet connection to use the application, as it needs to communicate with the iNaturalist API.
