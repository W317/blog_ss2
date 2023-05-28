import userModel from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import path from 'path'
import fs from "fs"
const __dirname = path.resolve();

const deleteUser = asyncHandler(async (req, res) => {
    try {
      const user = await userModel.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(204).redirect('back');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
})

// Get a single user by ID
const getOneUser = asyncHandler(async (req, res) => {
  try {
    const user = await userModel.findById(req.session.passport.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    };

    const date = user.dayJoined.toLocaleDateString("en-US", options);

    res.render(path.join(__dirname + "/src/views/profile.handlebars"), {
      layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
      user: { ...user._doc, dayJoined: date },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
})


// Create a new user
const createUser = asyncHandler(async (req, res) => {
  const { username, email, address, phone, password, isAdmin, image } = req.body;
  const user = await userModel.create({ username, email, address, phone, password, isAdmin, image });
  res.status(201).json(user);
});

// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userModel.find({});
  res.json(users);
});




// Update a user by ID
const updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imagePath = user.image; // set the image path to the old image by default

    // Check if a new file was uploaded
    if (req.file) {
      // If a new file was uploaded, update the image path with the new file
      imagePath = `/img/${req.file.filename}`;
    }

    // Update the user's image
    user.image = imagePath;
    await user.save();

    res.status(302).redirect("/pages/user/profile");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

const getEditUser = asyncHandler(async (req, res) => {
  try {
      const user = await userModel.findById(req.params.id).lean();
        res.render(path.join(__dirname + "/src/views/account.handlebars"), {
          layout: path.join(__dirname + "/src/views/layout/main.handlebars"),
          user: user,
        });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
})

export {getOneUser, getEditUser, updateUser, deleteUser}