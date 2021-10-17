import React from "react";
import {
  Modal,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalContent,
  Lorem,
  Button
} from "@chakra-ui/react";
import ReactJson from "react-json-view";
import { SimpleGrid } from "@chakra-ui/react";

export function DetailViewModal({ onClose, data }) {
  const isOpen = data ? true : false;

  if (!isOpen) {
    return null;
  }

  const { SCRIPT_RESULT, PARAMETER } = data;
  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <SimpleGrid columns={2} spacing={10}>
          <Box bg="tomato" height="80px"></Box>
          <Box bg="tomato" height="80px"></Box>
        </SimpleGrid>
        <ModalBody>ok</ModalBody>
      </ModalContent>
    </Modal>
  );
}
