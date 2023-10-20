import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import AppContext from "../../contexts";
import styles from "./AddFriend.module.css";
import constants from "../../constants";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const { BASE_URL } = constants;

function AddFriend() {
  const { user, setUser } = useContext(AppContext);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userFriends, setUserFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setUserFriends(user.friends);
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (searchInput.trim() === "") {
      toast.error("Please enter a username to search.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}/users?q=${searchInput}`);
      const foundUsers = response.data;
      setSearchResults(foundUsers);
    } catch (error) {
      toast.error("An error occurred while searching for friends");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async (friendId) => {
    if (friendId === user.id) {
      toast.error("You cannot add yourself as a friend.");
      return;
    }

    if (userFriends.includes(friendId)) {
      toast.error("This user is already in your friends list.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}/users/${friendId}`);
      const friendData = response.data;

      // Update user's friends list
      const updatedUser = {
        ...user,
        friends: [...user.friends, friendId],
      };

      // Update friend's friends list
      const updatedFriend = {
        ...friendData,
        friends: [...friendData.friends, user.id],
      };

      await axios.patch(`${BASE_URL}/users/${user.id}`, {
        friends: updatedUser.friends,
      });

      await axios.patch(`${BASE_URL}/users/${friendId}`, {
        friends: updatedFriend.friends,
      });

      // Perbarui state user dengan daftar teman yang diperbarui
      setUser(updatedUser);

      navigate("/");
      toast.success("Friend added successfully!");
    } catch (error) {
      toast.error("Failed to add friend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.addFriendContainer}>
      <h2 className={styles.addFriendTitle}>Add Friend</h2>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter username"
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          {isLoading ? (
            <ClipLoader color={"#ffffff"} loading={true} size={12} />
          ) : (
            "Search"
          )}
        </button>
      </form>

      {searchResults.length > 0 ? (
        <ul className={styles.searchResults}>
          {searchResults.map((result) => (
            <li key={result.id} className={styles.searchResult}>
              <img
                src={result.imgurl}
                alt="Friend"
                className={styles.friendImage}
              />
              <div>
                <p className={styles.friendName}>{result.fullname}</p>
                <p className={styles.friendUsername}>@{result.username}</p>
              </div>
              <button
                className={styles.addButton}
                onClick={() => handleAddFriend(result.id)}
                disabled={userFriends.includes(result.id)}
              >
                {isLoading ? (
                  <ClipLoader color={"#ffffff"} loading={true} size={12} />
                ) : userFriends.includes(result.id) ? (
                  "Added"
                ) : (
                  "Add"
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        searchInput.trim() !== "" && (
          <p className={styles.noResultsText}>No results found.</p>
        )
      )}
    </div>
  );
}

export default AddFriend;
