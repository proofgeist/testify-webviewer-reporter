import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Test from "./Test";

export default function App() {
  return (
    <ChakraProvider>
      <Test />
    </ChakraProvider>
  );
}
