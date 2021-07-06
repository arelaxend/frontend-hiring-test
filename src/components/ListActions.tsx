import { Button, Checkbox, Flex, Spacer } from "@aircall/tractor";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useSelector } from "../store";
import { setSelected, setToarchived } from "../store/get/actions";
import { Call } from "../store/get/types";
import FilterCall from "./FilterCall";
import Pagination from "./Pagination";

const ListActions = ({
  hasNextPage,
  allSelected,
  toggleAll,
  selections,
}: {
  hasNextPage: boolean;
  allSelected: boolean;
  toggleAll: () => void;
  selections: string[];
}) => {
  const dispatch = useDispatch();
  const { selected } = useSelector((state: any) => state.get);

  useEffect(() => {
    dispatch(setSelected(selections));
  }, [dispatch, selections]);

  const hasArchived = selected
    .map(([, node]: [string, Call]) => node.is_archived)
    .includes(true);

  const handleArchive = () => {
    const toarchived = selected.filter(
      ([, node]: [string, Call]) => hasArchived === node.is_archived
    ).map(([id,]: [string, Call]) => id);

    if (!toarchived || toarchived.length === 0) return;
    dispatch(setToarchived(toarchived));
  };

  return (
    <Flex
      bg="grey.light"
      color="base.black"
      alignItems="center"
      justifyContent="center"
      borderBottom="1px solid"
      borderColor="secondary.lighter"
      p={3}
      position="fixed"
      width="100%"
      bottom={0}
    >
      <Flex
        color="base.black"
        justifyContent="space-between"
        alignItems="center"
        width={600}
        maxWidth={600}
        pl={3}
        pr={3}
        margin="auto"
        overflow="y"
      >
        <Spacer space="s" justifyContent="center" alignItems="center">
          {<Checkbox checked={allSelected} onChange={toggleAll} />}
          <Button
            size="regular"
            variant={selected.length > 0 ? undefined : "darkGhost"}
            onClick={handleArchive}
          >
            {hasArchived && selected.length > 0 ? "Unarchive" : "Archive"}
          </Button>
        </Spacer>
        <Spacer space="s" justifyContent="center" alignItems="center">
          <FilterCall />
        </Spacer>
        <Pagination hasNextPage={hasNextPage} />
      </Flex>
    </Flex>
  );
};

const areEqual = () => {
  return false;
};

export default React.memo(ListActions, areEqual);
