

import { Delivery } from '../models/index.js';

const getDelivery = async (req, res) => {
    try {
        const deliveries = await Delivery.findAll();
        return res.json(deliveries);
    } catch (error) {
        console.error(error);
        return res.status(500).json({msg: error.message});
    }
}

const editDelivery = async (req, res) => {
    const { id } = req.params;
    const { envio_costo, envio_extra, distancia } = req.body;
    try {
        const delivery = await Delivery.findByPk(id);
        if (!delivery) {
            return res.status(404).json({msg: 'Delivery not found'});
        }
        await delivery.update({ envio_costo, envio_extra, distancia });
        return res.status(200).json({msg: 'Delivery updated successfully'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({msg: error.message});
    }
}

export { getDelivery,
    editDelivery };

