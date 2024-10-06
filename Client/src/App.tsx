import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Layout, Row, Col, Button, Spin, List, Checkbox, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import "./App.css";

type Habit = {
  address: string;
  completed_today: boolean;
  content: string;
  habit_id: string;
  reward: number;
  completion_streak: boolean[]; 
};

const aptosConfig = new AptosConfig({ network: Network.DEVNET });

export const aptos = new Aptos(aptosConfig);
export const moduleAddress = "0x0da2178c68352cf9035afbb8750eb9eb6905332a9d0f15bd36b140cba6eaf5eb"; // Update with your module address

function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      address: "0x1",
      completed_today: false,
      content: "Coding",
      habit_id: "1",
      reward: 10,
      completion_streak: [false, true, true, false, false, true, false], 
    },
    {
      address: "0x1",
      completed_today: false,
      content: "Study",
      habit_id: "2",
      reward: 15,
      completion_streak: [true, true, false, false, true, false, true], 
    },
    {
      address: "0x1",
      completed_today: false,
      content: "Sports",
      habit_id: "3",
      reward: 5,
      completion_streak: [false, false, true, true, true, false, true], 
    },
  ]); 
  const [newHabit, setNewHabit] = useState<string>("");
  const { account, signAndSubmitTransaction } = useWallet();
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);

  const onWriteHabit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewHabit(event.target.value);
  };

  const addNewHabit = async () => {
    if (!account) return;
    setTransactionInProgress(true);

    const transaction: InputTransactionData = {
      data: {
        function: `${moduleAddress}::habittracker::create_habit`,
        functionArguments: [newHabit],
      },
    };

    const latestId = habits.length > 0 ? parseInt(habits[habits.length - 1].habit_id) + 1 : 1;
    const newHabitToPush = {
      address: account.address,
      completed_today: false,
      content: newHabit,
      habit_id: latestId + "",
      reward: 10,
      completion_streak: [false, false, false, false, false, false, false], 
    };

    try {
      const response = await signAndSubmitTransaction(transaction);
      await aptos.waitForTransaction({ transactionHash: response.hash });

      setHabits([...habits, newHabitToPush]);
      setNewHabit("");
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const onCheckboxChange = async (event: CheckboxChangeEvent, habitId: string) => {
    if (!account || !event.target.checked) return;
    setTransactionInProgress(true);

    const transaction: InputTransactionData = {
      data: {
        function: `${moduleAddress}::habittracker::complete_habit`,
        functionArguments: [habitId],
      },
    };

    try {
      const response = await signAndSubmitTransaction(transaction);
      await aptos.waitForTransaction({ transactionHash: response.hash });

      setHabits((prevState) =>
        prevState.map((habit) =>
          habit.habit_id === habitId
            ? {
                ...habit,
                completed_today: true,
                reward: habit.reward + 10,
                completion_streak: [...habit.completion_streak.slice(1), true], // Update the streak
              }
            : habit
        )
      );
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  return (
    <>
      <Layout>
        <Row align="middle">
          <Col span={10} offset={2}>
            <h1 className="habit-tracker-title">Habit Tracker</h1>
          </Col>
          <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
            <WalletSelector />
          </Col>
        </Row>
      </Layout>
      <Spin spinning={transactionInProgress}>
        <Row gutter={[0, 32]} className="habit-tracker-container">
          <Col span={24} className="habit-input-container">
            <Input.Group compact>
              <Input
                onChange={onWriteHabit}
                placeholder="Add a Habit"
                size="large"
                value={newHabit}
              />
              <Button onClick={addNewHabit} type="primary">
                Add
              </Button>
            </Input.Group>
          </Col>
          <Col span={24}>
            {habits && (
              <List
                size="small"
                className="habit-list"
                bordered
                dataSource={habits}
                renderItem={(habit: Habit) => (
                  <List.Item className={`habit-item ${habit.content.toLowerCase()}`}>
                    <div style={{ width: "60%" }}>
                      <strong>{habit.content}</strong>
                      <div className="completion-map">
                        {habit.completion_streak.map((completed, index) => (
                          <div
                            key={index}
                            className={`completion-block ${completed ? "completed" : ""} ${habit.content.toLowerCase()}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="checkbox-container">
                      <Checkbox
                        onChange={(event) => onCheckboxChange(event, habit.habit_id)}
                        defaultChecked={habit.completed_today}
                      />
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Col>
        </Row>
      </Spin>
    </>
  );
}

export default HabitTracker;
