import React, { useState } from "react";
import styles from "./TransactionHistory.module.css";

function TransactionHistory({
  transactions,
  user,
  friendsList,
  formatCurrency,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const TRANSACTIONS_PER_PAGE = 5;

  const totalPages = Math.ceil(transactions.length / TRANSACTIONS_PER_PAGE);

  const getDisplayedTransactions = () => {
    const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
    const endIndex = startIndex + TRANSACTIONS_PER_PAGE;
    return transactions.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={`${styles.transactionCard} ${styles.card}`}>
      <h2 className={styles.cardTitle}>Transaction History</h2>
      {transactions.length > 0 ? (
        <React.Fragment>
          <ul className={styles.transactionList}>
            {getDisplayedTransactions().map((transaction) => (
              <li key={transaction.id} className={styles.transactionItem}>
                <div className={styles.transactionInfo}>
                  <p className={styles.transactionDate}>{transaction.date}</p>
                  <p className={styles.transactionAmount}>
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className={styles.transactionCategory}>
                    {transaction.senderId === user.id ? "Expense" : "Income"}
                  </p>
                </div>
                <div className={styles.transactionUsers}>
                  <p className={styles.senderUser}>
                    {user.id === transaction.senderId
                      ? "You"
                      : friendsList.find(
                          (friend) => friend.id === transaction.senderId
                        )?.fullname || ""}
                    <span className={styles.senderLabel}>Sender</span>
                  </p>
                  <p className={styles.recipientUser}>
                    {user.id === transaction.recipientId
                      ? "You"
                      : friendsList.find(
                          (friend) => friend.id === transaction.recipientId
                        )?.fullname || ""}
                    <span className={styles.recipientLabel}>Recipient</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`${styles.pageButton} ${
                  currentPage === index + 1 ? styles.active : ""
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </React.Fragment>
      ) : (
        <p className={styles.noTransactionsText}>
          No transaction history found.
        </p>
      )}
    </div>
  );
}

export default TransactionHistory;
