import React from "react";
import { SVGProps } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

export default function Logo(props: any) {
  return (
    <Box {...props}>
      <GentlemanHatSVG />     
    </Box>
  );
}

function GentlemanHatSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <Flex direction="row" align="center">
      <svg
        width={props.width || "100"} // Reduced width for a smaller logo
        height={props.height || "100"} // Reduced height for a smaller logo
        viewBox="0 0 100 100" // Reduced viewBox for a smaller and more detailed logo
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <ellipse cx="50" cy="75" rx="35" ry="10" fill="#333" /> // Adjusted for new viewBox
        <rect x="30" y="25" width="40" height="50" fill="#333" /> // Adjusted for new viewBox
        <path d="M30 25c-5 0-5-5-5-5h50s0 5-5 5H30z" fill="#555" /> // Adjusted for new viewBox
        <circle cx="50" cy="40" r="5" fill="#777" /> // Adjusted for new viewBox
      </svg>
      <Text fontSize="xl" fontWeight="bold" ml="4">
        dgenDID
      </Text>
    </Flex>
  );
}

