import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { createTask } from '../utils/aptos';

const AddTask = ({ userAddress, refreshTasks }) => {
  const [visible, setVisible] = useState(false);
  const [taskName, setTaskName] = useState('');

  const handleAddTask = async () => {
    await createTask(taskName, userAddress);
    setTaskName('');
    setVisible(false);
    refreshTasks();
  };

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Add Task
      </Button>
      <Modal
        title="Add New Task"
        visible={visible}
        onOk={handleAddTask}
        onCancel={() => setVisible(false)}
      >
        <Input
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task Name"
        />
      </Modal>
    </>
  );
};

export default AddTask;
