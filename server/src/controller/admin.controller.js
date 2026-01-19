import User from "../../models/user.model.js";

const getAllUsers = async (req, res) => {
	try {
		const users = await User.find().select("-passwordHash");
		return res.status(200).json({ success: true, users });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "Failed to fetch users" });
	}
};

const getUserById = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id).select("-passwordHash");
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}
		return res.status(200).json({ success: true, user });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "Failed to fetch user" });
	}
};

const updateUserById = async (req, res) => {
	try {
		const { id } = req.params;
		const { username, email, role, isVerified } = req.body;

		const updates = {};
		if (typeof username !== "undefined") updates.username = username;
		if (typeof email !== "undefined") updates.email = email;
		if (typeof phone_number !== "undefined")
			updates.phone_number = phone_number;
		if (typeof role !== "undefined") updates.role = role;
		if (typeof isVerified !== "undefined") updates.isVerified = isVerified;

		const updated = await User.findByIdAndUpdate(
			id,
			{ $set: updates },
			{ new: true, runValidators: true, context: "query" },
		).select("-passwordHash");

		if (!updated) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		return res.status(200).json({ success: true, user: updated });
	} catch (error) {
		if (error && error.code === 11000) {
			return res
				.status(409)
				.json({
					success: false,
					message: "Duplicate key",
					details: error.keyValue,
				});
		}
		return res
			.status(500)
			.json({ success: false, message: "Failed to update user" });
	}
};

const deleteUserById = async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await User.findByIdAndDelete(id);
		if (!deleted) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}
		return res.status(200).json({ success: true, message: "User deleted" });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "Failed to delete user" });
	}
};

export default {
	getAllUsers,
	getUserById,
	updateUserById,
	deleteUserById,
};
