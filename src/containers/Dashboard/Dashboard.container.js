import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

import AppContext from "../../contexts";
import styles from "./Dashboard.module.css";
import constants from "../../constants";
import BalanceCard from "../../components/BalanceCard/BalanceCard.component";
import FriendsList from "../../components/FriendsList/FriendsList.component";
import ProfileCard from "../../components/ProfileCard/ProfileCard.component";
import TransactionHistory from "../../components/TransactionHistory/TransactionHistory.component";

const { BASE_URL } = constants;

function Dashboard() {
  const { user } = useContext(AppContext);
  const [startingBalanceInput, setStartingBalanceInput] = useState("");
  const [startingBalance, setStartingBalance] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchStartingBalance();
    fetchCurrentBalance();
    fetchFriendsList();
    fetchTransactionHistory();
  }, [user.id]);

  const fetchStartingBalance = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/balances?userId=${user.id}`
      );
      const balance = response.data[0]?.startingBalance || null;
      setStartingBalance(balance);
    } catch (error) {
      toast.error("Error retrieving starting balance:", error);
    }
  };

  const fetchCurrentBalance = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/balances?userId=${user.id}`
      );
      const balance = response.data[0]?.balance || null;
      setCurrentBalance(balance);
    } catch (error) {
      toast.error("Error retrieving current balance:", error);
    }
  };

  const fetchFriendsList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${user.id}`);
      const userFriends = response.data.friends || [];
      const friends = await Promise.all(
        userFriends.map(async (friendId) => {
          const friendResponse = await axios.get(
            `${BASE_URL}/users/${friendId}`
          );
          return friendResponse.data;
        })
      );
      setFriendsList(friends);
    } catch (error) {
      toast.error("Error retrieving friends list");
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/transactions`);
      const allTransactions = response.data;

      // Filter transactions based on the user's id
      const userTransactions = allTransactions.filter(
        (transaction) =>
          transaction.senderId === user.id ||
          transaction.recipientId === user.id
      );

      const transactionsWithTypes = userTransactions.map((transaction) => {
        const transactionType =
          transaction.senderId === user.id ? "Mengirim" : "Menerima";
        return {
          ...transaction,
          transactionType,
        };
      });

      setTransactions(transactionsWithTypes);
    } catch (error) {
      toast.error("Error retrieving transaction history");
    }
  };

  const handleDeleteFriend = (friendId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This friend will be removed from your friends list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove friend",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Remove friend from user's friends list
          const updatedUser = {
            ...user,
            friends: user.friends.filter((friend) => friend !== friendId),
          };
          await axios.patch(`${BASE_URL}/users/${user.id}`, {
            friends: updatedUser.friends,
          });

          // Remove user from friend's friends list
          const friendResponse = await axios.get(
            `${BASE_URL}/users/${friendId}`
          );
          const friendData = friendResponse.data;
          const updatedFriend = {
            ...friendData,
            friends: friendData.friends.filter((friend) => friend !== user.id),
          };
          await axios.patch(`${BASE_URL}/users/${friendId}`, {
            friends: updatedFriend.friends,
          });

          fetchFriendsList(); // Refresh friends list

          toast.success("Friend removed successfully!");
        } catch (error) {
          toast.error("Failed to remove friend.");
        }
      }
    });
  };

  const handleStartingBalance = async (e) => {
    e.preventDefault();

    if (startingBalanceInput.trim() === "") {
      toast.error("Please enter a starting balance.");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/balances`, {
        userId: user.id,
        startingBalance: Number(startingBalanceInput),
      });

      setStartingBalance(Number(startingBalanceInput));
      toast.success("Starting balance saved successfully!");
    } catch (error) {
      toast.error("Error saving starting balance");
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.leftContainer}>
        <ProfileCard user={user} />
        <FriendsList
          friendsList={friendsList}
          handleDeleteFriend={handleDeleteFriend}
        />
      </div>
      <div className={styles.rightContainer}>
        <BalanceCard
          startingBalance={startingBalance}
          startingBalanceInput={startingBalanceInput}
          setStartingBalanceInput={setStartingBalanceInput}
          handleStartingBalance={handleStartingBalance}
          currentBalance={currentBalance}
          formatCurrency={formatCurrency}
        />
        <TransactionHistory
          transactions={transactions}
          user={user}
          friendsList={friendsList}
          formatCurrency={formatCurrency}
        />
      </div>
      <Toaster />
    </div>
  );
}

export default Dashboard;
