import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [ads, setAds] = useState([]);
  const [selectedAds, setSelectedAds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newAd, setNewAd] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [editAd, setEditAd] = useState(null); // To track which ad is being edited
  const [error, setError] = useState("");
  const location = useLocation();
  const role = location.state?.role;

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/ads/getads"
        );
        if (response.data && Array.isArray(response.data.ads)) {
          setAds(response.data.ads);
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

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/ads/${selectedAds.join(",")}`
      );

      setAds((prevAds) =>
        prevAds.filter((ad) => !selectedAds.includes(ad._id))
      );

      setSelectedAds([]);
      alert("Selected ads deleted successfully");
    } catch (error) {
      console.error("Error deleting ads:", error);
      alert("Failed to delete ads");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAd((prevNewAd) => ({
      ...prevNewAd,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/ads/newads",
        newAd
      );
      setNewAd({ title: "", description: "", image: "" });
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      setError("There was an error adding the ad.");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditAd((prevEditAd) => ({
      ...prevEditAd,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/ads/update/${editAd._id}`,
        editAd
      );
      setAds((prevAds) =>
        prevAds.map((ad) =>
          ad._id === editAd._id ? { ...ad, ...editAd } : ad
        )
      );
      setEditAd(null); // Close the edit form after successful update
    } catch (error) {
      setError("There was an error updating the ad.");
    }
  };

  return (
    <div>
      <h1 className="text-center">לוח מודעות</h1>

      {error && <p className="error-message">{error}</p>}

      {selectedAds.length > 0 && (
        <button onClick={handleDelete} className="btndel">
          מחק מודעות נבחרות
        </button>
      )}

      {role === "admin" && (
        <button onClick={() => setShowForm(!showForm)} className="btn-add">
          הוספת מודעה
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <h2>הוסף מודעה חדשה</h2>
          <input
            type="text"
            name="title"
            value={newAd.title}
            onChange={handleInputChange}
            placeholder="כותרת"
            required
          />
          <input
            type="text"
            name="description"
            value={newAd.description}
            onChange={handleInputChange}
            placeholder="תיאור"
            required
          />
          <input
            type="text"
            name="image"
            value={newAd.image}
            onChange={handleInputChange}
            placeholder="תמונה (URL)"
            required
          />
          <button type="submit" className="bg-blue-500">
            הוסף מודעה
          </button>
        </form>
      )}

      {/* Edit Form */}
      {editAd && (
        <form onSubmit={handleEditSubmit}>
          <h2>ערוך מודעה</h2>
          <input
            type="text"
            name="title"
            value={editAd.title}
            onChange={handleEditChange}
            placeholder="כותרת"
            required
          />
          <input
            type="text"
            name="description"
            value={editAd.description}
            onChange={handleEditChange}
            placeholder="תיאור"
            required
          />
          <input
            type="text"
            name="image"
            value={editAd.image}
            onChange={handleEditChange}
            placeholder="תמונה (URL)"
            required
          />
          <button type="submit" className="bg-green-500">
            שמור שינויים
          </button>
          <button type="button" onClick={() => setEditAd(null)} className="bg-red-500">
            ביטול
          </button>
        </form>
      )}

      <div className="ads-container">
        {ads.length === 0 ? (
          <div className="empty-ads-message">
            <p>אין מודעות להצגה כרגע.</p>
          </div>
        ) : (
          ads.map((ad) => (
            <div key={ad._id} className="ad-card">
              <h2>{ad.title}</h2>
              <p>{ad.description}</p>
              <img src={ad.image} alt={ad.title} />
              {role === "admin" && (
                <>
                  <button
                    onClick={() => setEditAd(ad)}
                    className="btn-edit"
                  >
                    ערוך מודעה
                  </button>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedAds.includes(ad._id)}
                      onChange={() => handleCheckboxChange(ad._id)}
                    />
                    בחר מודעה למחיקה
                  </label>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
