import { Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import { listTechs } from "../../utils/listTechs";

interface ListTechBarProps {
  selectedTech: string;
  handleSelectTech: (name: string) => void;
}

export function ListTechBar({
  selectedTech,
  handleSelectTech,
}: ListTechBarProps) {
  return (
    <Flex flexDir="row" gap="1.25rem" mb="2rem">
      {listTechs.map((item) => {
        return (
          <Flex
            key={item.name}
            onClick={() => handleSelectTech(item.name)}
            cursor="pointer"
          >
            <Tooltip label={item.ext}>
              <img src={`/logos/${item.imagePath}`} />
              {/* <Text color={item.name === selectedTech ? "#fafafa" : "#7d7d7d"}>
                {item.name}
              </Text> */}
            </Tooltip>
          </Flex>
        );
      })}
    </Flex>
  );
}
