import React, { useState, useEffect } from "react";
import { groupBy, set } from "lodash";
import {
  Heading,
  Stack,
  Button,
  Container,
  Text,
  Divider,
  Box,
  List,
  ListItem,
  ListIcon,
  UnorderedList,
  SimpleGrid,
  Flex,
  FormControl,
  FormLabel,
  Switch
} from "@chakra-ui/react";
import {
  PhoneIcon,
  AddIcon,
  CheckCircleIcon,
  WarningTwoIcon
} from "@chakra-ui/icons";
import ReactJson from "react-json-view";
import JsonFormat from "./vendored/js-compare-bundle";

function loadData(data, showAll = false) {
  let filtered = [];
  filtered = data.AllTests.filter(t => {
    if (showAll) return true;
    return !t.PASS;
  });

  const AllTests = groupData(filtered, "GROUP");

  const TotalTests = data.AllTestCount;
  const FailingTests = data.FailingTestCount;
  const PassingTests = TotalTests - FailingTests;
  return { TotalTests, FailingTests, PassingTests, AllTests };
}

export default function Test() {
  const [rawData, setRawData] = useState();
  const [showAllTests, setShowAllTests] = useState(false);

  const toggle = () => {
    setShowAllTests(v => !v);
  };

  window.loadData = d => {
    try {
      d = JSON.parse(d);
    } catch (error) {}

    setRawData(d);
  };

  if (!rawData) return "run tests";

  const data = loadData(rawData, showAllTests);

  return (
    <>
      <Container maxWidth="100%">
        <Heading pb={"18px"} pt={"04px"} as="h2" size="lg">
          Test Results
        </Heading>

        <Divider />

        <Stack spacing="0px" direction="column">
          <Text color="green">Passed: {data.PassingTests}</Text>
          <Text color="red">Failed: {data.FailingTests || 0}</Text>
          <Divider />
          <div style={{ height: "24px" }} />
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="email-alerts" mb="0">
              Show all tests
            </FormLabel>
            <Switch
              color="green"
              isChecked={showAllTests}
              onChange={toggle}
              id="email-alerts"
            />
          </FormControl>
          <div style={{ height: "24px" }} />
          <Groups data={data.AllTests} />
        </Stack>
      </Container>
    </>
  );
}

function Groups({ data }) {
  return (
    <Box>
      {data.map(g => (
        <Group key={g.name} data={g} />
      ))}
    </Box>
  );
}

function Group({ data }) {
  const color = data.hasAFailure ? "red" : "green";
  return (
    <Box key={data.name}>
      <Text fontSize="xl">
        <LabelSpan>Group: </LabelSpan> {data.name}
      </Text>
      <Box pl="27px" pb={"24px"}>
        <TestSubjects data={data.data} />
      </Box>
    </Box>
  );
}

function LabelSpan({ children }) {
  return (
    <span style={{ color: "var(--chakra-colors-gray-500)" }}>{children}</span>
  );
}

function TestSubjects({ data }) {
  const groupedByName = groupData(data, "NAME");

  return (
    <List>
      {groupedByName.map(i => {
        return <TestResult key={i.name} data={i}></TestResult>;
      })}
    </List>
  );
}

function TestResult({ data }) {
  return (
    <ListItem>
      <Text fontSize="sm">
        <LabelSpan>Test:</LabelSpan> {data.name}
      </Text>
      <List ml="48px" mb="12px">
        {data.data.map(i => {
          return <Assertion key={i.ASSERTION} data={data} i={i} />;
        })}
      </List>
    </ListItem>
  );
}

function Assertion({ i }) {
  const [showDetails, setShowDetails] = useState(false);
  const toggle = () => {
    setShowDetails(v => !v);
  };
  const color = !i.PASS ? "red.500" : "green.500";
  const Icon = !i.PASS ? WarningTwoIcon : CheckCircleIcon;
  const expectedIsObject = typeof i.EXPECTED === "object";
  i.expectedIsObject = expectedIsObject;

  return (
    <ListItem key={i.ASSERTION}>
      <ListIcon fontSize="sm" as={Icon} color={color} />
      <Text as="span" fontSize="sm">
        <LabelSpan>Assertion: </LabelSpan>
      </Text>
      <Button onClick={toggle} size="sm" variant="link" colorScheme="blue">
        {i.ASSERTION}
      </Button>
      {false && (
        <ExpectedVsActualList
          actual={i.ACTUAL}
          expected={i.EXPECTED}
          expectedIsObject={expectedIsObject}
          pass={i.PASS}
        />
      )}
      <Display show={showDetails} data={i} />
    </ListItem>
  );
}

function Display({ show, data }) {
  if (!show) return null;
  return (
    <Flex mt={"8px"}>
      <Box
        flex="1"
        style={{
          border: "1px solid var(--chakra-colors-gray-200)",
          overflowWrap: "anywhere"
        }}
        bg="gray.50"
        p="18px"
        ml="-60px"
        mr="12px"
      >
        <Text>Parameter</Text>
        <ReactJson
          name={false}
          displayDataTypes={false}
          collapseStringsAfterLength={30}
          src={data.PARAMETER}
        />
        <Text paddingTop="12px">Result</Text>
        <ReactJson
          src={data.RESULT}
          name={false}
          displayDataTypes={false}
          collapseStringsAfterLength={30}
        />
      </Box>

      <Box
        flex={data.expectedIsObject ? 2 : 1}
        style={{ border: "1px solid var(--chakra-colors-gray-200)" }}
        bg="gray.50"
        p="18px"
      >
        <Text color={data.PASS ? "" : "red.500"}>Expected vs Actual</Text>

        <Compare
          expected={data.EXPECTED}
          actual={data.ACTUAL}
          pass={data.PASS}
          expectedIsObject={data.expectedIsObject}
        />
      </Box>
    </Flex>
  );
}

function Compare(props) {
  if (props.expectedIsObject) {
    return <ExpectedVsActualJSON {...props} />;
  } else {
    return <ExpectedVsActualList {...props} />;
  }
}

function ExpectedVsActualJSON({ actual, expected, pass }) {
  const actualIsNotAnObject = typeof actual !== "object";

  if (pass || actualIsNotAnObject) {
    return (
      <Flex>
        <Box fontSize="sm" flex={1}>
          <pre>{JSON.stringify(expected, null, "  ")}</pre>
        </Box>

        <Box fontSize="sm" flex={1}>
          <pre>{JSON.stringify(actual, null, "  ")}</pre>
        </Box>
      </Flex>
    );
  }

  return <Box fontSize="sm">{JsonFormat(expected, actual)}</Box>;
}

function ExpectedVsActualList({ actual, expected, pass }) {
  const color = pass ? "green.500" : "red.500";
  const actualIobject = typeof actual === "object";
  return (
    <UnorderedList ml="32px">
      <ListItem>
        <Text fontSize="sm" color={color} as="span">
          Expected: {expected}
        </Text>
      </ListItem>
      <ListItem>
        <Text fontSize="sm" color={color} as="span">
          Actual: {actualIobject ? JSON.stringify(actual) : actual}
        </Text>
      </ListItem>
    </UnorderedList>
  );
}

function groupData(data, groupField) {
  const n = groupBy(data, groupField);
  const s = Object.keys(n).map(key => {
    const d = n[key];
    const failedItem = d.find(i => {
      return !i.PASS;
    });
    const hasAFailure = failedItem ? true : false;
    return {
      name: key,
      data: d,
      hasAFailure
    };
  });

  return s;
}
