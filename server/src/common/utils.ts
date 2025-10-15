import { v1 as uuid } from 'uuid';

export const generateUUID = () => uuid().replaceAll('-', '');
