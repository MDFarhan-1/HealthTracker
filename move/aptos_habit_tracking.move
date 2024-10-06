module AptosHabitTracking {
    // Define a struct to represent a Task
    struct Task has key, store {
        id: u64,
        name: vector<u8>,
        completed: bool,
        completion_count: u64,
    }

    // Define a struct to represent the User's tasks and reward balance
    struct User has key, store {
        tasks: vector<Task>,
        reward_balance: u64,
    }

    // Public function to create a new task
    public fun create_task(user_addr: address, task_name: vector<u8>) {
        let user = borrow_global_mut<User>(user_addr);
        let task_id = vector::length(&user.tasks) as u64; // Task ID is the current length of the vector
        let new_task = Task {
            id: task_id,
            name: task_name,
            completed: false,
            completion_count: 0,
        };
        vector::push_back(&mut user.tasks, new_task);
    }

    // Public function to mark a task as completed
    public fun complete_task(user_addr: address, task_id: u64) {
        let user = borrow_global_mut<User>(user_addr);
        let task = &mut vector::borrow_mut(&mut user.tasks, task_id);
        assert!(!task.completed, 1); // Ensure task is not already completed
        task.completed = true;
        task.completion_count += 1;

        // Check if the task has been completed for 7 consecutive days
        if (task.completion_count >= 7) {
            user.reward_balance += 1; // Add reward
        }
    }

    // Function to get user rewards balance
    public fun get_rewards(user_addr: address): u64 {
        let user = borrow_global<User>(user_addr);
        user.reward_balance
    }
}
