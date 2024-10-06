import React from 'react';
import { List, Button } from 'antd';
import { completeTask } from '../utils/aptos';

const TaskList = ({ tasks, userAddress, refreshTasks }) => {
  const handleComplete = async (taskId) => {
    await completeTask(taskId, userAddress);
    refreshTasks();
  };

  return (
    <List
      bordered
      dataSource={tasks}
      renderItem={(task) => (
        <List.Item>
          <div style={{ flexGrow: 1 }}>
            {task.name} {task.completed && '(Completed)'}
          </div>
          <Button
            onClick={() => handleComplete(task.id)}
            disabled={task.completed}
          >
            Complete
          </Button>
        </List.Item>
      )}
    />
  );
};

export default TaskList;
