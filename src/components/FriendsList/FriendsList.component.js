import React from "react";
import styles from "./FriendsList.module.css";

function FriendsList({ friendsList, handleDeleteFriend }) {
  return (
    <div className={`${styles.friendsCard} ${styles.card}`}>
      <h2 className={styles.cardTitle}>Friends List</h2>
      {friendsList.length > 0 ? (
        <ul className={styles.cardListHorizontal}>
          {friendsList.map((friend) => (
            <li key={friend.id} className={styles.cardItem}>
              <img
                src={friend.imgurl}
                alt="Friend"
                className={styles.cardImage}
              />
              <div className={styles.cardContent}>
                <p className={styles.cardName}>{friend.fullname}</p>
                <p className={styles.cardUsername}>@{friend.username}</p>
              </div>
              <button
                onClick={() => handleDeleteFriend(friend.id)}
                className={styles.cardButton}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noFriendsText}>You have no friends yet.</p>
      )}
    </div>
  );
}

export default FriendsList;
