import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box as="footer" width="full" py="5" backgroundColor="gray.800" color="white">
      <Flex justifyContent="center" alignItems="center">
        <Text fontSize="md">
            No copyright, fully decentralized and made with ❤️ for SSI
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
