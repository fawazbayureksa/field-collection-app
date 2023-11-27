import React from 'react';

export const navigationRef: React.RefObject<any> = React.createRef();

export const navigate = (name: string, params?: object) => {
    if (navigationRef.current) {
        navigationRef.current.navigate(name, params);
    }
};
