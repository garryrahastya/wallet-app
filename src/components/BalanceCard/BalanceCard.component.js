import React from 'react';
import styles from './BalanceCard.module.css';

function BalanceCard({
  startingBalance,
  startingBalanceInput,
  setStartingBalanceInput, 
  handleStartingBalance,
  currentBalance,
  formatCurrency,
}) {
  if (startingBalance === null) {
    return (
      <div className={`${styles.balanceCard} ${styles.card}`}>
        <h2 className={styles.cardTitle}>Set Your Starting Balance</h2>
        <form onSubmit={handleStartingBalance} className={styles.cardContent}>
          <input
            type="number"
            value={startingBalanceInput}
            onChange={(e) => setStartingBalanceInput(e.target.value)}
            placeholder="Enter starting balance"
            className={styles.startingBalanceInput}
          />
          <button type="submit" className={styles.cardButton}>
            Set Balance
          </button>
        </form>
      </div>
    );
  } else {
    return (
      <div className={`${styles.balanceCard} ${styles.card}`}>
        <h2 className={styles.cardTitle}>Current Balance</h2>
        <p className={styles.cardContent}>{formatCurrency(currentBalance)}</p>
        <h2 className={styles.cardTitle}>Starting Balance</h2>
        <p className={styles.cardContent}>{formatCurrency(startingBalance)}</p>
      </div>
    );
  }
}

export default BalanceCard;
