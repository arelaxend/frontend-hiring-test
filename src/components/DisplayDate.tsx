import { Flex } from "@aircall/tractor";
import React, { useLayoutEffect, useState } from "react";
import { onlyDate } from "src/hooks/time";
import { Call } from "src/store/get/types";

const DisplayDate = ({
  id,
  node,
  filtered,
  filters
}: {
  id: string;
  node: Call;
  filtered: [string, Call][];
  filters: string[] | undefined;
}) => {
  const [listDates, setListDates] = useState<string[]>([]);
  useLayoutEffect(() => {
    if (!filtered) return;
    if (!filters || !filters.includes("groupbydate")) {
      setListDates([""]);
      return;
    }

    const checked: string[] = [];
    const dates: string[] = [];

    filtered.forEach(([id, node]: [string, Call]) => {
      const date = onlyDate(node.created_at);
      if (!checked.includes(date)) {
        dates.push(id);
        checked.push(date);
      }
    });

    setListDates(dates);
  }, [filtered, filters]);

  return (
    listDates.includes(id) && (
      <Flex
        bg="base.white"
        color="base.black"
        p={3}
        maxWidth={600}
        margin="auto"
      >
        {onlyDate(node.created_at)}
      </Flex>
    )
  ) || null;
};

const areEqual = () => {
  return false;
};

export default React.memo(DisplayDate, areEqual);
