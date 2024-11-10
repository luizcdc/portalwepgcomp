import { UserContext } from '@/context/user';
import { useContext } from 'react';

export const useUsers = () => useContext(UserContext);
