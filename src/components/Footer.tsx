import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box as="footer" width="full" py="5" >
      <Flex justifyContent="center" alignItems="center">
        <Text fontSize="md">
            no copyright, fully decentralized and made with ❤️ for self sovereign identity
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
