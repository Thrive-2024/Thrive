import React, { useEffect, useState } from 'react';
import './Home.css';
import { Navbar } from '../../Navbar';

export const Home = () => {

    useEffect(() => {
    }, []);

    return (
        <div>
            <Navbar />
            <h1>Home page</h1>
        </div>
    )
}