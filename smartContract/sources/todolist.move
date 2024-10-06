module MyModule::HabitTracker {
    use aptos_framework::account;
    use aptos_framework::signer;
    use aptos_framework::event;
    use std::vector;
    use aptos_std::table::{Self, Table};
    use std::string::String;

    // Error codes
    const E_IS_NOT_INITIALIZED: u64 = 1;
    const E_HABIT_DOESNT_EXIST_IN_CONTRACT: u64 = 2;
    const E_HABIT_IS_COMPLETED: u64 = 3;

    /// Struct representing a habit.
    struct Habit has store, key {
        id: u64,
        owner: address,         // Address of the habit owner
        name: vector<u8>,      // Name of the habit
        reward: u64,           // Reward points for completing the habit
        completed: bool,       // Whether the habit is completed
    }

    /// Struct representing a habit list.
    struct HabitList has key {
        habits: Table<u64, Habit>,
        set_habit_event: event::EventHandle<Habit>,
        habit_counter: u64,
    }

    /// Function to initialize a habit list for the account.
    public entry fun initialize_habit_list(account: &signer) {
        let habit_list = HabitList {
            habits: table::new(),
            set_habit_event: account::new_event_handle<Habit>(account),
            habit_counter: 0,
        };
        move_to(account, habit_list);
    }

    /// Function to add a new habit.
    public entry fun add_habit(account: &signer, name: vector<u8>) acquires HabitList {
        let signer_address = signer::address_of(account);
        assert!(exists<HabitList>(signer_address), E_IS_NOT_INITIALIZED);
        let habit_list = borrow_global_mut<HabitList>(signer_address);
        
        // Increment the habit counter
        let counter = habit_list.habit_counter + 1;

        // Create new habit
        let new_habit = Habit {
            id: counter,
            owner: signer_address,
            name,
            reward: 0,
            completed: false,
        };

        // Add the new habit to the table
        table::upsert(&mut habit_list.habits, counter, new_habit);
        habit_list.habit_counter = counter;

        // Emit event for the new habit
        event::emit_event<Habit>(
            &mut borrow_global_mut<HabitList>(signer_address).set_habit_event,
            new_habit
        );
    }

    /// Function to mark a habit as completed.
    public entry fun complete_habit(account: &signer, habit_id: u64) acquires HabitList {
        let signer_address = signer::address_of(account);
        assert!(exists<HabitList>(signer_address), E_IS_NOT_INITIALIZED);
        let habit_list = borrow_global_mut<HabitList>(signer_address);
        
        // Check if the habit exists
        assert!(table::contains(&habit_list.habits, habit_id), E_HABIT_DOESNT_EXIST_IN_CONTRACT);
        let habit_record = table::borrow_mut(&mut habit_list.habits, habit_id);

        // Check if the habit is already completed
        assert!(!habit_record.completed, E_HABIT_IS_COMPLETED);
        habit_record.completed = true;

        // Increment the reward points (example: 10 points)
        habit_record.reward= habit_record.reward + 10;
    }
}
