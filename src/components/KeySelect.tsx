import React, { useState } from 'react';
import { Button, Input, Select, useToast } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

interface KeySelectProps {
    onKeySubmit: (key: string) => void;
}

const KeySelect: React.FC<KeySelectProps> = ({ onKeySubmit }) => {
    const { isConnected, address: connectedAddress } = useAccount();
    const [selectedKey, setSelectedKey] = useState('');
    const [manualKey, setManualKey] = useState('');
    const toast = useToast();

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedKey(e.target.value);
        onKeySubmit(e.target.value);
    };

    const handleManualKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setManualKey(e.target.value);
        onKeySubmit(e.target.value);
    };

    return (
        <div>
            {isConnected && (
                <Select placeholder="Select key" onChange={handleSelectChange} value={selectedKey}>
                    <option value={connectedAddress}>Use connected account ({connectedAddress})</option>
                    <option value="manual">Enter manually</option>
                </Select>
            )}
            {selectedKey === 'manual' && (
                <Input placeholder="Enter public key manually" value={manualKey} onChange={handleManualKeyChange} />
            )}
        </div>
    );
};

export default KeySelect;
