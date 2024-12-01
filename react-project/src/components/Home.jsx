import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios

const Home = () => {
  const [ads, setAds] = useState([]);  // Ensuring it's an array by default
  const [selectedAds, setSelectedAds] = useState([]);
  const [showForm, setShowForm] = useState(false); // To toggle the form visibility
  const [newAd, setNewAd] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [error, setError] = useState(""); // For error messages

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/ads");
        // Assuming the response contains the ads array directly
        console.log(response.data);
        if (response.data && Array.isArray(response.data.ads)) {
          setAds(response.data.ads); // Update ads if it's an array
        } else {
          setError("No ads found in the response.");
        }
      } catch (error) {
        setError("There was an error fetching the ads.");
      }
    };

    fetchAds();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedAds((prevSelectedAds) => {
      if (prevSelectedAds.includes(id)) {
        return prevSelectedAds.filter((adId) => adId !== id);
      } else {
        return [...prevSelectedAds, id];
      }
    });
  };

  const handleDelete = () => {
    setAds((prevAds) => prevAds.filter((ad) => !selectedAds.includes(ad.id)));
    setSelectedAds([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAdObject = {
      ...newAd,
      id: ads.length + 1, // Automatically set the new ID based on the current length of ads
    };
  
    try {
      // Post the new ad to the backend
      await axios.post("http://localhost:3000/api/ads", newAdObject);
      // Fetch the updated list of ads after successful submission
      const updatedAds = await axios.get("http://localhost:3000/api/ads");
      setAds(updatedAds.data.ads); // Update the state with the new list of ads
      setNewAd({ title: "", description: "", image: "" }); // Clear the form
      setShowForm(false); // Hide the form after submission
    } catch (error) {
      setError("There was an error adding the ad.");
    }
  };
  

  return (
    <div>
      <h1 className="text-3xl font-bold underline text-center ">לוח מודעות</h1>

      {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error message */}

      {selectedAds.length > 0 && (
        <button
          onClick={handleDelete}
          className="mt-5 mr-2 bg-red-500 text-white p-2 rounded-lg"
        >
          מחק מודעות נבחרות
        </button>
      )}

      {/* Button to show the ad creation form */}
      <button
        onClick={() => setShowForm(true)}
        className="mt-5 p-2 bg-green-500 text-white rounded-lg"
      >
        הוספת מודעה
      </button>

      {/* Show form for adding a new ad */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-5 p-5 border border-gray-300 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4">הוסף מודעה חדשה</h2>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2">כותרת</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newAd.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2">תיאור</label>
            <input
              type="text"
              id="description"
              name="description"
              value={newAd.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block mb-2">תמונה (URL)</label>
            <input
              type="text"
              id="image"
              name="image"
              value={newAd.image}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            הוסף מודעה
          </button>
        </form>
      )}

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.isArray(ads) && ads.length === 0 ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex items-center justify-center min-h-screen">
            <p className="text-center">אין מודעות להצגה כרגע.</p>
          </div>
        ) : (
          Array.isArray(ads) &&
          ads.map((ad) => (
            <div
              key={ad.id}
              className="p-3 border border-gray-300 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold mb-2">{ad.title}</h2>
              <p className="text-gray-600 mb-4">{ad.description}</p>
              <img
                src={`${ad.image}`}
                alt={ad.title}
                className="w-full max-h-64 object-fill rounded-md"
              />
              <div className="mt-2">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedAds.includes(ad.id)}
                    onChange={() => handleCheckboxChange(ad.id)}
                  />
                  בחר מודעה למחיקה
                </label>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
