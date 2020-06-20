// Node modules
import React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

// Local modules
import './style.css';

interface Props {
    checked: boolean;
    onChange() : void;
}

const BgToggler: React.FC<Props> = ({ onChange, checked }) => {
    return (
        <label className='toggler'>
            <span className={ checked ? 'activated light-border' : 'dark-border' }>
                <FiSun color='white' />
                <FiMoon color='black' />
                <div className={ checked ? 'circle bg-light' : 'circle bg-red' }></div>
            </span>
            <input
                type="checkbox"
                onChange={ onChange }
                checked={ checked }
            />
        </label>
    );
}

export default BgToggler;