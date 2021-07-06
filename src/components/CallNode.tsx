import { ArchiveOutlined, Checkbox, Flex, InformationOutlined, Spacer } from "@aircall/tractor";
import { gql, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { dateTime, onlyTime } from "../hooks/time";
import { useSelector } from "../store";
import { setCall, setToarchived } from "../store/get/actions";
import { Call } from "../store/get/types";
import DisplayDate from "./DisplayDate";
import IconCall from "./IconCall";

export const ARCHIVE_MUTATION = gql`
  mutation archiveCall($id: ID!) {
    archiveCall(id: $id) {
      id
      direction
      from
      to
      duration
      is_archived
      call_type
      via
      created_at
      notes {
        id
        content
      }
    }
  }
`;

const CallNode = ({
  id,
  node,
  filtered,
  filters,
  isSelected,
  toggle,
}: {
  id: string;
  node: Call;
  filtered: any;
  filters: any;
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: any) => state.auth);
  const { toarchived } = useSelector((state: any) => state.get);

  const [archiveCall, { data }] = useMutation(ARCHIVE_MUTATION, {
    variables: { id: (node && node.id) || "" },
    context: { headers: { authorization: `Bearer ${token}` } },
  });

  useEffect(() => {
    if (!node || !toarchived || toarchived.length === 0) return;

    if (toarchived.includes(node.id)) {
      archiveCall();
      dispatch(setToarchived([]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archiveCall, toarchived]);

  useEffect(() => {
    if (!data || !data.archiveCall) return;

    const n = data.archiveCall;
    dispatch(setCall(n.id, n));
  }, [data, dispatch]);

  return (
    <>
      <DisplayDate id={id} node={node} filtered={filtered} filters={filters} />
      <Flex
        bg="grey.lighter"
        color="base.black"
        justifyContent="space-between"
        alignItems="center"
        p={3}
        key={node.id}
        maxWidth={600}
        margin="auto"
        overflow="y"
        borderRadius={8}
      >
        <Checkbox
          checked={isSelected(node.id)}
          onChange={() => toggle(node.id)}
        />
        <Spacer direction="vertical" justifyContent="left" alignItems="left">
          <IconCall
            type={node.call_type}
            direction={node.direction}
            height={20}
          />
          {node.is_archived ? <ArchiveOutlined height={20} /> : null}
        </Spacer>
        <Spacer
          direction="vertical"
          justifyContent="left"
          alignItems="left"
          p={1}
        >
          {node.from}
          <div>called on {node.to}</div>
        </Spacer>
        <Spacer
          direction="vertical"
          justifyContent="left"
          alignItems="left"
          p={1}
        >
          {(!filters || !filters.includes("groupbydate")) &&
            dateTime(node.created_at)}
          {filters &&
            filters.includes("groupbydate") &&
            onlyTime(node.created_at)}
        </Spacer>
        <Link to={`/call/${node.id}`}>
          <InformationOutlined />
        </Link>
      </Flex>
    </>
  );
};

const areEqual = () => {
  return false;
};

export default React.memo(CallNode, areEqual);
