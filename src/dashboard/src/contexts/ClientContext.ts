"use client";

import { createContext, useContext } from 'react';

const ClientContext = createContext(false);

export const useClient = () => {
    const isClient = useContext(ClientContext);
    return isClient;
};

export default ClientContext;