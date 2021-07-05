import { Box, Button, Flex, Form, FormItem, Spacer, Textarea, Typography } from "@aircall/tractor";
import { gql, GraphQLClient } from "graphql-request";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Redirect } from "react-router-dom";

import { useSelector } from "../../store";
import { setCall as setCallAction } from "../../store/get/actions";
import { Note } from "../../store/get/types";
import { endpoint } from "../calls";

const ADD_NOTE = gql`
  mutation addNote($id: ID!, $content: String!) {
    addNote(input: { activityId: $id, content: $content }) {
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

const DetailsView = () => {
  const dispatch = useDispatch();
  const { calls } = useSelector((state: any) => state.get);
  const { id }: any = useParams();
  const { token } = useSelector((state: any) => state.auth);

  const call = calls.get(id);
  console.log(calls, id)
  const graphQLClient = new GraphQLClient(endpoint);

  const [content, setContent] = useState<string>();

  const [error, setError] = useState<string>();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!content || content.length === 0) return;
    graphQLClient
      .request(
        ADD_NOTE,
        { id, content },
        {
          authorization: `Bearer ${token}`,
        }
      )
      .then((data: any) => {
        const n = data.addNote;
        dispatch(setCallAction(n.id, n));
      })
      .catch((e) => {
        setError("error");
      });

    setContent("");
  };

  if (!call) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Spacer
        direction="vertical"
        justifyContent="left"
        width="100%"
        marginTop={73 + 10}
        marginBottom={73 + 10}
      >
        <Flex
          color="base.black"
          justifyContent="left"
          alignItems="center"
          maxWidth={600}
          margin="auto"
          overflow="y"
          borderRadius={8}
          mb={2}
        >
          <Link to="/">
            <Button size="regular" variant={"darkGhost"}>
              Back to list
            </Button>
          </Link>
        </Flex>
        <Flex
          bg="grey.lighter"
          color="base.black"
          justifyContent="space-between"
          alignItems="center"
          p={3}
          maxWidth={600}
          margin="auto"
          overflow="y"
          borderRadius={8}
        >
          <Spacer direction="vertical" justifyContent="left" alignItems="left">
            <Typography mt={3} mb={3} variant="displayS">
              Details
            </Typography>
            <Typography variant="body2">
              ID: <b>{call.id}</b>
            </Typography>
            <Typography variant="body2">
              Created at: <b>{call.created_at}</b>
            </Typography>
            <Typography variant="body2">
              Call Type: <b>{call.call_type}</b>
            </Typography>
            <Typography variant="body2">
              Direction: <b>{call.direction}</b>
            </Typography>
            <Typography variant="body2">
              Duration: <b>{call.duration / 1000} seconds</b>
            </Typography>
            <Typography variant="body2">
              From: <b>{call.from}</b>
            </Typography>
            <Typography variant="body2">
              To: <b>{call.to}</b>
            </Typography>
            <Typography variant="body2">
              Via: <b>{call.via}</b>
            </Typography>
            <Typography variant="body2">
              Archived: <b>{call.is_archived ? "yes" : "no"}</b>
            </Typography>

            <Box>
              <Typography mt={3} mb={3} variant="displayS">
                Add a note
              </Typography>
              {error && (
                <Typography mt={3} mb={3} variant="subheading">
                  {error}
                </Typography>
              )}
              <Form onSubmit={handleSubmit}>
                <FormItem name="content">
                  <Textarea
                    placeholder="Describe your note in a few words."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </FormItem>
                <FormItem justifySelf="start">
                  <Button type="submit">Send</Button>
                </FormItem>
              </Form>
            </Box>
            <Spacer
              direction="vertical"
              justifyContent="left"
              alignItems="left"
            >
              <Typography mt={3} mb={3} variant="displayS">
                Notes
              </Typography>
              {call.notes && call.notes.length === 0 && (
                <Typography variant="body2">-</Typography>
              )}
              {call.notes &&
                call.notes.length > 0 &&
                call.notes.map((note: Note) => (
                  <div key={note.id}>
                    <Flex
                      bg="grey.light"
                      color="base.black"
                      p={3}
                      borderRadius={8}
                    >
                      <Spacer direction="vertical">
                        <Typography variant="body2">
                          ID: <b>{note.id}</b>
                        </Typography>
                        <Typography variant="body2">{note.content}</Typography>
                      </Spacer>
                    </Flex>
                  </div>
                ))}
            </Spacer>
          </Spacer>
        </Flex>
      </Spacer>
    </>
  );
};

const areEqual = () => {
  return true;
};

export default React.memo(DetailsView, areEqual);
