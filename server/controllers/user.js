const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AptosClient, FaucetClient, AptosAccount } = require('aptos');

const aptosClient = new AptosClient(process.env.APTOS_NODE_URL);
const faucetClient = new FaucetClient(process.env.APTOS_FAUCET_URL, aptosClient);
require('dotenv').config(); // Load environment variables

// Register User

// exports.registerUser = async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         // Validate input
//         if (!username || !password) {
//             return res.status(400).json({ message: "Username and password are required." });
//         }

//         // Check if user already exists
//         const userExist = await User.findOne({ username });
//         if (userExist) {
//             return res.status(400).json({ message: "Username already exists." }); // Update message for clarity
//         }

//         // Create Aptos account
//         const aptosAccount = new AptosAccount();
        
//         // Hash password
//         const saltRound = 10;
//         const hash_password = await bcrypt.hash(password, saltRound);
        
//         // Create new user
//         const userCreated = await User.create({
//             username,
//             password: hash_password,
//             aptosAddress: aptosAccount.address().toString(),
//             tasks: []
//         });

//         // Fund the new Aptos account
//         await faucetClient.fundAccount(aptosAccount.address(), 5000000);

//         console.log(req.body);

//         // Respond with success
//         res.status(201).json({
//             message: "Registration successful",
//             token: await userCreated.generateToken(),
//             userId: userCreated._id
//         });
//     } catch (error) {
//         console.error(error); // Log error for debugging
//         console.log(error);
//         // Send a generic error message
//         res.status(500).json({ message: "An unexpected error occurred. Please try again." });
//     }
// };
exports.registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if username exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Create Aptos account
        const aptosAccount = new AptosAccount();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to DB
        const newUser = new User({
            username,
            password: hashedPassword,
            aptosAddress: aptosAccount.address().toString(),
            tasks: []
        });
        await newUser.save();

        // Fund account with faucet
        try {
            await faucetClient.fundAccount(aptosAccount.address(), 5000000);
        } catch (error) {
            console.error("Error funding account:", error);
        }        
        res.status(201).json({ message: 'User registered successfully', aptosAddress: aptosAccount.address().toString() });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Create Task
exports.createTask = async (req, res) => {
    const { username, taskName } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const taskExists = user.tasks.find(t => t.taskName === taskName);
        if (taskExists) return res.status(400).json({ message: 'Task already exists' });

        user.tasks.push({ taskName });
        await user.save();

        res.status(201).json({ message: 'Task created successfully', tasks: user.tasks });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Complete Task and Reward User
exports.completeTask = async (req, res) => {
    const { username, taskName } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const task = user.tasks.find(t => t.taskName === taskName);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.completedDays += 1;
        await user.save();

        if (task.completedDays % 7 === 0) {
            try {
                const rewardAmount = 1000000; // 1 APT
                const transaction = await aptosClient.transfer(user.aptosAddress, rewardAmount);
                res.status(200).json({ message: 'Task completed and reward issued', transaction });
            } catch (error) {
                return res.status(500).json({ message: 'Failed to issue reward', error });
            }
        } else {
            res.status(200).json({ message: 'Task completed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
