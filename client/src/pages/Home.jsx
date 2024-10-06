import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import AddTask from '../components/AddTask';
import TaskList from '../components/TaskList';
import { getRewards } from '../utils/aptos';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import axios from 'axios';

const Home = () => {
  const { account } = useWallet();
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState(0);

  useEffect(() => {
    if (account) {
      fetchTasks();
      fetchRewards();
    }
  }, [account]);

  const fetchTasks = async () => {
    const response = await axios.get(`/api/tasks/${account.address}`);
    setTasks(response.data);
  };

  const fetchRewards = async () => {
    const rewards = await getRewards(account.address);
    setRewards(rewards);
  };

  return (
    <div>
      <Header />
      <h2>Welcome to Habit Tracking App</h2>
      <h3>Your Rewards: {rewards}</h3>
      {account && <AddTask userAddress={account.address} refreshTasks={fetchTasks} />}
      <TaskList tasks={tasks} userAddress={account.address} refreshTasks={fetchTasks} />
    </div>
  );
};

export default Home;
