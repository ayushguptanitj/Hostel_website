// src/Contact.js
import React from 'react';
import { useParams } from 'react-router-dom'; // To get the hostel from the URL
import HostelContent from './HostelContent';
import './Contact.css'; // Import your custom CSS for table styling

export const Contact = () => {
  const { hostel } = useParams(); // Get the hostel from the URL
  const currentHostel = HostelContent[hostel]; // Fetch the hostel content dynamically
  
  if (!currentHostel) {
    return <h1>Hostel not found</h1>; // Display an error if the hostel doesn't exist
  }

  return (
    <>
      
      <table className="custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th>NAME</th>
            <th>POSITION</th>
            <th>CONTACT NUMBER</th>
            <th>EMAIL</th>
          </tr>
        </thead>
        <tbody>
          {currentHostel.staff.map((staffMember) => (
            <tr key={staffMember.id}>
              <td>{staffMember.id}</td>
              <td>{staffMember.name}</td>
              <td>{staffMember.position}</td>
              <td>{staffMember.contact}</td>
              <td>{staffMember.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
