import { Spacer } from "@aircall/tractor";
import { gql, useQuery } from "@apollo/client";
import { useSelections } from "ahooks";
import React from "react";
import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";

import CallNode from "../../components/CallNode";
import ListActions from "../../components/ListActions";
import { useSelector } from "../../store";
import { filtering, setCall } from "../../store/get/actions";
import { Call } from "../../store/get/types";

export const CALLS_QUERY = gql`
  query paginatedCalls($offset: Float = 0, $limit: Float = 10) {
    paginatedCalls(offset: $offset, limit: $limit) {
      nodes {
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
      totalCount
      hasNextPage
    }
  }
`;

const CallsView = () => {
  const dispatch = useDispatch();
  const { filtered, pageOffset, loadOffset, filters, selected } = useSelector(
    (state: any) => state.get
  );
  const { token } = useSelector((state: any) => state.auth);

  const limit = 10;

  const { loading, data } = useQuery(CALLS_QUERY, {
    variables: {
      offset: loadOffset * limit,
      limit,
    },
    context: { headers: { authorization: `Bearer ${token}` } },
  });

  useLayoutEffect(() => {
    if (loading) return;
    if (
      !data ||
      !data.paginatedCalls ||
      !data.paginatedCalls.nodes ||
      data.paginatedCalls.nodes.length === 0
    )
      return;

    data.paginatedCalls.nodes.map((n: any) => dispatch(setCall(n.id, n)));
    dispatch(filtering());
  }, [loading, data, dispatch, pageOffset]);

  useLayoutEffect(() => {
    dispatch(filtering());
  }, [filters, dispatch]);

  const hasNextPage =
    data && data.paginatedCalls && data.paginatedCalls.hasNextPage;

  const ids = filtered.map(([, node]: [string, Call]) => node.id);
  const selectedIds = selected.map(([id]: [string]) => id);
  const {
    selected: selections,
    allSelected,
    isSelected,
    toggle,
    toggleAll,
  } = useSelections<string>(ids, selectedIds);

  return (
    <>
      <Spacer
        direction="vertical"
        justifyContent="left"
        width="100%"
        marginTop={73 + 10}
        marginBottom={73 + 10}
      >
        {filtered &&
          filtered.map(([id, node]: [string, Call]) => (
            <CallNode
              key={id}
              id={id}
              node={node}
              filtered={filtered}
              filters={filters}
              isSelected={isSelected}
              toggle={toggle}
            />
          ))}
      </Spacer>
      <ListActions
        hasNextPage={hasNextPage}
        selections={selections}
        allSelected={allSelected}
        toggleAll={toggleAll}
      />
    </>
  );
};

const areEqual = () => {
  return true;
};

export default React.memo(CallsView, areEqual);
