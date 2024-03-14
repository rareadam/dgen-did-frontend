import React from "react";
import { SVGProps } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

export default function Logo(props: any) {
  return (
    <Box {...props}>
      <LogoSVG />     
    </Box>
  );
}

// haha, no svg anymore :see-no-evil:
function LogoSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <Flex direction="row" align="center">
      <Text fontSize="xl" fontWeight="bold" ml="4">
        dgenDID
      </Text>
    </Flex>
  );
}




