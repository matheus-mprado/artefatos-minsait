import "./style/global.css";

import {
  Button,
  Flex,
  Input,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdOutlineContentCopy } from "react-icons/md";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";

import { listTechs } from "./utils/listTechs";
import { ModalGitConfig } from "./components/modals/ModalGitConfig";
import { ListTechBar } from "./components/core/ListTechBar";
import { format } from "date-fns";

interface ArtifactsProps {
  added: string[];
  modified: string[];
}

function App() {
  const [text, setText] = useState("");
  const [tech, setTech] = useState("typescript");
  const [chaveC, setChaveC] = useState("");
  const [dateLog, setDateLog] = useState("");
  const [project, setProject] = useState("");
  const [regexTech, setRegexTech] = useState<RegExp | string>(/\.jsx?/g);
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
      case "typescript":
        setRegexTech(RegExp(/\.tsx?/g));
        break;
      case "javascript":
        setRegexTech(RegExp(/\.jsx?/g));
        break;
      case "css":
        setRegexTech(RegExp(/\.(css|scss|sass)\b/g));
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
    if (!project) {
      toast({
        title: "Nome do projeto inválido",
        description: "Preencha o nome do projeto",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    if (!text) {
      toast({
        title: "Hash do projeto inválido",
        description: "Preencha o git log",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

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
      .map((item) => project + "/" + item.slice(1));

    let added = sanitized
      .filter((item) => item[0] === "A")
      .map((item) => project + "/" + item.slice(1));

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

  function handleGenerateGitLog() {
    if (!dateLog || !chaveC) {
      toast({
        title: "Erro ao gerar Log",
        description: "Preencha os campos obrigatórios",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    localStorage.setItem("@genAtf:chaveC", chaveC);

    const dateFormatted = format(new Date(dateLog), "yyyy-MM-dd");
    const gitLog = `git log --name-status --author=${chaveC} --after="${dateFormatted}" --pretty=format:'commit: #%h' > hashOF.txt`;

    navigator.clipboard.writeText(gitLog);
    toast({
      title: "Git log Gerado",
      description: "Git log copiado para sua área de transferencia",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  }

  useEffect(() => {
    const storagedChaveC = localStorage.getItem("@genAtf:chaveC");
    if (storagedChaveC !== null) {
      setChaveC(storagedChaveC);
    }
  }, []);

  return (
    <Flex flexDir="column" px="2rem" py="2rem" bg="#05040E" h="100vh" w="100%">
      <Flex mb="1.5rem" align="center" justify="space-between">
        <Flex gap="2rem" align="baseline">
          <Text color="#fafafa" fontWeight={600} fontSize="1.75rem">
            GenAtf
          </Text>
          <Text
            color="#e6e6e6"
            fontSize="0.875rem"
            cursor="pointer"
            onClick={onOpen}
          >
            Git Config
          </Text>
        </Flex>
        <Flex flexDir="column">
          <Text fontSize="0.625rem" color="#fafafa" mb="0.35rem">Gerar git log</Text>
          <Flex align="center" gap="0.5rem">
            <Input
              w="8rem"
              placeholder="Chave C"
              fontSize="0.875rem"
              border="none"
              bg="#0a0915"
              color="#e6e6e6"
              value={chaveC}
              onChange={(e) => setChaveC(e.target.value)}
            />
            <Input
              w="10rem"
              type="date"
              fontSize="0.875rem"
              border="none"
              bg="#0a0915"
              color="#e6e6e6"
              value={dateLog}
              onChange={(e) => setDateLog(e.target.value)}
            />
            <Tooltip label="Gerar Git Log" placement="auto">
              <HiOutlineClipboardDocumentCheck
                cursor="pointer"
                color="#fafafa"
                onClick={handleGenerateGitLog}
                size="1.25rem"
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
      <Flex h="100%" flexDir={["column", "row"]}>
        <Flex flexDir="column" w={["100%", "50%"]} mr="1rem" align="flex-start">
          <ListTechBar
            handleSelectTech={handleSelectTech}
            selectedTech={tech}
          />

          <Flex mb="2rem" h="100%" w="100%" flexDir="column" align="flex-start">
            <Input
              mb="1rem"
              placeholder="Nome do Projeto"
              fontSize="0.875rem"
              border="none"
              bg="#0a0915"
              color="#e6e6e6"
              onChange={(e) => setProject(e.target.value)}
              value={project}
            />
            <Textarea
              bg="#0a0915"
              border="none"
              onChange={(e) => setText(e.target.value)}
              placeholder="Preencha com seu git log"
              color="#e6e6e6"
              py="0.75rem"
              fontSize="0.875rem"
              h="100%"
              resize="none"
            ></Textarea>
          </Flex>
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
          w={["100%", "50%"]}
          mt={["2rem", "0"]}
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
                  <Text key={item} fontSize="0.875rem" color="#7d7d7d">
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
                  <Text key={item} fontSize="0.875rem" color="#7d7d7d">
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
