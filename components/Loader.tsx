

import React from 'react';

type LoaderType = {
    show: boolean;
}

/**
 * Loader component
 * @param show boolean to show or hide the loader
 * @returns {JSX.Element} Loader component or null
 */
const Loader = ({ show }: LoaderType) => {
    if (show) {
        return (
            <div className="loader" />
        )
    }
    return null
}

export default Loader;
