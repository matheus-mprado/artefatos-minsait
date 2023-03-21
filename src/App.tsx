import "./style/global.css";

import {
  Button,
  Flex,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdOutlineContentCopy } from "react-icons/md";

import { listTechs } from "./utils/listTechs";
import { ModalGitConfig } from "./components/ModalGitConfig";

interface ArtifactsProps {
  added: string[];
  modified: string[];
}

function App() {
  const [text, setText] = useState("");
  const [tech, setTech] = useState("java");
  const [regexTech, setRegexTech] = useState<RegExp | string>("");
  const [artifacts, setArtifacts] = useState<ArtifactsProps>(
    {} as ArtifactsProps
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  function handleSelectTech(tech: string) {
    switch (tech) {
      case "java":
        setRegexTech(RegExp(/\.java/g));
        break;
      case "html":
        setRegexTech(RegExp(/\.html/g));
        break;
      case "react":
        setRegexTech(RegExp(/\.tsx?/g));
        break;
      case "javascript":
        setRegexTech(RegExp(/\.jsx?/g));
        break;
      case "css":
        setRegexTech(RegExp(/\.css/g));
        break;
      case "test":
        setRegexTech(RegExp(/\.(test|spec)/g));
        break;
      default:
        setRegexTech("");
        break;
    }

    setTech(tech);
  }

  function handleGenerateArtefacts() {
    let aux = "";

    var sanitized = text
      .replace(/\t/g, " ")
      .replace(/format|commit|formatcommit|:/g, " ")
      .split("\n")
      .map((item) => {
        if (item.match(/#/g)) {
          aux = item;
        }
        item = item + aux;

        item = item.trim();
        return item.replace(/ /g, "");
      })
      .filter((item) => item[0] !== "#")
      .sort((a, b) => a.localeCompare(b))
      .filter((item) => item.match(regexTech));

    // sanitized.map((item) => {
    //   if (item.slice(item.indexOf("#") + 1).length) {
    //     console.log("hash do commit invalido, faltando valores")
    //   }
    // });

    let modified = sanitized
      .filter((item) => item[0] === "M")
      .map((item) => item.slice(1));

    let added = sanitized
      .filter((item) => item[0] === "A")
      .map((item) => item.slice(1));

    const artifactsData = {
      added,
      modified,
    };

    setArtifacts(artifactsData);
  }

  function handleClipboardArtifacts(artfacts: string[]) {
    navigator.clipboard.writeText(artfacts.join(" "));
    toast({
      title: "Artefato Copiado",
      description: "Artefatos em sua área de transferencia",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  }

  return (
    <Flex flexDir="column" px="2rem" py="2rem" bg="#05040E" h="100vh" w="100%">
      <Flex mb="1.5rem" gap="2rem" align="baseline">
        <Text color="#fafafa" fontWeight={600} fontSize="1.75rem">
          GenAtf
        </Text>
        <Text
          color="#e6e6e6"
          fontSize="0.875rem"
          cursor="pointer"
          onClick={onOpen}
        >
          Git Log
        </Text>
      </Flex>
      <Flex h="100%">
        <Flex flexDir="column" w="50%" mr="1rem" align="flex-start">
          <Flex flexDir="row" gap="1.25rem" mb="2rem">
            {listTechs.map((item) => {
              return (
                <Flex
                  key={item}
                  onClick={() => handleSelectTech(item)}
                  cursor="pointer"
                >
                  <Text color={item === tech ? "#fafafa" : "#7d7d7d"}>
                    {item}
                  </Text>
                </Flex>
              );
            })}
          </Flex>

          <Textarea
            bg="#0a0915"
            mb="2rem"
            border="none"
            onChange={(e) => setText(e.target.value)}
            placeholder="Preencha com seu git log"
            color="#e6e6e6"
            py="0.75rem"
            fontSize="0.875rem"
            h="100%"
            resize="none"
          ></Textarea>
          <Button
            bg="#06BA83"
            px="3rem"
            py="1rem"
            color="white"
            onClick={handleGenerateArtefacts}
            _hover={{
              bg: "#036748",
            }}
          >
            Gerar Artefatos
          </Button>
        </Flex>
        <Flex
          w="50%"
          h="100%"
          maxH="30rem"
          flexDir="column"
          overflowY="auto"
          gap="1rem"
        >
          {artifacts?.added?.length > 0 && (
            <Flex flexDir="column">
              <Flex align="center" gap="0.75rem">
                <Text fontSize="1.35rem" fontWeight={500} color="#fafafa">
                  {artifacts?.added?.length}{" "}
                  {artifacts?.added?.length > 1 ? "Adicionados" : "Adicionado"}
                </Text>
                <MdOutlineContentCopy
                  color="#fafafa"
                  cursor="pointer"
                  onClick={() => handleClipboardArtifacts(artifacts.added)}
                />
              </Flex>
              {artifacts.added.map((item) => {
                return (
                  <Text fontSize="0.875rem" color="#7d7d7d">
                    {item}
                  </Text>
                );
              })}
            </Flex>
          )}

          {artifacts?.modified?.length > 0 && (
            <Flex flexDir="column">
              <Flex align="center" gap="0.75rem">
                <Text fontSize="1.35rem" fontWeight={500} color="#fafafa">
                  {artifacts?.modified?.length}{" "}
                  {artifacts?.modified?.length > 1
                    ? "Modificados"
                    : "Modificado"}
                </Text>
                <MdOutlineContentCopy
                  color="#fafafa"
                  cursor="pointer"
                  onClick={() => handleClipboardArtifacts(artifacts.modified)}
                />
              </Flex>
              {artifacts.modified.map((item) => {
                return (
                  <Text fontSize="0.875rem" color="#7d7d7d">
                    {item}
                  </Text>
                );
              })}
            </Flex>
          )}
        </Flex>
      </Flex>
      <ModalGitConfig isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}

export default App;
