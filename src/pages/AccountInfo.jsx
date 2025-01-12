import React, { useState, useEffect } from 'react';
import { Container, Card, Alert } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AccountInfo = () => {
    const { user, isAuthenticated } = useCart();
    const [taxid, setTaxId] = useState(null);
    const backendUrl = "http://localhost:5001";
  
    useEffect(() => {
        const fetchTaxId = async () => {
          try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`${backendUrl}/api/users/tax-id`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.taxId) {
              setTaxId(response.data.taxId);
            }
          } catch (error) {
            console.error('Failed to fetch tax ID:', error);
          }
        };
    
        if (isAuthenticated) {
          fetchTaxId();
        }
    }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center shadow-sm">
          Please <Link to="/login" className="font-bold text-primary hover:text-primary-dark">log in</Link> to view your account information.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Account Information</h2>
      </div>
      
      <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
        <Card.Header className="bg-primary text-white py-3">
          <h4 className="mb-0 font-semibold">Personal Details</h4>
        </Card.Header>
        <Card.Body className="bg-white p-4">
          <div className="grid gap-4">
            <div className="p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
              <h6 className="text-sm text-gray-600 mb-1">Customer ID</h6>
              <p className="text-gray-900 font-medium">{user?.id}</p>
            </div>

            <div className="p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
              <h6 className="text-sm text-gray-600 mb-1">Name</h6>
              <p className="text-gray-900 font-medium">{user?.name}</p>
            </div>

            <div className="p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
              <h6 className="text-sm text-gray-600 mb-1">Tax ID</h6>
              <p className="text-gray-900 font-medium">{taxid}</p>
            </div>

            <div className="p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
              <h6 className="text-sm text-gray-600 mb-1">Email Address</h6>
              <p className="text-gray-900 font-medium">{user?.email}</p>
            </div>

            <div className="p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
              <h6 className="text-sm text-gray-600 mb-1">Home Address</h6>
              <p className="text-gray-900 font-medium">{user?.address}</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AccountInfo;