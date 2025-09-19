import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

import axios from 'axios';

const SecurityForm = ({ onResult, isLoading, setIsLoading }) => {
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');

  const validateUpiId = (id) => {
    if (!id?.trim()) {
      return 'UPI ID is required';
    }
    
    // Basic UPI ID format validation
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiRegex?.test(id)) {
      return 'Please enter a valid UPI ID (e.g., user@paytm)';
    }
    
    return '';
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const validationError = validateUpiId(upiId);
  if (validationError) {
    setError(validationError);
    return;
  }

  setError('');
  setIsLoading(true);

  try {
    const response = await axios.post(
      'https://ninety-bats-strive.loca.lt/check',
      { upiId: upiId.trim() },
      { headers: { 'Content-Type': 'application/json' } }
    );

    onResult({
      status: response.data?.status || 'UNKNOWN',
      message: response.data?.message || 'Verification completed',
      upiId: upiId.trim()
    });
  } catch (err) {
    onResult({
      status: 'ERROR',
      message: err?.response?.data?.message || 'Unable to verify UPI ID. Please try again.',
      upiId: upiId.trim()
    });
  } finally {
    setIsLoading(false);
  }
};


  const handleInputChange = (e) => {
    setUpiId(e?.target?.value);
    if (error) {
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="UPI ID"
          type="text"
          placeholder="Enter UPI ID (e.g., user@paytm)"
          value={upiId}
          onChange={handleInputChange}
          error={error}
          required
          disabled={isLoading}
          className="text-center"
        />
      </div>
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={!upiId?.trim() || isLoading}
        iconName="Shield"
        iconPosition="left"
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
      >
        {isLoading ? 'Checking...' : 'Check Security'}
      </Button>
    </form>
  );
};

export default SecurityForm;