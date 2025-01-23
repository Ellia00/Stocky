import { useState } from 'react';

const CounterButton = ({ onClick }) => {
    return (
        <button onClick={onClick}>
            Click to earn $1
        </button>
    );
};

export default CounterButton;

