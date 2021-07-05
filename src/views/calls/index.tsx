import { ArchiveOutlined, Button, Checkbox, Flex, InformationOutlined, Spacer } from "@aircall/tractor";
import { useSelections } from "ahooks";
import { gql, GraphQLClient } from "graphql-request";
import React from "react";
import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import DisplayDate from "../../components/DisplayDate";
import FilterCall from "../../components/FilterCall";
import IconCall from "../../components/IconCall";
import Pagination from "../../components/Pagination";
import { dateTime, onlyTime } from "../../hooks/time";
import { useSelector } from "../../store";
import { filtering, setCall } from "../../store/get/actions";
import { Call } from "../../store/get/types";
import useSWR from "swr";

export const endpoint = "https://frontend-test-api.aircall.io/graphql";

const CALLS_QUERY = gql`
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

const ARCHIVE_QUERY = gql`
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

const CallsView = () => {
  const dispatch = useDispatch();
  const { calls, filtered, pageOffset, loadOffset, filters } = useSelector((state: any) => state.get);
  const { token } = useSelector((state: any) => state.auth);
  const ids = filtered.map(([, node]: [string, Call]) => node.id);

  const graphQLClient = new GraphQLClient(endpoint);

  const limit = 10;

  const { data } = useSWR(
    token ? [CALLS_QUERY, loadOffset] : null,
    (query) =>
      graphQLClient.request(
        query,
        { offset: loadOffset * limit, limit },
        {
          authorization: `Bearer ${token}`,
        }
      ),
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const loading = !data;

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

  const { selected, allSelected, isSelected, toggle, toggleAll } =
    useSelections<string>(ids, []);

  const hasArchived = selected
    .map((id: string) => calls.get(id)?.is_archived)
    .includes(true);

  const handleArchive = () => {
    if (!selected || selected.length <= 0) return;

    selected
      .filter((id: string) => hasArchived === calls.get(id)?.is_archived)
      .forEach((id: string) => {
        graphQLClient
          .request(
            ARCHIVE_QUERY,
            { id },
            {
              authorization: `Bearer ${token}`,
            }
          )
          .then((data: any) => {
            const n = data.archiveCall;
            dispatch(setCall(n.id, n));
          })
          .catch(() => {
            console.log("error");
          });
      });
  };

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
            <div key={id}>
              <DisplayDate
                id={id}
                node={node}
                filtered={filtered}
                filters={filters}
              />
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
                <Spacer
                  direction="vertical"
                  justifyContent="left"
                  alignItems="left"
                >
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
            </div>
          ))}
      </Spacer>
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
            <Checkbox checked={allSelected} onChange={toggleAll} />
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
          <Pagination
            hasNextPage={hasNextPage}
          />
        </Flex>
      </Flex>
    </>
  );
};

const areEqual = () => {
  return true;
};

export default React.memo(CallsView, areEqual);
