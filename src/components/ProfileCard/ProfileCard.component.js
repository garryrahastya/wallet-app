import React from 'react';
import styles from './ProfileCard.module.css';

function ProfileCard({ user }) {
  return (
    <div className={`${styles.profileCard} ${styles.card}`}>
      <h1 className={styles.cardTitle}>Welcome, {user.fullname}</h1>
      <img src={user.imgurl} alt="User" className={styles.userImage} />
    </div>
  );
}

export default ProfileCard;
