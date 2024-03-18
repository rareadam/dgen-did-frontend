import React from "react";
import { SVGProps } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

import logoLight from "./logo_light_background.png";
import logoDark from "./logo_dark_background.png";

import { useColorMode } from "@chakra-ui/react";

export default function Logo(props: any) {
  const { colorMode } = useColorMode();
  return (
    <Box {...props}>
      <img src={colorMode === "light" ? logoLight : logoDark} />
    </Box>
  );
}





