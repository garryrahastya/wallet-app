import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-hot-toast";
import AppContext from "../../contexts";
import constants from "../../constants";
import styles from "./Transaction.module.css";
import { ClipLoader } from "react-spinners";

const { BASE_URL } = constants;

const Transaction = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [amount, setAmount] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      const userList = response.data;
      const currentUser = userList.find((userData) => userData.id === user.id);
      const friendList = userList.filter((userData) =>
        currentUser.friends.includes(userData.id)
      );
      setFriends(friendList);
      setSelectedFriend(friendList[0]); // Mengatur teman pertama sebagai nilai awal
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch friends");
    }
  };

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });
    return formatter.format(amount);
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleTransaction = async () => {
    if (!selectedFriend) {
      toast.error("Please select a friend");
      return;
    }

    if (amount === "") {
      toast.error("Please enter an amount");
      return;
    }

    const parsedAmount = parseInt(amount);

    if (parsedAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        `${BASE_URL}/users/${selectedFriend.id}`
      );
      const recipient = response.data;

      if (!recipient) {
        toast.error("Recipient not found");
        return;
      }

      Swal.fire({
        title: "Confirm Transaction",
        html: `You are about to send ${formatCurrency(parsedAmount)} to ${
          recipient.username
        }.<br>Do you want to proceed?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const senderBalanceResponse = await axios.get(
              `${BASE_URL}/balances/${user.id}`
            );
            const senderBalanceData = senderBalanceResponse.data;

            const recipientBalanceResponse = await axios.get(
              `${BASE_URL}/balances/${recipient.id}`
            );
            const recipientBalanceData = recipientBalanceResponse.data;

            if (
              parsedAmount > senderBalanceData.balance ||
              parsedAmount > recipientBalanceData.balance
            ) {
              toast.error("Insufficient balance");
              return;
            }

            await axios.put(`${BASE_URL}/balances/${user.id}`, {
              ...senderBalanceData,
              balance: senderBalanceData.startingBalance - parsedAmount,
            });

            await axios.put(`${BASE_URL}/balances/${recipient.id}`, {
              ...recipientBalanceData,
              balance: recipientBalanceData.startingBalance + parsedAmount,
            });

            const currentDate = getCurrentDate();

            const transaction = {
              senderId: user.id,
              recipientId: recipient.id,
              amount: parsedAmount,
              date: currentDate,
            };

            await axios.post(`${BASE_URL}/transactions`, transaction);

            toast.success("Transaction successful");
            navigate(-1);
          } catch (error) {
            console.error(error);
            toast.error("An error occurred");
          } finally {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className={styles.transactionContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleGoBack}>
          <FaArrowLeft className={styles.icon} />
        </button>
        <h2 className={styles.title}>Transaction</h2>
      </div>
      <div className={styles.formContainer}>
        <label htmlFor="amount" className={styles.label}>
          Amount:
        </label>
        <input
          type="number"
          id="amount"
          className={styles.input}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <label htmlFor="friend" className={styles.label}>
          Select a Friend:
        </label>
        <select
          id="friend"
          className={styles.select}
          value={selectedFriend?.id}
          onChange={(e) => {
            const friendId = parseInt(e.target.value);
            const friend = friends.find((friend) => friend.id === friendId);
            setSelectedFriend(friend);
          }}
        >
          <option value="">-- Select Friend --</option>
          {friends
            .filter(
              (friend) =>
                user.friends.includes(friend.id) ||
                friend.id === selectedFriend?.id
            )
            .map((friend) => (
              <option key={friend.id} value={friend.id}>
                {friend.username}
              </option>
            ))}
        </select>

        <button
          className={styles.transactionButton}
          onClick={handleTransaction}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className={styles.loadingOverlay}>
              <ClipLoader color={"#ffffff"} loading={true} size={80} />
            </div>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </div>
  );
};

export default Transaction;
