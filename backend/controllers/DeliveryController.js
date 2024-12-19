import { Op } from 'sequelize';
import { Delivery } from '../models/index.js';

// Create a state
const createState = async (req, res) => {
    try {
        const { state, cost } = req.body;

        if (!state || cost === undefined) {
            return res.status(400).json({ msg: "State and cost are required" });
        }

        const newState = await Delivery.create({
            state,
            city: null, // State-level entry
            cost,
        });

        res.status(201).json(newState);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error creating state", error });
    }
};

// Create a city under a state
const createCity = async (req, res) => {
    try {
        const { state, city, cost } = req.body;

        if (!state || !city || cost === undefined) {
            return res.status(400).json({ msg: "State, city, and cost are required" });
        }

        // Check if the state exists
        const stateEntry = await Delivery.findOne({
            where: {
                state: state, // Match the state name
                city: null,   // Ensure it's a state-level entry
            },
        });

        // If the state does not exist, return an error
        if (!stateEntry) {
            return res.status(404).json({ msg: "State not found. Create the state first." });
        }

        // Create the city and associate it with the state
        const newCity = await Delivery.create({
            state: stateEntry.state, // Associate with the state
            city,                    // Name of the city
            cost,
        });

        res.status(201).json(newCity);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error creating city", error });
    }
};

// Get all states
const getStates = async (req, res) => {
    try {
        const states = await Delivery.findAll({
            where: {
                city: null, 
            },
            attributes: ['id', 'state', 'cost', 'createdAt', 'updatedAt'], // Exclude other fields
        });

        res.status(200).json(states);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error retrieving states", error });
    }
};

// Get cities under a state
const getCities = async (req, res) => {
    try {
        const { state_id } = req.params;

        if (!state_id) {
            return res.status(400).json({ msg: "State ID is required" });
        }

        // Fetch the state entry to ensure it exists
        const stateEntry = await Delivery.findOne({
            where: {
                id: state_id,
                city: null, // Ensure it's a state-level entry
            },
        });

        if (!stateEntry) {
            return res.status(404).json({ msg: "State not found." });
        }

        // Fetch all cities associated with the state
        const cities = await Delivery.findAll({
            where: {
                state: stateEntry.state, // Match the state name
                city: { [Op.ne]: null }, // Exclude state-level entries
            },
        });

        if (cities.length === 0) {
        }

        res.status(200).json(cities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error retrieving cities", error });
    }
};


// Edit a state or city
const editStateOrCity = async (req, res) => {
    try {
        const { id } = req.params;
        const { state, city, cost } = req.body;

        const delivery = await Delivery.findByPk(id);
        if (!delivery) return res.status(404).json({ msg: "Delivery not found" });

        delivery.state = state || delivery.state;
        delivery.city = city || delivery.city;
        delivery.cost = cost;

        await delivery.save();

        res.status(200).json({ msg: "Delivery updated successfully", delivery });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error updating delivery", error });
    }
};

// Delete a state or city
// Delete a state or city
const deleteStateOrCity = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the delivery entry by ID
        const delivery = await Delivery.findByPk(id);
        if (!delivery) return res.status(404).json({ msg: "Delivery not found" });

        // If it's a state, delete all related cities
        if (delivery.city === null) {
            await Delivery.destroy({
                where: {
                    state: delivery.state, // Match the state name
                    city: { [Op.ne]: null }, // Ensure only cities are targeted
                },
            });
        }

        // Delete the state or city
        await delivery.destroy();

        res.status(200).json({ msg: `${delivery.city ? 'City' : 'State'} deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error deleting delivery", error });
    }
};


export { createState, createCity, getStates, getCities, editStateOrCity, deleteStateOrCity };
