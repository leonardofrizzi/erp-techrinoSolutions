import { Router } from 'express';
import { listClients, createClient, updateClient } from '../controllers/client.controller.js';

const router = Router();

router.get('/', listClients);
router.post('/', createClient);
router.put('/:id', updateClient);

export default router;