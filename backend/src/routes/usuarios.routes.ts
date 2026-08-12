import { Router } from 'express';
import { getUsuarios, getUsuarioById } from '../controllers/usuarios.controller';

const router = Router();

router.get('/usuarios', getUsuarios);
router.get('/usuarios/:id', getUsuarioById);

export default router;
