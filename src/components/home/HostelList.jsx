import React from 'react';
import { Link } from 'react-router-dom';
import './HostelList.css';

const HostelList = () => {
    const boysHostels = [
        { name: 'Krishna Boys Hostel', key: 'BH-1' },
        { name: 'Sutlej Boys Hostel', key: 'BH-2' },
        { name: 'Beas Boys Hostel', key: 'BH-3' },
        { name: 'Ravi Boys Hostel', key: 'BH-4' },
        { name: 'Chenab Boys Hostel', key: 'BH-5' },
        { name: 'Jhelum Boys Hostel', key: 'BH-6' },
        { name: 'Brahmaputra Boys Hostel', key: 'BH-7' },
        { name: 'Narmada Boys Hostel', key: 'MBH-A-Block' },
        { name: 'Godavari Boys Hostel', key: 'MBH-B-Block' },
        { name: 'Bhagirathi Boys Hostel', key: 'MBH-E-Block' },
        { name: 'Sabarmati Boys Hostel', key: 'MBH-F-Block' },
    ];

    const girlsHostels = [
        { name: 'Sarsawati Girls Hostel', key: 'girls-hostel-1' },
        { name: 'Ganga Girls Hostel', key: 'girls-hostel-2' },
        { name: 'Alaknanda Girls Hostel', key: 'mega-girls-hostel-1' },
        { name: 'Yamuna Girls Hostel', key: 'MGH-Phase-II' },
    ];

    const boysMid = Math.ceil(boysHostels.length / 2);

    return (
        <div className="mainDiv">
            <div className="hostel-category">
                <h2>Boys' Hostels</h2>
                <div className="hostel-columns">
                    <ul className="hostel-list">
                        {boysHostels.slice(0, boysMid).map((hostel) => (
                            <li key={hostel.key} className="hostel-item">
                                <Link to={`/${hostel.key}`}>
                                    <span className="arrow">➔</span> {hostel.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <ul className="hostel-list">
                        {boysHostels.slice(boysMid).map((hostel) => (
                            <li key={hostel.key} className="hostel-item">
                                <Link to={`/${hostel.key}`}>
                                    <span className="arrow">➔</span> {hostel.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="hostel-category">
                <h2>Girls' Hostels</h2>
                <ul className="hostel-list">
                    {girlsHostels.map((hostel) => (
                        <li key={hostel.key} className="hostel-item">
                            <Link to={`/${hostel.key}`}>
                                <span className="arrow">➔</span> {hostel.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default HostelList;
