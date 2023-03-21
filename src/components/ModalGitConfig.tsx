import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Code,
  Flex,
} from "@chakra-ui/react";

interface ModalGitConfigProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalGitConfig({ isOpen, onClose }: ModalGitConfigProps) {
  const textGitLog = `git log --name-status --author=SUA_CHAVE_C --after="yyyy-mm-dd" --pretty=format:'commit: #%h' > hashOF.txt`;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent pb="1rem">
          <ModalHeader>Git Log Config</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="0.75rem" mb="0.25rem">
              Config Global no Git
            </Text>
            <Flex flexDir="column" gap="0.25rem" mb="1rem" >
              <Code>git config --global log.abbrevcommit yes</Code>
              <Code>git config --global core.abbrev 10</Code>
            </Flex>
            <Text fontSize="0.75rem" mb="0.25rem">
              Gerando seu log
            </Text>
            <Code>{textGitLog}</Code>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
