import { Network, Provider, AptosClient, AptosAccount } from 'aptos';

const provider = new Provider(Network.TESTNET);
const client = new AptosClient(Network.TESTNET);

// Function to create a task on Aptos
export const createTask = async (taskName, userAddress) => {
  const transaction = {
    // Construct the transaction payload here using your Move module
    type: 'entry_function_payload',
    function: 'AptosHabitTracking.create_task',
    arguments: [userAddress, taskName],
  };
  
  // Send the transaction
  const response = await client.executeTransaction(transaction);
  return response;
};

// Function to complete a task on Aptos
export const completeTask = async (taskId, userAddress) => {
  const transaction = {
    type: 'entry_function_payload',
    function: 'AptosHabitTracking.complete_task',
    arguments: [userAddress, taskId],
  };

  const response = await client.executeTransaction(transaction);
  return response;
};

// Function to get user rewards from Aptos
export const getRewards = async (userAddress) => {
  const response = await client.getAccountResource(userAddress, 'AptosHabitTracking.User');
  return response.data.reward_balance;
};
