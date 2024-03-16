import React from 'react';
import { Box, Button, Tooltip, useClipboard, useToast } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';

interface LongStringProps {
    text: string;
    maxLength?: number;
}

const LongString: React.FC<LongStringProps> = ({ text, maxLength = 16 }) => {
    const toast = useToast();
    const { hasCopied, onCopy } = useClipboard(text);
    const displayText = text.length > maxLength ? `${text.substring(0, Math.floor(maxLength / 2))}...${text.substring(text.length - Math.floor(maxLength / 2), text.length)}` : text;

    const onClick = ()=>{
        onCopy();
        toast({
            title: `Copied "${text}" to clipboard.`,
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
    }

    return (
        <Box display="flex" alignItems="center">
            <Tooltip label={text} aria-label="Full text tooltip">
                {displayText}
            </Tooltip>
            <Button onClick={onClick} size="xs" ml={2}>
                {hasCopied ? 'Copied' : <CopyIcon />}
            </Button>
        </Box>
    );
};

export default LongString;
