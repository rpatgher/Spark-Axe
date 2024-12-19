import express from 'express';
import {
    createState,
    createCity,
    getStates,
    getCities,
    editStateOrCity,
    deleteStateOrCity
} from '../controllers/DeliveryController.js';

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

// Obtener todos los estados
router.get('/states', checkAuth, getStates);

// Obtener las ciudades de un estado
router.get('/cities/:state_id', checkAuth, getCities);

// Crear un estado
router.post('/state', checkAuth, createState);

// Crear una ciudad
router.post('/city', checkAuth, createCity);

// Editar un estado o ciudad
router.put('/:id', checkAuth, editStateOrCity);

// Eliminar un estado o ciudad
router.delete('/:id', checkAuth, deleteStateOrCity);

export default router;
