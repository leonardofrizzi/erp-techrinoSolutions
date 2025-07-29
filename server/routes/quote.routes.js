import { Router } from 'express';
import { listQuotes, createQuote, getQuoteById, updateQuote } from '../controllers/quote.controller.js';

const router = Router();

router.get('/', listQuotes);
router.post('/', createQuote);
router.get('/:id', getQuoteById);
router.put('/:id', updateQuote);

export default router;